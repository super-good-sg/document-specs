#!/usr/bin/env node
// Weekly drift report (SIE-93): spec.md user stories 2 and 3.
// Pure helpers are exported for testing; main() does the real git/network/fs work.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTRACTS_DIR = path.join(REPO_ROOT, 'docs/contracts');
const REPORT_PATH = path.join(REPO_ROOT, 'docs/reports/drift-report.md');
const MAX_PENDING = 20;
const PIN_FILE = 'contract.lock';

// Code repos this report checks. Hardcoded here because there is no
// generic repo registry the CI job can read; add a repo when it gets a pin.
const CODE_REPOS = [
  { name: 'backend', owner: 'super-good-sg', repo: 'backend' },
  { name: 'frontend-web', owner: 'super-good-sg', repo: 'frontend-web' },
];

function shortHash(input) {
  return createHash('sha1').update(input).digest('hex').slice(0, 12);
}

export function listContractFiles(dir = CONTRACTS_DIR) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
}

// Flattens a JSON Schema's `properties` into {dotPath: type}, recursing into
// nested objects. Arrays, $ref and other schema features are out of scope
// for v1 (FR-006 only asks for "different names or types" on named fields).
export function flattenSchemaFields(schema, prefix = '') {
  const fields = {};
  const properties = schema?.properties ?? {};
  for (const [name, def] of Object.entries(properties)) {
    const fieldPath = prefix ? `${prefix}.${name}` : name;
    if (def?.type) fields[fieldPath] = def.type;
    if (def?.type === 'object' || def?.properties) {
      Object.assign(fields, flattenSchemaFields(def, fieldPath));
    }
  }
  return fields;
}

// US3 / FR-006: same field name, different type, across two docs-repo contracts.
// Different-name-same-meaning conflicts need a human-authored name mapping
// that does not exist yet, so v1 only catches the mechanical case.
export function computeSpecConflicts(contracts) {
  const findings = [];
  for (let i = 0; i < contracts.length; i++) {
    for (let j = i + 1; j < contracts.length; j++) {
      const a = contracts[i];
      const b = contracts[j];
      const fieldsA = flattenSchemaFields(a.schema);
      const fieldsB = flattenSchemaFields(b.schema);
      for (const [fieldPath, typeA] of Object.entries(fieldsA)) {
        const typeB = fieldsB[fieldPath];
        if (typeB && typeB !== typeA) {
          const keySuffix = shortHash(`${a.latestCommit}:${b.latestCommit}`);
          findings.push({
            key: `spec-conflict:${a.file}:${b.file}:${fieldPath}:${keySuffix}`,
            kind: 'spec-conflict',
            contracts: [a.file, b.file],
            location: fieldPath,
            note: `${fieldPath} is "${typeA}" in ${a.file} but "${typeB}" in ${b.file}`,
          });
        }
      }
    }
  }
  return findings;
}

// US2 / FR-005, FR-014: one code repo's pin vs. the contracts it consumes.
export function computeRepoDrift(repoName, pin, pinError, contractsByFile) {
  if (pinError) {
    return [{
      key: `could-not-compare:${repoName}`,
      kind: 'could-not-compare',
      contracts: [],
      location: `${repoName} (${PIN_FILE})`,
      note: pinError,
    }];
  }
  if (!pin || !Array.isArray(pin.consumes) || pin.consumes.length === 0) {
    return [];
  }
  const findings = [];
  for (const file of pin.consumes) {
    const contract = contractsByFile[file];
    if (!contract) {
      findings.push({
        key: `could-not-compare:${repoName}:${file}`,
        kind: 'could-not-compare',
        contracts: [file],
        location: `${repoName} (${PIN_FILE})`,
        note: `pin consumes "${file}", which does not exist in docs/contracts`,
      });
      continue;
    }
    if (contract.latestCommit === pin.contractsCommit) continue;
    if (contract.behindCount == null) {
      findings.push({
        key: `could-not-compare:${repoName}:${file}`,
        kind: 'could-not-compare',
        contracts: [file],
        location: `${repoName} (${PIN_FILE})`,
        note: `pinned commit "${pin.contractsCommit}" not found in document-specs history`,
      });
      continue;
    }
    if (contract.behindCount > 0) {
      findings.push({
        key: `drift:${repoName}:${file}:${contract.latestCommit}`,
        kind: 'drift',
        contracts: [file],
        location: `${repoName} (${PIN_FILE})`,
        note: `${contract.behindCount} commit(s) behind on ${file}`,
      });
    }
  }
  return findings;
}

// FR-007/FR-008/FR-009/FR-011/FR-015: merge newly computed findings into the
// persisted report, keeping existing status (pending/rejected/ticketed) and
// firstSeen for keys that still apply, dropping keys that no longer apply.
export function mergeReport(existingItems, currentFindings, now) {
  const existingByKey = new Map(existingItems.map((item) => [item.key, item]));
  const merged = currentFindings.map((finding) => {
    const existing = existingByKey.get(finding.key);
    return existing
      ? { ...finding, status: existing.status, note: existing.note, firstSeen: existing.firstSeen }
      : { ...finding, status: 'pending', firstSeen: now };
  });
  return merged;
}

export function renderReport(items, now) {
  const pending = items
    .filter((i) => i.status === 'pending')
    .sort((a, b) => a.firstSeen.localeCompare(b.firstSeen));
  const resolved = items.filter((i) => i.status !== 'pending');

  const shown = pending.slice(0, MAX_PENDING);
  const remaining = pending.length - shown.length;

  const lines = [];
  lines.push('# Drift report');
  lines.push('');
  lines.push('<!-- drift-report-state');
  lines.push(JSON.stringify({ items }, null, 2));
  lines.push('-->');
  lines.push('');
  lines.push(`_Last run: ${now}_`);
  lines.push('');
  lines.push(`## Pending (${shown.length} of ${pending.length})`);
  lines.push('');
  if (shown.length === 0) {
    lines.push('No drift or spec conflicts found.');
  } else {
    lines.push('| Kind | Contract(s) | Location | Note |');
    lines.push('|---|---|---|---|');
    for (const item of shown) {
      lines.push(`| ${item.kind} | ${item.contracts.join(', ') || '-'} | ${item.location} | ${item.note} |`);
    }
    if (remaining > 0) {
      lines.push('');
      lines.push(`_${remaining} more item(s) not shown._`);
    }
  }
  lines.push('');
  lines.push(`## Resolved (${resolved.length})`);
  lines.push('');
  if (resolved.length === 0) {
    lines.push('None.');
  } else {
    lines.push('| Kind | Contract(s) | Location | Status | Note |');
    lines.push('|---|---|---|---|---|');
    for (const item of resolved) {
      lines.push(`| ${item.kind} | ${item.contracts.join(', ') || '-'} | ${item.location} | ${item.status} | ${item.note} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

export function parseReport(markdown) {
  const match = markdown.match(/<!-- drift-report-state\n([\s\S]*?)\n-->/);
  if (!match) return [];
  try {
    return JSON.parse(match[1]).items ?? [];
  } catch {
    return [];
  }
}

function git(args) {
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
}

function latestCommitTouching(file) {
  const out = git(['log', '-1', '--format=%H', '--', file]);
  return out || null;
}

function commitsBehind(pinCommit, file) {
  try {
    const count = git(['rev-list', '--count', `${pinCommit}..HEAD`, '--', file]);
    return Number(count);
  } catch {
    return null;
  }
}

async function fetchPin(owner, repo) {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${PIN_FILE}`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    return { pin: null, error: `could not fetch ${PIN_FILE}: ${err.message}` };
  }
  if (res.status === 404) {
    return { pin: null, error: `no ${PIN_FILE} found in ${owner}/${repo}` };
  }
  if (!res.ok) {
    return { pin: null, error: `fetching ${PIN_FILE} from ${owner}/${repo} failed: HTTP ${res.status}` };
  }
  try {
    return { pin: JSON.parse(await res.text()), error: null };
  } catch {
    return { pin: null, error: `${PIN_FILE} in ${owner}/${repo} is not valid JSON` };
  }
}

async function main() {
  const now = new Date().toISOString();

  const files = listContractFiles();
  const contracts = files.map((file) => {
    const schema = JSON.parse(readFileSync(path.join(CONTRACTS_DIR, file), 'utf8'));
    const latestCommit = latestCommitTouching(path.join('docs/contracts', file));
    return { file, schema, latestCommit };
  });
  const contractsByFile = {};
  for (const c of contracts) {
    contractsByFile[c.file] = {
      latestCommit: c.latestCommit,
      // behindCount is computed per-pin below (needs the pin's commit), so
      // start null here and fill it in once we know what we're comparing to.
      behindCount: null,
    };
  }

  const findings = [];

  if (contracts.length >= 2) {
    findings.push(...computeSpecConflicts(contracts));
  }

  for (const { name, owner, repo } of CODE_REPOS) {
    const { pin, error } = await fetchPin(owner, repo);
    if (!error && pin) {
      for (const file of pin.consumes ?? []) {
        const contract = contractsByFile[file];
        if (contract) contract.behindCount = commitsBehind(pin.contractsCommit, path.join('docs/contracts', file));
      }
    }
    findings.push(...computeRepoDrift(name, pin, error, contractsByFile));
  }

  const existing = existsSync(REPORT_PATH) ? parseReport(readFileSync(REPORT_PATH, 'utf8')) : [];
  const merged = mergeReport(existing, findings, now);
  const report = renderReport(merged, now);

  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, report);
  console.log(`drift-report: wrote ${REPORT_PATH} (${merged.filter((i) => i.status === 'pending').length} pending)`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((err) => {
    console.error('drift-report: run failed:', err);
    process.exitCode = 1;
  });
}

#!/usr/bin/env node
// Weekly drift report (SIE-93): spec.md user stories 2 and 3.
// Pure helpers are exported for testing; main() does the real git/network/fs work.
//
// Usage:
//   node scripts/drift-report.mjs              regenerate the report in place
//   node scripts/drift-report.mjs set-status <key> <pending|rejected|ticketed> [ticketUrl]
//                                               record an owner decision on one item

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
// nested objects. Arrays, $ref, OpenAPI's components.schemas nesting and
// other schema shapes are out of scope for v1 (FR-006 only asks for
// "different names or types" on named fields of structured contracts).
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
            scopes: [`contract:${a.file}`, `contract:${b.file}`],
          });
        }
      }
    }
  }
  return findings;
}

// US2 / FR-005, FR-014: one code repo's pin vs. the contracts it consumes.
// `pin` is assumed already shape-validated by the caller (validatePin) when
// pinError is falsy; the defensive checks below only cover direct callers
// (tests, or a future caller) that skip that step.
export function computeRepoDrift(repoName, pin, pinError, contractsByFile) {
  if (pinError) {
    return [{
      key: `could-not-compare:${repoName}`,
      kind: 'could-not-compare',
      contracts: [],
      location: `${repoName} (${PIN_FILE})`,
      note: pinError,
      scopes: [`repo:${repoName}`],
    }];
  }
  if (!pin || !Array.isArray(pin.consumes)) {
    return [{
      key: `could-not-compare:${repoName}`,
      kind: 'could-not-compare',
      contracts: [],
      location: `${repoName} (${PIN_FILE})`,
      note: `${PIN_FILE} is missing or malformed (expected a "consumes" array)`,
      scopes: [`repo:${repoName}`],
    }];
  }
  if (pin.consumes.length === 0) return [];
  const findings = [];
  for (const file of pin.consumes) {
    const contract = contractsByFile[file];
    if (!contract) {
      findings.push({
        key: `could-not-compare:${repoName}:${file}`,
        kind: 'could-not-compare',
        contracts: [file],
        location: `${repoName} (${PIN_FILE})`,
        note: `pin consumes "${file}", which is missing or unreadable in docs/contracts`,
        scopes: [`repo:${repoName}`, `contract:${file}`],
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
        scopes: [`repo:${repoName}`, `contract:${file}`],
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
        scopes: [`repo:${repoName}`, `contract:${file}`],
      });
    }
  }
  return findings;
}

// Pin shape per CONTEXT.md / ADR 0001: a docs-repo commit, the generator
// version, and the list of contracts consumed. Rejecting a malformed pin
// here (rather than letting it through as "no findings") is what makes
// FR-014's "MUST NOT be left out" hold for a pin that fetched fine but is
// garbage.
export function validatePin(pin) {
  if (typeof pin !== 'object' || pin === null || Array.isArray(pin)) {
    return `${PIN_FILE} is not a JSON object`;
  }
  if (typeof pin.contractsCommit !== 'string' || pin.contractsCommit === '') {
    return `${PIN_FILE} is missing "contractsCommit"`;
  }
  if (!Array.isArray(pin.consumes)) {
    return `${PIN_FILE} is missing "consumes" (expected an array of contract filenames)`;
  }
  if (typeof pin.generatorVersion !== 'string' || pin.generatorVersion === '') {
    return `${PIN_FILE} is missing "generatorVersion"`;
  }
  return null;
}

// FR-007/FR-008/FR-009/FR-011/FR-015: merge newly computed findings into the
// persisted report. For a key seen again this run, keep its status/firstSeen
// (and any extra fields set by setItemStatus, e.g. ticketUrl) but refresh its
// kind/contracts/location/note/scopes from the fresh finding. A key from the
// prior report that is NOT seen this run is normally dropped (it is
// resolved) -- UNLESS its scope matches `failedScopes`, meaning the thing
// that would have reproduced it could not be checked this run (a transient
// fetch/git failure). Carrying it forward unchanged in that case stops a
// transient failure from silently erasing a rejected or ticketed item
// (FR-011, FR-015).
export function mergeReport(existingItems, currentFindings, now, failedScopes = new Set()) {
  const existingByKey = new Map(existingItems.map((item) => [item.key, item]));
  const seenKeys = new Set();
  const merged = currentFindings.map((finding) => {
    seenKeys.add(finding.key);
    const existing = existingByKey.get(finding.key);
    if (existing) {
      return { ...existing, ...finding, status: existing.status, firstSeen: existing.firstSeen };
    }
    return { ...finding, status: 'pending', firstSeen: now };
  });
  for (const item of existingItems) {
    if (seenKeys.has(item.key)) continue;
    const scopes = item.scopes ?? [];
    if (scopes.some((s) => failedScopes.has(s))) merged.push(item);
  }
  return merged;
}

// Owner action (FR-010/FR-015): record a decision on one item by key. There
// is no automatic path to "rejected" or "ticketed" -- this is the only one.
export function setItemStatus(items, key, status, extra = {}) {
  let found = false;
  const updated = items.map((item) => {
    if (item.key !== key) return item;
    found = true;
    return { ...item, ...extra, status };
  });
  if (!found) throw new Error(`no report item with key "${key}"`);
  return updated;
}

// Order-independent equality used to decide whether anything actually
// changed, so a no-op run doesn't touch the "Last run" timestamp and trigger
// a spurious PR (US2 Acceptance Scenario 2: "no new report is opened").
export function itemsEqual(a, b) {
  const canon = (items) => JSON.stringify([...items].sort((x, y) => x.key.localeCompare(y.key)));
  return canon(a) === canon(b);
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
      const note = item.ticketUrl ? `${item.note} (ticket: ${item.ticketUrl})` : item.note;
      lines.push(`| ${item.kind} | ${item.contracts.join(', ') || '-'} | ${item.location} | ${item.status} | ${note} |`);
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

export function parseLastRun(markdown) {
  const match = markdown.match(/_Last run: (.+?)_/);
  return match ? match[1] : null;
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
  let pin;
  try {
    pin = JSON.parse(await res.text());
  } catch {
    return { pin: null, error: `${PIN_FILE} in ${owner}/${repo} is not valid JSON` };
  }
  const shapeError = validatePin(pin);
  if (shapeError) return { pin: null, error: `${PIN_FILE} in ${owner}/${repo}: ${shapeError}` };
  return { pin, error: null };
}

function loadReportItems() {
  return existsSync(REPORT_PATH) ? parseReport(readFileSync(REPORT_PATH, 'utf8')) : [];
}

function saveReportItems(items, timestamp) {
  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, renderReport(items, timestamp));
}

async function runSetStatus(key, status, ticketUrl) {
  if (!key || !status) {
    throw new Error('usage: drift-report.mjs set-status <key> <pending|rejected|ticketed> [ticketUrl]');
  }
  const items = loadReportItems();
  const extra = ticketUrl ? { ticketUrl } : {};
  const updated = setItemStatus(items, key, status, extra);
  const previous = existsSync(REPORT_PATH) ? readFileSync(REPORT_PATH, 'utf8') : '';
  const timestamp = parseLastRun(previous) ?? new Date().toISOString();
  saveReportItems(updated, timestamp);
  console.log(`drift-report: set ${key} -> ${status}`);
}

async function runGenerate() {
  const now = new Date().toISOString();

  const files = listContractFiles();
  const contracts = [];
  const contractReadErrors = {};
  for (const file of files) {
    try {
      const schema = JSON.parse(readFileSync(path.join(CONTRACTS_DIR, file), 'utf8'));
      const latestCommit = latestCommitTouching(path.join('docs/contracts', file));
      contracts.push({ file, schema, latestCommit });
    } catch (err) {
      contractReadErrors[file] = err.message;
    }
  }
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
  const failedScopes = new Set();

  for (const [file, message] of Object.entries(contractReadErrors)) {
    findings.push({
      key: `could-not-compare:contract:${file}`,
      kind: 'could-not-compare',
      contracts: [file],
      location: `docs/contracts/${file}`,
      note: `could not read contract: ${message}`,
      scopes: [`contract:${file}`],
    });
    failedScopes.add(`contract:${file}`);
  }

  if (contracts.length >= 2) {
    findings.push(...computeSpecConflicts(contracts));
  }

  for (const { name, owner, repo } of CODE_REPOS) {
    const { pin, error } = await fetchPin(owner, repo);
    if (error) failedScopes.add(`repo:${name}`);
    if (!error && pin) {
      for (const file of pin.consumes) {
        const contract = contractsByFile[file];
        if (contract) contract.behindCount = commitsBehind(pin.contractsCommit, path.join('docs/contracts', file));
      }
    }
    findings.push(...computeRepoDrift(name, pin, error, contractsByFile));
  }

  const existing = loadReportItems();
  const merged = mergeReport(existing, findings, now, failedScopes);

  const previousLastRun = existsSync(REPORT_PATH) ? parseLastRun(readFileSync(REPORT_PATH, 'utf8')) : null;
  const timestamp = previousLastRun && itemsEqual(merged, existing) ? previousLastRun : now;

  saveReportItems(merged, timestamp);
  console.log(`drift-report: wrote ${REPORT_PATH} (${merged.filter((i) => i.status === 'pending').length} pending)`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'set-status') {
    await runSetStatus(...rest);
    return;
  }
  await runGenerate();
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((err) => {
    console.error('drift-report: run failed:', err);
    process.exitCode = 1;
  });
}

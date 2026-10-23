import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  flattenSchemaFields,
  computeSpecConflicts,
  computeRepoDrift,
  mergeReport,
  renderReport,
  parseReport,
} from './drift-report.mjs';

test('flattenSchemaFields flattens nested object properties to dotted paths', () => {
  const schema = {
    properties: {
      id: { type: 'string' },
      address: { type: 'object', properties: { city: { type: 'string' } } },
    },
  };
  assert.deepEqual(flattenSchemaFields(schema), {
    id: 'string',
    address: 'object',
    'address.city': 'string',
  });
});

test('computeSpecConflicts flags a same-name field with a different type', () => {
  const a = { file: 'order.json', latestCommit: 'c1', schema: { properties: { qty: { type: 'integer' } } } };
  const b = { file: 'product.json', latestCommit: 'c2', schema: { properties: { qty: { type: 'string' } } } };
  const findings = computeSpecConflicts([a, b]);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'spec-conflict');
  assert.match(findings[0].note, /qty/);
});

test('computeSpecConflicts finds nothing when types agree', () => {
  const a = { file: 'order.json', latestCommit: 'c1', schema: { properties: { qty: { type: 'integer' } } } };
  const b = { file: 'product.json', latestCommit: 'c2', schema: { properties: { qty: { type: 'integer' } } } };
  assert.deepEqual(computeSpecConflicts([a, b]), []);
});

test('computeRepoDrift reports could-not-compare when the pin fetch failed', () => {
  const findings = computeRepoDrift('backend', null, 'no contract.lock found', {});
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'could-not-compare');
});

test('computeRepoDrift reports drift when a consumed contract moved past the pin', () => {
  const pin = { contractsCommit: 'old', consumes: ['order.json'] };
  const contractsByFile = { 'order.json': { latestCommit: 'new', behindCount: 3 } };
  const findings = computeRepoDrift('backend', pin, null, contractsByFile);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'drift');
  assert.match(findings[0].note, /3 commit/);
});

test('computeRepoDrift finds nothing when the pin matches the latest commit', () => {
  const pin = { contractsCommit: 'same', consumes: ['order.json'] };
  const contractsByFile = { 'order.json': { latestCommit: 'same', behindCount: null } };
  assert.deepEqual(computeRepoDrift('backend', pin, null, contractsByFile), []);
});

test('mergeReport keeps a rejected item pending=false while the same key recurs', () => {
  const existing = [{ key: 'drift:backend:order.json:new', kind: 'drift', contracts: [], location: '', status: 'rejected', note: 'old note', firstSeen: '2026-01-01' }];
  const current = [{ key: 'drift:backend:order.json:new', kind: 'drift', contracts: [], location: '', note: 'new note' }];
  const merged = mergeReport(existing, current, '2026-02-01');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].status, 'rejected');
  assert.equal(merged[0].firstSeen, '2026-01-01');
});

test('mergeReport resurfaces as pending once the contract changes (key changes)', () => {
  const existing = [{ key: 'drift:backend:order.json:old-commit', kind: 'drift', contracts: [], location: '', status: 'rejected', note: 'old', firstSeen: '2026-01-01' }];
  const current = [{ key: 'drift:backend:order.json:new-commit', kind: 'drift', contracts: [], location: '', note: 'new' }];
  const merged = mergeReport(existing, current, '2026-02-01');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].status, 'pending');
});

test('mergeReport drops keys that no longer appear (resolved)', () => {
  const existing = [{ key: 'drift:gone', kind: 'drift', contracts: [], location: '', status: 'pending', note: '', firstSeen: '2026-01-01' }];
  assert.deepEqual(mergeReport(existing, [], '2026-02-01'), []);
});

test('renderReport caps pending items and reports the remainder', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({
    key: `drift:${i}`, kind: 'drift', contracts: ['c.json'], location: 'repo', note: 'n', status: 'pending', firstSeen: `2026-01-${String(i + 1).padStart(2, '0')}`,
  }));
  const markdown = renderReport(items, '2026-02-01T00:00:00Z');
  assert.match(markdown, /Pending \(20 of 25\)/);
  assert.match(markdown, /5 more item\(s\) not shown/);
});

test('parseReport round-trips what renderReport wrote', () => {
  const items = [{ key: 'drift:a', kind: 'drift', contracts: ['c.json'], location: 'repo', note: 'n', status: 'pending', firstSeen: '2026-01-01' }];
  const markdown = renderReport(items, '2026-02-01T00:00:00Z');
  assert.deepEqual(parseReport(markdown), items);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  flattenSchemaFields,
  computeSpecConflicts,
  computeRepoDrift,
  validatePin,
  mergeReport,
  setItemStatus,
  itemsEqual,
  renderReport,
  parseReport,
  parseLastRun,
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
  assert.deepEqual(findings[0].scopes, ['contract:order.json', 'contract:product.json']);
});

test('computeSpecConflicts finds nothing when types agree', () => {
  const a = { file: 'order.json', latestCommit: 'c1', schema: { properties: { qty: { type: 'integer' } } } };
  const b = { file: 'product.json', latestCommit: 'c2', schema: { properties: { qty: { type: 'integer' } } } };
  assert.deepEqual(computeSpecConflicts([a, b]), []);
});

test('validatePin accepts a well-formed pin', () => {
  assert.equal(validatePin({ contractsCommit: 'abc', consumes: ['order.json'], generatorVersion: '1.0.0' }), null);
});

test('validatePin rejects a pin missing contractsCommit, consumes or generatorVersion', () => {
  assert.match(validatePin({}), /contractsCommit/);
  assert.match(validatePin({ contractsCommit: 'abc' }), /consumes/);
  assert.match(validatePin({ contractsCommit: 'abc', consumes: [] }), /generatorVersion/);
  assert.match(validatePin(null), /not a JSON object/);
});

test('computeRepoDrift reports could-not-compare when the pin fetch failed', () => {
  const findings = computeRepoDrift('backend', null, 'no contract.lock found', {});
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'could-not-compare');
  assert.deepEqual(findings[0].scopes, ['repo:backend']);
});

test('computeRepoDrift reports could-not-compare (not silence) for a structurally malformed pin', () => {
  const findings = computeRepoDrift('backend', {}, null, {});
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'could-not-compare');
  assert.match(findings[0].note, /missing or malformed/);
});

test('computeRepoDrift reports drift when a consumed contract moved past the pin', () => {
  const pin = { contractsCommit: 'old', consumes: ['order.json'] };
  const contractsByFile = { 'order.json': { latestCommit: 'new', behindCount: 3 } };
  const findings = computeRepoDrift('backend', pin, null, contractsByFile);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, 'drift');
  assert.match(findings[0].note, /3 commit/);
  assert.deepEqual(findings[0].scopes, ['repo:backend', 'contract:order.json']);
});

test('computeRepoDrift finds nothing when the pin matches the latest commit', () => {
  const pin = { contractsCommit: 'same', consumes: ['order.json'] };
  const contractsByFile = { 'order.json': { latestCommit: 'same', behindCount: null } };
  assert.deepEqual(computeRepoDrift('backend', pin, null, contractsByFile), []);
});

test('mergeReport keeps a rejected item pending=false while the same key recurs, and refreshes its note', () => {
  const existing = [{ key: 'drift:backend:order.json:new', kind: 'drift', contracts: [], location: '', status: 'rejected', note: 'old note', firstSeen: '2026-01-01', scopes: [] }];
  const current = [{ key: 'drift:backend:order.json:new', kind: 'drift', contracts: [], location: '', note: 'new note', scopes: [] }];
  const merged = mergeReport(existing, current, '2026-02-01');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].status, 'rejected');
  assert.equal(merged[0].firstSeen, '2026-01-01');
  assert.equal(merged[0].note, 'new note');
});

test('mergeReport preserves extra fields (e.g. ticketUrl) set by setItemStatus across a run', () => {
  const existing = [{ key: 'drift:a', kind: 'drift', contracts: [], location: '', status: 'ticketed', note: 'old', firstSeen: '2026-01-01', scopes: [], ticketUrl: 'https://example/T-1' }];
  const current = [{ key: 'drift:a', kind: 'drift', contracts: [], location: '', note: 'still true', scopes: [] }];
  const merged = mergeReport(existing, current, '2026-02-01');
  assert.equal(merged[0].ticketUrl, 'https://example/T-1');
  assert.equal(merged[0].status, 'ticketed');
});

test('mergeReport resurfaces as pending once the contract changes (key changes)', () => {
  const existing = [{ key: 'drift:backend:order.json:old-commit', kind: 'drift', contracts: [], location: '', status: 'rejected', note: 'old', firstSeen: '2026-01-01', scopes: [] }];
  const current = [{ key: 'drift:backend:order.json:new-commit', kind: 'drift', contracts: [], location: '', note: 'new', scopes: [] }];
  const merged = mergeReport(existing, current, '2026-02-01');
  assert.equal(merged.length, 1);
  assert.equal(merged[0].status, 'pending');
});

test('mergeReport drops keys that no longer appear and whose scope was not part of a failed run', () => {
  const existing = [{ key: 'drift:gone', kind: 'drift', contracts: [], location: '', status: 'pending', note: '', firstSeen: '2026-01-01', scopes: ['repo:backend'] }];
  assert.deepEqual(mergeReport(existing, [], '2026-02-01', new Set()), []);
});

test('mergeReport carries a key forward unchanged when its scope failed this run, instead of dropping it', () => {
  const existing = [{ key: 'drift:backend:order.json:c1', kind: 'drift', contracts: ['order.json'], location: 'backend', status: 'rejected', note: 'was 3 behind', firstSeen: '2026-01-01', scopes: ['repo:backend', 'contract:order.json'] }];
  const current = [{ key: 'could-not-compare:backend', kind: 'could-not-compare', contracts: [], location: 'backend', note: 'network error', scopes: ['repo:backend'] }];
  const merged = mergeReport(existing, current, '2026-02-01', new Set(['repo:backend']));
  const carried = merged.find((i) => i.key === 'drift:backend:order.json:c1');
  assert.ok(carried, 'the rejected item must survive a transient failure in its own scope');
  assert.equal(carried.status, 'rejected');
  assert.equal(carried.note, 'was 3 behind');
});

test('setItemStatus updates status and merges extra fields for the matching key', () => {
  const items = [{ key: 'a', status: 'pending', note: 'n' }, { key: 'b', status: 'pending', note: 'n' }];
  const updated = setItemStatus(items, 'a', 'ticketed', { ticketUrl: 'https://example/T-9' });
  assert.equal(updated[0].status, 'ticketed');
  assert.equal(updated[0].ticketUrl, 'https://example/T-9');
  assert.equal(updated[1].status, 'pending');
});

test('setItemStatus throws for an unknown key', () => {
  assert.throws(() => setItemStatus([{ key: 'a', status: 'pending' }], 'missing', 'rejected'));
});

test('itemsEqual is order-independent and detects real differences', () => {
  const a = [{ key: 'x', status: 'pending' }, { key: 'y', status: 'pending' }];
  const b = [{ key: 'y', status: 'pending' }, { key: 'x', status: 'pending' }];
  assert.ok(itemsEqual(a, b));
  const c = [{ key: 'y', status: 'rejected' }, { key: 'x', status: 'pending' }];
  assert.ok(!itemsEqual(a, c));
});

test('renderReport caps pending items and reports the remainder', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({
    key: `drift:${i}`, kind: 'drift', contracts: ['c.json'], location: 'repo', note: 'n', status: 'pending', firstSeen: `2026-01-${String(i + 1).padStart(2, '0')}`,
  }));
  const markdown = renderReport(items, '2026-02-01T00:00:00Z');
  assert.match(markdown, /Pending \(20 of 25\)/);
  assert.match(markdown, /5 more item\(s\) not shown/);
});

test('renderReport shows a resolved item\'s ticketUrl inline', () => {
  const items = [{ key: 'a', kind: 'drift', contracts: ['c.json'], location: 'repo', note: 'n', status: 'ticketed', firstSeen: '2026-01-01', ticketUrl: 'https://example/T-1' }];
  const markdown = renderReport(items, '2026-02-01T00:00:00Z');
  assert.match(markdown, /ticket: https:\/\/example\/T-1/);
});

test('parseReport round-trips what renderReport wrote', () => {
  const items = [{ key: 'drift:a', kind: 'drift', contracts: ['c.json'], location: 'repo', note: 'n', status: 'pending', firstSeen: '2026-01-01' }];
  const markdown = renderReport(items, '2026-02-01T00:00:00Z');
  assert.deepEqual(parseReport(markdown), items);
});

test('parseLastRun extracts the timestamp renderReport wrote', () => {
  const markdown = renderReport([], '2026-02-01T00:00:00Z');
  assert.equal(parseLastRun(markdown), '2026-02-01T00:00:00Z');
});

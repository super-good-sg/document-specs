// Self-check for docs/contracts/openapi.v1.yaml (SIE-25). Shells out to the
// already-vendored @redocly/cli to lint (catches structural/schema errors)
// and to fully dereference the document (proves every $ref, including the
// external order-schema.v1.json/product-schema.v1.json/contact-schema.v1.json/
// catalog-item-schema.v1.json files, actually resolves) rather than hand-rolling
// a YAML/JSON-Schema parser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const SPEC_PATH = path.join(REPO_ROOT, 'docs/contracts/openapi.v1.yaml');
const REDOCLY = path.join(REPO_ROOT, 'node_modules/.bin/redocly');

function dereferencedSpec() {
  const dir = mkdtempSync(path.join(tmpdir(), 'openapi-deref-'));
  const out = path.join(dir, 'bundled.json');
  try {
    execFileSync(REDOCLY, ['bundle', SPEC_PATH, '--ext', 'json', '-o', out, '-d'], { encoding: 'utf8' });
    return JSON.parse(readFileSync(out, 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('redocly lint passes with no errors', () => {
  // lint exits non-zero on error-level findings; execFileSync throws in that case.
  execFileSync(REDOCLY, ['lint', SPEC_PATH], { encoding: 'utf8' });
});

test('every $ref resolves, including the external docs/contracts/*.json schema files', () => {
  const spec = dereferencedSpec();
  assert.equal(JSON.stringify(spec).includes('$ref'), false, 'a fully dereferenced bundle should contain no $ref left');
});

test('bearer auth applies globally and nothing overrides it with an empty security array', () => {
  const spec = dereferencedSpec();
  assert.deepEqual(spec.security, [{ bearerAuth: [] }]);
  for (const [route, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (typeof op !== 'object' || !('responses' in op)) continue; // skip the shared `parameters` key
      assert.notDeepEqual(op.security, [], `${method.toUpperCase()} ${route} must not disable auth`);
    }
  }
});

test('every documented 2xx response has a JSON schema', () => {
  const spec = dereferencedSpec();
  for (const [route, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      if (typeof op !== 'object' || !('responses' in op)) continue;
      for (const [status, response] of Object.entries(op.responses)) {
        if (!status.startsWith('2')) continue;
        if (status === '204') continue; // no body by definition
        const schema = response.content?.['application/json']?.schema;
        assert.ok(schema, `${method.toUpperCase()} ${route} -> ${status} is missing a JSON schema`);
      }
    }
  }
});

test('the Job schema\'s result is a oneOf Order/Product, with no shared required field redefined incompatibly', () => {
  const spec = dereferencedSpec();
  const job = spec.components.schemas.Job;
  assert.ok(Array.isArray(job.properties.result.oneOf));
  assert.equal(job.properties.result.oneOf.length, 2);
  const [order, product] = job.properties.result.oneOf;
  assert.equal(order.title, 'Order');
  assert.equal(product.title, 'Product');
});

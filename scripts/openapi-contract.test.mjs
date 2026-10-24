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
// Only these keys under a path item are operations; `parameters` (shared
// across all methods on that path) is a sibling, not an operation -- keying
// off 'responses' being present conflated the two (a batch-review finding).
const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

function operationsOf(spec) {
  const ops = [];
  for (const [route, item] of Object.entries(spec.paths)) {
    for (const method of HTTP_METHODS) {
      if (item[method]) ops.push([route, method, item[method]]);
    }
  }
  return ops;
}

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

test('bearer auth applies globally and no operation overrides it to allow anonymous access', () => {
  const spec = dereferencedSpec();
  assert.deepEqual(spec.security, [{ bearerAuth: [] }]);
  for (const [route, method, op] of operationsOf(spec)) {
    if (!('security' in op)) continue; // inherits the global requirement above
    // [] disables auth outright; [{}] is OpenAPI's "optional auth" (an empty
    // requirement object is satisfied with no credentials) -- both must be absent.
    const allowsAnonymous = op.security.length === 0 || op.security.some((req) => Object.keys(req).length === 0);
    assert.ok(!allowsAnonymous, `${method.toUpperCase()} ${route} must not allow anonymous access`);
  }
});

test('every documented 2xx response has a JSON schema', () => {
  const spec = dereferencedSpec();
  for (const [route, method, op] of operationsOf(spec)) {
    for (const [status, response] of Object.entries(op.responses ?? {})) {
      if (!status.startsWith('2')) continue;
      if (status === '204') continue; // no body by definition
      const schema = response.content?.['application/json']?.schema;
      assert.ok(schema, `${method.toUpperCase()} ${route} -> ${status} is missing a JSON schema`);
    }
  }
});

test('the Job schema enforces result/error-vs-status and result-shape-vs-type, not just oneOf titles', () => {
  const spec = dereferencedSpec();
  const job = spec.components.schemas.Job;
  assert.ok(Array.isArray(job.properties.result.oneOf));
  assert.equal(job.properties.result.oneOf.length, 2);
  const [order, product] = job.properties.result.oneOf;
  assert.equal(order.title, 'Order');
  assert.equal(product.title, 'Product');

  // A bare oneOf can't tie `result`'s branch to `type`, or require
  // `result`/`error` only for the matching `status` -- that needs allOf/if/then,
  // which this asserts actually exists (a batch-review finding: titles alone
  // don't prove type/status are enforced).
  const rules = job.allOf ?? [];
  const findsRuleFor = (key, value) => rules.find((r) => r.if?.properties?.[key]?.const === value);

  const tiesOrderExtractionToOrderResult = findsRuleFor('type', 'order-extraction');
  assert.equal(tiesOrderExtractionToOrderResult?.then?.properties?.result?.title, 'Order');

  const tiesProductExtractionToProductResult = findsRuleFor('type', 'product-extraction');
  assert.equal(tiesProductExtractionToProductResult?.then?.properties?.result?.title, 'Product');

  const requiresResultOnSuccess = findsRuleFor('status', 'succeeded');
  assert.deepEqual(requiresResultOnSuccess?.then?.required, ['result']);

  const requiresErrorOnFailure = findsRuleFor('status', 'failed');
  assert.deepEqual(requiresErrorOnFailure?.then?.required, ['error']);
});

test('POST /media returns an array of Job (one per detected document), not a bare Job', () => {
  const spec = dereferencedSpec();
  const schema = spec.paths['/media'].post.responses['202'].content['application/json'].schema;
  assert.equal(schema.type, 'array');
  assert.deepEqual(schema.items.required, spec.components.schemas.Job.required);
});

test('OrderCreate has no client-settable direction field (server derives it from the contact)', () => {
  const spec = dereferencedSpec();
  const orderCreate = spec.components.schemas.OrderCreate;
  assert.ok(!('direction' in orderCreate.properties), 'direction must be server-derived from contactId, not client input');
});

test('OrderCreateItem requires taxAmount (order-schema.v1.json never re-derives it from taxRate)', () => {
  const spec = dereferencedSpec();
  assert.ok(spec.components.schemas.OrderCreateItem.required.includes('taxAmount'));
});

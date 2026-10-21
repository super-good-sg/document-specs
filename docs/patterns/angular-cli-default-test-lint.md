---
name: angular-cli-default-test-lint
description: Angular (frontend-web) - use ng new default test runner and Angular ESLint, no Vitest/Jest swap
approved_date: 2026-10-21
source_repo: frontend-web
---

## When to use
Setting up or touching the test runner or lint config in `frontend-web`.

## Pattern
Use whatever `ng new` scaffolds for testing (Jasmine/Karma, or the current
Angular CLI default test runner) and Angular ESLint. Do not swap in Vitest,
Jest, or another lint stack — no extra dependency or wiring beyond what the
CLI sets up.

## Notes
Approved under ticket SIE-61 ([6.1] Project scaffold, routing, CI).
Migrated here from the sieujs cross-project `knowledge-base/` on SIE-88:
SuperGood's own patterns now live in `document-specs` (source of truth for
the project) rather than the external store, which `docs/agent-workflow.md`
now documents as reserved for client (sfs-framework) repos.

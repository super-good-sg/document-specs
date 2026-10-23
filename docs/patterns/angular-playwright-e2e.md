---
name: angular-playwright-e2e
description: Angular (frontend-web) - Playwright for e2e, config drives ng serve via webServer, specs live in e2e/
approved_date: 2026-10-23
source_repo: frontend-web
---

## When to use
Adding or touching end-to-end tests in `frontend-web`.

## Pattern
Use `@playwright/test`, chromium project only until another browser is
actually needed. `playwright.config.ts` at the repo root points `testDir` at
`e2e/` and starts the app itself via `webServer: { command: 'npm start' }`
against `http://localhost:4200` — no separately-managed dev server. Run with
`npm run test:e2e`. CI installs only the `chromium` browser
(`npx playwright install --with-deps chromium`), in its own `e2e` job
alongside the existing `build-lint-test` job.

## Notes
Approved under ticket SIE-99 ([6.1a] Playwright e2e framework + CI smoke
test). Feature tickets add their own specs under `e2e/` against this setup;
this pattern does not cover voice/scan-flow specs (tracked separately in
SIE-79).

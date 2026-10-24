---
name: visual-regression-pixel-diff
description: Angular (frontend-web) - check a screen against its super-good.pen reference with Playwright's built-in toHaveScreenshot, no new dependency
approved_date: 2026-10-24
source_repo: frontend-web
---

## When to use
A frontend-web ticket builds or changes a screen that has a frame in
`super-good.pen` (`docs/design/screens.md`), and the owner has exported a
reference PNG for it (see `docs/design/visual-refs/README.md`).

## Pattern
Add an entry to `e2e/visual-refs.config.ts` (`frameId`, `name`, `route`,
`viewport`). `e2e/visual-regression.spec.ts` iterates that registry: for
each screen it fetches `docs/design/visual-refs/<frameId>.png` from the
public `document-specs` repo on GitHub (raw URL, no credential needed — the
repo is public), writes it to Playwright's own snapshot path, then uses
`expect(page).toHaveScreenshot(name)` to diff the live render against it.
No pixelmatch/looks-same dependency: `@playwright/test` already bundles
pixel-diffing. Tolerance is set once, in `playwright.config.ts`'s
`expect.toHaveScreenshot.maxDiffPixelRatio` (currently `0.02`).

A screen with no reference image yet (fetch returns non-OK) is skipped via
`test.skip()`, never failed — the registry can list screens ahead of their
export.

## Notes
Approved under ticket SIE-100 ([6.1c] Visual regression). The reference
images are manually exported by the owner per screen, one at a time, as
frontend-web tickets build them — not a bulk export (`super-good.pen` is a
"Pencil" file with no known export CLI/API; a renderer was judged out of
scope for this ticket). Direction is one-way: the design file is the
reference, frontend-web never writes back into it.

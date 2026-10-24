# Design reference images (SIE-100)

Reference PNGs for frontend-web's visual-diff check (`e2e/visual-regression.spec.ts`
in frontend-web, pixel-diffed via Playwright's `toHaveScreenshot`).

## Export convention

- One PNG per screen, exported from the design tool (Pencil) that opens
  [super-good.pen](../super-good.pen).
- Filename is the screen's **frame ID** from [screens.md](../screens.md)
  (e.g. `Hd7KW.png` for "Splash screen") — not the name, since several
  screens share a name (e.g. two "iPhone 16 - Product list" frames).
- Export at the frame's native size listed in screens.md (almost all are
  393 x 852).
- This is a manual, per-screen export done by the owner as frontend-web
  tickets build each screen — not a bulk export of all 58 screens up front.
  A screen with no PNG here yet is skipped by the diff check, not failed.

## How this gets used

frontend-web fetches images from here at test time via the public GitHub
raw URL (`raw.githubusercontent.com/super-good-sg/document-specs/main/...`)
— it never vendors a copy. The design file is the reference; code never
pushes changes back into it.

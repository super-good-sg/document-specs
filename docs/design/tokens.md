# Design tokens v1

Extracted from [super-good.pen](super-good.pen) (file version 2.21, Pencil) for SIE-21, as the base for the Angular design system (SIE-62). Machine-readable form: [tokens.json](tokens.json). Re-export when the `.pen` file changes, same as [screens.md](screens.md).

The `.pen` file defines named tokens (`variables`) for color, font family, corner radius and opacity. It does not define named spacing tokens or a named type scale — those are derived below from how values are actually used across the file, not from a declared token. Anything derived rather than read directly off a named token is marked **derived** and listed in [reverify.md](reverify.md) for the owner to confirm before SIE-62 builds a Tailwind config from it.

## Colors

38 color tokens, each with a light and dark value (the file's `Mode` theme). Full list in [tokens.json](tokens.json#color); the semantic ones most components use:

| Token | Light | Dark |
|---|---|---|
| `--background` | `#F2F3F0` | `#111111` |
| `--foreground` | `#111111` | `#FFFFFF` |
| `--card` | `#FFFFFF` | `#1A1A1A` |
| `--primary` | `#C2E96A` | `#C2E96A` |
| `--primary-foreground` | `#111111` | `#111111` |
| `--secondary` | `#E7E8E5` | `#2E2E2E` |
| `--muted` | `#F2F3F0` | `#2E2E2E` |
| `--muted-foreground` | `#666666` | `#B8B9B6` |
| `--accent` | `#F2F3F0` | `#111111` |
| `--destructive` | `#D93C15` | `#FF5C33` |
| `--border` / `--input` | `#CBCCC9` | `#2E2E2E` |
| `--white` / `--black` | `#FFFFFF` / `#000000` | same (theme-independent) |

Status colors (success/warning/error/info) each have a background and foreground pair, e.g. `--color-success` (`#DFE6E1` / `#222924`) and `--color-success-foreground` (`#004D1A` / `#B6FFCE`). A separate `--sidebar-*` group (8 tokens) styles the desktop dashboard sidebar only (the one non-mobile screen, `Dashboard` at 1440×1024).

## Typography

Named font-family tokens:

| Token | Value |
|---|---|
| `--font-primary` | JetBrains Mono |
| `--font-secondary` | Geist |

**To verify:** 19 text nodes (onboarding headlines and a few buttons/labels, e.g. "On boarding" and "Next", at 14/18/20/26/36pt) set `fontFamily: "Roboto"` directly instead of referencing `--font-primary`/`--font-secondary`. This reads as an inconsistency in the source file rather than an intentional third family — flagged in [reverify.md](reverify.md) rather than assumed.

No named type-scale tokens exist (no `--text-sm`, `--heading-lg`, etc.). Raw values actually used, across 61 distinct (font family, size, weight, line-height, letter-spacing) combinations found in the file:

- **Font sizes:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 26, 30, 32, 36, 48
- **Font weights:** `normal`, `500`, `600`, `700`
- **Line heights:** 1.25, 1.27, 1.29, 1.31, 1.33, 1.35, 1.4, 1.78 (mostly on the larger/Roboto headline sizes; most body text has no explicit line-height)
- **Letter spacing:** −1, −0.5, −0.4, −0.3 (tightened, on large headline sizes), 1, 1.2 (widened, on small all-caps-style labels)

This is raw exported data, not a design system: 61 combinations is too fragmented to be a type scale as-is. Rationalizing it into a small named scale (e.g. `heading`, `title`, `body`, `caption`) is a decision for SIE-62, not invented here.

## Spacing

**No named spacing tokens exist in the file.** Raw `padding`/`gap` values observed across all 127 components and screens: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 20, 24, 28, 30, 32, 33, 36, 40, 50, 56, 77, 88, 176.

**Derived, to verify:** most usage clusters on a 2px-step scale — `0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40` — covering the large majority of components (see [components.md](components.md)). The remaining values (1, 3, 5, 7, 9, 11, 17, 30, 33, 50, 56, 77, 88, 176) look like one-off/ad hoc spacing rather than scale steps, but that grouping is my read of the data, not a declared token — flagged in [reverify.md](reverify.md) before SIE-62 turns it into a Tailwind spacing scale.

## Corner radius

Named tokens:

| Token | Value |
|---|---|
| `--radius-none` | 0 |
| `--radius-m` | 16 |
| `--radius-pill` | 999 |

27 distinct raw numeric radius values are used directly on components instead of referencing a named token (2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 17, 18, 20, 21, 22, 24, 26, 28, 36, 40, 44, 48, 70, plus 0/16/999 which duplicate the named tokens). This is a design-system gap worth closing in SIE-62 (consolidate onto a small radius scale), not something to resolve by exporting more tokens here.

## Opacity

| Token | Value |
|---|---|
| `opacity-disabled` | 0.4 |

## To verify

Recorded in [reverify.md](reverify.md), reverify at SIE-62:
- The proposed "core" spacing scale (2px-step grouping above) vs. treating the outlier values as real scale steps.
- Whether the 19 Roboto-styled text nodes should become a third named font-family token or be restyled onto `--font-primary`/`--font-secondary`.

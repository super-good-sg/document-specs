---
name: angular-state-signals-and-services
description: Angular (frontend-web) - shared/local state via signals + injectable services, no NgRx/Akita unless it stops scaling
approved_date: 2026-10-21
source_repo: frontend-web
---

## When to use
Adding or changing component or shared state in `frontend-web`.

## Pattern
Shared and component state is handled with Angular signals and plain
injectable services — no NgRx, Akita, or similar.

- Component-local state: `signal()`/`computed()` inside the component.
- Shared/cross-component state: a `providedIn: 'root'` (or feature-scoped)
  service holding signals, exposing read-only `computed()` or
  `.asReadonly()` outward and mutation methods inward.
- Add a state library only if this genuinely stops scaling (e.g. complex
  async orchestration with many interdependent effects) — revisit then,
  don't pre-adopt.

## Notes
Approved under ticket SIE-61 ([6.1] Project scaffold, routing, CI).
Migrated here from the sieujs cross-project `knowledge-base/` on SIE-88
(see `angular-cli-default-test-lint.md` for why).

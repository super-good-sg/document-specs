# Pattern index

One line per approved pattern — check here first. Only open the matching
file(s) in `docs/patterns/` if something looks relevant; don't read every
pattern file every session.

| Pattern file | Summary |
|---|---|
| angular-cli-default-test-lint.md | Angular (frontend-web): use `ng new` default test runner (Jasmine/Karma) and Angular ESLint, no Vitest/Jest swap |
| angular-state-signals-and-services.md | Angular (frontend-web): shared/local state via signals + injectable services, no NgRx/Akita unless it stops scaling |
| ef-core-migrations-per-service.md | Backend: migrations use EF Core, owned by each service, applied via a migration role separate from the service's runtime role |
| iorderextractor-gemini-first-adapter.md | Backend: extraction goes through the `IOrderExtractor` port (`ExtractFromAudio`/`ExtractFromImage`), Gemini first, provider chosen by DI config |

<!--
When adding a pattern, append one row here:
| <slug>.md | <one-line summary of what it's for> |
Keep this table sorted by filename. Do not duplicate the file's full
description — just enough to judge relevance without opening it.
-->

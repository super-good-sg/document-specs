# document-specs

Specs for Super Good, written with Spec Kit. Code repos reference these specs.

## Docs (source of truth)
This is the docs repo: business doc, ADRs, canonical order schema and OpenAPI contracts. Read [docs/agent-workflow.md](docs/agent-workflow.md) before starting any ticket. Work lives in Linear (project SuperGood).

## Build / test / lint
TODO: fill in once the project is scaffolded.
- Build: TODO
- Test: TODO
- Lint: TODO

## Conventions
- New or changed behavior starts as a Spec Kit spec here, merged by PR before dependent code.
- One ticket, one branch (Linear `gitBranchName`), one PR. Never merge your own PR.
- Reuse approved patterns; stop and ask before adding a new library or convention.
- Contracts (OpenAPI, order schema) change in document-specs first, never here.
- No secrets in code or commits.

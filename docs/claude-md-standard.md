# CLAUDE.md standard

Linear: SIE-84. Applies to `document-specs`, `frontend-web`, `backend` and `infra`.
Parent: [agent-workflow.md](agent-workflow.md).

## Rules
- One `CLAUDE.md` at each repo root. Target: under 60 lines. Link to docs instead of copying them.
- Same section order in every repo, so an agent knows where to look.
- If a command or path does not exist yet, write `TODO` and the ticket that will fill it. Never guess a command.
- Update `CLAUDE.md` in the same PR that changes a command, folder or convention it describes.

## Sections (in this order)
1. **What this repo is.** One or two lines.
2. **Read first.** Links: [agent-workflow.md](agent-workflow.md), and the spec, contract or ADR relevant to the ticket. Work lives in Linear (project SuperGood).
3. **Commands.** Build, test, lint. One line each.
4. **Folder map.** Top-level folders and what they hold. One line each.
5. **Where things live.** Specs, contracts and ADRs: all in `document-specs`. Code repos never hold contracts.
6. **Conventions.** Branch `type/SIE-xxx/short-summary`, commits `type(SIE-xxx): message` (see CONVENTIONS.md). One ticket, one branch, one PR. Reuse approved patterns; ask before a new library or convention. No secrets.
7. **Do not touch.** Generated files, tool-managed folders, other repos' contracts.

## Where things live (all in `document-specs`)
| What | Path | Status |
|---|---|---|
| Agent workflow | `docs/agent-workflow.md` | exists |
| This standard | `docs/claude-md-standard.md` | exists |
| Business doc | `docs/business-doc.md` | exists |
| ADRs | `docs/adr/` | exists |
| Architecture diagrams (archify JSON and HTML) | `docs/architecture/` | exists |
| Items to reverify | `docs/reverify.md` | exists |
| Contracts (OpenAPI, order schema) | `docs/contracts/` | planned, not created yet |
| Specs (Spec Kit) | `specs/` | planned, created by Spec Kit |

Paths marked planned are the intended homes. Move them here once the first file lands, and update this table.

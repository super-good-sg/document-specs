# Super Good: Agent Workflow Spec (v1)

Linear: SIE-83. Written for: the developer (Sieu) and any coding agent working on Super Good.
Lives in the `document-specs` repo (the docs repo), at `docs/agent-workflow.md`.
Details owned by later tickets: CLAUDE.md files (SIE-84), Linear/GitHub conventions (SIE-85), permissions and hooks (SIE-86), PR review gate (SIE-87), patterns (SIE-88), weekly code/spec sync (SIE-93).

## Principles
1. **The docs repo is the source of truth.** Business doc, ADRs, the canonical order schema and the OpenAPI contracts live there. Agents read them before coding. **Linear is the source of truth for work**: tickets, briefs, dependencies and status.
2. **One ticket, one worktree, one branch, one PR.**
3. **Contracts change first.** A change to the OpenAPI spec or order schema is a PR to the docs repo, merged before any code that depends on it.
4. **Reuse approved patterns; ask before inventing.**
5. **Nothing merges without CI and a review pass.**

## Task flow
| Step | Who | What |
|---|---|---|
| 1. Pick | Sieu | Choose a Linear issue (Backlog to Todo). Check its "Depends on" tickets are done. |
| 2. Brief | Sieu or agent | Make sure the issue has a task brief (template below). Missing links or acceptance criteria: fix the issue first. |
| 3. Worktree | Sieu | Create a worktree and branch with the sieujs Warp tab config (`repo_alias`). Branch name is the Linear `gitBranchName` (for example `nvsieu2703/sie-83-08-agent-workflow-spec`). Issue moves to In Progress. |
| 4. Read | Agent | The repo `CLAUDE.md`, the linked doc section or contract, relevant ADRs, then the pattern index (see Patterns). |
| 5. Build | Agent | Implement only what the brief asks. Tests alongside. Run build, test and lint. |
| 6. Stop and ask | Agent | Whenever a stop rule below applies. |
| 7. PR | Agent | Push the branch, open a PR that links the Linear issue and the contract or doc section, and fills the PR checklist. |
| 8. Review | CI + reviewer | CI passes, then a review pass checks the diff against the brief and contract (SIE-87). |
| 9. Merge | Sieu | Squash merge. Issue moves to Done. Remove the worktree (`sieujs-cleanup`). |

## Task brief template (Linear issue description)
```
Goal: <one sentence, the outcome>
Links: <doc section / ADR / OpenAPI path / schema version>
Acceptance criteria:
- <checkable item>
- <checkable item>
Out of scope: <what not to touch>
Size: S | M | L
Depends on: <ticket ids>
```
An agent should not start on an issue that has no goal, no links and no acceptance criteria. Ask first.

## When an agent must stop and ask
- **New pattern:** a new library, convention or structural approach not in the pattern index.
- **Contract change:** the work needs a change to OpenAPI, the order schema or a database schema owned by another service.
- **Scope growth:** the task needs significantly more than the brief or the size estimate.
- **Destructive or outward actions:** deleting data or branches, force push, changing cloud resources, spending money (cloud, paid API calls beyond dev limits), sending anything to external services, changing production.
- **Secrets:** needing a credential it does not have. Never invent, copy or commit secrets; never use production keys.
- **Conflict:** the brief contradicts the docs, an ADR or the contract.
- **Failing checks it cannot explain** after one reasonable fix attempt.

Bugs, security issues and correctness concerns get normal scrutiny even when a pattern matches.

## Contract rule
1. Need a contract change? Stop. Open a PR in the docs repo with the change and a note on who is affected.
2. After it merges, regenerate clients (web API client, shared contracts project) from it.
3. Only then change the code that depends on it.

Services never edit contracts in their own repo.

## Spec-driven flow
Specs first, then code. Scope of this ticket is only this flow; broader guard rails (permissions, hooks, enforcement beyond the PR check) come in later tickets.
1. **Docs repo (Spec Kit).** Spec Kit is installed in the docs repo (`document-specs`). A new or changed behavior starts as a spec there, merged by PR.
2. **Code repo (OpenSpec).** frontend-web and backend use OpenSpec. Each change is an OpenSpec change that references the merged docs-repo spec it implements.
3. **Code.** Implementation starts only after steps 1 and 2. Every implementation references a spec in the docs repo.
4. **Skills.** frontend-web and backend each have a skill that reads the docs-repo specs. Agents use it in the Read step.

### PR check
- CI runs on every PR in a code repo and fails it if any referenced docs-repo spec is not merged.
- This means the docs-repo spec PR merges first. A code PR cannot pass CI while its spec is still in review.
- CI needs read access to the docs repo to see what is merged (proposed, to confirm in SIE-85/SIE-86).

### Code and spec sync
- A weekly job compares code against specs and sends a report to the owner, who reviews the differences.
- This detects drift; it does not prevent it. A mismatch can stay open for up to a week.
- What is compared and who the owner is: tracked in SIE-93.

## Claude and Codex
- Claude drives. Claude uses Codex for coding tasks and review tasks.
- If a Codex call returns an error, Claude stops that call immediately and does the task itself. Claude does not retry Codex for that task.
- After an error, Claude continues from the current working tree and reviews the diff Codex left before building on it (proposed, to confirm).
- Quota cannot be checked ahead of time, so a failed call is the only signal.

## Patterns
- Knowledge base: the local sieujs `knowledge-base/` directory (outside the repos on purpose; its location is set in the developer's local setup, not in this doc).
- Read `index.md` first; open only the relevant pattern files.
- Match found: apply it, no need to ask again.
- Nothing matches: stop and ask. After approval, add a pattern file and an `index.md` row.

## Definition of done
- [ ] All acceptance criteria met and checked.
- [ ] Build, tests and lint pass locally and in CI.
- [ ] New logic has at least one test that fails if it breaks.
- [ ] Docs updated where behavior changed (README, ADR, contract), with no unrelated edits.
- [ ] No secrets, no debug leftovers, no new dependency without approval.
- [ ] PR links the Linear issue and the contract or doc section; the review pass found no open issues.
- [ ] Linear issue moved to Done after merge.

## Linear status mapping
| Linear status | Meaning |
|---|---|
| Backlog | Not started; may lack a brief |
| Todo | Brief complete, dependencies done, ready to pick |
| In Progress | Worktree exists, work under way |
| In Review | PR open |
| Done | Merged |
| Canceled | Decided against |

(Automatic status changes from GitHub PRs are set up in SIE-85.)

## Working as one developer
- One active milestone and at most two tickets in progress.
- Split an L ticket when starting it if it will not fit in one PR.
- Agents never merge their own PRs.

## Open items (owned by other tickets)
- Exact commit message and PR title format (SIE-85).
- Which commands agents may run without asking, and which are denied (SIE-86).
- PR template checklist and review agent (SIE-87).
- Weekly code/spec sync: what is compared against what, how the comparison is done, and who the owner is (SIE-93).
- Whether a Codex error should also be reported somewhere (log, Linear comment), and whether Codex-only mode is ever wanted.
- Whether sandboxing (Docker Sandboxes) or Docker Agent is added later: deferred (see the 2026-10-12 Docker Agent discussion note).

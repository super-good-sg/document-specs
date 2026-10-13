# Git conventions

Applies to every Super Good repo (`document-specs`, `frontend-web`, `backend`). One Linear ticket, one branch, one PR. Modelled on sfs-framework, minus the monorepo "area" part.

## Branch name

`type/SIE-xxx/short-summary`, for example `docs/SIE-85/linear-github-conventions`.

- Types: `feat`, `fix`, `hotfix`, `docs`, `build`, `chore`.
- The ticket is the Linear issue ID. Linear reads it from the branch name (case does not matter) and links the PR.
- Several tickets: use the primary one in the branch name and name the others in the PR description.

## Commit message and PR title

`type(SIE-xxx): message`, for example `fix(SIE-85): handle login error`.

- Types: `feat`, `fix`, `hotfix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`, `revert`.
- The scope is the ticket and is required. Several tickets: `SIE-85,86`.
- The message starts with a lowercase letter a-z. The whole header is at most 100 characters.
- The PR title follows the same format.

## What blocks what

| Rule | Enforced by | Blocks |
|---|---|---|
| Commit message format | `commit-msg` hook (husky and commitlint) | The commit, on your machine |
| PR title format | CI check `PR title` | Merging, once it is a required check on `main` |
| Branch name | PR checklist item | Nothing |
| Merge style (no squash) | Convention. Disable squash and rebase merging in the repo settings to enforce it | Nothing until the setting is changed |

The hook is skipped by `git commit --no-verify` and does not exist until `npm install` has run in the clone or worktree, so the PR title check is the backstop. Run `npm ci` after creating a worktree.

## Merging

Merge with the merge button (a merge commit). Do not squash or rebase: a squash commit's message is never checked by the hook.

## Linear and GitHub

Set in Linear (Settings, Integrations, GitHub), not in code:

| PR event | Linear status |
|---|---|
| PR ready for review | In Review (verified) |
| PR merged | Done (set in Linear, not yet verified) |

The draft-PR rule is not verified: set In Progress by hand when you start.

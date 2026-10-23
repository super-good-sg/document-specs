---
name: weekly-report-markdown-state
description: document-specs - a scheduled report persists its state as a hidden JSON block inside the Markdown file it delivers, with a fixed-name branch reused as the single open PR
approved_date: 2026-10-23
source_repo: document-specs
---

## When to use

A scheduled job that compares repo/contract state over time and needs to
show the owner one persistent, append-only report (not a one-off notification)
without a database or external service.

## Pattern

- **State lives inside the delivered artifact.** The report is one Markdown
  file with a hidden `<!-- drift-report-state ... -->` JSON block holding the
  structured items (status, firstSeen, any owner-added fields). The rendered
  tables below it are a view over that state, regenerated every run via
  `parseReport`/`renderReport`. No separate database or issue tracker credential
  is needed to keep history between runs.
- **One fixed branch name is the one open report**, not a branch per run. The
  CI job always force-pushes `reports/<report-name>` fresh off `main`, after
  first loading that branch's current file content as the merge baseline (so
  in-flight owner edits via a `set-status`-style CLI command aren't lost). It
  then checks `gh pr list --head <branch> --state open` and only opens a new
  PR if none exists — this is what keeps "one open report" true across weeks.
- **A pure-function core, an impure shell.** All comparison/merge/render logic
  is exported as pure functions (`computeX`, `mergeReport`, `renderReport`,
  `parseReport`) covered by `node:test`; only the top-level `main()` touches
  git/fetch/fs. Keep this split for any similar scheduled-report script.
- **Idempotency matters for the PR-reuse check to work.** Render must not
  embed anything (e.g. a fresh timestamp) that changes on every run when the
  underlying data didn't — compare old vs. new state value-wise and only bump
  the displayed "Last run" time when something actually changed.
- Owner actions (reject / ticket an item) are a separate CLI subcommand
  (`set-status`) that edits the same persisted state, not automatic logic —
  see SIE-93 spec FR-010.

## Notes

From SIE-93 (`specs/001-contract-drift-detection/spec.md`, user stories 2
and 3). The report-target/execution/scope decisions (Markdown file vs. GitHub
issue, GitHub Actions cron vs. local script, building against real "could not
compare" input before pins exist) were explicitly approved by the owner in
that ticket's session rather than inferred.

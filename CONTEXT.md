# Super Good

Language used across the docs repo and the code repos (`backend`, `frontend-web`). The docs repo is the source of truth; code follows it.

## Language

**Contract**:
A machine-readable definition in the docs repo (an OpenAPI file or the order schema) that code is built to match.
_Avoid_: API doc, interface file

**Pin**:
The docs-repo commit, generator version and list of consumed contracts a code repo declares it follows, recorded in that repo and changed only by a deliberate pull request.
_Avoid_: lock, version bump (the act of changing it is "moving the pin")

**Drift**:
A difference between a code repo and its pinned contracts, or a contract the repo consumes having changed since its pin. The contract is right; the code repo is what changes.
_Avoid_: conflict, mismatch, out of sync

**Contract ahead**:
The normal state after a contract changes: the latest contract is newer than a code repo's pin. It is reported, not blocked.
_Avoid_: stale code, outdated

**Spec conflict**:
Two contracts or specs in the docs repo that disagree with each other. Neither is "right" by rule, so the owner decides which one changes.
_Avoid_: drift, conflict (a bare "conflict" means a git merge conflict)

**Drift report**:
The weekly list of drift and spec conflicts, addressed to the owner. Items become tickets only on the owner's instruction.
_Avoid_: scan result, alert

**Owner**:
The person who reads the drift report and decides which items become tickets.
_Avoid_: assignee, reviewer

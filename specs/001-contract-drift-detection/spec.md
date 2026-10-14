# Feature Specification: Contract Drift Detection

**Feature Branch**: `docs/SIE-94/contract-drift-spec`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Detect when code differs from the contracts in the docs repo. Block code pull requests that differ from the contract version the repo follows, and report weekly where the latest contract is ahead of the code or where two contracts disagree. The owner reads the report and approves which items become tickets. The contract is always right; code follows it."

Terms (Contract, Pin, Drift, Contract ahead, Spec conflict, Drift report, Owner) are defined in [CONTEXT.md](../../CONTEXT.md). The pin decision is recorded in [ADR 0001](../../docs/adr/0001-pin-contract-version-per-code-repo.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A code PR that differs from its pinned contract is blocked (Priority: P1)

A developer or agent opens a pull request in a code repo. The system checks that the generated code matches what the repo's pinned contract version produces. If it does not, the pull request cannot merge, and the failure shows what differs.

**Why this priority**: This is the guard rail. Without it, hand edits to generated code reach `main` and the contract stops being the source of truth.

**Independent Test**: Open a pull request that hand-edits one generated file in a code repo. It fails with the difference shown. Revert the edit and it passes. Needs no weekly report to work.

**Acceptance Scenarios**:

1. **Given** generated code that matches the pinned contract, **When** a pull request is opened, **Then** the check passes.
2. **Given** a hand edit to generated code, **When** a pull request is opened, **Then** the check fails and shows which output differs from what the pinned contract produces.
3. **Given** the latest contract is ahead of the pin, **When** an unrelated pull request (for example a README change) is opened, **Then** the check passes.
4. **Given** the pin is moved to a newer contract and the code is regenerated in the same pull request, **When** the pull request is opened, **Then** the check passes.

---

### User Story 2 - The owner receives a weekly report of drift and approves tickets (Priority: P2)

Once a week the system compares each code repo's pin with the latest contract and produces one report addressed to the owner, listing every code repo that is behind and which contracts changed. The owner reads it and chooses which items become tickets. The system never creates tickets by itself.

**Why this priority**: The PR check cannot see "contract ahead of code", because nobody opens a PR in the code repo after a contract change. The report is the only place that state shows up.

**Independent Test**: Move a contract forward without moving a repo's pin. At the next scheduled run, the report lists that repo and the changed contract. No ticket exists until the owner asks for one.

**Acceptance Scenarios**:

1. **Given** a code repo whose pin is behind the latest contract, **When** the weekly run happens, **Then** the report lists the repo, how far it is behind, and which contracts changed.
2. **Given** every pin is current, **When** the weekly run happens, **Then** no new report is opened.
3. **Given** a previous report is still open, **When** the weekly run finds drift, **Then** the system adds to that report instead of opening a second one.
4. **Given** the owner rejected an item with a reason, **When** the same drift is found later, **Then** the item is not listed again until the contract changes again.
5. **Given** the owner has read the report, **When** the owner asks for tickets for chosen items, **Then** tickets are created for exactly those items.

---

### User Story 3 - Disagreeing contracts are surfaced as a spec conflict (Priority: P3)

During the same weekly run, the system checks the contracts in the docs repo against each other (the OpenAPI contract against the order schema). A disagreement is listed in the report as a spec conflict, for the owner to decide which contract changes.

**Why this priority**: It is the same kind of mechanical comparison, but it can only appear once both contracts exist, and it does not block anything.

**Independent Test**: Make a field name differ between the OpenAPI contract and the order schema. The next report lists a spec conflict naming both places.

**Acceptance Scenarios**:

1. **Given** two contracts that name the same field differently, **When** the weekly run happens, **Then** the report lists a spec conflict naming both contracts and the field.
2. **Given** contracts that agree, **When** the weekly run happens, **Then** no spec conflict is listed.

---

### Edge Cases

- The pinned contract version cannot be fetched: the PR check fails with a message naming the pin. It never passes silently.
- The code generator fails or is missing: the PR check fails and shows the generator's own error.
- The pin file is missing or malformed: the PR check fails; the system does not guess a version.
- The generator itself is upgraded and its output changes: the PR check fails until the code is regenerated in the same pull request. The failure message says this can be the cause. Because the generator version is part of the pin, a generator upgrade is a deliberate pin move made in its own pull request, so it never fails unrelated pull requests.
- The weekly run finds more than 20 items: the report lists 20 and states how many more exist.
- The weekly run itself fails: the owner is told in the same week. A silent failure must not look like "no drift".
- No contract has been published yet in the docs repo: both checks report "nothing to compare" and do not fail, and a code repo without a pin is accepted. From the first published contract on, a repo without a pin fails the PR check (FR-001), and a pin naming a version that cannot be fetched always fails (FR-003).
- A code repo has no generated code yet: the PR check passes with "nothing to compare".
- The owner cancels a ticket made from a report item: the item is not listed again for the same contract change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every code repo MUST declare one pin, changed only by a pull request. The pin is one docs-repo commit plus the generator version, together with the list of contracts the repo consumes.
- **FR-002**: For every pull request in a code repo, the system MUST regenerate code from the pinned contract and fail the pull request when the committed generated code differs.
- **FR-003**: A failed PR check MUST show what differs and MUST NOT pass when the contract, the generator, or the pin cannot be read.
- **FR-004**: The PR check MUST NOT compare against the latest contract, only against the pin, so a contract change never fails unrelated pull requests.
- **FR-005**: Once a week the system MUST compare each code repo's pin with the latest contract and record, per repo, how far it is behind and which of the contracts it consumes changed. A change to a contract the repo does not consume MUST NOT make it behind.
- **FR-006**: Once a week the system MUST compare the contracts in the docs repo against each other and record disagreements as spec conflicts. In version one a disagreement is a field that exists in both contracts under different names, or with different types. Required-ness and enum values are a later scope.
- **FR-007**: The weekly run MUST produce at most one open drift report, addressed to the owner, and MUST add to an open report instead of opening a second.
- **FR-008**: A drift report MUST list at most 20 items, oldest first, and state how many more exist. Items that already have a ticket (FR-015) or were rejected (FR-011) do not count toward the 20 or the remainder, so acting on items brings the next ones into view.
- **FR-009**: Each report item MUST name its kind (drift or spec conflict), the contract or contracts involved (and, for drift, the code repo and location), and a stable key that is the same on every run for the same difference.
- **FR-010**: The system MUST NOT create tickets by itself. A ticket is created only when the owner asks for it for a chosen item.
- **FR-011**: The system MUST NOT list again an item the owner rejected, until a contract it concerns changes (for a spec conflict, either of the two contracts involved).
- **FR-012**: If the weekly run fails, the system MUST tell the owner within the same week.
- **FR-013**: The weekly run MUST NOT hold any credential for the ticket tracker.
- **FR-014**: If the weekly run cannot read a code repo's pin or the pinned contract, the repo MUST appear in the report as "could not compare" with the reason. It MUST NOT be left out.
- **FR-015**: When the owner asks for a ticket for an item, the report MUST show that ticket on the item and MUST NOT offer the item again as new while the ticket is open.

### Key Entities

- **Contract**: A definition in the docs repo that code is built to match. Has a version (a commit in the docs repo).
- **Pin**: One per code repo: a docs-repo commit, the generator version, and the list of contracts the repo consumes. A repo is behind only when a contract it consumes changed between its pin and the latest docs-repo commit.
- **Drift finding**: One difference, with a stable key, a kind, the contract and the code location involved.
- **Drift report**: One list of findings for the owner, capped at 20 items, with an open or closed state.
- **Spec conflict**: Two contracts in the docs repo that disagree, naming both and the field involved.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pull request that hand-edits generated code fails the PR check in 100% of cases, tested with at least one hand edit in each kind of generated file.
- **SC-002**: A pull request that changes no generated code passes the PR check even when the latest contract is ahead of the pin with zero extra steps for the author.
- **SC-003**: After a contract changes, the owner learns which code repos are behind within one week, without opening any code repo.
- **SC-004**: No drift report lists more than 20 items, and no second report exists while one is open.
- **SC-005**: Zero tickets are created without an explicit instruction from the owner.
- **SC-006**: A failed weekly run is visible to the owner within the same week.
- **SC-007**: A PR check run finishes in under 5 minutes on the standard CI runner, measured on the largest code repo at that time,, so it does not slow merging.

## Assumptions

- **Precondition:** code in the code repos is generated from the contracts, and the generator produces identical output on every run for the same input. Without this the PR check would fail at random. The stack is not chosen yet, so this is unverified. If only part of the code is generated, only that part is checked.
- Version one covers structured contracts only: OpenAPI contracts and the order schema, compared with generated code and with each other. Comparing prose specs, or code-repo specs with docs-repo specs, is out of scope and needs a later scope.
- Hand-written code that is not generated is out of scope for version one.
- The owner is the person who runs the project today (Sieu). The report goes to that person.
- The report and the PR check run where the repos already are (the GitHub organisation). The exact job mechanism is decided in the plan, not here.
- The pin file is called `contract.lock` as a working name. The name may change in the plan.
- The cap of 20 items, the "tell the owner when the weekly run fails" rule and the 5-minute target (FR-008, FR-012, SC-007), the oldest-first order (FR-008), the "could not compare" rule (FR-014) and the ticketed state (FR-015) were proposed by the assistant, the last three after an independent review, and are still to be confirmed by the owner. The three open questions (generator version in the pin, what one pin covers, what counts as a disagreement) were settled by the owner on 2026-10-14 by accepting the recommended options. Everything else above was decided by the owner.
- The docs repo and the code repos are public, so fetching a contract version needs no credential.
- Depends on the first contract and the first generated code existing. Until then, building the checks has nothing to run against; this spec is written first, as the project works specs-first.
- Relation to existing tickets: SIE-93 (weekly report) covers User Stories 2 and 3 for version one. A new ticket is needed for User Story 1 (the blocking PR check).

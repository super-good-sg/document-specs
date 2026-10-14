# Each code repo pins the contract version it follows

Code repos record one pinned contract version, and the PR drift check compares generated code against that pin, not against the latest contract. This keeps docs-first work possible: a contract can change without failing every unrelated code PR, and "contract ahead of code" becomes a visible, normal state that the weekly report lists. Moving the pin is a deliberate pull request.

## Considered Options

- **Check against the latest contract, no pin.** Rejected: after any contract change, every code PR fails, including unrelated ones, which contradicts the rule that contract changes land first.
- **Pin plus a hash stamp, without regenerating code.** Rejected: it is cheaper but cannot see a hand edit to generated code, which is the case the PR-time check exists to stop.

## Consequences

- Every code repo carries one extra small file (the pin).
- The check needs a code generator that produces the same output on every run; the spec records this as a precondition.

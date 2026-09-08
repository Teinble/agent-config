# Code quality and final-state clarity

Report concrete comprehension, coupling, or maintenance costs. Generic heuristics
are not hard violations; cite an adopted project rule when claiming a violation.

## Boundaries and simplicity

- Judge files by cohesion and reasons to change, not a fixed line limit.
  Suggest separation when unrelated responsibilities obscure an independent flow.
  Do not fragment cohesive code into tiny files that require more navigation.
- Functions should express a clear task with understandable inputs, outputs,
  and side effects. Extract meaningful steps, not wrappers that merely move lines.
- Keep values in the smallest sensible scope. Module-private constants are valid;
  export only real shared contracts. Equal literals need not represent one rule.
  Do not create a global constants file just to relocate private values.
- A const binding does not make its object immutable. Check shared mutable state
  for ownership, lifetime, and cross-request effects.
- Prefer existing code, native features, and established dependencies when they
  satisfy the actual semantics. A single implementation is not proof an abstraction
  is wasteful. Show why an alternative reduces cost without losing useful behavior,
  safety, performance, or clarity; never optimize for lines deleted.
- In frontend code, keep feature-specific behavior near its owner and respect
  adopted dependency directions. Do not impose a new folder architecture during
  review. Consider component state, accessibility, and effect cleanup where relevant.

## Final-state clarity

Comments should explain non-obvious reasons, invariants, constraints, or workarounds,
not narrate obvious code or preserve abandoned attempts and retracted assumptions.
Preserve useful API documentation and verified historical rationale.

Review docs and supplied commit/PR drafts against the final change. Explain purpose,
behavior, relevant verification, and material tradeoffs. Do not advertise the absence
of unrequested features or describe never-merged intermediate states. Removing
behavior from the base revision can be important for compatibility and migration.
Do not turn this into a general prose rewrite or invent rationale for the author.

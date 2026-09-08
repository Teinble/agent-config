# Test quality and evidence

Judge whether evidence addresses meaningful changed behavior, not test count or
coverage alone. Missing evidence is not itself proof of an implementation defect.

- Expected behavior should follow requirements or established contracts, not a
  copy of the implementation's branches or a snapshot accepted without inspection.
- Ask which plausible wrong behavior an assertion would detect. A test failing
  through an unrelated import/setup error does not demonstrate that capability.
  Reason from source and existing results; do not mutate code to prove a point
  in this read-only review.
- Prefer observable outcomes over incidental internal calls. Internal assertions
  can be valid for explicit interaction or resource-management contracts.
- Check whether mocks bypass the failure boundary being claimed. Do not reject
  unit tests merely for using mocks or demand integration tests for every change.
- Identify flaky timing, fixed sleeps, order dependence, environment assumptions,
  missing cleanup, and unsafe shared fixtures when supported by the test.
- For lifecycle/concurrency changes, consider applicable failure, cancellation,
  retry, and cleanup invariants. Random runs are not proof of all interleavings;
  useful experiment reports include seeds, conditions, and reproduction steps.
- Do not demand tests for mechanical renames, file deletion, config removal, or
  text replacement alone. Check references and existing validation; recommend a
  regression test only for a meaningful, insufficiently protected contract.
- Do not assert incidental paths, config keys, or file existence unless they are
  the contract. Explain redundancy or brittleness before suggesting test removal.
- When evidence is insufficient, name the claim at risk and the cheapest adequate
  check: existing test, static check, focused regression test, or isolated experiment.
  Do not require permanent tests for one-off evidence, but consequential claims
  need a reproducible basis. Production actions require separate authorization.

Report what actually ran separately from inspected test code and proposed checks.
Do not turn a narrow passing scenario into a universal guarantee.

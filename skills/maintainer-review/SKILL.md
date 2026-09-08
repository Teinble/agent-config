---
name: maintainer-review
description: Read-only review of a diff or PR for correctness, test evidence, and maintainability. Supports quick, focused, and full reviews; does not implement fixes.
---

# Maintainer Review

Give the maintainer verified findings, not an automatic repair loop.

## Scope and depth

Establish the requested comparison and requirements. State the base revision,
head revision, and whether staged, unstaged, or relevant untracked files are
included. Do not require a commit to review work in progress. Use an unambiguous
requested scope; ask only when different plausible scopes would change the review.
Read relevant contracts and callers, not the whole repo. With no spec, state the
limit and use explicit user requirements and established contracts; invent none.

- Default / quick: one reviewer, proportionate inspection of the target diff
  and important affected paths. No automatic full test suite.
- Focused: inspect only the requested boundary in depth. State excluded areas.
- Full: cover material risks across the boundaries below; independent reviewers
  are optional, not a fixed quota. Use multiple agents only when the user requests
  full or multi-agent review and independent scopes justify it.

Quick narrows coverage, not the evidence needed to report a finding.

## Review boundaries

- Behavior / correctness: check requirement compliance, regressions, contracts,
  ownership, lifecycle, security, and failure handling relevant to the change.
  Separate a demonstrated defect from a missing requirement or an open question.
- Code quality / clarity: when reviewing structure, complexity, or documentation,
  read [code-quality.md](references/code-quality.md).
- Test / evidence: when reviewing changed tests or verification of changed behavior,
  read [test-quality.md](references/test-quality.md).

These are lenses, not required report sections or sources of finding quotas.
Prefer the project's documented conventions over generic design preferences.

## Independent review, when selected

Assign bounded responsibilities with the same revision or stable diff snapshot,
requirements, and necessary raw context. Do not supply other reviewers' findings
or the author's rationale as established facts. Each reviewer works directly:
no delegation, recursive skill invocation, edits, or fix loops.

A different model such as Claude may cover a boundary only through an available,
authorized interface. Never claim a cross-model review that did not run. If it
is unavailable, disclose that and use available review capabilities without
installing tools or sending private code to an unapproved service.

The coordinating reviewer must recheck findings against source and requirements,
merge duplicates, and resolve or expose disagreements using evidence, not votes.
If the reviewed files change during review, disclose the stale scope rather than
silently combining evidence from different versions.

## Read-only boundary

Do not edit code, tests, docs, config, or Git state; install dependencies; post
comments; commit; push; or deploy. Review is not authorization to fix.
Run existing checks only when safe within the authorized environment. Checks may
write disposable outputs, but must not rewrite source, snapshots, lockfiles, or
shared state. If their effects are unclear, inspect first or report the limit.
Do not introduce mutations, fault injection, or new tests during this review.

## Findings and handoff

Validate each candidate against actual behavior and available evidence. Prioritize
issues introduced or exposed by this change; do not expand into an unrelated audit.
Skip formatter noise, speculative concerns, and personal taste presented as rules.

For each actionable finding, give a concise priority, file/line, triggering
condition, impact, supporting evidence, and smallest correction direction.
Rank by concrete impact and urgency, not by category or reviewer count.
Distinguish confirmed defects from optional design suggestions and open questions.
Do not relabel a style concern as a correctness defect to make it seem important.

Briefly state scope, checks actually run, and material verification limits.
Use the user's conversation language while preserving code identifiers.
If there are no supported findings, say so without claiming the change is risk-free.
Stop after the report. Do not apply fixes or rerun review until it comes back clean.

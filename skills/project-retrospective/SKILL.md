---
name: project-retrospective
description: Teach project behavior and design decisions through recently completed work using repository evidence. Use when the user asks to learn from a change or do a project retrospective, rather than a standalone code review or cleanup operation.
---

# Project Retrospective

Help the user understand the project through the work they just did: how the
affected system operates, why the change matters, and what remains unresolved.
Default to read-only inspection and conversational explanation. Completing work
does not authorize fixes, publication, resource termination, or deletion.

## Establish the evidence boundary

Identify the requested task or change from the conversation and repository.
Inspect the relevant instructions, Git status, revisions, and diff. Ask for a
target only if ambiguity would materially change the explanation.

- Distinguish pushed PR revisions, local commits, and uncommitted or untracked
  work. In a stack, distinguish each PR's responsibility from combined behavior.
  Name the revisions used; do not attribute unrelated worktree changes to this task.
- Use conversations and PR descriptions as leads, then check implementation and
  relevant callers. Mark unavailable evidence and stale remote observations.
- Choose a representative flow through the affected modules. Expand the scope
  only where needed to explain its inputs, outputs, ownership, or failure behavior.

Proceed when the target and its evidence limits are clear, not when the entire
repository has been inventoried.

## Teach through the change

Start with the outcome and the problem it addressed. Walk through one concrete
request, data item, or state transition before and after the change. Point to the
files and symbols that own each meaningful step and explain the contracts between
them. Emphasize the concepts the user can reuse to navigate or modify the project,
not a chronological list of edits.

Explain consequential decisions and tradeoffs. Separate recorded rationale from
your inference; describe unknown motivation as unknown. Discuss alternatives when
they clarify a real constraint, not to invent a decision history. Link important
claims to code, tests, or revision-specific artifacts.

Match depth to the user's questions and familiarity. When a visual materially
helps and show-me is available, read and use that skill for the smallest useful
view. Otherwise use a short explanation or compact inline diagram; do not install
dependencies to produce the retrospective. Avoid automatic quizzes, exhaustive
file tours, and unsolicited HTML or reports. Save a retrospective only when asked,
at an agreed location in the project that owns the knowledge.

## Explain confidence and remaining work

Tie each test or runtime observation to what it actually demonstrates, including
the revision and environment where known. Distinguish results inspected from
checks run in this session. Earlier passing checks are not evidence for later
edits. State important untested paths and environmental assumptions.

Separate completed behavior, unresolved uncertainty, and deferred work. Link
existing issues or PRs instead of creating new ones automatically. A newly noticed
possible defect is an observation with evidence, not a completed review or an
instruction to implement a fix.

## Optional cleanup handoff

Only when the user explicitly requests cleanup assessment or a task closeout
checklist, read [cleanup-handoff.md](references/cleanup-handoff.md) and assess
resources connected to the scoped task. Completing a change or asking to learn
from it does not trigger this branch. Candidate discovery does not execute cleanup.

A retrospective is complete when the scoped behavior and design decisions have
been explained with evidence, verification limits, and remaining decisions.

# Cleanup handoff

Use this reference only when the user explicitly requests cleanup assessment or
a task closeout checklist alongside the retrospective. Inspect resources tied to
the scoped task and report exact targets, preservation/dependency evidence, and
uncertain disposition. This assessment does not execute cleanup.

For Git resources, assess local branches, remote branches, and worktrees as
separate targets:

- Record repository, branch/ref, tip SHA, worktree path where applicable, and
  the evidence that the work is preserved elsewhere. Include uncommitted,
  untracked, ignored, and local-only material relevant to removing a worktree;
  a clean tracked diff alone is insufficient.
- Check worktree occupancy and unfinished stack/PR dependencies. A branch still
  serving as another PR's base or supporting active work is not ready for deletion.
- Verify preservation against the intended destination. A merged PR badge or
  ancestry check alone is insufficient for squash/rebase merges or subsequent
  branch commits. Inspect the relevant changes; retain uncertain work.
- Describe disruption and recovery limits. A tip SHA is a recovery clue, not a
  durable backup, and cannot recover uncommitted files. Local deletion does not
  authorize remote deletion; failure of a safe deletion check does not authorize
  force deletion.

For jobs, processes, containers, or temporary files, report task attribution,
known use, and missing safety evidence. Age or idleness alone does not prove that
a resource is disposable. Keep host-specific inspection and execution in the
appropriate maintenance workflow. For explicitly requested A100-4 resource
cleanup, use a100-cleanup if available and follow its fresh ownership checks.
If no applicable cleanup skill is available, report the evidence and execution
limits. Preserve existing user authorization; ask only for permission or direction
that is actually missing.

Record which actions are already authorized and which still require approval.
Cleanup completion is separate from explaining the scoped work.

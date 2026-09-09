# Maintaining agent-config

This repository stores reusable instructions, not project-specific knowledge.
These rules govern edits here; they are not a global instruction payload.

- Keep portable defaults in instructions/AGENTS.md and instructions/CLAUDE.md.
  Keep their shared policies aligned; preserve genuine agent-specific differences.
- Put host-specific facts in instructions/machines/ and load them only through
  an explicitly selected local entry file.
- Put conditional operational guidance in instructions/workflows/ with a clear
  trigger in the global instructions. Reuse installed third-party skills rather
  than copying their contents.
- Keep project architecture, contracts, and invariants in the project that owns
  them. Do not add generic knowledge folders or speculative reference files.
- Keep skill descriptions precise and workflows proportional to the task.
  Preserve permission boundaries; instructions do not authorize external actions.
- Describe current behavior and non-obvious constraints in instructions and docs,
  not abandoned attempts or editing history. Preserve actionable migration guidance
  and verified rationale; describe process history only when requested.
- Update README setup guidance when loading paths or installation steps change.
  Update registry.json when personal skill behavior or metadata changes.
- For documentation-only changes, inspect the diff and reference targets.
  Do not add tests that merely assert wording, filenames, or file existence.
  Validate executable changes with focused checks when applicable.
- Never modify installed global files, install skills, publish, or push merely
  because the canonical source changed. Those are separate requested operations.
- Write repository artifacts in English. Reply in natural Simplified Chinese with English
  technical terms unless the user requests another language.

## Skill selection and synchronization

Maintain selections in skills.json and the sync entry point in scripts/skills.mjs.
Read the README's Skill synchronization section before changing either. A manifest
or documentation edit does not authorize installing skills.

- Keep one version-controlled selection manifest for personal and third-party
  skills, recording each upstream source, explicitly selected skill names, and
  installation scope and target agents. Keep registry.json for human-facing
  personal skill metadata; it is not an installation manifest.
- Before adding a third-party skill, verify its upstream source and exact name,
  read its SKILL.md and relevant bundled scripts, and check permissions and overlap
  with existing skills. Record the selection before installing it. Maintain
  third-party content upstream rather than copying it into this repository.
- Keep the installation entry point thin and delegate installation to the skills
  CLI. Prefer verified native CLI capabilities when they meet the contract.
  Reject empty or ambiguous selections rather than installing every upstream skill.
- Sync installs missing selections for the configured scope and agents. Inspect
  installed state and provenance first; preserve matching installations without
  refreshing their contents. Report source conflicts or unknown provenance rather
  than silently overwriting. Do not implement sync by reinstalling every selection.
- Update explicitly refreshes selected skills from upstream. Remove explicitly
  uninstalls selected skills. Neither happens implicitly during sync, and removing
  a manifest entry does not authorize uninstalling an existing skill. Preserve
  installations outside the managed selection.
- Report failures and incomplete synchronization clearly. Do not claim identical
  content across machines unless revisions are pinned and verified; matching
  selections alone do not guarantee matching versions.
- Keep the actual bootstrap and sync commands documented in README.md.
  Other machines pull the manifest and run sync explicitly; a commit or push does
  not synchronize installed skills automatically.

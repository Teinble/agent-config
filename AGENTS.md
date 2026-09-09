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

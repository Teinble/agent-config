# Global instructions

## Response language

Default to natural Chinese prose with English technical terminology in replies
to the user, even when the user writes in English. Follow another language choice
when explicitly requested.

- Use Chinese for ordinary language, language names, transitions, explanations,
  and conclusions. Do not insert English words merely to create a mixed style.
- Keep technical and software-engineering terms in English, including common
  workflow terms such as test, build, lint, review, debug, refactor, commit,
  branch, merge, and deploy, as well as API, cache, function, and config.
- Do not routinely add Chinese translations of technical terms. Explain
  unfamiliar concepts in Chinese while keeping their technical names in English.
- Preserve identifiers, commands, paths, logs, error messages, and numbers exactly.
- Lead with the conclusion. Keep the prose clear and direct without omitting
  important details, uncertainty, or verification limits.

This mixed-language preference applies only to conversational replies to the
user. Write code and project artifacts in English, including comments,
docstrings, UI text, error messages, documentation, test descriptions, commit
messages, and PR descriptions, unless the user explicitly requests another
language. Preserve existing localization.

## Human maintainability

Prefer existing abstractions and explicit control flow. Add abstractions when
they materially simplify the requested change, not for speculative reuse.

For significant changes, briefly explain new concepts, ownership or lifecycle
changes, and non-obvious behavior such as retries, caching, background work,
or fallbacks. Ground explanations in code and distinguish confirmed rationale
from inference. Use a compact visual when it clarifies an important relationship.
Do not automatically create architecture documents, walkthroughs, or quizzes.

## Verification

Choose checks that address changed behavior and material risks. Reuse existing
checks when sufficient; do not optimize for test count or coverage alone.

Do not add tests merely to confirm mechanical edits such as file renames,
deletions, config removal, or text replacement. Check affected references and
use existing validation where relevant. Add a regression test when a meaningful
behavioral contract changes and existing checks do not adequately protect it.

Do not assert incidental filenames, file existence, config keys, or source text
unless they are part of an explicit contract. Derive expectations from
requirements and established contracts, not by copying implementation logic.

Complete relevant verification and fix issues introduced by the requested
implementation within the authorized scope. Report what actually ran, its
outcome, and important remaining uncertainty.

Use fault injection or mutation checks only when they materially improve
confidence and can run safely in isolation. Preserve reproducible evidence for
consequential experiments. Do not modify shared or production systems without
appropriate authority.

## Git and GitHub

- Name branches `xiling/<type>/<short-description>`, using types such as
  `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, or `chore`.
- Write commits as `<type>[optional scope]: <description>`. Mark breaking
  changes with `!` or a `BREAKING CHANGE:` footer.
- Use `gh` for GitHub and PR operations when authenticated. Use `gh stack`
  only when installed and stacked PRs are relevant.
- If a GitHub operation encounters an authentication or connectivity error,
  read `workflows/github-auth.md` relative to this instruction file before
  recommending reauthentication.
- For UI PRs, include after-change screenshots. Keep screenshots temporary;
  do not commit them unless explicitly requested.

## Knowledge and conditional instructions

Read only the references relevant to the current task. Resolve relative paths
against this file in the canonical clone, not the current project directory.
If a required reference is unavailable, report it rather than inventing its contents.

Machine instructions are selected explicitly by the local entry file. Do not
load other machine profiles or infer that an A100 path applies to every host.

Keep project architecture, contracts, invariants, and operational knowledge in
the project's existing docs. Read relevant subsystem docs when needed, not the
whole documentation set before every edit. Update durable facts with the code;
do not turn unverified inferences or temporary findings into project facts.

For tasks involving Herdr panes or Herdr review requests, read the installed
`herdr-collaboration` skill and follow the applicable role. Do not load it for
unrelated tasks. If unavailable, report the missing dependency before attempting
the Herdr workflow.

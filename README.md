# Personal agent configuration

Canonical source for Xiling's reusable skills and global agent instructions.
The personal website consumes a pinned revision of this repository as a submodule.

## Skills

```sh
npx skills add Teinble/agent-config --list
npx skills add Teinble/agent-config -g -a codex claude-code --skill ask eli5
npx skills update
```

Edit skills under `skills/`. `registry.json` contains their human-facing website
descriptions. Keep project-specific knowledge in the project's repository.
Third-party skills should be installed from their upstream repositories.

### Skill synchronization

Requires Node.js 22+ and npm (including npx). Clone this repository, then run:

```sh
node scripts/skills.mjs sync --dry-run
node scripts/skills.mjs sync
```

The script reads skills.json relative to itself, regardless of the working
directory. On another machine, pull this repository and run the same command.
Only published upstream content is installed; local edits to personal skills
are not installed by sync.

To add a third-party skill, review its upstream SKILL.md and bundled resources,
verify its exact name, and add that name under its provider in skills.json.
For a new provider, add an object with source (GitHub owner/repo) and a non-empty
skills array. Preview, sync, and commit the manifest to share the selection.
registry.json remains website metadata for personal skills, not the install list.

Sync installs missing selections using the pinned skills CLI. Existing matching
content is preserved, including local edits. Codex uses ~/.agents/skills directly;
if only the Claude Code entry is missing, sync adds a symlink to that existing
content without downloading it again. The script respects CLAUDE_CONFIG_DIR,
CODEX_HOME (for legacy shadowing checks), and XDG_STATE_HOME (for the CLI lock).

This adapter supports global GitHub selections for Codex and Claude Code on
Linux/macOS. It checks the CLI's v3 global lock and filesystem targets, rejecting
unknown provenance, source/ref conflicts, broken installs, independent copies,
and unsupported lock formats before any installation. Inspect and resolve those
cases explicitly; sync does not adopt, delete, or overwrite them. Run only one
skills management command at a time. CLI or verification failures exit nonzero;
earlier successful installations are retained and reported in the plan. A retry
checks current state rather than reinstalling successful selections.

Sync is not update or remove. Use explicit upstream CLI operations for those,
with selected skill names and the intended global/agent scope. Removing a
manifest entry does not uninstall it, and unselected installations remain
untouched. There are no wrapper update/remove commands. The manifest tracks
selection, not immutable skill revisions; fresh machines may receive newer
upstream content than existing machines.

The CLI version is pinned in scripts/skills.mjs because this adapter depends on
its lock format and installation layout. Recheck the upstream
[lock handling](https://github.com/vercel-labs/skills/blob/v1.5.25/src/skill-lock.ts)
and [installer](https://github.com/vercel-labs/skills/blob/v1.5.25/src/installer.ts)
when upgrading. The native experimental_install command restores project-level
skills; it does not provide this global sync behavior.

Run isolated tests without downloading or installing upstream skills:

```sh
node --test scripts/skills.test.mjs
```

### Maintainer review

Install the complete folder, including references:

```sh
npx skills add Teinble/agent-config -g -a codex claude-code --skill maintainer-review
```

Example requests:

- Use maintainer-review for a quick review of my uncommitted changes.
- Use maintainer-review to assess test quality in this diff.
- Use maintainer-review for a full review against main.

Default and quick reviews scan correctness, code quality, and test evidence with
one reviewer; quick limits depth. Focused reviews inspect the selected boundary.
Stack reviews distinguish each PR from combined behavior and local modifications.
Reports separate finding status from revision- and environment-specific evidence.
Full reviews may use independent
reviewers for relevant boundaries, including another model when available and
authorized. All modes report findings without fixes or recursive review loops.
A standalone SKILL.md download is insufficient because it omits the references.

This replaces review-fix-loop and implement-review-loop. Their old versions remain
in Git history. Removing them here does not uninstall existing copies on devices;
inspect and remove those installations separately before using the replacement.

### Review design references

The personal review policy synthesizes ideas rather than invoking upstream skills:

- [Matt Pocock](https://www.aihero.dev/skills-code-review): distinguish requirements
  from repository conventions; do not inherit fixed subagents or repeated review.
- [Ponytail](https://github.com/DietrichGebert/ponytail): inspect unnecessary complexity;
  do not use lines deleted as the success metric.
- [Google review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html):
  assess design, correctness, complexity, tests, and comments with evidence.
- [Google TypeScript guide](https://google.github.io/styleguide/tsguide.html):
  minimize exported surface; adopt language rules only when they fit the project.
- [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md):
  feature cohesion and dependency boundaries, not mandatory folder proliferation.

These are design references, not runtime dependencies or automatically adopted rules.
Revisit them when a demonstrated review problem warrants a change.

## Global instructions

`instructions/AGENTS.md` and `instructions/CLAUDE.md` contain portable defaults:
Simplified Chinese conversation with English technical terms, English project artifacts,
human maintainability, proportionate verification, and Git conventions.
They are reference files, not skills installed by `npx skills`.

| Content | Location | Load when |
| --- | --- | --- |
| Portable defaults | instructions/AGENTS.md or instructions/CLAUDE.md | Every session through the local entry |
| Host facts | instructions/machines/a100-4.md | Explicitly selected on a100-4 |
| GitHub troubleshooting | instructions/workflows/github-auth.md | An auth or connectivity error occurs |
| Herdr workflow | Installed herdr-collaboration skill | The task involves Herdr |
| Project knowledge | The owning project's existing docs | The relevant subsystem is in scope |

Clone this repository to a stable local path. Back up and inspect existing
`~/.codex/AGENTS.md` and `~/.claude/CLAUDE.md`, preserving unrelated rules.
Create a small local entry file at each location. Replace the example absolute
paths below with the actual clone path on that machine.

Codex entry on a100-4:

```markdown
Read and follow these files before working:
- /absolute/path/agent-config/instructions/AGENTS.md
- /absolute/path/agent-config/instructions/machines/a100-4.md
```

Claude entry on a100-4:

```markdown
Read and follow these files before working:
- /absolute/path/agent-config/instructions/CLAUDE.md
- /absolute/path/agent-config/instructions/machines/a100-4.md
```

On a Mac or another host, omit the a100-4 reference. Add a host profile only when
there are actual local facts to record. Do not select profiles by guessing.

These entries instruct the agent to read files; they are not a Markdown import
mechanism. Start a fresh session in each agent and ask it to report the loaded
source paths and applicable scratch policy. Confirm file reads and conditional
workflow resolution before relying on the setup. This repository does not
automatically install entries or guarantee loading across agent versions.

If migrating from the previous direct symlink setup, back up the existing entry
and replace the link itself with a local entry file. Do not edit through the
symlink: that would modify the canonical source. A standalone copy of a global
payload also needs its relative workflow references, so prefer a local entry
pointing into the complete clone.

Run `git pull --ff-only` in the clone to update referenced instructions, then
start a fresh agent session. Local entries remain machine-specific and need
adjustment if the clone moves. Skills update separately with `npx skills update`.
Nothing automatically synchronizes other machines.

## Maintaining knowledge

Keep each fact with its owner. Project contracts, architecture, operational
constraints, and invariants belong in that project's existing documentation,
with task-specific pointers from its AGENTS.md. Do not require reading every doc
before a small edit. Keep temporary findings in the conversation or PR unless
they become verified, durable knowledge; update or remove stale facts with code.

The root AGENTS.md governs maintenance of this repository. The root CLAUDE.md
points to it; neither is a global payload to install on other machines.

## Website updates

Push changes here first, then update and commit the website's submodule pointer.
The website builds its registry and downloads from that pinned source.

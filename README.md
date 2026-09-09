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

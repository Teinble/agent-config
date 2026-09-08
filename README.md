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

## Global instructions

`instructions/AGENTS.md` and `instructions/CLAUDE.md` preserve the initial A100
configuration. They are reference files, not skills installed by `npx skills`.
The Codex scratch directory is specific to the A100 environment; adjust it before
using these instructions on another machine. The Herdr references require the
separately installed `herdr-collaboration` skill.

Clone this repository to a stable local path. Back up any existing global files,
then link the appropriate source to `~/.codex/AGENTS.md` or `~/.claude/CLAUDE.md`.
For example, from the clone, after moving any existing destination to a backup:

```sh
mkdir -p ~/.codex ~/.claude
ln -s "$PWD/instructions/AGENTS.md" ~/.codex/AGENTS.md
ln -s "$PWD/instructions/CLAUDE.md" ~/.claude/CLAUDE.md
```

These commands intentionally do not overwrite existing files. Run `git pull
--ff-only` in the clone to update linked instructions. Skill installations require
their own `npx skills update`. Nothing automatically synchronizes other machines.

## Website updates

Push changes here first, then update and commit the website's submodule pointer.
The website builds its registry and downloads from that pinned source.

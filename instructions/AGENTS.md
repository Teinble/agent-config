## Temp files
Use /local/numa1/scratch/xiling for disposable artifacts and clean them afterward.
Avoid using /tmp as much as you can


## Git and GitHub

- Name branches `xiling/<type>/<short-description>`, using types such as `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, or `chore`.
- Write commits as `<type>[optional scope]: <description>`, using `feat` for features, `fix` for bug fixes, and `!` or a `BREAKING CHANGE:` footer for breaking changes.
- Run `gh auth status` and `gh api user --jq .login` as separate commands before GitHub or PR operations. Do not chain them with `&&`.
- Do not interpret a failed `gh auth status` as an expired token until GitHub API connectivity is verified. Older GitHub CLI versions may report network failures as invalid credentials.
- If `gh api user` reports a connection or network error, treat it as a sandbox network restriction and retry with approved network access. Do not ask the user to reauthenticate.
- Ask the user to run `gh auth login` only when GitHub is reachable and explicitly rejects the credentials as unauthorized.
- Use `gh` for GitHub and PR operations when authenticated.
- Use the installed `gh stack` extension for stacked PRs when appropriate.
- For web UI PRs, include after-change screenshots in the PR description.
- Keep PR screenshots temporary; never commit or add them to the Git diff unless explicitly requested.

## Herdr (when used)

Before interacting with Herdr panes or handling a review request through Herdr, read `~/.codex/skills/herdr-collaboration/SKILL.md` and follow its requester or reviewer role; otherwise no Herdr workflow is required.

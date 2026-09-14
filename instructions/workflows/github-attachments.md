# GitHub attachments

Use native GitHub CLI `--attach` for screenshots and media on PRs, issues,
and comments. See the [official attachment guide](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli).

1. Check `gh --version` and the target command's help for `--attach`.
   If the installed CLI lacks it, use a current official release. A verified
   release binary in a user-owned temporary directory can avoid changing the
   system installation; verify its archive against the release checksums.
   Missing flags in an older CLI do not establish that GitHub lacks the feature.
2. Use the existing authenticated CLI account with repository push access.
   Native uploads do not require a browser login or an attachment extension.
   For authentication or connectivity failures, follow `github-auth.md` in
   this directory before recommending reauthentication.
3. Preserve the current body when editing an existing PR. Write the intended
   Markdown to a temporary file and pass it with `--body-file`. Reference each
   local image in that Markdown and pass the same path with `--attach`; GitHub
   CLI replaces the local reference with the uploaded URL and retains alt text.

   ```bash
   gh pr edit 123 --repo OWNER/REPO --body-file /path/to/body.md \
     --attach /path/to/requests.png --attach /path/to/cache.png
   ```

   For example, `body.md` can contain `![Request activity](/path/to/requests.png)`.
   Repeating `--attach` uploads multiple files. Without a body flag, attachments
   are appended to the existing body.
4. Read back the PR, issue, or comment and verify that every intended image has
   an uploaded attachment URL and that existing content is preserved. Uploads
   may partially succeed even when the command exits with an error; inspect
   the result before retrying to avoid duplicate attachments.

Keep source screenshots temporary rather than committing them to the code
repository, unless explicitly requested. Report completion only after verifying
all intended attachments in the published body.

# GitHub authentication and connectivity

Read when a GitHub operation reports an authentication or connectivity error.

Run `gh auth status` and `gh api user --jq .login` as separate commands, not
chained with `&&`. Confirm the active identity is appropriate for the operation.

A failed auth status alone does not establish an expired token. Older GitHub
CLI versions may misreport network failures as invalid credentials.

If the API call has a network error, distinguish sandbox restrictions from DNS,
proxy, host connectivity, or service failures using available evidence. Retry
with approved network access when restrictions are plausible and escalation is
available. Do not bypass permissions or recommend login for a connectivity error.

Ask the user to reauthenticate only when GitHub is reachable and explicitly
rejects the credentials as unauthorized. A permission or repository-access error
does not by itself establish invalid credentials.

# GitHub Copilot Instructions

## Accessibility (a11y) fix pull requests

When Copilot opens a pull request that addresses accessibility findings — whether
they come from the **accessibility scanner** (`github/accessibility-scanner`) or from
the **agentic accessibility workflows** (`a11y-pr-review`, `a11y-scheduled-audit`) — the
pull request **title MUST be prefixed with**:

```
fix(a11y):
```

For example:

- `fix(a11y): add accessible name to icon-only cart button`
- `fix(a11y): correct heading hierarchy on album detail view`
- `fix(a11y): meet 4.5:1 text contrast on checkout form labels`

### Why this prefix matters

The `fix(a11y):` prefix is **load-bearing**, not just a convention:

- It identifies the PR as an automated accessibility remediation.
- The **Azure Static Web Apps CI/CD** workflow
  (`.github/workflows/azure-static-web-apps.yml`) only builds, deploys, and scans pull
  requests opened from `feat/*` branches. Accessibility fix PRs branch from `fix/*`, so
  they never trigger a preview deploy or scan.
- This **prevents an infinite loop**: without it, deploying an a11y fix PR would run
  the accessibility scanner again, which could file new issues and open new fix PRs,
  which would deploy and scan again, and so on.

### Rules for Copilot

- **Always** start accessibility fix PR titles with `fix(a11y):` (lowercase, no leading
  space before the colon).
- **Always** make sure the fix branches are based on the latest `main` branch, and are named like fix/*.
- **Do not** use this prefix for non-accessibility changes — it suppresses deployment and
  scanning, so unrelated changes would silently not be built or deployed.
- Keep the rest of the title short, imperative, and descriptive of the specific fix.

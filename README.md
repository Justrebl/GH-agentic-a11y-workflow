# 🎵 Accessibility Copilot — Album Viewer

A simple web application with **intentional accessibility issues**, designed to demonstrate how **GitHub Copilot** can assess, identify, and remediate WCAG 2.2 violations through automated workflows.

The app is a Vue.js / TypeScript music store that looks perfectly functional visually but contains **21 WCAG 2.2 violations** — making it a hands-on playground for accessibility auditing and automated remediation with GitHub Copilot.

---

## Repository Structure

```
├── SamplesAndTest/
│   └── album-viewer/          # Vue.js app with intentional a11y issues
│       ├── src/               # Application source code
│       ├── index.html         # Entry point (missing lang, skip link, etc.)
│       ├── package.json       # Dependencies & scripts
│       └── vite.config.ts     # Vite configuration
├── .github/
│   ├── instructions/
│   │   └── a11y.instructions.md   # Accessibility rules for Copilot
│   └── workflows/                 # Agentic workflows for automated a11y review
├── docs/
│   └── a11y-audit-scenario.md     # Detailed before/after for all 21 violations
└── README.md
```

## Accessibility Instructions

The accessibility rules used by Copilot are defined in [`.github/instructions/a11y.instructions.md`](.github/instructions/a11y.instructions.md). These instructions are based on WCAG 2.2 AA standards and cover semantic HTML, ARIA, keyboard navigation, forms, color contrast, and framework-specific patterns.

> **Keeping custom instructions up to date:** The community-maintained source of truth is the [awesome-copilot accessibility instructions](https://github.com/github/awesome-copilot/blob/main/instructions/a11y.instructions.md). Check there for the latest updates and contribute improvements.

---

## Demo Scenario

### Goal

Use GitHub Copilot to **automatically audit** a pull request for accessibility issues, **create tracking issues**, and **trigger automated remediation** via the Coding Agent.

### Steps

1. **Create the `run-a11y-review` label** in your fork — go to **Issues → Labels → New label**, name it exactly `run-a11y-review`, and save. This is the label the workflow listens for, so it must exist before you can apply it.

2. **Create a Pull Request** from the `feat/new-concerts-near-you-feature` branch (the only branch other than `main`) into `main`

3. **Add the `run-a11y-review` label** on the PR — this triggers the agentic workflow that performs the accessibility audit

4. **Watch the Copilot session** running in the GitHub Actions tab — the agent reviews the changed files against WCAG 2.2 criteria

5. **Check the issues created automatically** once the session ends (approximately 15–20 minutes) — each accessibility violation is filed as an individual issue with severity, WCAG reference, and recommended fix

6. **Assign an issue to the Coding Agent** from the issue panel to trigger an automatic remediation — Copilot will open a PR with the proposed fix

### What Gets Detected

The app contains 21 intentional violations across 4 areas:

| Area | Examples | Count |
|------|----------|-------|
| **Page setup** | Missing `lang`, no skip link, no landmarks, low contrast | 6 |
| **Album cards** | `<div>` instead of `<button>`, no `alt` text, positive `tabindex` | 6 |
| **Album preview modal** | No focus trap, no Escape key, flash animation, non-interactive play button | 4 |
| **Cart & checkout** | No labels on inputs, unlinked errors, enforced time limit, blinking animation | 5 |

> For a detailed before/after breakdown of every violation, see [`docs/a11y-audit-scenario.md`](docs/a11y-audit-scenario.md).

---

## Fork & Setup Guide

If you fork this repo, you need to configure a **GitHub App** and a **Copilot token** for the agentic workflows to run.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- A GitHub account with access to [GitHub Copilot](https://github.com/features/copilot)
- [GitHub CLI](https://cli.github.com/) (`gh`) — required for deployment, which sets the Static Web App token as a repo secret
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/) (`azd`)

> **Authenticate before deploying.** The `azd up` provisioning hook pushes the Static Web App deployment token to GitHub via `gh secret set`, so you must be logged in to the GitHub CLI first:
>
> ```bash
> gh auth login
> gh auth status   # verify you are authenticated
> ```

### 1. Create a GitHub App

1. Go to **Settings → Developer settings → GitHub Apps → New GitHub App**
2. Fill in the basics:
   - **Name**: e.g. `a11y-copilot-bot`
   - **Homepage URL**: your repo URL
   - **Webhook**: uncheck "Active" (not needed)
3. Set **repository permissions**:

   | Permission | Access | Why |
   |-----------|--------|-----|
   | **Contents** | Read | Read source files during audit |
   | **Issues** | Read & Write | Create issues for findings |
   | **Pull requests** | Read & Write | Post review comments on PRs |
   | **Metadata** | Read | Required by default |

4. Click **Create GitHub App**
5. Note the **App ID** displayed on the app's settings page
6. Scroll to **Private keys** → **Generate a private key** — a `.pem` file downloads

### 2. Install the GitHub App

1. From the app's settings page, click **Install App** in the left sidebar
2. Select your fork's account/org
3. Choose **Only select repositories** → pick your fork
4. Click **Install**

> **Already installed the App before adding a permission?** Permission changes are **not** applied automatically. Go to **Settings → GitHub Apps → Configure** your App and accept the prompt to grant the newly requested permissions (e.g. Discussions) for the repository. Until you accept, token minting keeps failing.

### 3. Configure Repository Secrets & Variables

Go to your fork: **Settings → Secrets and variables → Actions**

#### Variables (tab: Variables)

| Name | Value |
|------|-------|
| `APP_ID` | The App ID from step 1 |

#### Secrets (tab: Secrets)

| Name | Value |
|------|-------|
| `APP_PRIVATE_KEY` | The full contents of the `.pem` file from step 1 |

These are referenced by the agentic workflows in `.github/workflows/a11y-pr-review.md` and `a11y-scheduled-audit.md`:
```yaml
github-app:
  app-id: ${{ vars.APP_ID }}
  private-key: ${{ secrets.APP_PRIVATE_KEY }}
```

### 4. Copilot as the AI Engine

The agentic workflows use **GitHub Copilot** as the default AI engine. This requires:

- **GitHub Copilot** enabled on your account/org (Business or Enterprise plan)
- The repository must have **GitHub Actions** enabled
- One of the following methods for the agent to be able to send LLM requests to GH CP : 
  - **Using User's GHCP License** : A **`COPILOT_GITHUB_TOKEN`** secret holding a Personal Access Token (PAT) with Copilot access — this is what lets any user's PAT drive the demo repo, so it is required for the workflows to run. Below are the recommended permissions for the PAT : 
      ```yaml 
      permissions:
         copilot-requests: read
      ```
   - **Recommended for orgs with centralized Copilot billing**: Instead of a PAT secret, set `permissions.copilot-requests: write` in the workflow frontmatter to use GitHub Actions token-based inference (no `COPILOT_GITHUB_TOKEN` needed). This requires your organization to have centralized Copilot billing enabled and may not be available in all organizations — see the [gh-aw billing docs](https://github.github.com/gh-aw/reference/billing/).
      Grant the `GITHUB_TOKEN` only the minimal permissions the workflow needs:
      ```yaml
      permissions:
      contents: read          # read source files during the audit
      issues: write           # create issues for findings
      pull-requests: write    # post review comments on PRs
      copilot-requests: read # token-based Copilot inference
      ```

> **Alternative AI engines**: If you want to use a different model, add the corresponding secret and update the workflow configuration:
>
> | Engine | Secret name | Docs |
> |--------|------------|------|
> | Anthropic (Claude) | `ANTHROPIC_API_KEY` | [gh-aw auth docs](https://github.github.com/gh-aw/reference/auth/) |
> | OpenAI (Codex) | `OPENAI_API_KEY` | [gh-aw auth docs](https://github.github.com/gh-aw/reference/auth/) |

#### Scanner secrets (set before deploying)

The [accessibility scanner](https://github.com/github/accessibility-scanner#2-create-a-token-and-add-a-secret) that runs on PR previews requires a **fine-grained PAT** as a repository secret — GitHub Actions' default `GITHUB_TOKEN` cannot be used. Create the token with these repository permissions:

| Permission | Access |
|-----------|--------|
| **Actions** | Read & write |
| **Contents** | Read & write |
| **Issues** | Read & write |
| **Pull requests** | Read & write |
| **Metadata** | Read |

> **Scope**: grant the token access to the target repository (where issues and PRs are created) and the repository containing the workflow. See [Creating a fine-grained PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token).

Set both secrets up front — `azd up` only sets `AZURE_STATIC_WEB_APPS`, and a pre-provision hook fails fast if these are missing:

```bash
gh secret set ACCESSIBILITY_GH_TOKEN   # used by the PR preview scan
gh secret set COPILOT_GITHUB_TOKEN     # used by the scheduled audit + Copilot fixes
```

### 5. Compile the Agentic Workflows

After forking and configuring secrets, compile the lock files:

```bash
gh extension install github/gh-aw
gh aw compile
```

The `.lock.yml` files are already committed in this repo. You only need to recompile if you modify the `.md` workflow files.

### 6. Run the App Locally

```bash
cd SamplesAndTest/album-viewer
npm install
npm run dev
```

The app starts on `http://localhost:5173` by default (Vite dev server).

### 7. Deploy the Demo App to Azure

The repo includes Bicep infrastructure (`IaC/`) and an `azure.yaml` for one-command deployment with the [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/).

> Authenticate all three CLIs first. The post-provision hook calls `az` to read the SWA deployment token and `gh` to store it as the `AZURE_STATIC_WEB_APPS` repo secret used by the PR preview deploys. The scanner PAT secrets (`ACCESSIBILITY_GH_TOKEN`, `COPILOT_GITHUB_TOKEN`) must already be set — see [Copilot as the AI Engine](#4-copilot-as-the-ai-engine).

```bash
gh auth login
az login
azd auth login
azd up
```

`azd up` provisions a **Standard** Azure Static Web App, deploys the built Vue app (`dist`), and sets the `AZURE_STATIC_WEB_APPS` GitHub secret so `feat/*` PR previews work. Pass `AZURE_ENV_NAME` and `AZURE_LOCATION` to control the environment name and region. The deployment token is never committed to source.

### Quick Checklist

- [ ] GitHub App created with Contents (read), Issues (read/write), Pull requests (read/write), Discussions (read/write)
- [ ] App installed on the fork (and new permissions accepted if added after install)
- [ ] `APP_ID` added as repository **variable**
- [ ] `APP_PRIVATE_KEY` added as repository **secret**
- [ ] GitHub Copilot enabled on the account/org
- [ ] GitHub Actions enabled on the fork

---

## References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2)
- [awesome-copilot accessibility instructions](https://github.com/github/awesome-copilot/blob/main/instructions/a11y.instructions.md)
- [GitHub Agentic Workflows docs](https://github.github.com/gh-aw/)
- [gh-aw authentication reference](https://github.github.com/gh-aw/reference/auth/)

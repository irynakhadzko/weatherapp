# BMAD Installation Guide for Claude Code Web Version

## Overview

BMAD (BMad Method) is an AI-powered software development methodology that integrates with Claude Code. This guide covers installation specifically for the **Claude Code web version** (claude.ai/code).

---

## Prerequisites

- Node.js 20+ installed on your local machine
- A project directory initialized with git
- Access to Claude Code web at [claude.ai/code](https://claude.ai/code)

---

## Step 1: Install BMAD via CLI

The initial installation must be done in your local terminal. BMAD cannot be installed directly from the web interface.

Open a terminal in your project directory and run:

```bash
npx bmad-method install
```

The installer will prompt you to choose which modules to install. For software development workflows, select **BMad Method**.

After installation completes, BMAD files will be placed under:

```
bmad/
└── web-bundles/    ← bundles for the web version
```

### Verify Installation

```bash
bmad-help
```

This displays available workflows and recommended next steps.

---

## Step 2: Use BMAD in Claude Code Web

Once installed locally, you can use BMAD in the Claude Code web interface:

1. Navigate to [claude.ai/code](https://claude.ai/code)
2. Open your project (it must be connected to the repository where BMAD was installed)
3. Locate the bundle files under `bmad/web-bundles/` in your project
4. Drop the relevant bundle file into the Claude Code web chat

### Available Agent Bundles

Use the `*agent` syntax to activate specialized agents in the web chat:

| Agent | Purpose |
|-------|---------|
| `@pm-agent` | Product Manager — requirements and planning |
| `@sm-agent` | Scrum Master — agile workflows |
| `@dev-agent` | Developer — implementation tasks |
| `@qa-agent` | QA Engineer — testing and quality |

---

## Step 3: Start a Workflow

After dropping in a bundle, follow the instructions it provides. To initialize a development workflow, use:

```
/workflow-init
```

Or ask the active agent for guidance:

```
bmad-help
```

---

## Key Differences: Web vs IDE vs CLI

| Feature | Web (claude.ai/code) | IDE Extension | CLI |
|---------|----------------------|---------------|-----|
| Activation | Drop bundle file into chat | Slash commands (`/pm`, `/dev`) | Slash commands |
| Skills location | Bundled in chat | `~/.claude/skills/bmad/` | `~/.claude/skills/bmad/` |
| Installation | Requires CLI first | Direct install | `npx bmad-method install` |

---

## Troubleshooting

**Bundle not working in web chat?**
- Ensure BMAD was installed with Node.js 20+
- Re-run `npx bmad-method install` and re-download the bundle
- Check that the bundle file under `bmad/web-bundles/` is not empty

**Project not visible in Claude Code web?**
- Make sure your repository is connected to Claude Code via the web interface settings
- The project must be a git repository

---

## Resources

- [BMAD Method GitHub](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD Documentation](https://docs.bmad-method.org/)
- [Claude Code Web](https://claude.ai/code)

# CLAUDE.md

Guidance for AI assistants (Claude Code and similar) working in this repository.

## Project

**The Integrated Woman Diagnostic Tool** — a live, AI-powered life-strategy
diagnostic for African women, organized around three pillars:

- **Purpose**
- **Profession**
- **Faith**

(Source: `README.md`.)

## Current state

This repository is in pre-implementation stage. As of the latest commit
(`b894a07` "Initial commit") the tree contains only:

```
README.md   # 2-line project description
CLAUDE.md   # this file
```

There is **no application code, build tooling, package manifest, tests,
CI configuration, or framework choice committed yet**. Do not assume a
stack (Next.js, FastAPI, Streamlit, etc.) — none has been selected in the
repo. If a task requires picking one, ask the user first rather than
scaffolding silently.

When new code lands, update the sections below (Architecture, Commands,
Conventions) to reflect reality. Keep this file honest: prefer deleting
a stale section over leaving aspirational documentation in place.

## Working in this repo

### Branching

- Default branch: `main`.
- Web/agent sessions develop on a dedicated branch (e.g.
  `claude/<topic>-<id>`) and open a **draft PR** against `main` when
  pushing. Never push directly to `main`.
- Create the working branch locally if it does not exist; never push to
  an unrelated branch without explicit permission.

### Commits

- Use clear, descriptive commit messages focused on the *why*.
- Prefer creating new commits over amending published ones.
- Do not stage with `git add -A` / `git add .` once real source exists —
  add files by name to avoid sweeping in secrets or build artifacts.
- Do not bypass hooks (`--no-verify`) or signing flags unless the user
  explicitly asks.

### Pushing & PRs

- Always push with `git push -u origin <branch-name>`.
- After pushing, open a **draft PR** if one does not already exist for
  the branch. The repo is scoped to
  `papadanico/the-integrated-woman-diagnostic-tool` — do not target
  other repos.
- Use the `mcp__github__*` tools for all GitHub interactions in web
  sessions; the `gh` CLI is not available.

## Architecture

*Not yet established.* Replace this section with a real architecture
overview (entry points, modules, data flow, external services) once
code is committed. Until then, keep it short and accurate rather than
speculative.

## Commands

*None defined.* No `package.json`, `pyproject.toml`, `Makefile`, or
equivalent exists. When tooling is introduced, document the canonical
commands here, for example:

```
# install
<pkg-manager> install

# dev server
<pkg-manager> run dev

# tests
<pkg-manager> test

# lint / typecheck
<pkg-manager> run lint
<pkg-manager> run typecheck
```

## Conventions for AI assistants

- **Don't fabricate structure.** If asked to "add a feature" before a
  stack is chosen, surface the gap and ask which framework/language to
  use rather than picking one unilaterally.
- **Edit over create.** Once files exist, prefer editing them to adding
  parallel ones. Do not create README/docs files unless asked.
- **No emojis in code or commits** unless the user requests them.
- **No drive-by refactors.** Make the requested change; resist adding
  abstractions, comments, or "future-proofing" beyond the task.
- **Comments are off by default.** Add one only when the *why* is
  non-obvious (hidden constraint, subtle invariant, workaround).
- **Treat content sensitivity carefully.** This tool targets a specific
  audience (African women) and covers faith and life strategy. When
  generating user-facing copy, diagnostic questions, or model prompts,
  default to respectful, non-stereotyping language and flag culturally
  sensitive choices to the user instead of guessing.
- **Secrets.** Never commit `.env`, API keys, or credential files. If a
  task seems to require one, ask the user how secrets should be
  injected (env var, secret manager, etc.).

## Updating this file

When the project gains real structure, replace the *Current state*,
*Architecture*, and *Commands* sections with concrete content. Keep
*Working in this repo* and *Conventions for AI assistants* unless the
user changes the workflow.

# AGENTS.md

This file defines agentic workflow conventions for turbo-tan. Agents should follow these rules for safe, effective operation.

## Safe Commands
- `bun run build:affected`, `bun run test:affected`, `bun run lint` are safe to run autonomously
- Never run database migrations automatically — always show the SQL and ask for confirmation
- Never install dependencies without explicit user approval
- Never commit .env files or secrets

## Branch and Commit Conventions
- Branch off `main` as `{type}/{description}` (e.g., `feat/add-login`, `fix/bug-123`)
- Commit messages must follow Conventional Commits
- Always run commitlint before pushing

## Handling Secrets and Env
- Copy `.env-example` to `.env.local` for local setup
- Never commit `.env`, `.env.local`, or any secrets

## Ambiguous Requests
- If a request is unclear, ask for clarification before proceeding
- If a request contradicts architectural constraints, flag and ask

## Known Gotchas
- Turbo selectors must reference a package, directory, or pattern (never `...`)
- Biome lint rule `useLiteralKeys` is disabled everywhere
- If an auth module is added, treat as a global singleton — do not instantiate twice in tests

## Agent Behavior
- Always follow architectural, code style, and folder structure constraints
- Prefer minimal, self-explanatory code
- Never run destructive or irreversible actions without confirmation
- Document all changes and decisions

---

# copilot-instructions.md

This file is automatically injected into every Copilot chat session in this repo. It defines the core context, constraints, and conventions for turbo-tan.

## Tech Stack
- Bun (1.3+)
- Turborepo (2.7+)
- Lefthook (git hooks)
- Biome (lint/format)
- Vitest (test)
- React (functional, no class components)
- TypeScript (strict)
- CSS Modules (UI)
- GitHub Actions (CI/CD)

## Build, Test, Lint
- Use `bun run build:affected` for builds
- Use `bun run test:affected` for tests
- Use `bun run lint` for linting
- Never use npm or yarn commands

## Architectural Constraints
- Never import directly from `lib/` — use barrel exports in `index.ts`
- Feature code lives in `apps/web/src/routes/{feature}`
- Shared utilities in `packages/ui/src/lib/`
- Database code in `packages/db/src/`
- UI components in `packages/ui/src/components/`

## Code Style
- Functional React only (no class components)
- Strict TypeScript
- Prefer self-explanatory code, minimal comments
- Use CSS Modules for styling

## Folder Structure
- Feature code: `apps/web/src/routes/{feature}`
- Shared utilities: `packages/ui/src/lib/`
- UI components: `packages/ui/src/components/`
- Database: `packages/db/src/`

## Agent Constraints
- Never install a new dependency without asking first
- Never commit .env files
- Never run destructive scripts without confirmation
- Always follow architectural and code style constraints

## Known Gotchas
- Turbo tasks must use valid selectors (never `...`)
- Biome lint rule `useLiteralKeys` is disabled everywhere
- Auth module is not present; if added, treat as singleton

---

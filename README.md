# Turbo TypeScript Starter

A modern, production-ready TypeScript monorepo starter built with best practices and performance in mind.

## Overview

This is a full-stack monorepo template designed for building scalable web applications. It combines a server-side rendering (SSR) architecture with a shared component library, all managed through Turbo for efficient builds and task orchestration.

## Development Guidelines

This project uses GitHub Copilot instruction files in `.github/instructions/` to provide context-aware coding suggestions. The guidelines are automatically applied when working on TypeScript, React, CSS, and JSON files.

Key guidelines:

- [TanStack Start + Base UI + CSS Modules Development Guide](.github/instructions/tanstack-start-baseui-cssmodules.instructions.md)

## Architecture

### Directory Structure

```
turbo-typescript-starter/
├── apps/                          # Applications
│   └── web/                       # Next-gen web application
│       ├── src/
│       │   ├── routes/            # File-based routing
│       │   ├── styles/            # App-specific global styles
│       │   └── index.tsx          # Entry point
│       └── vite.config.ts
│
├── packages/                      # Shared libraries
│   ├── ui/                        # Reusable component library
│   │   ├── src/
│   │   │   ├── components/        # Shared React components
│   │   │   ├── lib/               # Utilities (cn, etc)
│   │   │   └── styles/            # Design system tokens
│   │   └── package.json
│   │
│   └── config-typescript/         # Shared TypeScript config
│
└── Root config files
```

### Packages vs Apps

**Apps** (`apps/`)

- Actual user-facing applications
- Contain routes, pages, and business logic
- Import components and utilities from packages
- Can be deployed independently
- Currently includes: `web`

**Packages** (`packages/`)

- Reusable libraries shared across apps
- Used by multiple apps in the monorepo
- Published internally via workspace protocol
- Currently includes:
  - `ui` - Component library with design system
  - `config-typescript` - Shared TypeScript configurations

## Technologies & Services

### Core Runtime

- **Bun 1.3.6** - All-in-one JavaScript runtime (replaces npm/yarn, faster than Node)
- **Node 24.13.0** - JavaScript runtime
- **TypeScript 5.9.3** - Type-safe JavaScript

### Monorepo Management

- **Turbo 2.7.5** - Orchestrates builds, tests, and dev servers across packages
  - Intelligent task caching for faster builds
  - Parallel execution of independent tasks
  - Dependency graph awareness

### Web Framework

- **React 19.2.3** - UI framework
- **TanStack React Router 1.150.0** - File-based routing with SSR support
- **TanStack React Start 1.150.0** - Full-stack meta-framework for server rendering
- **Vite 7.3.1** - Lightning-fast build tool and dev server
  - Instant HMR (Hot Module Replacement)
  - Optimized production builds

### Styling

- **CSS Modules** - Scoped, zero-runtime CSS
  - Component-level CSS isolation
  - Type-safe class names
  - No runtime overhead

### UI Components & Accessibility

- **Base UI 1.1.0** - Headless, unstyled component library
  - Provides accessible primitives (Button, etc)
  - Full control over styling
- **Class Variance Authority (CVA) 0.7.1** - Variant management for components
  - Organize component states and sizes
  - Type-safe prop variants

### Testing & Quality

- **Vitest 4.0.17** - Unit testing framework (Vite-native)
  - Test coverage with V8
  - UI dashboard for test results
- **Biome 2.3.11** - Fast linter, formatter, and bundler
  - Unified tooling (replaces ESLint + Prettier)
  - Near-instantaneous lint/format operations
- **Commitlint 20.3.1** - Enforces conventional commit format
  - Ensures consistent commit messages
  - Blocks non-compliant commits
- **cspell 9.6.0** - Spell checker for code
- **Syncpack 14.0** - Keeps dependency versions consistent across monorepo

### Development Experience

- **Lefthook 2.0.15** - Git hooks framework
  - Pre-commit: type checking, linting, formatting
  - Commit-msg: spell check and commit message validation
  - Prevents bad code from entering the repository
- **EditorConfig** - Consistent editor settings across team

## Getting Started

### Prerequisites

- Bun 1.3.6 or later
- Node 24.13.0 (optional, Bun includes JavaScript runtime)

### Installation

```bash
# Install dependencies
bun install

# Set up git hooks
bun run prepare

# Start development server
bun run dev

# Run type checking
bun run check-types

# Lint and format code
bun run lint

# Run tests
bun run test

# Build for production
bun run build
```

### Available Scripts (Root)

- `bun run dev` - Start all dev servers
- `bun run build` - Build all packages and apps
- `bun run check-types` - Type check everything
- `bun run lint` - Lint all files (with auto-fix on pre-commit)
- `bun run test` - Run all tests
- `bun run coverage` - Generate test coverage report

## Styling & CSS Modules

### CSS Modules

CSS Modules provide:

- Natural scoping without naming conflicts
- Zero runtime overhead
- Easier to maintain and refactor
- Works seamlessly with design tokens

### Design System

Design tokens are centralized in `packages/ui/src/styles/variables/`:

```
variables/
├── base.css          # Viewport settings, base font size (10px = 1rem)
├── spacing.css       # Fluid spacing scale (300px - 1200px)
├── type.css          # Typography with fluid scaling
├── transition.css    # Animation timing
└── index.css         # Entry point
```

Apps import the design system:

```css
@import "@repo/ui/styles/variables/index.css";
```

### Creating Components

Components live in `packages/ui/src/components/`:

```
components/
├── Button/
│   ├── Button.tsx         # Component
│   ├── Button.module.css  # Scoped styles
│   └── index.ts           # Barrel export
└── Hero/
    ├── Hero.tsx
    ├── Hero.module.css
    └── index.ts
```

Using CSS Modules + CVA:

```tsx
// Button.tsx
import { cva } from "class-variance-authority";
import styles from "./Button.module.css";

const buttonVariants = cva(styles.base, {
	variants: {
		variant: {
			default: styles.variantDefault,
			outline: styles.variantOutline,
		},
	},
});

export function Button({ variant = "default", ...props }) {
	return <button className={buttonVariants({ variant })} {...props} />;
}
```

```css
/* Button.module.css */
.base {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.375rem;
	transition: all 150ms ease-in-out;
}

.variantDefault {
	background-color: #18181b;
	color: #fafafa;
}

.variantOutline {
	border: 1px solid #e4e4e7;
	background-color: white;
}
```

## File-Based Routing

Routes are automatically discovered from `apps/web/src/routes/`:

```
routes/
├── __root.tsx       # Root layout
├── index.tsx        # /
├── about/
│   └── index.tsx    # /about
└── contact/
    └── index.tsx    # /contact
```

The router tree is automatically generated in `routeTree.gen.ts`. Do not edit this file manually.

### Route Example

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
	head: () => ({
		title: "About Us",
	}),
});

function About() {
	return <div>About content</div>;
}
```

## Monorepo Workflow

### Adding Dependencies

Install in the specific workspace:

```bash
# Add to app
bun add -W apps/web some-package

# Add to shared package
bun add -W packages/ui some-package

# Add dev dependency
bun add -D -W packages/ui some-dev-package
```

### Importing from Packages

Apps import from packages using the workspace alias:

```tsx
// From packages/ui
import { Button } from "@repo/ui/components/Button";
import { Hero } from "@repo/ui/components/Hero";
import { cn } from "@repo/ui/lib/utils";

// From packages/config-typescript
import type { CustomType } from "@repo/config-typescript";
```

Exports are configured in `packages/ui/package.json`:

```json
{
	"exports": {
		"./components/*": "./src/components/*/index.ts",
		"./lib/*": "./src/lib/*.ts",
		"./styles/*": "./src/styles/*"
	}
}
```

### Turbo Tasks

Turbo orchestrates task execution. Common tasks:

- `build` - Builds packages in dependency order
- `check-types` - Type checks all packages
- `dev` - Runs development servers (persistent, no caching)

Tasks are defined in `turbo.json` and run across all workspaces.

## Development Tips

### 1. REM Unit Scaling

The design system sets `html { font-size: 62.5%; }`, making 1rem = 10px:

```css
/* Easy mental math */
1rem = 10px
1.6rem = 16px
2.4rem = 24px
3.2rem = 32px
```

### 2. Fluid Spacing

Spacing variables automatically scale between 300px and 1200px viewports:

```css
.container {
	padding: var(--space-lg); /* Scales fluidly */
}
```

### 3. Type Safety with CSS Modules

CSS Modules are TypeScript-safe:

```tsx
import styles from "./Button.module.css";

// TypeScript knows these exist
<div className={styles.base} />

// TypeScript error: Property 'notExists' does not exist
<div className={styles.notExists} />
```

### 4. Git Hooks

Before committing, hooks automatically:

- Check types
- Lint and format code
- Check spelling
- Validate commit message format

If checks fail, commit is blocked. Fix issues and try again.

### 5. Hot Module Replacement (HMR)

Changes to components, styles, and routes update instantly without losing state:

```bash
bun run dev
# Edit a component and save - instant refresh
```

### 6. Component Co-location

Keep components with their styles:

```
components/
  MyComponent/
    MyComponent.tsx         # Logic
    MyComponent.module.css  # Styles
    index.ts               # Export
```

This makes components portable and easy to move between packages.

## Performance Considerations

### Build Performance

- **Turbo caching** - Tasks don't re-run if inputs haven't changed
- **Vite** - Extremely fast rebuilds and dev server
- **Biome** - Near-instantaneous linting
- **Bun** - 30-40% faster than npm/yarn

### Runtime Performance

- **CSS Modules** - Zero runtime CSS-in-JS overhead
- **Server-Side Rendering** - Initial page is rendered on server
- **Code splitting** - TanStack Router automatically splits code per route
- **Tree-shaking** - Unused code removed from production builds

## Troubleshooting

### Hero component not found

If you see `Cannot find module "@repo/ui/components/Hero"`:

1. Check the exports in `packages/ui/package.json`
2. Ensure `packages/ui/src/components/Hero/index.ts` exists
3. Make sure the component is properly exported

### CSS not loading

If CSS isn't applying:

1. Ensure you have the type definition file:
   ```
   packages/ui/src/css-modules.d.ts
   ```
2. Import the CSS Module in your component:
   ```tsx
   import styles from "./Component.module.css";
   ```
3. Use the scoped class names:
   ```tsx
   <div className={styles.container} />
   ```

### Pre-commit hooks failing

If `bun run prepare` didn't work:

```bash
# Reinstall hooks
lefthook install

# Or manually:
bun run prepare
```

## Project Statistics

- **Monorepo**: Turbo + Bun
- **Apps**: 1 (web with SSR)
- **Packages**: 2 (ui, config-typescript)
- **Components**: 2 example components (Button, Hero)
- **Styling**: CSS Modules (no Tailwind)
- **Type safety**: End-to-end TypeScript

## Next Steps

1. **Add a new route**: Create `apps/web/src/routes/newpage.tsx`
2. **Create a component**: Add to `packages/ui/src/components/MyComponent/`
3. **Add a package**: Create folder in `packages/` with its own `package.json`
4. **Scale horizontally**: Add new apps to `apps/` (e.g., admin, mobile web)

## License

MIT

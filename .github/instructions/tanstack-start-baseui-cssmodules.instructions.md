---
description: "Guidelines for building TanStack Start applications with Base UI and CSS Modules in a Turborepo monorepo"
applyTo: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css, **/*.json"
---

# TanStack Start + Base UI + CSS Modules Development Guide

You are an expert TypeScript developer specializing in TanStack Start applications with modern React patterns, Base UI components, and CSS Modules styling.

## Tech Stack

- TypeScript (strict mode)
- React 19+
- TanStack Start (routing & SSR)
- TanStack Router (routing core)
- Base UI (headless, accessible components)
- CSS Modules (scoped styles)
- class-variance-authority (variant management)
- Zod (validation in @repo/validation)
- Drizzle ORM (database in @repo/db)
- Vitest (testing)
- Turborepo (monorepo management)

## Monorepo Structure

```
apps/
  web/                    # TanStack Start application
packages/
  ui/                     # Shared Base UI components with CSS Modules
  validation/             # Shared Zod schemas
  db/                     # Drizzle ORM database client
  config-typescript/      # Shared TypeScript configs
  config-biome/           # Shared Biome configs
```

## Code Style Rules

- Never use `any`.
- Prefer function components over class components.
- Validate external data with Zod schemas from `@repo/validation`.
- Include error and pending boundaries for all routes.
- Use semantic HTML before ARIA.
- Use CSS Modules for all styling (avoid inline styles unless dynamic).
- Import shared components from `@repo/ui/components/*`.

## Git Workflow

- **Always use feature branches** for development work.
- Branch naming convention: `feature/description`, `fix/description`, `chore/description`, `docs/description`.
- Never commit directly to `main` or `develop` branches.
- Create pull requests for code review before merging to main.
- Ensure all CI checks pass and tests are green before merging.
- Squash commits when merging feature branches for a clean commit history.
- Never merge anything without permission from a code reviewer.
- Use descriptive commit messages that explain the "why" behind changes.

## Component Patterns

### Base UI Component Pattern

Use Base UI primitives with CSS Modules and class-variance-authority:

```ts
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.ts";
import styles from "./Button.module.css";

const buttonVariants = cva(styles["base"], {
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: styles["sizeDefault"],
      sm: styles["sizeSm"],
      lg: styles["sizeLg"],
    },
    variant: {
      default: styles["variantDefault"],
      outline: styles["variantOutline"],
      ghost: styles["variantGhost"],
    },
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  size,
  variant,
  type = "button",
}: ButtonProps) {
  return (
    <ButtonPrimitive
      type={type}
      onClick={onClick}
      className={cn(buttonVariants({ size, variant }))}
    >
      {children}
    </ButtonPrimitive>
  );
}
```

### CSS Modules Pattern

```css
/* Button.module.css */
.base {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-md);
	font-weight: 500;
	transition: var(--transition-base);
}

.sizeDefault {
	height: var(--size-10);
	padding: 0 var(--spacing-4);
	font-size: var(--font-size-sm);
}

.variantDefault {
	background-color: var(--color-primary);
	color: var(--color-primary-foreground);
}

.variantDefault:hover {
	background-color: var(--color-primary-hover);
}
```

### Class Composition with `cn()`

Use the `cn()` utility (implemented in `packages/ui/src/lib/utils.ts`) to merge CSS Module class names:

```ts
// packages/ui/src/lib/utils.ts
export function cn(...classes: (string | undefined | null | false)[]) {
	return classes.filter(Boolean).join(" ");
}

// Usage in components
import { cn } from "../../lib/utils.ts";

const className = cn(
	buttonVariants({ size, variant }),
	props.className, // Allow component consumers to add additional styles
);
```

## TanStack Router Patterns

### File-based Routing

```ts
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@repo/ui/components/Hero";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Hero />;
}
```

### Root Route with Meta Tags

```ts
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Your App Title" },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

### Route Loaders with Validation

```ts
import { createFileRoute } from "@tanstack/react-router";
import { userListSchema } from "@repo/validation";

export const Route = createFileRoute("/users")({
  loader: async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    const users = userListSchema.parse(data);
    return { users };
  },
  component: UserList,
});

function UserList() {
  const { users } = Route.useLoaderData();
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Error and Pending Boundaries

```ts
export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const data = await fetchDashboardData();
    return { data };
  },
  component: Dashboard,
  errorComponent: ({ error }) => (
    <div>Error loading dashboard: {error.message}</div>
  ),
  pendingComponent: () => <div>Loading dashboard...</div>,
});
```

## Validation with Zod

Validation schemas are centralized in `@repo/validation` to keep them consistent across the application. Always check what's exported from that package before creating new schemas to avoid duplication.

### Define Schemas in @repo/validation

```ts
import { z } from "zod";

export const userInputSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("A valid email is required"),
	age: z.number().int().min(0).optional(),
});

export type UserInput = z.infer<typeof userInputSchema>;

export const userSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
```

### Use Schemas in Components

```ts
import { userInputSchema, type UserInput } from "@repo/validation";

function UserForm() {
  const handleSubmit = (data: unknown) => {
    const result = userInputSchema.safeParse(data);

    if (!result.success) {
      console.error("Validation failed:", result.error.format());
      return;
    }

    submitUser(result.data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Database with Drizzle ORM

```ts
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

async function getUser(id: string) {
	const user = await db.select().from(users).where(eq(users.id, id));
	return user[0];
}
```

### Server Actions

Server actions are marked with `"use server"` directive and can be called from client components:

```ts
// app/actions.ts
"use server";

import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { userInputSchema } from "@repo/validation";

export async function createUser(input: unknown) {
	const validated = userInputSchema.parse(input);

	const [newUser] = await db.insert(users).values(validated).returning();
	return newUser;
}
```

Then call from client components:

```ts
import { createUser } from "./actions";

export function UserForm() {
  const handleSubmit = async (data: FormData) => {
    const result = await createUser(Object.fromEntries(data));
    console.log("User created:", result);
  };

  return <form action={handleSubmit}>...</form>;
}
```

## Shared UI Components

```ts
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.ts";
import styles from "./Card.module.css";

const cardVariants = cva(styles["base"], {
  defaultVariants: { variant: "default" },
  variants: {
    variant: {
      default: styles["variantDefault"],
      bordered: styles["variantBordered"],
      elevated: styles["variantElevated"],
    },
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, variant, className }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)}>{children}</div>;
}
```

## Icons with Lucide React

```ts
import { Download, Heart, Trash2 } from "lucide-react";

<Button>
  <Download />
  Download File
</Button>

<Button variant="destructive">
  <Trash2 />
  Delete
</Button>
```

## CSS Variables and Design Tokens

```css
.container {
	padding: var(--spacing-4);
	margin: var(--spacing-8);
	border-radius: var(--radius-md);
	transition: var(--transition-base);
	font-size: var(--font-size-base);
}
```

## Testing with Vitest

```ts
import { describe, it, expect } from "vitest";
import { userInputSchema } from "@repo/validation";

describe("userInputSchema", () => {
	it("validates correct user input", () => {
		const input = { name: "John Doe", email: "john@example.com" };
		const result = userInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it("rejects invalid email", () => {
		const input = { name: "John Doe", email: "invalid-email" };
		const result = userInputSchema.safeParse(input);
		expect(result.success).toBe(false);
	});
});
```

## Best Practices

### Type Safety

- Use strict TypeScript settings.
- Use `unknown` + validation instead of `any`.
- Infer types with `z.infer<typeof schema>`.

### Styling

- Prefer CSS Modules for scoped styles.
- Use design tokens from `packages/ui/src/styles/variables`.
- Use `cva` and `cn()` for variants and class composition.

### Components

- Build on Base UI primitives for accessibility.
- Export components from each `index.ts`.
- Co-locate styles with components.
- Ensure all interactive components are keyboard accessible (tab, enter, space, arrow keys as appropriate).
- Use proper ARIA attributes where needed (e.g., `aria-label`, `aria-expanded`, `aria-describedby`).
- Test with keyboard navigation and screen readers, especially when extending Base UI components.

### Accessibility

- Base UI provides accessible primitives; use them as-is rather than replacing with unstyled divs.
- All form inputs must have associated labels (use `<label htmlFor="id">`).
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.) before adding ARIA.
- Ensure color is never the only indicator (e.g., use icons + text for status indicators).
- Maintain sufficient contrast ratios (4.5:1 for normal text, 3:1 for large text).

### Routing

- Use file-based routing in `apps/web/src/routes/`.
- Include error and pending boundaries.
- Validate loader data.

### Validation

- Keep schemas in `@repo/validation`.
- Use `safeParse` for user input.
- Use `parse` for trusted/internal data.

### Database

- Import `db` from `@repo/db`.
- Validate inputs before queries.

### Environment Configuration

- Store environment-specific variables (database URLs, API keys, secrets) in `.env` files or environment variables.
- Never commit secrets to version control.
- Reference environment variables using `process.env.VARIABLE_NAME`.
- Document required environment variables in a `.env.example` file.

## Anti-Patterns to Avoid

- Tailwind classes (this project uses CSS Modules).
- shadcn/ui components (this project uses Base UI).
- Static inline styles.
- `any` types.
- Unvalidated external data.
- Missing route error/pending boundaries.
- Hardcoded colors or spacing instead of tokens.

## Additional Resources

- TanStack Start: https://tanstack.com/start/latest/docs
- TanStack Router: https://tanstack.com/router/latest/docs
- Base UI: https://base-ui.com/react/overview/quick-start
- CSS Modules: https://github.com/css-modules/css-modules
- class-variance-authority: https://cva.style/docs
- Zod: https://zod.dev
- Drizzle ORM: https://orm.drizzle.team/docs/overview
- Vitest: https://vitest.dev/guide
- Turborepo: https://turborepo.dev/docs
- Lucide React: https://lucide.dev/guide/packages/lucide-react

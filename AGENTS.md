# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **Turborepo monorepo** for a SaaS feedback management platform. It contains:
- `apps/api` — NestJS REST API (backend)
- `apps/web` — Next.js web app (frontend)
- `packages/schema` — Shared Zod validation schemas (`@feedback/schema`)
- `packages/ui` — Shared React component library (`@feedback/ui`, Radix UI + Tailwind)
- `packages/email-templates` — React Email templates
- `packages/eslint-config` and `packages/typescript-config` — Shared tooling configs

## Commands

All commands use **pnpm** (v10+) and **Turborepo**.

### Root (run from repo root)
```bash
pnpm install        # Install all dependencies
pnpm dev            # Start all apps in dev mode
pnpm build          # Build all apps and packages
pnpm test           # Run all tests
pnpm lint           # Lint all packages
```

### API (`apps/api`)
```bash
pnpm dev            # NestJS dev server with watch
pnpm test           # Jest unit tests
pnpm test:e2e       # End-to-end tests
pnpm test:cov       # Test coverage report

# Run a single test file
pnpm test -- path/to/file.spec.ts

# Prisma
pnpm prisma:generate   # Regenerate Prisma client after schema changes
pnpm prisma:migrate    # Run pending migrations
pnpm prisma:studio     # Open Prisma Studio UI
```

### Web (`apps/web`)
```bash
pnpm dev            # Next.js dev server (Turbopack)
pnpm build          # Production build
pnpm typecheck      # TypeScript type checking
```

### Makefile shortcuts (from repo root)
```bash
make resource name=ResourceName   # Scaffold a NestJS CRUD resource
make prisma-generate
make prisma-migrate
```

## Task Workflow

### Branching and GitHub Issues
- Start every new task from a new Git branch.
- Every branch must map to a GitHub issue before implementation begins. If no issue exists, ask the user to create one or confirm that Claude should create one.
- Name branches with the issue number and short task slug, for example `feat/123-feedback-filters`, `fix/124-auth-redirect`, or `chore/125-prisma-cleanup`.
- Keep the branch focused on the linked issue. If the work expands into a separate concern, create or request a separate issue and branch.

### Planning Significant Changes
- Before a restructure, architecture change, or multi-file feature, switch to plan mode and present a short plan for approval before writing code.
- Include an architecture artifact with the plan. Prefer diagrams over long markdown write-ups: flow diagrams, file layout diagrams, naming tables, data-shape maps, or user-role mappings.
- Include proper user mappings for user-facing features: affected roles, permissions, entry points, primary flows, empty/loading/error states, and any API or data ownership boundaries.
- Implement only after the plan is approved.
- Follow the approved build order and commit in small, single-purpose Conventional Commits.

### Scope Discipline
- Keep changes limited to the linked issue.
- Do not refactor unrelated code unless it is required for the task.
- If a better unrelated improvement is discovered, note it separately instead of including it silently.

### Definition of Done
- Code is implemented according to the approved scope.
- Relevant tests, type checks, lint, or builds have been run.
- Any skipped verification is clearly reported with the reason.
- User-facing changes include empty, loading, error, and success states where applicable.
- API changes include schema updates, validation, and frontend service updates when needed.

### Naming
- Use simple, explicit names that communicate purpose.
- Avoid ambiguous names like `data`, `item`, `temp`, `handleChange`, or `process` unless the scope makes the meaning obvious.
- Prefer domain-specific names, for example `workspaceMember`, `feedbackStatus`, `createProjectInput`, or `sendVerificationEmail`.
- Function names should describe the action and outcome.

### API and Schema Changes
- Shared request/response validation belongs in `packages/schema` when used by both API and web.
- Keep API DTOs, Zod schemas, frontend services, and React Query hooks aligned.
- Do not duplicate validation rules separately in API and web unless there is a clear reason.

### Frontend UX Baseline
- New user-facing flows must handle loading, empty, error, and success states.
- Forms must show validation feedback from shared schemas where possible.
- Avoid placeholder-only UI unless the issue explicitly asks for scaffolding.

### Testing Expectations
- Add or update tests for changed business logic, validation, permissions, and API behavior.
- For UI changes, verify affected flows manually or with existing test patterns.
- Run the narrowest relevant checks first, then broader checks when the change touches shared packages or contracts.

## Architecture

### API (`apps/api`)

NestJS modular architecture under `src/modules/`:
- **auth** — JWT authentication, email-based login/registration with verification codes
- **user** — User profile management
- **workspace** — Team/organization management with member roles
- **projects** — Project CRUD (containers for feedback)
- **feedbacks** — Core feedback/issue collection
- **labels** — Tags for feedback items
- **email** — Email notification delivery
- **token** — Auth/verification token management

Key infrastructure:
- **Prisma** (`src/prisma/`) — Single `PrismaService` used across modules; schema is split into model files under `prisma/models/`
- **EventEmitter** — Async events for email notifications (e.g., `user-registered`, `login-code` events trigger email jobs)
- **BullMQ** — Redis-backed job queue for email delivery
- **Redis** — Also used for caching via Keyv
- **Global setup** (`main.ts`) — API prefix `/api`, versioning `v1`, Zod validation pipe, global response interceptor, HTTP exception filter, Swagger at `/docs`

### Web (`apps/web`)

Next.js App Router structure:
- `app/auth/` — Authentication pages
- `app/dashboard/` — Main app dashboard
- `components/` — Page-specific React components
- `contexts/` — React context providers
- `hooks/` — Custom hooks
- `services/` — API service layer (calls to the NestJS API)
- `lib/` — Utilities

State management: **TanStack React Query** for server state; **React Hook Form** + Zod for forms.

### Shared Packages

**`@feedback/schema`** — Zod schemas imported by both API and web for validation. Organized by domain: `auth/`, `projects/`, `workspace/`, `token/`.

**`@feedback/ui`** — Component library built on Radix UI + Tailwind CSS 4. Exports components, hooks, utilities, and `globals.css`. The web app must transpile this package (configured in `next.config.mjs`).

## Key Conventions

- **Commit messages** must follow Conventional Commits (enforced by commitlint): `feat:`, `fix:`, `refactor:`, etc.
- **Commits must not include AI attribution**: do not add `Co-authored-by`, `Generated with`, or similar Claude/AI author trailers.
- **Pre-commit hooks** (Husky + lint-staged) run ESLint on staged files.
- **Validation** uses Zod throughout — schemas live in `packages/schema` and are shared; NestJS uses a Zod validation pipe.
- **Auth flow**: Email + verification code (no password). JWT issued after successful verification.
- **API versioning**: All endpoints are under `/api/v1/`.
- **Prisma schema** is split across multiple `.prisma` files in `prisma/models/` and merged into `schema.prisma`.

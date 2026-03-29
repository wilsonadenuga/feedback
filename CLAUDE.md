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
- **Pre-commit hooks** (Husky + lint-staged) run ESLint on staged files.
- **Validation** uses Zod throughout — schemas live in `packages/schema` and are shared; NestJS uses a Zod validation pipe.
- **Auth flow**: Email + verification code (no password). JWT issued after successful verification.
- **API versioning**: All endpoints are under `/api/v1/`.
- **Prisma schema** is split across multiple `.prisma` files in `prisma/models/` and merged into `schema.prisma`.

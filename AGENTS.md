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

### Sprints, Linear Issues & Branching
- Work runs in short **sprints (Linear Cycles)**. Scope each feature to fit roughly **three days**; if it won't fit, split it into multiple features.
- **Plan each feature together first**, then document it: agree on scope and approach, write the plan to `docs/sprints/<slug>.md` (versioned with the code and reviewed in the PR), and only then break it into **Linear issues/tasks** that reference that spec.
- Every branch must map to a **Linear issue** before implementation begins. If no issue exists, ask the user to create one or confirm that Claude should create one.
- Start every new branch off `develop`, not off `main`. The one exception is a chained task branch (below), which starts off the previous task's branch.
- Name branches with the **Linear issue ID** and a short slug, keeping a Conventional-Commit type prefix, for example `feat/fee-12-feedback-filters`, `fix/fee-13-auth-redirect`, or `chore/fee-14-prisma-cleanup`. The issue ID must appear in the branch name so Linear auto-links the PR and advances the issue's status. (Replace `fee` with the actual Linear team key.)
- Use **one branch and PR per task**, not per feature — smaller PRs are easier to review. A task that builds on the one before it starts off that branch rather than `develop`, so the tasks form a chain.
- **Every PR still targets `develop`.** Because the branches are chained they have to merge in order, and until a parent lands its child's diff also shows the parent's commits. That collapses on its own as each one merges.
- **Put the merge order at the top of every chained PR description** — for example "Merge order: 2 of 3 — merge after PR 1", followed by the full list. Without it there is no way to tell from the PR which goes first.
- Keep the branch focused on the linked issue. If the work expands into a separate concern, create or request a separate Linear issue and branch.

### Issue Status Flow
- Statuses advance automatically via the GitHub integration. Don't drag cards by hand unless something goes wrong.

| Trigger | Status |
|---|---|
| PR opened | In Progress |
| Review requested, or review activity | In Review |
| PR merged | Done |

- This only works because the Linear issue ID is in the branch name — another reason the naming rule above matters.
- `In Review` is in the **Started** category, sitting between In Progress and Done.
- Board columns are hidden when empty, and the setting is **per view**. If a status looks missing, turn on `Show empty columns` in that view's display options.

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

### Validate Before Handing Over
- After implementing a task, validate it before handing it back. Do not present unreviewed work as finished.
- Have the reviewer (see Agent Roles) review the change the way a PR reviewer would: correctness, scope creep, missed edge cases, and anything that contradicts this file. Give it the diff, the linked issue, and the implementer's report so it can check the work against what was actually asked for.
- Exercise the change for real where it can be run — call the endpoint, run the flow, trigger the error path — rather than relying only on it compiling. Say which paths were exercised and which were not.
- Report what the review found, including findings that were dismissed and why. Fix what is real before handing over.
- This is in addition to tests, type checks, lint, and builds, not a replacement for them.

### Agent Roles
- Every task passes through three roles. The **planner** writes the sprint spec and the Linear issue. The **implementer** builds one task from them. The **reviewer** checks the diff against them. The planner may also review. The reviewer is never the implementer: a context that did not write the code is the point.
- Default seats. When a model changes, update this table and the agent definitions in `.claude/agents/`, not the rules.

| Role | Default |
|---|---|
| Planner | The session the user is talking to (Fable) |
| Implementer | The `implementer` agent in `.claude/agents/` (Opus) |
| Reviewer | The planner, the `reviewer` agent in `.claude/agents/`, or any other tool the user names |

- The user can reassign seats per task: another tool implements and this session reviews, or a second reviewer of their choice runs after the first. Any tool can take a seat because the handoff is only the spec, the Linear issue, and the branch. The Linear issue is the spec when the task has no sprint doc. The dispatch passes the spec by path or content rather than assuming the other seat can find it.
- The implementer cannot ask the user anything mid-task, so the spec must be decision-complete before handoff: acceptance criteria, the decisions already made and why, and the checks to run. When a question comes up that the spec does not answer, the implementer stops and returns it instead of guessing.
- The implementer builds only its task. It does not edit the spec, the issue, or this file, and it does not commit: it leaves the changes in the working tree and reports what it built, grouped by build step when the spec has one, which checks it ran, what it exercised for real, and any open questions. The planner makes the commits once the user has approved the messages.
- The reviewer reads the diff, the spec or issue, and the implementer's report. It re-runs the checks rather than trusting the report, exercises the change where it can be run, and says so where it cannot. It reports findings and fixes nothing.
- The review loop is bounded. A round is one fix pass by the implementer plus one re-review, and there are at most two. What is still open after that goes to the user with the findings. The planner takes the task over only if the user says so.
- Seats run in parallel only when they share nothing. Reviewers always can: two reviewers on the same diff at once is the normal way to get a second opinion. Planning research can: several read-only agents exploring the codebase at once. Implementers can only when their tasks are independent, each in its own git worktree on its own branch. Two implementers never share a working tree, and one task is never split between implementers.
- Parallel implementers still share the local database, Redis, and the API port from `apps/api/.env`. Until each worktree can point at its own database, only one implementer at a time runs the e2e tests or exercises the running API.
- The planner implements directly when the task is subtle: auth, migrations, concurrency, anything that can lose data.
- The user approves the commit message, the push, and the PR. Nothing is committed on their behalf before that.

### Comments
- Do not add a comment unless it is necessary. Default to no comment.
- Never restate what the code already says. If a comment would only paraphrase the line under it, delete it.
- Do not label sections of a list, object, or function with comments. If grouping matters, express it in the code.
- Write a comment only for something the code cannot say on its own: a non-obvious "why", a workaround with a link to the issue it works around, or a constraint that would look like a mistake otherwise.
- Prefer a clearer name or a small function over a comment that explains confusing code.

### Naming
- Use simple, explicit names that communicate purpose.
- Avoid ambiguous names like `data`, `item`, `temp`, `handleChange`, or `process` unless the scope makes the meaning obvious.
- Prefer domain-specific names, for example `workspaceMember`, `feedbackStatus`, `createProjectInput`, or `sendVerificationEmail`.
- Function names should describe the action and outcome.
- Name things the way a normal developer would — plain, familiar words that are instantly clear. Don't reach for a fancy synonym when a common word works (`use`, not `utilize` or `leverage`).
- Avoid "AI-tell" vocabulary that reads as machine-generated, in identifiers and comments alike: `enhanced`, `advanced`, `robust`, `comprehensive`, `seamless`, `smart`, `intelligent`, `powerful`, `optimized`, `sophisticated`, `streamlined`. Prefer the plain equivalent or just drop the adjective.
- Don't decorate names with generic suffixes (`Manager`, `Handler`, `Helper`, `Wrapper`, `Processor`, `Util`) unless that is genuinely what the thing is — name it by what it does.

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
- Run tests only against a local database. Never run tests against a production database.

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

# Sprint 01 — Workspace as Board (remove the Project layer) — Backend only

**Sprint:** 01
**Duration:** ~3 days (one Linear Cycle)
**Status:** Planned
**Branch base:** `develop`
**PRD refs:** §4 (Domain model), §6.1 (MVP — Accounts & workspaces), §12 Q5
**Linear team key:** `FEE` _(placeholder — replace with the real key)_

---

## Goal

Collapse the `workspace → project → feedback` nesting into `workspace → feedback`
so that **the workspace *is* the feedback board**, matching the PRD. Re-parent
`Feedback`, `Label`, and `ApiKey` from `Project` to `Workspace`, remove the
Project layer across the **backend**, and repair the feedback module along the
way. **The frontend is intentionally out of scope this sprint** (see below).

## Why this is Sprint 1

- **Foundational.** Every MVP feature (board, votes, roadmap) is project-scoped
  today. Building on the current shape and migrating later means rework. Migrate
  first, build on the final shape.
- **Already committed in the PRD** — §4: *"There is no separate 'project' layer —
  a workspace is the single top-level container."*
- **Low conceptual risk.** Every workspace already auto-creates exactly one
  `"Default Project"`, and authorization already walks `project → workspace →
  members` (i.e. it's workspace-membership authz wearing a project costume).
- **Forces a needed repair.** The feedback module has a stale `category`/`label`
  naming mismatch and a wrong Prisma client import — it likely doesn't typecheck.
  This migration is the natural moment to fix it.

## Current-state facts (from the codebase)

- `Feedback.project_id`, `Label.project_id`, `ApiKey.project_id` are **required
  FKs to Project**, not Workspace (`apps/api/prisma/models/`).
- `WorkspaceService.create` auto-creates a `"Default Project"` + default labels
  (`apps/api/src/modules/workspace/services/workspace.service.ts:32-44`).
- `ProjectGuard` + `validateUserAccess` authorize via `project → workspace →
  members` — already membership-based.
- Feedback module builds `category`/`category_id` relations and imports Prisma
  from `generated/client/client`, but the schema uses `labels`/`FeedbackLabel` —
  a half-renamed concept that needs fixing.

## Scope

**In (backend)**
- Prisma: re-parent Feedback/Label/ApiKey → Workspace; remove `Project`; data migration.
- API: remove `projects` module; re-scope `feedbacks` + `labels` to workspace;
  drop the auto-"Default Project"; repair the feedback module.
- Shared schema: remove `projects` domain; `project_id → workspace_id` in
  `feedbacks`/`labels`; drop `project_count`.

**Out (later sprints)**
- **All frontend / `apps/web` work** — route flattening, removing project UI, and
  re-pointing queries move to a dedicated **frontend sprint (Sprint 1.5 / 2)**.
- Auth hardening (`/auth/me`, refresh endpoint, Google redirect, role-enum fix).
- New feedback features (votes, comments, roadmap).
- API-key management UI (Phase 2) — this sprint only re-parents the model.

> **⚠️ Known consequence of backend-only:** `@feedback/schema` is shared by API
> and web. Changing its contracts here will break `apps/web`'s typecheck/build
> until the frontend sprint. That is accepted: this sprint verifies **api +
> schema only**, and `apps/web` is knowingly left red until Sprint 1.5/2.

---

## Tasks (→ Linear)

Ordered by build order. IDs shown as `FEE-x` placeholders.

### Data model
- [ ] **T1 — Re-parent Prisma models to Workspace.**
  In `apps/api/prisma/models/`, change `Feedback`, `Label`, `ApiKey` FKs from
  `project_id` → `workspace_id`; rewrite unique constraints/indexes
  (`@@unique([project_id, slug])` → `[workspace_id, slug]`, etc.); update
  `Workspace` relations; remove the `Project` model. Regenerate the client.
- [ ] **T2 — Data migration (backfill + drop Project).**
  Write a migration that backfills `workspace_id` on feedback/label/apikey from
  each row's `project → workspace`, folds the auto-`"Default Project"` into its
  workspace, then drops the `Project` table. Run on a **local DB only**; it is
  irreversible.

### API
- [ ] **T3 — Re-scope `feedbacks` to workspace + repair the module.**
  Rewrite service/repo/DTOs/controller to scope by `workspace_id`; fix the
  `category`/`label` mismatch (use `labels`/`FeedbackLabel`) and the Prisma
  client import path so the module typechecks.
- [ ] **T4 — Re-scope `labels` to workspace.**
  Service/repo/DTOs/controller keyed by `workspace_id`; default-label seeding
  moves to workspace creation (see T6).
- [ ] **T5 — Re-scope `ApiKey` to workspace (model/data only).**
  No new UI or endpoints — just make the model/relations workspace-scoped so it's
  consistent. _Deferrable if the sprint runs tight (API intake is Phase 2)._
- [ ] **T6 — Remove `projects` module; seed defaults on Workspace.**
  Delete `modules/projects` (controller/service/repo/guard/DTOs); replace any
  `ProjectGuard` usage with `WorkspaceGuard`; drop the auto-"Default Project" in
  `workspace.service.ts` and seed default labels directly on the workspace.

### Shared schema (`@feedback/schema`)
- [ ] **T7 — Update contracts.**
  Remove `packages/schema/src/projects/*`; change `feedbacks/*` and `labels/*`
  from `project_id` → `workspace_id`; drop `project_count` from `workspace.schema`.
  _(Breaks `apps/web` build until the frontend sprint — accepted.)_

### Verification
- [ ] **T8 — Backend tests + typecheck + build.**
  Update affected API tests (local DB only); `pnpm typecheck` + `pnpm build` for
  **`apps/api` and `packages/schema`**; manually verify (via API / Swagger)
  create-workspace → board-ready (default labels, no project step) and
  feedback/label CRUD scoped by workspace. `apps/web` build is expected to fail
  and is out of scope.

## Build order

`T1 (Prisma)` → `T7 (shared contracts)` → `T3 / T4 / T5 / T6 (API)` →
`T2 (run data migration)` → `T8 (verify backend)`.
(T2 is *authored* with T1 but *run* after the API code compiles.)

## Definition of done

- No `Project` model, module, or routes remain in the backend; a grep for
  `project_id` in `apps/api` and `packages/schema` returns nothing in active code.
- Creating a workspace yields a board-ready workspace with default labels and
  **no project step**.
- Feedback + label CRUD work scoped by workspace; the feedback module typechecks.
- `pnpm typecheck` + `pnpm build` pass for **`apps/api` and `packages/schema`**;
  affected backend tests updated and green **against a local DB only**.
- `apps/web` is knowingly out of scope and may not build until the frontend sprint.

## Risks

- **Data migration is irreversible** (drops Project). Back up / run locally first.
- **Hidden `project_id` references** — grep across api + schema before calling it done.
- **Web build breakage is intentional but must be tracked** — create the frontend
  follow-up sprint/issue now so it isn't forgotten.
- **3 days is ambitious.** If tight, defer **T5** (ApiKey) — API intake is Phase 2.

## Open questions

- **Password auth (Sprint 2):** still need the driver before deciding. Keep
  passwordless unless a self-host-without-email bootstrap justifies it.
- **Linear team key:** replace `FEE-` throughout once confirmed.

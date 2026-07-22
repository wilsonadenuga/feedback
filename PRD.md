# Product Requirements Document — Feedback

**Status:** Draft
**Last updated:** 2026-07-14
**Owner:** Product
**Reference products:** [UserJot](https://userjot.com) — north star (feedback boards + roadmap + changelog for SaaS; simple, AI-native, single-workspace) — and [Featurebase](https://featurebase.app) — studied for UX breadth and its knowledge-base/help-center (the parallel to Phase 3.5 AI Answers, §6.4).
**Distribution:** **Open source & self-hostable** — monetized open-core (see §1.3)

---

## 1. Overview

**Feedback** is an **open-source, self-hostable platform** that gives product
teams one place to collect customer feedback, prioritize it in the open, and
close the loop by shipping and announcing changes. It is modeled on the "build
your product out loud" category (UserJot, Canny, Featurebase): a public
**feedback board**, a **public roadmap** that stays in sync with the team's work,
and a **changelog** that reaches the users who asked for each feature. Unlike the
closed-source incumbents, teams can run the whole stack themselves — including
fully local AI inference — with no data leaving their infrastructure.

### 1.1 Problem

Product teams lose feedback between the support inbox, email, social, and sales
calls. What survives lands in a spreadsheet or an issue tracker that customers
never see. The result: duplicated requests, no visibility into what is planned,
no credit back to the people who asked, and churn from users who feel unheard.

### 1.2 Solution

A single hub that **collects** feedback (branded portal, in-app widget, guest
and API intake), **organizes** it automatically (deduplicated, tagged,
classified, searchable), **prioritizes** it transparently (votes + a configurable
scoring formula), and **closes the loop** (a public roadmap and a changelog that
emails the exact users who voted, pulling them back into the product).

Its differentiator over the closed-source incumbents is being **open source with
first-class self-hosting** plus a layered set of **AI capabilities** that run
locally when required.

### 1.3 Licensing & distribution

Feedback is **open source**. Self-hosting is a supported, first-class deployment
target — not an afterthought — which raises the bar on two things throughout this
PRD: (a) **no hard dependency on any third-party service** (LLMs, email) for core
functionality, and (b) **data sovereignty** — a self-hoster can run without any
data leaving their infrastructure, including AI via local inference
(Ollama + BGE-M3, see §8).

Likely monetization is **open-core**: the platform is free and self-hostable,
with a managed **cloud offering** (hosting, backups, updates) and a set of
**premium/team features** (e.g. SSO, custom domains, advanced integrations,
higher AI budgets) on paid tiers. The exact license and open-core boundary are
open questions (§12).

> **How to read this PRD.** Requirements are organized by **release phase**
> (MVP → Phase 2 → …). Each phase describes the product capabilities and AI
> features that make up that release. This document specifies *what the product
> should do* — the features to build. Detailed feature planning and sprint
> execution (in Jira) happen separately and are out of scope here.

---

## 2. Goals & Non-goals

### 2.1 Goals

- **G1 — One hub, closed loop.** Collect, prioritize, ship, and announce feedback
  in one system, with each shipped item traceable back to the users who asked.
- **G2 — Public transparency.** Public feedback boards, a self-updating public
  roadmap, and a public changelog browsable without an account.
- **G3 — Low-friction intake.** Guest submissions, an embeddable widget, a
  branded standalone portal, and programmatic/API intake.
- **G4 — AI that reduces triage load.** Duplicates collapse on the way in, items
  are tagged and classified automatically, and themes surface without manual reading.
- **G5 — Engagement that reduces churn.** Automated lifecycle emails
  (acknowledgment, progress, launch) and a weekly digest that bring users back.
- **G6 — Trust and control for AI.** Human-in-the-loop by default (never
  auto-merge, never autonomous), per-workspace controls, cost transparency, and
  PII redaction before any third-party LLM call.
- **G7 — Open source & self-hostable.** Runnable with no required third-party
  dependencies for core functionality and a fully-local AI path; monetized via
  managed cloud + premium features (§1.3).

### 2.2 Non-goals (initially)

- **N1** — Full project-management / sprint tooling. We integrate with GitHub /
  Linear / Jira rather than replace them.
- **N2** — A general analytics / BI suite. VoC digests and priority scoring are
  feedback-specific.
- **N3** — Per-seat pricing. Managed cloud and premium features follow a
  workspace-based, unlimited-end-user model.
- **N4** — A closed or crippled self-hosted build. Self-hosting must be genuinely
  usable; monetization comes from hosting + clearly-scoped premium features, not
  from withholding core functionality.
- **N5** — Autonomous AI actions. The triage agent is opt-in and always routes
  through a reviewable approval queue.

---

## 3. Personas & roles

| Persona | Role | Primary jobs |
|---|---|---|
| **Founder / Product lead** (buyer) | Workspace **owner** | Stand up a board fast, decide priorities, ship, announce, prove they listen |
| **Product manager / triager** | **admin** / **member** | Triage the queue, merge duplicates, tag, move items along the roadmap, draft changelog posts |
| **Team contributor** (eng/design/support) | **member** | Respond to feedback, link items to issues, comment |
| **Stakeholder** (exec, investor, CS lead) | **viewer** | Read-only visibility into demand and direction |
| **Customer / end user** | External user | Submit ideas, upvote, comment, follow status, receive updates |
| **Guest** | Unauthenticated visitor | Browse public board/roadmap/changelog, submit without an account (moderated) |

Role permission model (defined in `@feedback/schema`):

- **owner** — full control incl. billing, member management, delete workspace, transfer ownership.
- **admin** — manage members, feedback, roadmap, changelog, and workspace settings; cannot delete workspace or transfer ownership.
- **member** — create/manage feedback and roadmap items, respond to customers; cannot manage members or workspace settings.
- **viewer** — read-only.

---

## 4. Domain model & terminology

Core entities:

- **User** — auth identity. `status`: `UNVERIFIED | ACTIVE | SUSPENDED | BANNED`.
- **Workspace** — the tenant, team, **and feedback board** in one. Owned by a
  User; contains Members, Feedback, Labels, the roadmap, and the changelog. Its
  public face is the board/portal. There is **no separate "project" layer** — a
  workspace is the single top-level container.
- **WorkspaceMember** — user↔workspace with a `role` (one per workspace/user).
- **WorkspaceInvite** — email invite. `status`: `PENDING | ACCEPTED | REVOKED | EXPIRED`.
- **Feedback** — a request/idea/report in a workspace; carries optional
  `customer_*` fields and **image attachments** (screenshots/uploads).
- **Attachment** — an image (screenshot or upload) on a feedback item, stored via
  the pluggable file-storage backend.
- **Vote** / **Comment** — end-user engagement on feedback and roadmap items.
- **Label** (+ `FeedbackLabel`) — tags on feedback.
- **RoadmapItem** — a feedback item promoted onto the public roadmap; lifecycle
  **Pending → Review → Planned → In Progress → Completed**.
- **ChangelogEntry** — a published update linked to the feedback it resolves.
- **KnowledgeSource** — customer-supplied docs the AI Answers agent retrieves
  from: a crawled docs URL, uploaded files (Markdown/PDF/HTML), or in-app articles.
- **Article** — a single knowledge unit within a KnowledgeSource; chunked and
  embedded for retrieval.
- **AnswerLog** — a logged end-user question, the agent's cited answer, and
  whether it was answered, escalated, or converted into Feedback.
- **Digest** — a scheduled AI-generated summary (weekly/monthly) of what people
  asked for; archived on the in-app Insights page and delivered via email/Slack/Teams.
- **Integration** — a connected issue tracker (GitHub / Linear / Jira).
- **ApiKey** — per-workspace key for programmatic intake.
- AI support: **Embedding** (pgvector), **AiJob**, **AiUsage** (telemetry/cost).

> Terminology note: an item's **roadmap lifecycle** — **Pending → Review →
> Planned → In Progress → Completed** — is the canonical status shown on the
> public roadmap; changing it is what keeps the roadmap in sync (§6.1).

---

## 5. Release plan at a glance

| Phase | Theme | Product features | AI capabilities |
|---|---|---|---|
| **MVP** | The core loop | Auth, workspace & roles, feedback board, votes & comments, self-updating public roadmap, loop emails, **manual duplicate merge** | — *(no AI; moved to Phase 2)* |
| **Phase 2** | Reach & organization | Embeddable widget, branded portal, changelog, weekly digest, API intake | **AI Foundation** + **Semantic duplicate detection** + **Auto-tagging & classification** |
| **Phase 3** | Findability | Semantic search UI, scheduled/smart changelog publishing | **Semantic search** (hybrid BM25 + vector) |
| **Phase 3.5** | Self-serve answers | Doc import (URL crawl + file upload), "Ask" tab in the widget | **AI Answers** — RAG over customer docs + app content, cited; misses → feedback |
| **Phase 4** | Insight | In-app **Insights** page, weekly & monthly schedule, Slack / Teams delivery | **Voice-of-customer digests** — AI summary of what people asked for |
| **Phase 5** | Prioritization | Transparent, configurable scoring UI | **Smarter priority scoring** |
| **Phase 6** | Integrations | GitHub / Linear / Jira sync, bidirectional status | **AI issue-linking** |
| **Phase 7** | Automation | MCP server | **AI triage agent** (opt-in, approval queue) |

Cross-cutting concerns (PII redaction, multilingual, eval harness, cost
transparency) and non-functional requirements apply from the MVP onward — see §8
and §9.

---

## 6. Requirements by phase

Within each phase, **[must]** = required to consider the release done,
**[should]** = strongly desired, **[could]** = include if time allows.

### 6.1 MVP — the core loop

*Goal: a team can collect feedback, prioritize it in the open, ship, and close
the loop — end to end — with AI catching duplicates on the way in.*

**Accounts & workspaces**

- **[must]** Passwordless email auth (register → code → verify → JWT + refresh)
  and Google OAuth sign-in.
- **[must]** Authenticated team-member sessions with a current-user lookup.
- **[must]** Distinct **end-user (customer) accounts** so external users can
  vote/comment/follow.
- **[must]** Workspace CRUD; creating a workspace provisions the owner member and
  default labels, and its feedback board is ready immediately (no separate project
  step).
- **[must]** Member management + email invites (accept via public token link).
- **[must]** **Role-based authorization** enforced on every workspace action
  (owner/admin/member/viewer).

**Feedback board**

- **[must]** Feedback CRUD with pagination, filtering (status, label, search),
  and status changes.
- **[must]** **Public or private board** — the workspace's feedback board is
  visible to everyone, or kept private between author and team.
- **[must]** **Upvotes and comments** on feedback; vote counts visible on board
  and roadmap.
- **[must]** **Accounts to participate** — posting, voting, and commenting all
  require a signed-in user (passwordless email — minimal friction). No anonymous/guest
  participation, so every action is attributable and dedup-able.
- **[should]** **Image attachments** on feedback — upload, drag-and-drop, or paste
  from clipboard (screenshots matter for bug reports); type/size validation and
  abuse controls on guest uploads.
- **[should]** Labels management UI (create, edit, delete, assign to feedback).

**Roadmap**

- **[must]** **Self-updating public roadmap** — changing a feedback item's status
  updates the public roadmap immediately (single source of truth).
- **[must]** Lifecycle **Pending → Review → Planned → In Progress → Completed**.
- **[must]** Roadmap items show votes and **link back to originating feedback**
  (credit to requesters).
- **[could]** Guardrails (warn on too many in-progress) and stale-item flags.

**Engagement (the loop)**

- **[must]** Lifecycle emails at four moments — **submission acknowledgment,
  progress update, launch** — plus **vote/comment alerts**. Email delivery must
  support both a hosted provider and SMTP (SMTP required for self-hosters).

**AI — moved to Phase 2** *(2026-07-18)*

- The **AI Foundation** and **Semantic duplicate detection** were deprioritised out
  of the MVP so the core loop can ship without standing up pgvector, the embedding
  pipeline, and provider BYOK. Full scope now lives in §6.2.
- The MVP keeps only **manual duplicate merge** — an admin merges duplicates by hand
  (consolidating votes/comments), no AI, no auto-merge.

### 6.2 Phase 2 — reach & organization

*Goal: meet users where they already are, and keep the board organized without
manual effort.*

**Product**

- **[must]** **Embeddable widget** — a single script tag that opens an in-app
  panel presenting a **configurable set of tabs** the user picks from: **feedback
  capture** (submit, upvote, comment), **roadmap**, and **changelog**. Tabs are
  **toggleable per workspace**, and the tab system is built to accept new tabs so
  the **AI Answers "Ask" tab** slots in as config in Phase 3.5 (§6.4), not a
  re-architecture.
- **[should]** **In-widget screenshot capture** — snap the current page (or
  upload/paste an image) when filing feedback from the widget, so bug reports
  arrive with visual context. (Weigh a DOM snapshot vs. the browser Screen Capture
  API and its permission prompt.)
- **[must]** **Standalone branded portal** — public page at a workspace subdomain
  / custom domain, with optional identity masking.
- **[must]** **Widget ↔ portal division of labor.** The widget handles
  **in-context quick actions** — upvote, comment, submit, and glance at roadmap
  status / the "new update" badge — with **no forced navigation** out of the host
  app. The **portal is the canonical, shareable, SEO-friendly home** for deep
  browsing; the widget deep-links to it ("view full board / open in portal")
  rather than cramming everything into the overlay.
- **[must]** **Stable public URLs** — every feedback item, roadmap item, and
  changelog entry has a canonical portal URL, used by widget deep-links, loop
  emails, and digests.
- **[must]** **Changelog** — entries linked to the feedback/roadmap items they
  resolve; **emails to voters/commenters** when their item ships; **in-app
  "new update" indicator** in the widget.
- **[should]** **Weekly digest** of top new ideas (a lightweight roundup; the
  richer AI thematic summary is Phase 4, §6.5).
- **[should]** **Programmatic intake via API keys** — per-workspace keys with
  generation/rotation and an authenticated submission endpoint.

**AI — Foundation** *(moved from MVP)*

- **[must]** pgvector on Postgres; async embedding pipeline (off the request path).
  The embedding model is **pinned at the instance level** (uniform dimension for
  pgvector); only the **generative** provider is per-workspace BYOK.
- **[must]** LLM **provider abstraction** — direct **OpenAI / Anthropic / Google** +
  **OpenRouter** behind one interface (Bedrock / Ollama later), with **per-workspace BYOK**.
- **[must]** **AI budget caps** (soft + hard) per workspace; telemetry on every call
  (tokens, cost, latency, model); **feature flags per workspace**.

**AI — Semantic duplicate detection** *(moved from MVP)*

- **[must]** On submission, suggest similar existing feedback; surface merge
  candidates in the admin triage queue.
- **[must]** Embed the draft, cosine top-k, **tunable threshold per workspace**,
  **human-in-the-loop only — never auto-merge**.

**AI — Auto-tagging & classification**

- **[must]** Auto-tag feedback; classify **type** (bug / feature / question /
  complaint / praise); tag **sentiment**.
- **[must]** Runs as an **LLM batch job off the submission path** against a
  workspace-defined or auto-discovered taxonomy.

### 6.3 Phase 3 — findability

*Goal: find anything across all feedback in natural language.*

**Product**

- **[should]** **Scheduled publishing** and **smart prompts** to nudge publishing
  a changelog when enough shipped work has accumulated.

**AI — Semantic search**

- **[must]** Natural-language search and filtering across all feedback via
  **hybrid BM25 + vector retrieval with reciprocal rank fusion**.

### 6.4 Phase 3.5 — AI Answers (self-serve knowledge base)

*Goal: deflect repetitive questions — let customers ask in natural language and
get answered from the team's own docs and product content, reusing the Phase 3
retrieval stack.*

**Product — knowledge intake (bring your own docs)**

- **[must]** Add a knowledge source by **crawling a docs URL** and/or **uploading
  files** (Markdown / PDF / HTML). Import-first — no re-authoring required.
- **[should]** **In-app article editor** as a secondary source for teams with no
  docs, or for quick FAQ entries.
- **[must]** **Freshness** — scheduled re-crawl / re-sync of imported sources;
  surface last-synced state so answers don't silently go stale.

**Product — Ask experience**

- **[must]** An **"Ask" tab in the embeddable widget** (and on the public portal)
  where an end user asks a question and gets an answer.
- **[should]** Public vs. authenticated availability configurable per workspace
  (a public Ask tab raises the bar on answer quality).

**AI — Answers (RAG)**

- **[must]** Retrieve over the workspace's **docs + changelog + roadmap + resolved
  feedback** (reusing Phase 0/3 embeddings) and generate a grounded answer.
- **[must]** **Cite sources** on every answer; answer **only** from retrieved
  content — no open-ended world knowledge.
- **[must]** **Confidence gate** — below threshold, don't guess: offer to
  **escalate to a human and/or turn the question into a feedback submission**.
- **[should]** **Log questions and answers** (answered vs. escalated) so doc gaps
  surface as feedback and content to write.
- **[must]** Consistent with the product principle — **assistive, never
  autonomous**: answers from provided material, hands off when unsure.

### 6.5 Phase 4 — insight

*Goal: surface what people asked for — themes and trends — without reading every
item.*

**Product — the summary place**

- **[must]** An in-app **Insights** page where scheduled digests are generated and
  **archived**, so past weekly/monthly summaries are browsable, not just emailed.
- **[must]** **Weekly and monthly** cadence, configurable per workspace.

**AI — Voice-of-customer digests**

- **[must]** AI-generated summary of **what people asked for** in the period — top
  themes, emerging trends, sentiment shifts, and highest-impact items.
- **[must]** **Cluster embeddings, label clusters with an LLM**; deliver via the
  in-app Insights page **and** email + Slack / Teams webhook.

### 6.6 Phase 5 — prioritization

*Goal: prioritize by more than raw upvotes, transparently.*

**AI — Smarter priority scoring**

- **[must]** Weighted, **configurable-per-workspace** formula (upvotes, recency,
  sentiment, customer segment, admin priority).
- **[must]** **The formula is shown to users, not hidden** — transparency is a
  product principle.

### 6.7 Phase 6 — integrations

*Goal: keep the roadmap and the team's issue tracker in sync.*

- **[must]** GitHub / Linear / Jira sync via OAuth + webhooks, with
  **bidirectional status sync**.
- **[must]** **AI issue-linking** — on ticket closure, suggest which feedback
  items it may have resolved (embedding-based), human-confirmed.

### 6.8 Phase 7 — automation

*Goal: an opt-in co-pilot that does the busywork, always reviewable.*

- **[must]** **AI triage agent** — auto-tags, routes, links to existing issues,
  and drafts responses/changelogs. Built on Phases 0–6, **fully reviewable
  approval queue, never autonomous**.
- **[should]** **MCP server** so agents (Claude, Cursor, etc.) can triage
  feedback and draft changelogs — human-approved before any write.

---

## 7. Cross-cutting AI concerns (apply from the MVP onward)

| Concern | Why it matters | How we handle it |
|---|---|---|
| **PII redaction** | Privacy-constrained/self-hosted workspaces can't send raw customer text to third-party LLMs | Redaction pass **before** embedding or LLM calls; configurable per workspace |
| **Multilingual** | Feedback isn't always in English | Embedding model choice: `text-embedding-3` for cloud, `BGE-M3` for local |
| **Eval harness** | You can't tune what you can't measure | Hand-label 200–500 pairs for duplicate detection; qualitative review elsewhere until volume justifies more |
| **Cost transparency** | Workspaces will ask "why did this cost X?" | Show per-feature and per-workspace cost in the admin UI |

---

## 8. Non-functional requirements

- **NFR-1 Security & privacy.** JWT on all admin endpoints; enforced role-based
  authorization; encrypt API keys at rest; never send unredacted PII to
  third-party LLMs; public views honor identity masking.
- **NFR-2 Multi-tenancy isolation.** Every query scoped by workspace; AI budgets,
  keys, and feature flags are per-workspace.
- **NFR-3 Performance.** Submission and public-board reads stay fast; **all
  embedding/LLM work is asynchronous** (BullMQ), never on the submission path;
  public pages cacheable.
- **NFR-4 Reliability & cost control.** Hard + soft AI budget caps; graceful
  degradation when a provider is unavailable or a cap is hit (the feature still
  works without the AI assist).
- **NFR-5 Self-hosting friendliness.** No required third-party dependency for
  core functionality: SMTP as an email option, and a **fully local AI path**
  (Ollama + BGE-M3) so privacy-constrained deployments need no external LLM.
- **NFR-6 Observability.** Telemetry on every AI call; audit trail for
  AI-assisted actions (what was suggested, who approved).
- **NFR-7 Validation contracts.** Shared Zod schemas in `@feedback/schema` remain
  the single source of truth for enums/validation across API and web.
- **NFR-8 UX baseline.** Every user-facing flow handles loading, empty, error,
  and success states; forms show validation from shared schemas.
- **NFR-9 Pluggable file storage.** Image attachments, AI-Answers doc uploads, and
  workspace logos use a storage abstraction — local filesystem for self-host,
  S3-compatible (MinIO / R2 / S3) for cloud — with type/size limits and no hard
  dependency on a proprietary service.

---

## 9. Milestones & timeline

Cumulative estimate at ~8–10 hours/week (from the AI plan); product foundations
are interleaved into the same windows.

| Milestone | Phases included | Cumulative weeks |
|---|---|---|
| **v1 (MVP)** | MVP (AI Foundation + duplicate detection + core loop) | ~6 |
| **v1.5** | + Phase 2 (auto-tagging; widget, portal, changelog) | ~9 |
| **v2** | + Phase 3 (semantic search) | ~14 |
| **v2.x** | + Phase 3.5 (AI Answers / knowledge base) | ~17 |
| **v2.5** | + Phase 4 (VoC digests + Insights page) | ~22 |
| **v3** | + Phase 5 (priority scoring) | ~26 |
| **v3.5** | + Phase 6 (issue-tracker integration + AI linking) | ~33 |
| **v3+** | Phase 7 (AI triage agent + MCP) | open-ended |

> The AI-plan estimates cover the AI work through Phase 6; Phase 3.5 (AI Answers)
> and the Insights page are additions beyond that plan (≈ +3 weeks). MVP product
> foundations (public boards, votes/comments, roadmap, loop emails, role
> enforcement, end-user accounts) add to the v1 window; sequence them alongside
> the AI Foundation during planning.

---

## 10. Success metrics

Product (reference benchmarks in parentheses):

- **M1 Activation** — time from signup to first published board (target: minutes).
- **M2 Intake volume** — submissions per active board; public boards see more (≈ +40% reference).
- **M3 Engagement / return** — return-visit rate once the loop is running (≈ 4× reference).
- **M4 Retention** — churn reduction for workspaces running the full loop (≈ 10%+ reference).
- **M5 Loop completeness** — % of shipped items announced via changelog with voter emails sent.
- **M6 Adoption** — self-hosted installs and GitHub stars/contributors (open-source health).

AI:

- **M7 Duplicate-detection quality** — precision/recall against the hand-labeled eval set.
- **M8 Triage-time reduction** — admin time per item before vs. after dedup + auto-tag.
- **M9 AI cost per workspace** — within configured budgets; visible in admin UI.
- **M10 Suggestion acceptance rate** — % of AI suggestions (tags, merges, links, drafts) approved by a human.
- **M11 Answer deflection rate** — % of Ask questions answered confidently without escalation; and % of unanswered questions converted into feedback (doc-gap signal).
- **M12 Digest engagement** — open/click-through on weekly/monthly digests and visits to the in-app Insights page.

---

## 11. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI cost runaway | Unbounded LLM spend | Hard + soft caps, telemetry, async batching, BYOK |
| PII leakage to LLMs | Trust + compliance | Redaction before any external call; local-inference path |
| Over-automation erodes trust | Bad merges/routing | Human-in-the-loop by default; approval queue; never auto-merge/autonomous |
| Third-party lock-in hurts self-hosters | Blocks core goal | Provider abstraction + SMTP + local AI; no hard external dependency for core |
| Open-core boundary unclear | Community friction / weak monetization | Decide the boundary early (§12); keep core genuinely usable |
| Public/guest abuse & spam | Board noise, moderation load | Moderation controls, guest rate limits, identity masking |
| Multilingual/eval gaps | Poor AI quality on non-English / untuned models | Multilingual embeddings + eval harness from the MVP |

---

## 12. Open questions

- **Q1 — License & open-core boundary.** Which OSS license? Which features are
  core (free/self-host) vs. premium (managed cloud / paid)?
- **Q2 — End-user identity.** Full accounts for customers, or lightweight
  vote/comment identities linked by email?
- **Q3 — Default providers.** Default LLM/embedding providers for cloud vs.
  self-host, and default per-workspace budget caps.
- **Q4 — Pricing/packaging** of the managed cloud tiers (Free / Starter /
  Professional analog), and which AI features gate behind paid tiers. Note: with
  **workspace == board**, the reference's per-board pricing lever no longer
  applies — consider members, AI budget, integrations, or custom domain as levers.
- **Q5 — Multiple boards per team (future).** A workspace is a single feedback
  board (MVP decision, to cut nesting). If a team later needs several boards that
  share members/billing, do we add a lightweight *board* sub-entity under the
  workspace, or expect separate workspaces? This is the escape hatch — keeping the
  workspace as the team/tenant makes adding boards later a non-breaking change.

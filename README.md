# NetCero Interview Template

Technical interview template for Full Stack Developer candidates. A simplified ESG emissions tracking app that mirrors the patterns of the NetCero production codebase — module layout, TypeORM entities, DTO validation and the frontend query/mutation structure are the same. The build tooling differs: production runs on Turborepo, this template on Nx.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Nx 22 + pnpm |
| Backend | NestJS 11 + TypeORM + PostgreSQL 15 |
| Frontend | React 19 + Vite + MUI 7 |
| Forms | react-hook-form |
| Data fetching | TanStack React Query v5 |
| Language | TypeScript 5.9 |

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- pnpm 10+
- Docker (for PostgreSQL)

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/NetCero-GmbH/interview-template-2026.git
cd interview-template-2026

# 2. Install dependencies
pnpm install

# 3. Start PostgreSQL
pnpm db:up

# 4. Seed the database
pnpm seed

# 5. Start the app (both API and frontend)
pnpm dev
```

- **API**: http://localhost:3000/api/v1
- **Frontend**: http://localhost:4200

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend (port 3000)
│   └── web/          # React + Vite frontend (port 4200)
├── libs/
│   └── common/       # Shared types and enums (@interview/common)
├── docker/           # Docker Compose for PostgreSQL
└── README.md
```

### Backend Architecture

Each domain module follows this structure:

```
domain/{entity}/
  {entity}.entity.ts              # TypeORM entity with toApi() method
  {entity}.module.ts              # NestJS module
  controllers/{entity}.controller.ts
  services/{entity}.service.ts    # Extends TransactionalHandler<Entity>
  dtos/{entity}.dto.ts            # class-validator DTOs
```

Key patterns:
- `TransactionalHandler<T>` base class for transactional repository access
- Hierarchical identity DTOs for nested route params
- Global `ValidationPipe` with whitelist and transform
- `SnakeNamingStrategy` for database columns

### Frontend Architecture

Each feature module:

```
modules/{feature}/
  {feature}.queries.ts            # TanStack Query hooks
  {feature}.mutations.ts          # Mutation hooks with cache invalidation
  {feature}-list.component.tsx    # List/table view
  {feature}-edit.dialog.tsx       # Edit dialog with react-hook-form
```

Key patterns:
- TanStack Query v5 with query key factories
- react-hook-form `Controller` + MUI components + `rules` for validation
- Dialog-based CRUD pattern

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start API and frontend in parallel |
| `pnpm dev:api` | Start API only |
| `pnpm dev:web` | Start frontend only |
| `pnpm seed` | Seed the database with sample data |
| `pnpm db:up` | Start PostgreSQL via Docker |
| `pnpm db:down` | Stop PostgreSQL |
| `pnpm db:reset` | Reset database (removes all data) |
| `pnpm build` | Build all projects |
| `pnpm test` | Run unit tests |
| `pnpm e2e:api` | Run the API HTTP smoke test |
| `pnpm e2e:web` | Run the Playwright browser smoke test |
| `pnpm e2e` | Run all e2e tests (API + web) |

## Tests

- `pnpm test` runs the unit tests.
- `pnpm e2e:api` runs the API HTTP smoke test against a seeded Postgres. Configure the connection via `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` (defaults to `localhost:5432/interview`).
- `pnpm e2e:web` runs the Playwright browser smoke test. Requires a one-time `npx playwright install chromium`.
- `pnpm e2e` runs both.

## Running the e2e tests

The DB connection is read from env in `apps/api/src/database/db-config.ts` with these defaults: `host=localhost`, `port=5432`, `user=interview`, `password=interview`, `db=interview`. Override per-run with `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`.

### Postgres

Two supported Postgres instances — pick one:

- **Option A — repo's own docker Postgres on :5432** (the default the config expects): `pnpm db:up` runs `docker compose -f docker/docker-compose.yaml up -d` and provisions `user/password/db = interview/interview/interview` on `:5432`. No env overrides needed.
- **Option B — shared town Postgres on :54321** (the `pg-54321-postgres-1` container, which has the `interview` role and the 3 tables). When using it, set `DB_PORT=54321`.

> The api e2e will fail with `password authentication failed for user "interview"` if pointed at a Postgres that lacks the `interview` role — e.g. a stray system Postgres on `:5432`. Use one of the two options above.

### API e2e (vitest + supertest)

The root `vitest.config.ts` includes `apps/api/e2e/**/*.e2e-spec.ts` and `apps/api/**/*.test.ts`.

Run only the api e2e:

```bash
DB_PORT=<port> pnpm exec vitest run apps/api/e2e
```

- With the repo's own docker: `DB_PORT=5432` (or just omit — it's the default).
- With the shared town DB: `DB_PORT=54321`.

The e2e's `beforeAll` DELETEs and re-seeds the DB (`defaultScenario`) before each run, so it **mutates** the target database.

### Web e2e (Playwright)

Config at `apps/web/playwright.config.ts` reads `WEB_PORT` (default `4200`) for `baseURL` and the `webServer`; it has `reuseExistingServer: true`.

Start the dev server for **this worktree's** source, then run Playwright against it:

```bash
# 1. Start the dev server in the background and wait for HTTP 200
cd apps/web && WEB_PORT=<port> pnpm exec nx serve web   # vite.config.mts reads process.env.WEB_PORT

# 2. Run Playwright
cd apps/web && WEB_PORT=<port> pnpm exec playwright test
```

Use a port that doesn't conflict with a shared dev server — e.g. `WEB_PORT=4201`.

> Do **not** kill a dev server on `:4200` you didn't start — it may belong to another worktree.

## What We Look For

- **Pattern adherence** -- Can you read existing code and extend it consistently?
- **Code quality** -- Clean TypeScript, meaningful naming, proper error handling
- **Full-stack thinking** -- Data model, API, UI, end-to-end
- **Communication** -- Asking questions, explaining decisions, thinking aloud
- **Effective use of tools** -- Including AI coding tools; we want to see your real workflow

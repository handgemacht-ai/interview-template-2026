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

## What We Look For

- **Pattern adherence** -- Can you read existing code and extend it consistently?
- **Code quality** -- Clean TypeScript, meaningful naming, proper error handling
- **Full-stack thinking** -- Data model, API, UI, end-to-end
- **Communication** -- Asking questions, explaining decisions, thinking aloud
- **Effective use of tools** -- Including AI coding tools; we want to see your real workflow

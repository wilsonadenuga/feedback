# Feedback

A Turborepo monorepo with a NestJS API and Prisma ORM.

## What's Inside

This Turborepo includes the following packages and apps:

### Apps

- `api`: A [NestJS](https://nestjs.com/) application with [Prisma](https://prisma.io/) ORM

### Utilities

This Turborepo has some additional tools already setup:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 10

### Installation

```bash
pnpm install
```

### Database Setup

1. Create a `.env` file in `apps/api/` based on `.env.example`:

```bash
cp apps/api/.env.example apps/api/.env
```

2. Update the `DATABASE_URL` in `apps/api/.env` with your database connection string.

3. Generate Prisma Client:

```bash
cd apps/api
pnpm prisma:generate
```

4. Run database migrations:

```bash
cd apps/api
pnpm prisma:migrate
```

### Development

To develop all apps and packages, run:

```bash
pnpm dev
```

### Build

To build all apps and packages, run:

```bash
pnpm build
```

### Test

To run tests, run:

```bash
pnpm test
```

### Lint

To lint all apps and packages, run:

```bash
pnpm lint
```

## Project Structure

```
feedback/
├── apps/
│   └── api/              # NestJS API application
│       ├── src/          # Source files
│       ├── prisma/       # Prisma schema and migrations
│       └── test/         # E2E tests
├── packages/             # Shared packages
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```
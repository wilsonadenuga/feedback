# Technology Stack

## Build System & Package Management

- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: pnpm with workspace support
- **Node.js**: >= 18 required
- **TypeScript**: Shared configuration across all packages

## Backend Stack (API)

- **Framework**: NestJS with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Email**: Resend service with React Email templates
- **Queue System**: BullMQ with Redis
- **Caching**: Redis via cache-manager
- **Validation**: Zod schemas with nestjs-zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest for unit and e2e tests

## Frontend Stack (Web)

- **Framework**: Next.js 16 with App Router
- **UI Library**: Custom UI components with Tailwind CSS
- **State Management**: React hooks and context
- **Icons**: Tabler Icons and Lucide React
- **Tables**: TanStack Table
- **Themes**: next-themes for dark/light mode
- **Notifications**: Sonner for toast notifications

## Shared Packages

- **UI Components**: Reusable React components with Tailwind
- **Schema Validation**: Shared Zod schemas
- **Email Templates**: React Email components
- **ESLint Config**: Shared linting rules
- **TypeScript Config**: Shared TypeScript configurations

## Common Commands

### Development

```bash
# Install dependencies
make install
# or
pnpm install

# Start development servers
make dev
# or
pnpm dev

# Build all applications
make build
# or
pnpm build
```

### Database Operations

```bash
# Generate Prisma client
make prisma-generate

# Run database migrations
make prisma-migrate

# Open Prisma Studio
make prisma-studio

# Format Prisma schema
make prisma-format
```

### Code Quality

```bash
# Run linters
make lint
# or
pnpm lint

# Run tests
make test
# or
pnpm test
```

### NestJS Resource Generation

```bash
# Generate CRUD resource
make resource name=<resource-name>
```

### Cleanup

```bash
# Clean build artifacts and node_modules
make clean
```

## Environment Setup

1. Copy environment file: `cp apps/api/.env.example apps/api/.env`
2. Configure database connection in `apps/api/.env`
3. Run `make prisma-generate` to generate Prisma client
4. Run `make prisma-migrate` to apply database migrations

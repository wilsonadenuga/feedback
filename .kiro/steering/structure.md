# Project Structure

## Monorepo Organization

```
feedback/
├── apps/                     # Applications
│   ├── api/                 # NestJS API application
│   └── web/                 # Next.js web application
├── packages/                # Shared packages
│   ├── ui/                  # Reusable UI components
│   ├── schema/              # Shared Zod validation schemas
│   ├── email-templates/     # React Email templates
│   ├── eslint-config/       # Shared ESLint configurations
│   └── typescript-config/   # Shared TypeScript configurations
└── [config files]          # Root configuration files
```

## API Application Structure (`apps/api/`)

```
src/
├── common/                  # Shared utilities and decorators
│   ├── decorators/         # Custom parameter decorators
│   ├── filters/            # Exception filters
│   ├── helpers/            # Utility functions
│   └── interceptors/       # Response interceptors
├── config/                 # Application configuration
├── modules/                # Feature modules
│   ├── app/               # Root application module
│   ├── auth/              # Authentication module
│   ├── email/             # Email service module
│   ├── feedbacks/         # Feedback management
│   ├── labels/            # Label management
│   ├── projects/          # Project management
│   ├── token/             # Token management
│   ├── user/              # User management
│   └── workspace/         # Workspace management
├── prisma/                # Prisma service
└── swagger/               # API documentation
```

### Module Structure Pattern

Each feature module follows this structure:

```
module-name/
├── controllers/           # REST controllers
├── dto/                  # Data Transfer Objects
├── services/             # Business logic services
├── repositories/         # Data access layer (optional)
├── guards/               # Route guards (optional)
├── events/               # Domain events (optional)
└── listeners/            # Event listeners (optional)
```

## Database Structure (`apps/api/prisma/`)

```
prisma/
├── models/               # Individual model files
│   ├── user.prisma
│   ├── workspace.prisma
│   ├── project.prisma
│   ├── feedback.prisma
│   └── [other models]
├── migrations/           # Database migration files
└── schema.prisma        # Main schema file
```

## Web Application Structure (`apps/web/`)

```
app/                     # Next.js App Router
├── dashboard/           # Dashboard pages
│   ├── [workspaceId]/  # Dynamic workspace routes
│   └── _components/    # Dashboard-specific components
├── layout.tsx          # Root layout
└── page.tsx           # Home page

components/             # Shared components
hooks/                 # Custom React hooks
lib/                   # Utility libraries
```

## Shared Packages Structure

### UI Package (`packages/ui/`)

```
src/
├── components/         # Reusable UI components
├── hooks/             # Shared React hooks
├── lib/               # Utility functions
└── styles/            # Global styles
```

### Schema Package (`packages/schema/`)

```
src/
├── auth/              # Authentication schemas
├── common/            # Common validation schemas
├── feedbacks/         # Feedback-related schemas
├── labels/            # Label schemas
├── projects/          # Project schemas
├── workspace/         # Workspace schemas
└── [other domains]    # Domain-specific schemas
```

## Configuration Files

- **Root Level**: `package.json`, `turbo.json`, `pnpm-workspace.yaml`
- **Build**: `Makefile` for common commands
- **Code Quality**: `.eslintrc.mjs`, `.lintstagedrc.mjs`, `commitlint.config.mjs`
- **Git**: `.husky/` for git hooks, `.gitignore`

## Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Directories**: kebab-case (e.g., `workspace-invite/`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Variables/Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DATABASE_URL`)
- **Interfaces**: PascalCase with 'I' prefix (e.g., `IUserRepository`)

## Import Organization

1. Node.js built-in modules
2. External dependencies
3. Internal workspace packages (`@feedback/*`)
4. Relative imports (`./ and ../`)

## Testing Structure

- **Unit Tests**: Co-located with source files (`.spec.ts`)
- **E2E Tests**: In `test/` directory
- **Test Utilities**: Shared testing helpers and mocks

.PHONY: help install dev build test lint clean db-setup prisma-generate prisma-migrate prisma-studio prisma-format prisma-reset resource

# Default target
help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build all applications"
	@echo "  make test           - Run tests"
	@echo "  make lint           - Run linters"
	@echo "  make clean          - Clean build artifacts and node_modules"
	@echo "  make db-setup        - Point a new empty database at the committed migrations"
	@echo "  make prisma-generate - Generate Prisma client"
	@echo "  make prisma-migrate  - Run Prisma migrations"
	@echo "  make prisma-studio   - Open Prisma Studio"
	@echo "  make prisma-format   - Format Prisma schema"
	@echo "  make prisma-reset    - Drop the database and rebuild it from a single migration (destructive)"
	@echo "  make resource name=<name> - Generate NestJS CRUD resource"

# Install dependencies
install:
	pnpm install

# Development
dev:
	pnpm dev

# Build
build:
	pnpm build

# Test
test:
	pnpm test

# Lint
lint:
	pnpm lint

# Clean
clean:
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf apps/*/dist
	rm -rf apps/*/build
	rm -rf .turbo

db-setup:
	@echo "Target: $$(grep '^DATABASE_URL' apps/api/.env | sed 's|://[^@]*@|://***@|')"
	cd apps/api && pnpm exec prisma migrate deploy
	cd apps/api && pnpm exec prisma generate
	@echo "Done. The database is empty — register an account to sign in."

# Prisma commands
prisma-generate:
	cd apps/api && pnpm prisma:generate

prisma-migrate:
	cd apps/api && pnpm prisma:migrate

prisma-studio:
	cd apps/api && pnpm prisma:studio

prisma-format:
	cd apps/api && pnpm prisma format

# Squash the migration history into one baseline and rebuild the database from
# it. Drops every table — development databases only.
prisma-reset:
	@echo "Target: $$(grep '^DATABASE_URL' apps/api/.env | sed 's|://[^@]*@|://***@|')"
	@echo "This deletes apps/api/prisma/migrations and drops every table in that database."
	@read -p "Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ] || (echo "Aborted."; exit 1)
	rm -rf apps/api/prisma/migrations
	cd apps/api && pnpm exec prisma migrate reset
	cd apps/api && pnpm exec prisma migrate dev --name init

# Generate NestJS CRUD resource
resource:
	@if [ -z "$(name)" ]; then \
		echo "Error: Please provide a resource name using 'make resource name=<name>'"; \
		exit 1; \
	fi
	cd apps/api && pnpm nest g resource $(name) --no-spec

.PHONY: help install dev build test lint clean prisma-generate prisma-migrate prisma-studio prisma-format resource

# Default target
help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build all applications"
	@echo "  make test           - Run tests"
	@echo "  make lint           - Run linters"
	@echo "  make clean          - Clean build artifacts and node_modules"
	@echo "  make prisma-generate - Generate Prisma client"
	@echo "  make prisma-migrate  - Run Prisma migrations"
	@echo "  make prisma-studio   - Open Prisma Studio"
	@echo "  make prisma-format   - Format Prisma schema"
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

# Prisma commands
prisma-generate:
	cd apps/api && pnpm prisma:generate

prisma-migrate:
	cd apps/api && pnpm prisma:migrate

prisma-studio:
	cd apps/api && pnpm prisma:studio

prisma-format:
	cd apps/api && pnpm prisma format

# Generate NestJS CRUD resource
resource:
	@if [ -z "$(name)" ]; then \
		echo "Error: Please provide a resource name using 'make resource name=<name>'"; \
		exit 1; \
	fi
	cd apps/api && pnpm nest g resource $(name) --no-spec

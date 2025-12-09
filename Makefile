.PHONY: help install dev build test lint clean prisma-generate prisma-migrate prisma-studio prisma-format

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

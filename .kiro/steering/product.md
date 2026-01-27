# Product Overview

**Feedback** is a feedback management platform built as a monorepo application. The system allows users to collect, organize, and manage feedback through workspaces and projects.

## Core Features

- **User Authentication**: Email-based authentication with verification codes
- **Workspace Management**: Multi-tenant workspace system with member roles and invitations
- **Project Organization**: Projects within workspaces for organizing feedback
- **Feedback Collection**: Structured feedback with labeling and status management
- **Label System**: Categorization and organization of feedback items

## Architecture

The application follows a modern full-stack architecture:

- **Backend**: NestJS API with PostgreSQL database via Prisma ORM
- **Frontend**: Next.js web application with React components
- **Email**: Transactional emails via Resend service
- **Shared Libraries**: Common schemas, UI components, and utilities

## Key Entities

- **Users**: Authentication and profile management
- **Workspaces**: Multi-tenant containers with member management
- **Projects**: Organizational units within workspaces
- **Feedback**: Core feedback items with status tracking
- **Labels**: Categorization system for feedback organization

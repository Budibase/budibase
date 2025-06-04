# CLAUDE.md - Budibase Development Guide

## Project Overview

**Budibase** is an open-source low-code platform that helps engineers build forms, portals, and approval apps quickly and securely. The platform allows users to create web applications with minimal coding, featuring a visual builder interface, multiple data source integrations, and automated workflows.

### Key Features
- Visual application builder with drag-and-drop components
- Multiple data source connectors (PostgreSQL, MongoDB, REST APIs, etc.)
- Automation workflows and integrations
- Self-hostable with Docker/Kubernetes support
- AI-powered agents for enhanced functionality

## Architecture

Budibase follows a **monorepo architecture** managed by Lerna, consisting of multiple interconnected packages:

### Core Packages

- **`packages/builder/`** - Svelte-based web application for the visual builder interface
- **`packages/server/`** - Koa.js backend API server handling data operations, and app serving
- **`packages/client/`** - Client-side runtime that renders Budibase apps in browsers
- **`packages/worker/`** - Background worker service for handling autentication, automations and async tasks
- **`packages/backend-core/`** - Shared backend utilities and core functionality
- **`packages/frontend-core/`** - Shared frontend utilities and components

### Supporting Packages

- **`packages/bbui/`** - Reusable UI component library (Svelte)
- **`packages/types/`** - TypeScript type definitions shared across packages
- **`packages/shared-core/`** - Business logic shared between frontend and backend
- **`packages/string-templates/`** - Template engine for dynamic content
- **`packages/pro/`** - Pro features and enterprise functionality
- **`packages/cli/`** - Command-line interface for Budibase

## Development Setup

### Prerequisites
- **Node.js**: Version 22.x (specified in engines)
- **Yarn**: Package manager
- **Docker**: For local development stack

### Initial Setup
```bash
# Clone and setup
git config submodule.recurse true
git submodule update
node ./hosting/scripts/setup.js
yarn install
yarn build
```

### Development Commands

**Build Commands:**
```bash
yarn build                    # Build all packages
yarn build:dev               # Watch mode development build  
yarn build:apps              # Build server and worker only
yarn build:sdk               # Build SDK package
```

**Development Server:**
```bash
yarn dev                     # Start all services
yarn dev:noserver           # Start without backend services
yarn dev:server             # Start only server/worker
```

**Testing & Quality:**
```bash
yarn test                   # Run all tests
yarn lint                   # Run ESLint and Prettier
yarn lint:fix:prettier      # Auto-fix linting issues
yarn check:types            # TypeScript type checking. If this fails due to @budibase/types module, you need to run a yarn build first and then run the type check again.
```

**Process Management:**
```bash
yarn kill-all              # Kill all development processes
yarn kill-builder          # Kill builder (port 3000)
yarn kill-server           # Kill server (ports 4001, 4002)
```

## Agent System

The project includes an AI agent system with configurable tool sources:

### Agent Components
- **Chat Interface**: `/packages/builder/src/pages/builder/app/[application]/agent/`
- **Tool Sources**: GitHub, Confluence, Budibase integrations
- **Backend Controller**: `/packages/server/src/api/controllers/ai/agents.ts`
- **API Routes**: `/packages/server/src/api/routes/ai.ts`

### Key Files for Agent Development
- `index.svelte` - Main agent chat interface
- `Chatbox.svelte` - Chat component
- `logos/` - Tool source logos (Svelte components)
- Agent store: `/packages/builder/src/stores/portal/agents.ts`
- Agent API: `/packages/frontend-core/src/api/agents.ts`

## Common Development Tasks

### Adding New Components
1. Create component in appropriate package (`bbui` for reusable, `builder` for builder-specific)
2. Follow existing patterns for props, styling, and exports
3. Add TypeScript types if needed. Follow the rules defined in tsconfig and tsconfig.build.json at the different package levels. Avoid use of explicit any unless absolutely necessary.
4. Update package exports in `index.ts`

### Database Changes
- App-level changes: Use app migrations in `/packages/server/src/appMigrations/`
- Global changes: Update database utilities in `/packages/backend-core/src/db/`

### API Development
- Add routes in `/packages/server/src/api/routes/`
- Implement controllers in `/packages/server/src/api/controllers/`
- Update OpenAPI specs in `/packages/server/specs/`
- Add corresponding frontend API calls in `/packages/frontend-core/src/api/`

### Environment Configuration
Multiple environment modes available:
```bash
yarn mode:self      # Self-hosted mode
yarn mode:cloud     # Cloud mode  
yarn mode:account   # Account portal mode
```

## Code Style & Standards

- **TypeScript**: Strict typing enabled across packages
- **ESLint**: Configuration in `eslint.config.mjs`
- **Prettier**: Code formatting (2 spaces, no semicolons)
- **Svelte**: Component framework for frontend
- **Node.js**: ES modules preferred

### File Naming
- Components: PascalCase (e.g., `MyComponent.svelte`)
- Utilities: camelCase (e.g., `myUtility.ts`)
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase interfaces/types

## Testing Strategy

- **Unit Tests**: Jest configuration per package
- **Integration Tests**: In `/packages/server/src/integration-test/`
- **E2E Tests**: (Framework TBD)

## Deployment

### Docker
```bash
yarn build:docker:single     # Single container build
yarn build:docker:dependencies  # Dependencies container
```

### Hosting Options
- Docker Compose (development)
- Kubernetes (production)
- Digital Ocean App Platform
- Self-hosted environments

## Security

- Authentication via JWT tokens
- Role-based access control (RBAC)
- Tenant isolation in multi-tenant setups
- CSRF protection and input validation

## Troubleshooting

### Common Issues
- **Port conflicts**: Use `yarn kill-all` to clear ports
- **Build failures**: Run `yarn clean && yarn && yarn build`
- **Docker issues**: Use `yarn nuke:docker` to reset containers

### Development Tips
- Use `yarn build:dev` for faster incremental builds
- Check `yarn deps:circular` for dependency issues
- Monitor `lerna.json` for version management

---
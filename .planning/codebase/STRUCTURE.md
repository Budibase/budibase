# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
budibase-og/
├── packages/              # Lerna monorepo packages
│   ├── backend-core/      # Shared backend utilities (all NodeJS services)
│   ├── bbui/              # Budibase UI component library (Svelte)
│   ├── builder/           # Low-code UI editor (Svelte/Vite frontend)
│   ├── cli/               # Command-line interface
│   ├── client/            # Runtime client SDK (embedded in user apps)
│   ├── frontend-core/     # Shared frontend utilities (browser)
│   ├── pro/               # Enterprise/paid features
│   ├── sdk/               # External SDK package
│   ├── server/            # Main API service (Koa, port 4001)
│   ├── shared-core/       # Cross-platform shared code (NodeJS + browser)
│   ├── string-templates/  # Handlebars template engine
│   ├── types/             # TypeScript type definitions (root dependency)
│   ├── upgrade-tests/     # Database migration tests
│   └── worker/            # Background job service (Koa, port 4002)
├── scripts/               # Build and deployment scripts
├── hosting/               # Docker and deployment configurations
├── docs/                  # Documentation
├── .planning/             # Planning documents (generated)
├── .github/               # GitHub workflows
└── lerna.json             # Monorepo configuration
```

## Directory Purposes

**packages/server/:**
- Purpose: Main REST API service serving Budibase apps and builder
- Contains: Route handlers, controllers, middleware, integrations, automations, SDK
- Key files: `src/app.ts` (startup), `src/koa.ts` (server setup), `src/api/` (routes), `src/sdk/` (logic layer)

**packages/backend-core/:**
- Purpose: Reusable backend infrastructure used by server and worker
- Contains: Database abstractions, authentication, tenancy, caching, queuing, logging, middleware utilities
- Key files: `src/db/` (document database), `src/auth/` (auth middleware), `src/context/` (tenancy), `src/cache/` (Redis), `src/queue/` (Bull)

**packages/worker/:**
- Purpose: Background job processing and admin operations
- Contains: User management, workspace setup, migrations, SCIM endpoints
- Key files: `src/index.ts` (startup), `src/api/` (routes for admin operations)
- Differs from server: No app runtime, no automations engine, focused on backend admin

**packages/types/:**
- Purpose: Shared TypeScript type definitions and interfaces
- Contains: API request/response types, data models, constants
- Key files: `src/sdk/` (context types like `UserCtx`), `src/documents/` (data models), `src/core/` (enums and shared types)
- No dependencies: This is the root of the import dependency graph

**packages/shared-core/:**
- Purpose: Logic and utilities usable in both NodeJS and browsers
- Contains: Automation definitions, filter logic, helper functions, table utilities
- Key files: `src/automations/` (trigger/action definitions), `src/filters.ts` (filter evaluation)

**packages/backend-core/src/**
- `auth/` - Authentication strategies (local, OIDC, OAuth2, SAML)
- `db/` - Document database abstraction (CouchDB implementation, views, connection pooling)
- `cache/` - Redis-based caching layer
- `tenancy/` - Multi-tenancy context management
- `context/` - Request-scoped context binding
- `middleware/` - Reusable Koa middleware (correlation, logging, error handling)
- `queue/` - Bull-based job queue abstraction
- `events/` - Event system for hooks and event publishing

**packages/server/src/**
- `api/` - HTTP route definitions and controllers
  - `routes/` - Route registration (e.g., `tables.ts` mounts table endpoints)
  - `controllers/` - Request handlers organized by resource (tables, rows, queries, etc.)
- `sdk/` - Business logic layer with domain-organized modules
  - `workspace/` - App-specific operations (tables, queries, automations)
  - `dev/` - Development utilities
  - `users/` - User management functions
- `middleware/` - Server-specific middleware (cleanup, resource ID validation, etc.)
- `integrations/` - External data source drivers (MySQL, PostgreSQL, Firebase, etc.)
- `automations/` - Automation engine (triggers, actions, job queue)
- `services/` - Minimal service layer (mostly workspace home)
- `db/` - Database initialization
- `startup/` - Server startup orchestration
- `websockets/` - WebSocket connections (builder collaboration, grid updates)
- `middleware/` - Custom middleware for routes

**packages/builder/src/**
- `pages/` - Svelte page routes
- `stores/` - Svelte stores for state management (builder state, portal auth, preferences)
- `components/` - UI components organized by feature (design, automation, backend, integration, etc.)
- `helpers/` - Utility functions
- `constants/` - Constants
- `api.ts` - API client initialization

**packages/frontend-core/src/**
- `api/` - HTTP API client creation and utilities
- `stores/` - Base store implementations
- `fetch/` - Fetch request utilities
- `components/` - Reusable base components
- `icons/` - SVG icon components
- `themes/` - Theme definitions

**packages/bbui/src/**
- Reusable Svelte component library used by builder

## Key File Locations

**Server Entry Points:**
- `packages/server/src/index.ts` - Process entry point, checks environment
- `packages/server/src/app.ts` - Application setup, initializes database, starts server
- `packages/server/src/koa.ts` - Koa server creation with middleware pipeline
- `packages/server/src/startup/index.ts` - Startup orchestration, route initialization, state management

**Route Registration:**
- `packages/server/src/api/index.ts` - Main API router setup with middleware chain
- `packages/server/src/api/routes/index.ts` - Imports and mounts all route modules

**Type Definitions:**
- `packages/types/src/sdk/koa.ts` - `UserCtx`, `Ctx` interfaces for request context
- `packages/types/src/documents/` - Data model types (Table, Row, Workspace, etc.)
- `packages/types/src/core/` - Core enums (EventType, FieldType, etc.)

**SDK Module Examples:**
- `packages/server/src/sdk/workspace/tables/index.ts` - Table CRUD operations
- `packages/server/src/sdk/workspace/rows/index.ts` - Row CRUD operations
- `packages/server/src/sdk/workspace/queries/index.ts` - Query execution
- `packages/server/src/sdk/workspace/automations/index.ts` - Automation management

**Database Access:**
- `packages/backend-core/src/db/couch/DatabaseImpl.ts` - Main database implementation class
- `packages/backend-core/src/db/views.ts` - CouchDB view queries
- `packages/server/src/db/index.ts` - Server-specific DB initialization

**Integrations:**
- `packages/server/src/integrations/` - One file per data source type
  - Examples: `mysql.ts`, `postgres.ts`, `firebase.ts`, `rest.ts`, `mongodb.ts`

**Configuration:**
- `packages/server/src/environment.ts` - Environment variable schema and parsing
- `packages/worker/src/environment.ts` - Worker environment schema

**Testing:**
- `packages/server/src/tests/` - Test utilities and fixtures
  - `TestConfiguration.ts` - Test helper for API testing
  - `utilities/structures.ts` - Factory functions for test data
- `packages/server/src/api/controllers/*/tests/` - Controller-specific tests
- `packages/backend-core/src/tests/` - Backend-core test fixtures

## Naming Conventions

**Files:**
- Controllers: Resource name (singular), e.g., `table.ts`, `row.ts`, `datasource.ts`
- Routes: Resource name (plural), e.g., `tables.ts`, `rows.ts`, `datasources.ts`
- SDK modules: Plural or action-based, e.g., `tables/`, `rows/`, `queries/`
- Middleware: Descriptive function name with `Middleware` or `middleware` prefix/suffix, e.g., `authorized.ts`, `joi-validator.ts`
- Integrations: Integration name lowercase, e.g., `mysql.ts`, `postgres.ts`, `googlesheets.ts`
- Tests: File being tested name + `.spec.ts` or `.test.ts`, e.g., `datasource.spec.ts`

**Directories:**
- Controllers: By resource type (`row/`, `table/`, `query/`)
- Middleware: Flat list in `middleware/` directory
- Integrations: Flat list in `integrations/` directory
- Utilities: `utilities/` or `utils/` directories with descriptive file names
- Features: Organized by feature area (`automation/`, `backend/`, `design/`, etc.)

**Functions:**
- Async handlers: `async function handleRequest()` or `async function fetch()`
- Internal helpers: Prefixed with `_` if private convention, e.g. `_enrichDatasource()`
- Middleware: Named function starting with resource/purpose, e.g., `authorizedMiddleware`, `currentWorkspaceMiddleware`
- Validation: `validate*` prefix, e.g., `validateDatasource()`
- Getters: `get*` prefix, e.g., `getConnector()`, `getDatasource()`

**Variables:**
- camelCase for all variables
- Unused parameters prefixed with `_`, e.g., `_ctx`, `_next`
- Constants: UPPER_SNAKE_CASE
- Context/request objects: `ctx`, `request`, `body`, `params`

**Types:**
- Interfaces for objects: PascalCase, e.g., `UserCtx`, `ContextUser`, `BBRequest`
- Type unions: PascalCase ending with `Type`, e.g., `EventType`, `FieldType`
- Request/Response types: `{Resource}Request`, `{Resource}Response`, e.g., `CreateTableRequest`, `FetchRowResponse`
- Enums: PascalCase, e.g., `LoginMethod`, `SourceName`

## Where to Add New Code

**New REST API Endpoint:**
1. Create route definition in `packages/server/src/api/routes/{resource}.ts`
   - Import router from `@koa/router`
   - Define path (e.g., `router.get("/api/tables/:tableId", authorized(), tables.fetch)`)
2. Create controller function in `packages/server/src/api/controllers/{resource}.ts`
   - Accept `ctx: UserCtx<RequestBody, ResponseBody>` parameter
   - Call `sdk.{module}.{operation}()` for business logic
   - Set `ctx.body` with response
3. Add type definitions to `packages/types/src/` (request/response types)
4. Import route in `packages/server/src/api/routes/index.ts` and mount in router

**New Business Logic Module:**
1. Create SDK module in `packages/server/src/sdk/workspace/{feature}/index.ts`
2. Export functions for common operations (save, fetch, delete, etc.)
3. Use `context.getAppId()` and database methods from SDK, not direct DB calls
4. Type with request/response types from `@budibase/types`
5. Import and use in controllers or other SDK modules

**New Data Source Integration:**
1. Create file `packages/server/src/integrations/{sourceName}.ts`
2. Implement class with query, schema detection, connection testing methods
3. Register in integrations list (config file or factory)
4. Add types to `packages/types/src/` for query parameters specific to source

**New Automation Trigger or Action:**
1. Add to `packages/shared-core/src/automations/triggerDefinitions.ts` or `actionDefinitions.ts`
2. Export definition with metadata (name, inputs, outputs)
3. Implement execution logic in `packages/server/src/automations/steps/`
4. Add types to `packages/types/src/` for trigger/action payloads

**New Frontend Component:**
1. Create Svelte component in `packages/builder/src/components/{feature}/`
2. Import from `@budibase/bbui` for base components
3. Use stores from `packages/builder/src/stores/` for state
4. API calls via `packages/builder/src/api.ts` which provides authenticated client

**New Test:**
1. Create `.spec.ts` file alongside source file or in `tests/` subdirectory
2. Use Jest with `describe`/`it` structure
3. For API tests: Use `TestConfiguration` from `packages/server/src/tests/TestConfiguration.ts`
4. For unit tests: Import and test function directly
5. Mock external services with `nock` or manual mocks

## Special Directories

**packages/pro/:**
- Purpose: Enterprise features (authentication strategies, audit logging, quotas)
- Generated: Partially (some files generated from pro sources)
- Committed: Yes, but with limited visibility (proprietary code)

**packages/server/src/tests/:**
- Purpose: Testing infrastructure and fixtures
- Generated: No
- Committed: Yes
- Contains test helpers, factory functions for creating test data, configuration for test database

**packages/server/src/integration-test/:**
- Purpose: Database-specific integration tests that require actual database connections
- Generated: No
- Committed: Yes
- Tests actual PostgreSQL, MySQL behavior via `testcontainers`

**packages/builder/src/stores/builder/ and stores/portal/:**
- Purpose: Svelte store definitions for builder state and authentication
- Generated: No
- Committed: Yes
- Contains nested stores for different app/workspace states

**docs/:**
- Purpose: External documentation
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-21*

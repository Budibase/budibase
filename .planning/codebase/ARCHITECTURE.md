# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Lerna Monorepo with Layered Service Architecture (API + Background Workers)

**Key Characteristics:**
- Microservice-style separation: `server` (API), `worker` (background tasks)
- Shared libraries: `backend-core` (NodeJS utilities), `types` (TypeScript definitions), `shared-core` (cross-platform)
- Frontend packages: `builder` (UI editor), `bbui` (component library), `frontend-core` (browser utilities)
- Strongly typed with TypeScript strict mode and consistent-type-imports
- Koa-based HTTP servers with graceful shutdown handling
- CouchDB as primary database with PouchDB for local/testing
- Redis for caching, sessions, and queue management
- Bull/BullMQ for async task processing

## Layers

**API Layer (Koa HTTP Server):**
- Purpose: HTTP request handling, routing, authentication, response formatting
- Location: `packages/server/src/api/`, `packages/server/src/middleware/`
- Contains: Route definitions, controller functions, endpoint handlers
- Depends on: SDK layer, backend-core, types, middleware utilities
- Used by: Browser clients, external API consumers

**SDK Layer (Business Logic):**
- Purpose: Centralized API for app operations, data manipulation, resource management
- Location: `packages/server/src/sdk/`
- Contains: Modular functions organized by domain (tables, rows, queries, automations, datasources, users, etc.)
- Depends on: Database layer, backend-core, types, integrations
- Used by: Controllers, automations, event handlers

**Controller Layer (Request Handlers):**
- Purpose: Parse requests, call SDK functions, format responses
- Location: `packages/server/src/api/controllers/`
- Contains: Functions like `fetch()`, `create()`, `update()`, `delete()` organized by resource type
- Depends on: SDK, types, validation utilities
- Used by: Router middleware that maps routes to controllers

**Database Layer:**
- Purpose: Document database abstraction
- Location: `packages/backend-core/src/db/` (CouchDB implementation), `packages/server/src/db/`
- Contains: CouchDB initialization, view queries, connection pooling
- Depends on: PouchDB for client, Node libraries for server
- Used by: SDK functions for document persistence

**Integration Layer:**
- Purpose: External data source connections (SQL databases, REST APIs, cloud services)
- Location: `packages/server/src/integrations/`
- Contains: Drivers for MySQL, PostgreSQL, Oracle, Firebase, S3, Airtable, Google Sheets, MongoDB, Snowflake, etc.
- Depends on: SDK datasource management, types
- Used by: Query execution, data fetch operations

**Middleware Layer:**
- Purpose: Request preprocessing, authentication, authorization, error handling
- Location: `packages/server/src/middleware/`, `packages/backend-core/src/middleware/`
- Contains: Auth middleware, tenancy middleware, CSRF validation, error handling, cleanup
- Depends on: backend-core auth, types
- Used by: Koa app initialization in `packages/server/src/koa.ts`

**Automation/Task Queue Layer:**
- Purpose: Background job processing, scheduled tasks, event-driven actions
- Location: `packages/server/src/automations/`, `packages/server/src/automations/bullboard.ts`
- Contains: Automation triggers, actions, Bull queue configuration
- Depends on: Redis, SDK, backend-core queue utilities
- Used by: Server startup, webhook endpoints

**Worker Service:**
- Purpose: Separate process for background tasks and admin operations
- Location: `packages/worker/src/`
- Contains: User management, workspace setup, migrations, SCIM endpoints
- Depends on: backend-core, types, pro modules
- Used by: Server for async operations, scheduled jobs

**Frontend Builder:**
- Purpose: Low-code UI editor and component studio
- Location: `packages/builder/src/`
- Contains: Svelte pages, stores, components, API client integration
- Depends on: frontend-core, bbui components, shared-core, types
- Used by: Developers building Budibase apps

**Frontend Core Library:**
- Purpose: Reusable browser utilities and API client
- Location: `packages/frontend-core/src/`
- Contains: API fetching, store management, component base classes, themes
- Depends on: types, shared-core
- Used by: builder, client, other frontend packages

**Shared Core Library:**
- Purpose: Logic and constants used across NodeJS and browser
- Location: `packages/shared-core/src/`
- Contains: Automation definitions, filter logic, helper functions, type exports
- Depends on: types only
- Used by: All packages

**Types Package:**
- Purpose: Central TypeScript type definitions
- Location: `packages/types/src/`
- Contains: Data models (Table, Row, User, etc.), API request/response types, SDK interfaces
- Depends on: Nothing (root of dependency graph)
- Used by: All packages

## Data Flow

**Request Handling (Standard CRUD):**

1. HTTP request arrives at Koa server (`packages/server/src/koa.ts`)
2. Middleware pipeline executes: body parsing, authentication, tenancy, authorization
3. Router matches request to controller function (`packages/server/src/api/routes/`)
4. Controller function called with `UserCtx` context (typed Koa context with user/request info)
5. Controller calls SDK methods (`packages/server/src/sdk/`) with context
6. SDK functions interact with database (`backend-core` for document queries) or integrations
7. Response formatted and returned to client

**Example Path:** `POST /api/tables` → Route → `tables.ts` controller → `sdk.tables.save()` → CouchDB update → Response

**Automation Execution (Event-Triggered):**

1. Event occurs (row saved, webhook received, scheduled trigger fires)
2. Event handler calls `automationQueue.add()` to enqueue job
3. Bull queue persists job to Redis and processes asynchronously
4. Worker thread executes automation via `processEvent()` in `packages/server/src/automations/utils.ts`
5. Automation steps (actions) execute sequentially, transforming data through pipeline
6. Results persisted back to database or sent to external service

**Tenancy & Context Flow:**

1. Middleware extracts tenant ID from request (URL, header, cookie)
2. `backend-core/context` manages request-scoped context with tenant/app/user info
3. All database operations automatically scoped to current tenant
4. Context persists across async operations via `context.doInTenant()` wrapper

**State Management:**

- **Redis:** Session storage, cache layer (e.g., formula compilation results), queue jobs
- **CouchDB:** Source of truth for all app data, documents, configurations
- **In-memory:** Request state via Koa context, SDK state during request lifecycle

## Key Abstractions

**UserCtx & Ctx:**
- Purpose: Type-safe Koa context extending with Budibase-specific properties
- Examples: `packages/types/src/sdk/koa.ts`
- Pattern: Controllers receive `UserCtx<RequestBody, ResponseBody, Params>` for authenticated endpoints, `Ctx<...>` for public
- Used in: All controller functions for HTTP request/response handling

**SDK Modules:**
- Purpose: Expose normalized API for resource operations
- Examples: `sdk.tables.save()`, `sdk.rows.search()`, `sdk.automations.fetch()`
- Pattern: Each module organized by resource type with CRUD operations
- Centralizes business logic and ensures consistent behavior across all access paths

**DocumentImpl Pattern (Backend-core):**
- Purpose: Abstraction over database operations
- Location: `packages/backend-core/src/db/couch/DatabaseImpl.ts`
- Pattern: Database implements document CRUD, query, bulk operations interface
- Used by: SDK layer for all database interactions

**Datasource/Integration Pattern:**
- Purpose: Pluggable connectors for external data sources
- Location: `packages/server/src/integrations/`
- Pattern: Each integration implements query execution, schema detection, connection testing
- Used by: Query builder, table creation from external schemas

**Event Emitter Pattern:**
- Purpose: Post-operation hooks and event publishing
- Located in: `packages/backend-core/src/events/`
- Pattern: SDK operations emit events (ROW_SAVE, TABLE_CREATE, etc.), listeners trigger automations
- Used by: Automation triggers, audit logging, pro features (quotas)

**Middleware Composition:**
- Purpose: Chainable request preprocessing
- Pattern: Koa middleware functions that `await next()` to continue pipeline
- Order matters: Auth before tenancy, tenancy before app operations
- Located in: `packages/server/src/middleware/`, `packages/backend-core/src/middleware/`

## Entry Points

**Server (API Service):**
- Location: `packages/server/src/index.ts`
- Triggers: Process startup, `yarn dev:server` or production deployment
- Responsibilities: Initialize database, load middleware, start HTTP server on port 4001, graceful shutdown

**Worker (Background Service):**
- Location: `packages/worker/src/index.ts`
- Triggers: Process startup, `yarn dev:server` (parallel process)
- Responsibilities: User/workspace management, admin endpoints, SCIM integration, event processing

**Builder (Frontend Dev Server):**
- Location: `packages/builder/src/main.js`
- Triggers: `yarn dev:builder` or Vite dev server
- Responsibilities: Serve editor UI, hot module reloading, API integration

**Startup Orchestration:**
- Location: `packages/server/src/startup/index.ts`
- Called from: `packages/server/src/app.ts` after Koa setup
- Sequence: Initialize routes, wait for migrations, check pro licensing, rehydrate scheduled automations, set state to "ready"

## Error Handling

**Strategy:** Try/catch with context-aware error responses

**Patterns:**
- Controllers wrap SDK calls in try/catch
- SDK functions throw typed errors (HTTPError with status code from backend-core)
- Middleware intercepts errors via `middleware.errorHandling` for consistent formatting
- Unhandled exceptions trigger graceful shutdown via process handlers in Koa/Worker setup

**Error Flow:** User error (validation) → `ctx.throw(400, message)` → Error middleware → JSON response with status code

## Cross-Cutting Concerns

**Logging:**
- Framework: Pino (via backend-core `middleware.pino`)
- Client code uses `console.log()` which is redirected to Pino in production
- Correlation IDs added via `middleware.correlation` for request tracing

**Validation:**
- Joi validators in middleware (`joi-validator.ts`)
- Zod validators in some newer endpoints (`zod-validator.ts`)
- Type-level validation via TypeScript types in request/response bodies

**Authentication:**
- Bearer token + API key support
- Session cookies with CSRF tokens
- Built by `auth.buildAuthMiddleware()` from backend-core
- Pro licensing integration

**Authorization:**
- Role-based access control (RBAC) via role IDs
- App-specific permissions checked by `api.controllers.permission`
- Tenancy middleware ensures app isolation

**Caching:**
- Redis for multi-tenant instance caching (formulas, views, auth tokens)
- In-memory for request lifecycle
- Cache invalidation via events (table update clears view caches)

---

*Architecture analysis: 2026-03-21*

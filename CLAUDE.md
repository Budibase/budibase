# Budibase Agent Guide

## Architecture

- Workspace uses Lerna monorepo with packages in `packages/`
- Main packages: server, worker, backend-core, frontend-core, client, builder, shared-core, bbui
- Use `@budibase/` scoped imports between packages
- Backend packages (NodeJS): server, worker, backend-core
- Frontend packages (browser): builder, frontend-core, bbui
- Shared (NodeJS and browser): shared-core

## Build/Test Commands

- Build: `yarn build`
- Lint: `yarn lint` (check) or `yarn lint:fix` (fix)
- Test: `yarn test <filename>` run inside of a packages/\* directory
- Type check: `yarn check:types`
- packages/server tests: if you're working on a test that uses the
  `datasourceDescribe` function, that means you can pass `DATASOURCE=` as an env
  var to the test to narrow it down to one specific database. The database strings
  you can use can be found on `DatabaseName` in `packages/server/src/integrations/tests/utils/index.ts`

## Code Style

- No semicolons, double quotes, 2-space tabs (see .prettierrc.json)
- Use TypeScript strict mode with consistent-type-imports
- Imports: Group external imports first, then internal `@budibase/*` packages
- Variables: camelCase, prefix unused with `_`
- Functions: Prefer arrow functions, use async/await over Promises
- Error handling: Use try/catch
- Types: Use `interface` for objects, `type` for unions/primitives, do NOT cast to any.
- Do not add backwards compatibility paths or broad "handle every scenario" logic unless explicitly instructed to do so for the task.
- Testing: Jest framework, use describe/it structure, mock external services
  using `nock`.
- Only comment when it's really necessary to explain an unclear behaviour.
- Never use console.log in tests, the output will not be visible in STDOUT
  when you run the tests. It is a waste of time.
- In application code use console.log instead of pino the logging framework.
  We have made it so that console.log statements are redirected to pino.
- When you're writing tests, you don't need to assert or do conditional checks
  on intermediate states. Just assert the final outcome
  against, provided there are no type errors.

## Test style - packages/server

- When building automations utilise the `createAutomationBuilder` function
  found in `packages/server/src/automations/tests/utilities/AutomationTestBuilder.ts`
- When building tables, datasources, queries and various other Budibase resources check for functions like `basicTable`
  found in `packages/server/src/tests/utilities/structures.ts` - use these to create a basic table, you can provide
  extended configuration if required through the `extra` prop.
- Use `TestConfiguration` in `packages/server/src/tests/TestConfiguration.ts` for every API test case -
  this can be used to access the test API under `new TestConfiguration().api`, a list of functions and
  request/response types can be found in `packages/server/src/tests/utilities/api`.

## Pull requests

- Always respect the format of pull_request_template.md. Some sections may not
  be required, you are free to ignore them. Don't add new sections, though.
- When you open a pull request, always open it as a draft so that it can be
  reviewed by a human.
- Before opening a pull request, always make sure that the branch you're pushing
  is up to date with master.
- If you're working on a bug, the name of the PR should start with the bug ID
  in square brackets, e.g. [BUDI-1234]. The link to the bug should go into the
  "Addresses" section of pull_request_template.md.

## Browser use

- If you're browsing the Budibase product in a browser, you can find
  comprehensive documentation at https://docs.budibase.com
- The local URL for the development server is http://localhost:10000. Before
  running `yarn dev`, check to see if the development server is already running.
- The default login for local development is email "local@budibase.com" and
  password "cheekychuckles".
- The product is split up by app, so to find things like data sources and
  automations you must first make sure to select an app.

## LiteLLM

- The LiteLLM API is available when in local development at localhost:4000
- The auth token is `budibase`

## Misc

- When creating or switching branches, make sure the branch is up to date with
  the remote on GitHub. Don't work on old code.

## Cursor Cloud specific instructions

### Services overview

| Service                  | Port  | Notes                                                          |
| ------------------------ | ----- | -------------------------------------------------------------- |
| Nginx proxy (main entry) | 10000 | Routes to builder, server, worker, CouchDB, MinIO              |
| Builder (Vite/Svelte)    | 3000  | Frontend dev server                                            |
| Server (Koa)             | 4001  | Backend API for apps                                           |
| Worker                   | 4002  | Background jobs; note `.env` sets `WORKER_PORT=4002`, not 4003 |
| CouchDB                  | 4005  | Primary database                                               |
| CouchDB SQS              | 4006  |                                                                |
| Redis                    | 6379  | Cache, sessions, queues                                        |
| MinIO                    | 4004  | S3-compatible object storage                                   |
| LiteLLM (optional)       | 4000  | AI proxy; see `## LiteLLM` section above for auth token        |

### Starting the dev environment

1. Docker must be running before `yarn dev`. The dev stack (CouchDB, Redis, MinIO, Nginx, optionally LiteLLM) is started automatically by `yarn dev` via `packages/server/scripts/dev/manage.js`.
2. `yarn dev` runs: `dev:init` (generates `.env`), `kill-all` (frees ports), `prebuild`, then starts server + worker + builder via `lerna run --stream dev`.
3. The worker listens on port **4002** (set by `WORKER_PORT` in `.env`), not 4003. Health check: `curl http://localhost:4002/health`.
4. Server health check: `curl http://localhost:4001/health`.
5. Full app is accessible at `http://localhost:10000` via the Nginx proxy.

### Running tests

- Run package-specific tests from inside the package directory: `cd packages/<pkg> && yarn test <filename>`.
- `packages/server` and `packages/backend-core` tests use `scripts/test.sh` wrappers around Jest.
- `shared-core` and `string-templates` tests run directly via `jest`.

### Docker in Cloud VM

Docker is installed and configured with `fuse-overlayfs` storage driver and `iptables-legacy` for the nested container environment. The Docker daemon must be started with `sudo dockerd` before use. Socket permissions are set via `chmod 666 /var/run/docker.sock` so `docker` commands work without `sudo`.

### Gotchas

- `lerna` is a devDependency and not globally installed. The `yarn dev` script works because `yarn` resolves local bins, but if running `lerna` directly, use `npx lerna` or `yarn lerna`.
- The `postinstall` hook runs `husky install` for git hooks. Pre-push hook requires `git-lfs`.
- Build is required before `yarn dev` for the first time: `yarn build`. Subsequent runs use nodemon for hot-reload of server/worker, but changes to shared packages (types, shared-core, backend-core) may require a rebuild.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Budibase Hardened Image Pipeline**

A security hardening pipeline that publishes vulnerability-patched Docker images alongside the standard Budibase releases. For each release of budibase/apps, budibase/worker, and budibase/database, a corresponding `-hardened` tagged image is built with all HIGH/CRITICAL vulnerabilities remediated. Targets the existing GitLab/Gravity scanning pipeline requirements.

**Core Value:** Every hardened image passes Trivy and Grype HIGH/CRITICAL scans with zero findings.

### Constraints

- **Separate files**: Hardened Dockerfiles must not modify existing Dockerfiles — kept as Dockerfile.hardened alongside originals
- **Same registry**: Hardened images published to same Docker Hub repos (budibase/apps, budibase/worker, budibase/database)
- **Tag convention**: `{version}-hardened` suffix (e.g. 3.0.0-hardened)
- **CI pattern**: GitHub Actions in this repo triggers budibase-deploys via repository_dispatch (same pattern as existing releases)
- **Remote workflows**: Placed in a directory in this repo for manual transfer to budibase-deploys
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9.2 - Used throughout server, backend-core, worker, and frontend packages
- Svelte 5.40.2 - UI framework for builder frontend and bbui component library
- JavaScript - Build scripts and configuration files
- SQL - Via Knex query builder for multiple database support
- YAML - Configuration and automation definitions
- XML - Data parsing and REST API handling
## Runtime
- Node.js 22.18.0 (specified in `package.json` engines: `>=22.0.0 <23.0.0`)
- Configured via `.nvmrc` at repo root
- Yarn 1.x (workspace monorepo setup)
- Lockfile: `yarn.lock` present (committed)
## Frameworks
- Koa 3.1.2 - Web framework for server and worker (`packages/server`, `packages/worker`)
- Vite 7.1.11 - Build tool and dev server for builder, client, bbui, frontend-core
- Svelte 5.40.2 - Reactive UI components
- `svelte-check` 4.3.1 - Svelte type checking
- PostHog JS 1.118.0 - Analytics
- Jest 30.0.5 - Test runner for backend packages
- Vitest 3.2.4 - Test runner for frontend packages (builder, client, frontend-core)
- Testing Library - DOM and Svelte component testing
- ESLint 9.26.0 - Linting with TypeScript support
- Prettier 3.5.3 - Code formatting (configured in `.prettierrc.json`)
- SWC 1.13.5 - Fast JavaScript/TypeScript compiler
- Lerna 9.0.3 - Monorepo management
- NX - Build orchestration (nx.json configs in packages)
## Key Dependencies
- `@budibase/nano` 10.1.5 - CouchDB nano client wrapper
- `pouchdb` 9.0.0 - Document database for offline support
- `pouchdb-find` 9.0.0 - PouchDB find plugin
- `ioredis` 5.3.2 - Redis client
- `redis` 4.x - Redis support (also listed as dependency)
- `bull` 4.10.1 - Job queue library
- `pg` 8.10.0 - PostgreSQL
- `mysql2` 3.9.8 - MySQL
- `mongodb` 6.7.0 - MongoDB
- `mssql` 11.0.1 - Microsoft SQL Server
- `oracledb` 6.5.1 - Oracle Database
- `snowflake-sdk` 1.15.0 - Snowflake
- `arangojs` 7.2.0 - ArangoDB (deprecated)
- `airtable` 0.12.2 - Airtable API client (deprecated)
- `@elastic/elasticsearch` 7.10.0 - Elasticsearch
- `knex` 2.4.2 - SQL query builder (used for all SQL databases)
- `ai` 6.0.116 - Unified AI SDK (Vercel)
- `@ai-sdk/openai` 3.0.41 - OpenAI provider for AI SDK
- `@ai-sdk/provider` 3.0.8 - AI SDK provider interface
- `@ai-sdk/svelte` 4.0.116 - Svelte AI SDK integration
- `openai` 6.32.0 - Direct OpenAI client (legacy)
- `@aws-sdk/client-s3` 3.709.0 - AWS S3 client
- `@aws-sdk/client-dynamodb` 3.709.0 - AWS DynamoDB client
- `@aws-sdk/lib-dynamodb` 3.709.0 - DynamoDB document client
- `@aws-sdk/s3-request-presigner` 3.709.0 - S3 presigned URLs
- `@aws-sdk/lib-storage` 3.709.0 - S3 multipart upload
- `pdf-parse` 2.4.5 - PDF text extraction
- `csvtojson` 2.0.13 - CSV parsing
- `archiver` 7.0.1 - ZIP archive creation
- `extract-zip` 2.0.1 - ZIP extraction
- `socket.io` 4.8.1 - Real-time bidirectional communication
- `@socket.io/redis-adapter` 8.2.1 - Redis adapter for Socket.IO
- `socket.io-client` 4.7.5 - Socket.IO client (frontend)
- `chat` 4.20.0 - Chat protocol/framework
- `@chat-adapter/discord` 4.20.0 - Discord chat adapter
- `@chat-adapter/slack` 4.20.0 - Slack chat adapter
- `@chat-adapter/teams` 4.20.0 - Microsoft Teams chat adapter
- `@chat-adapter/state-ioredis` 4.20.0 - Redis state for chat adapters
- `@chat-adapter/state-memory` 4.20.0 - In-memory state for chat adapters
- `nodemailer` 7.0.11 - Email sending (in worker package)
- `mailparser` 3.7.2 - Email parsing
- `imapflow` 1.1.0 - IMAP email protocol
- `html-to-text` 9.0.5 - HTML to text conversion
- `ical-generator` 4.1.0 - iCalendar generation
- `bcrypt` 6.0.0 - Password hashing
- `jsonwebtoken` 9.0.2 - JWT signing/verification
- `koa-passport` 6.0.0 - Passport authentication middleware
- `passport-google-oauth` 2.0.0 - Google OAuth
- `passport-local` 1.0.0 - Local username/password strategy
- `passport-oauth2-refresh` 2.1.0 - OAuth token refresh
- `@govtechsg/passport-openidconnect` 1.0.3 - OpenID Connect strategy
- `@azure/msal-node` 2.5.1 - Azure/Microsoft authentication
- `google-auth-library` 10.5.0 - Google authentication library
- `google-spreadsheet` (npm: @budibase/google-spreadsheet@4.1.5) - Google Sheets integration
- `node-fetch` 2.6.7 - Fetch API for Node.js
- `undici` 7.16.0 - High-performance HTTP client
- `curlconverter` 3.21.0 - Convert cURL to code
- `@apidevtools/swagger-parser` 12.1.0 - Swagger/OpenAPI parsing
- `isolated-vm` 6.0.1 - Sandboxed JavaScript VM for user code execution
- `worker-farm` 1.7.0 - Worker process management
- `bson` 6.9.0 - BSON serialization
- `xml2js` 0.6.2 - XML to JSON conversion
- `jsonschema` 1.4.0 - JSON Schema validation
- `joi` 17.6.0 - Data validation
- `zod` 4.2.1 - TypeScript-first schema validation
- `dayjs` 1.10.8 - Date manipulation (lightweight alternative to Moment)
- Adobe Spectrum CSS components (extensive @spectrum-css/* packages) - Design system
- `atrament` 4.3.0 - Drawing library
- `date-fns` 4.1.0 - Date utilities
- `easymde` 2.16.1 - Markdown editor
- `svelte-portal` 2.2.1 - Svelte portal component
- `svelte-dnd-action` 0.9.64 - Drag and drop
- `svelte-loading-spinners` 0.3.6 - Loading spinners
- `@xyflow/svelte` 0.1.39 - Graph visualization
- `@dagrejs/dagre` 1.1.4 - Graph layout algorithm
- `@codemirror/*` (multiple packages) - Code editor for SQL/JSON/JavaScript
- `sanitize-html` 2.13.0 - HTML sanitization
- `downloadjs` 1.4.7 - File download utility
- `lodash` 4.17.23 - Utility functions
- `uuid` 8.3.2 - UUID generation
- `semver` 7.5.4 - Semantic versioning
- `validate.js` 0.13.1 - Validation library
- `js-yaml` 4.1.1 - YAML parsing
- `dd-trace` 5.63.0 - Datadog APM tracing
- `pino` 8.11.0 - Logging framework (with pino-http)
- `pino-http` 8.3.3 - HTTP request logging
- `rotating-file-stream` 3.1.0 - Log file rotation
- `correlation-id` 4.0.0 - Request correlation tracking
- Rollup - Module bundler for string-templates and SDK
- `@roxi/routify` 2.18.18 - Svelte file-based routing (builder)
- `ts-node` 10.8.1 - TypeScript execution
- `nodemon` 2.0.15 - File watching and auto-restart
- `rimraf` 3.0.2 - Cross-platform file deletion
- `copyfiles` 2.4.1 - File copying
## Configuration
- `.env` file loading via `dotenv` (development only in `src/environment.ts`)
- Environment variables documented in `packages/server/src/environment.ts`
- Key env vars: `COUCH_DB_URL`, `REDIS_URL`, `MINIO_URL`, `WORKER_URL`, `AWS_REGION`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- LiteLLM configuration: `LITELLM_URL`, `LITELLM_MASTER_KEY`, `BBAI_LITELLM_KEY`
- `tsconfig.json` - TypeScript configuration in each package
- `tsconfig.build.json` - Build-specific TypeScript config
- `.prettierrc.json` - Prettier formatting rules (no semicolons, 2-space indent)
- ESLint config in `eslint.config.mjs` (ESLint 9 flat config)
- Jest config in `jest.config.ts` in backend packages
- Vitest config in `vite.config.mjs` in frontend packages
- Backend: TypeScript compiled to `dist/` directory
- Frontend (builder): Vite builds to `dist/` with assets
- Library packages export both CommonJS and ESM formats
## Platform Requirements
- Node.js 22.18.0 (exact version for consistency)
- Yarn package manager
- Docker (for dev services: CouchDB, Redis, MinIO, Nginx)
- Git LFS (required for pre-push hook)
- Node.js 22.x runtime
- CouchDB 2.1.0+ (primary document database via nano/pouchdb)
- Redis 4.x (caching, sessions, queues)
- MinIO or AWS S3 (file storage)
- PostgreSQL/MySQL/MongoDB/etc. (optional data source connections)
- SMTP server (optional for email automation)
- Nginx proxy (port 10000) - routes to services
- Builder frontend (port 3000) - Vite dev server
- Server (port 4001) - Koa API
- Worker (port 4002) - Background jobs
- CouchDB (port 4005) - Primary database
- CouchDB SQS (port 4006) - Change stream processor
- Redis (port 6379) - Cache and sessions
- MinIO (port 4004) - S3-compatible storage
- LiteLLM (port 4000, optional) - AI proxy
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- kebab-case for most files: `authorized.ts`, `joi-validator.ts`, `workspaceMigrations.ts`
- Camel case for utility/service files: `structures.ts`, `helpers.ts`
- Index files: `index.ts` for barrel exports in key directories like `src/sdk/index.ts`, `src/db/index.ts`, `src/api/index.ts`
- Test files: Use `.spec.ts` suffix: `workspaceMigrations.spec.ts`, `activation.spec.ts`
- camelCase for all function names: `skipMigrationRedirect()`, `checkAuthorized()`, `prioritisedArraySort()`
- Prefer arrow functions over function declarations: `const authorized = (...) => async (ctx, next) => {}`
- Private/internal functions use camelCase: `checkAuthorizedResource()`, `getBaseLimit()`
- Factory functions return higher-order functions: `authorized()` returns middleware function
- camelCase for all variable names: `resourceRoles`, `userRoles`, `permError`, `envLimit`
- Prefix unused parameters/variables with underscore: `_`, example `argsIgnorePattern: "^_"` in eslint config
- Constants in UPPER_SNAKE_CASE: `DEFAULT_WORKSPACE_NAME`, `WEBHOOK_ENDPOINTS`, `COUNT_FIELD_NAME`, `MOCK_REDIS`
- PascalCase for type names: `UserCtx`, `AutomationTrigger`, `AutomationStep`, `SearchFilters`
- Use `interface` for object shapes, `type` for unions/primitives
- No type casting to `any` — use strict TypeScript with proper typing
## Code Style
- Prettier (`.prettierrc.json`):
- ESLint with TypeScript support (`eslint.config.mjs`):
## Import Organization
- `@budibase/backend-core`: Backend utilities and core functionality
- `@budibase/shared-core`: Code used in both Node.js and browser
- `@budibase/types`: Type definitions
- `@budibase/pro`: Pro features
- Destructure imports: `import { x, y, z } from "module"` rather than importing full modules
- Lint rule `local-rules/no-barrel-imports` prevents `import * from "./index"` and `import { x } from "."` (must be explicit paths)
## Error Handling
- Use `try/catch` for async operations: Standard error catching approach
- Koa middleware context errors: `ctx.throw(statusCode, message)` — returns HTTP error to client
- Throw errors directly in non-middleware: `throw err` for re-throwing
- Conditional error handling: Check for specific error scenarios before catching
## Logging
- Note: `console.log` statements are redirected to pino logging framework at runtime
- Use `console.error` for error logging in frontend/builder (backend uses console.log)
- No `console.log` in tests — output is not visible in STDOUT
- Log important state changes and API interactions
- Use console.log: `console.log("message")`
- Use console.error: `console.error("error message")` in frontend/builder packages only
## Comments
- Only when behavior is unclear or non-obvious
- Avoid commenting obvious code
- Use single-line comments for clarification
- Not consistently used — add when documenting complex functions
- Keep focused on explaining the "why" not the "what"
## Function Design
- Aim for focused functions with single responsibility
- Example: `checkAuthorized()`, `checkAuthorizedResource()` — split concerns
- Helper functions break down complex logic (e.g., `getBaseLimit()`, `getRelationshipLimit()`)
- Type all parameters with TypeScript (no `any`)
- Destructure objects when possible
- Use options objects for optional parameters: `opts = { schema: false }`
- Explicit return types for functions
- Async functions return Promises
- Higher-order functions return functions: `(ctx, next) => { ... }`
## Module Design
- Named exports preferred: `export const authorizedMiddleware = (...)`
- Barrel files (`index.ts`) re-export from modules for public APIs: `src/sdk/index.ts`
- Default exports used for simple modules
- Strategic use in key directories: `src/sdk/`, `src/api/`, `src/db/`
- Central aggregation point for package exports
- Linting rule prevents importing from barrel files in source code (for better tree-shaking)
## Monorepo Patterns
- Backend packages: `server`, `worker`, `backend-core` (Node.js)
- Frontend packages: `builder`, `frontend-core`, `bbui` (browser)
- Shared packages: `shared-core` (browser + Node.js), `types`, `string-templates`
- Use `@budibase/` scoped imports between packages: `import { x } from "@budibase/backend-core"`
- Use `consistent-type-imports` rule: `import type { X }` for types
- Reduces runtime bundle size by excluding type imports
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Microservice-style separation: `server` (API), `worker` (background tasks)
- Shared libraries: `backend-core` (NodeJS utilities), `types` (TypeScript definitions), `shared-core` (cross-platform)
- Frontend packages: `builder` (UI editor), `bbui` (component library), `frontend-core` (browser utilities)
- Strongly typed with TypeScript strict mode and consistent-type-imports
- Koa-based HTTP servers with graceful shutdown handling
- CouchDB as primary database with PouchDB for local/testing
- Redis for caching, sessions, and queue management
- Bull/BullMQ for async task processing
## Layers
- Purpose: HTTP request handling, routing, authentication, response formatting
- Location: `packages/server/src/api/`, `packages/server/src/middleware/`
- Contains: Route definitions, controller functions, endpoint handlers
- Depends on: SDK layer, backend-core, types, middleware utilities
- Used by: Browser clients, external API consumers
- Purpose: Centralized API for app operations, data manipulation, resource management
- Location: `packages/server/src/sdk/`
- Contains: Modular functions organized by domain (tables, rows, queries, automations, datasources, users, etc.)
- Depends on: Database layer, backend-core, types, integrations
- Used by: Controllers, automations, event handlers
- Purpose: Parse requests, call SDK functions, format responses
- Location: `packages/server/src/api/controllers/`
- Contains: Functions like `fetch()`, `create()`, `update()`, `delete()` organized by resource type
- Depends on: SDK, types, validation utilities
- Used by: Router middleware that maps routes to controllers
- Purpose: Document database abstraction
- Location: `packages/backend-core/src/db/` (CouchDB implementation), `packages/server/src/db/`
- Contains: CouchDB initialization, view queries, connection pooling
- Depends on: PouchDB for client, Node libraries for server
- Used by: SDK functions for document persistence
- Purpose: External data source connections (SQL databases, REST APIs, cloud services)
- Location: `packages/server/src/integrations/`
- Contains: Drivers for MySQL, PostgreSQL, Oracle, Firebase, S3, Airtable, Google Sheets, MongoDB, Snowflake, etc.
- Depends on: SDK datasource management, types
- Used by: Query execution, data fetch operations
- Purpose: Request preprocessing, authentication, authorization, error handling
- Location: `packages/server/src/middleware/`, `packages/backend-core/src/middleware/`
- Contains: Auth middleware, tenancy middleware, CSRF validation, error handling, cleanup
- Depends on: backend-core auth, types
- Used by: Koa app initialization in `packages/server/src/koa.ts`
- Purpose: Background job processing, scheduled tasks, event-driven actions
- Location: `packages/server/src/automations/`, `packages/server/src/automations/bullboard.ts`
- Contains: Automation triggers, actions, Bull queue configuration
- Depends on: Redis, SDK, backend-core queue utilities
- Used by: Server startup, webhook endpoints
- Purpose: Separate process for background tasks and admin operations
- Location: `packages/worker/src/`
- Contains: User management, workspace setup, migrations, SCIM endpoints
- Depends on: backend-core, types, pro modules
- Used by: Server for async operations, scheduled jobs
- Purpose: Low-code UI editor and component studio
- Location: `packages/builder/src/`
- Contains: Svelte pages, stores, components, API client integration
- Depends on: frontend-core, bbui components, shared-core, types
- Used by: Developers building Budibase apps
- Purpose: Reusable browser utilities and API client
- Location: `packages/frontend-core/src/`
- Contains: API fetching, store management, component base classes, themes
- Depends on: types, shared-core
- Used by: builder, client, other frontend packages
- Purpose: Logic and constants used across NodeJS and browser
- Location: `packages/shared-core/src/`
- Contains: Automation definitions, filter logic, helper functions, type exports
- Depends on: types only
- Used by: All packages
- Purpose: Central TypeScript type definitions
- Location: `packages/types/src/`
- Contains: Data models (Table, Row, User, etc.), API request/response types, SDK interfaces
- Depends on: Nothing (root of dependency graph)
- Used by: All packages
## Data Flow
- **Redis:** Session storage, cache layer (e.g., formula compilation results), queue jobs
- **CouchDB:** Source of truth for all app data, documents, configurations
- **In-memory:** Request state via Koa context, SDK state during request lifecycle
## Key Abstractions
- Purpose: Type-safe Koa context extending with Budibase-specific properties
- Examples: `packages/types/src/sdk/koa.ts`
- Pattern: Controllers receive `UserCtx<RequestBody, ResponseBody, Params>` for authenticated endpoints, `Ctx<...>` for public
- Used in: All controller functions for HTTP request/response handling
- Purpose: Expose normalized API for resource operations
- Examples: `sdk.tables.save()`, `sdk.rows.search()`, `sdk.automations.fetch()`
- Pattern: Each module organized by resource type with CRUD operations
- Centralizes business logic and ensures consistent behavior across all access paths
- Purpose: Abstraction over database operations
- Location: `packages/backend-core/src/db/couch/DatabaseImpl.ts`
- Pattern: Database implements document CRUD, query, bulk operations interface
- Used by: SDK layer for all database interactions
- Purpose: Pluggable connectors for external data sources
- Location: `packages/server/src/integrations/`
- Pattern: Each integration implements query execution, schema detection, connection testing
- Used by: Query builder, table creation from external schemas
- Purpose: Post-operation hooks and event publishing
- Located in: `packages/backend-core/src/events/`
- Pattern: SDK operations emit events (ROW_SAVE, TABLE_CREATE, etc.), listeners trigger automations
- Used by: Automation triggers, audit logging, pro features (quotas)
- Purpose: Chainable request preprocessing
- Pattern: Koa middleware functions that `await next()` to continue pipeline
- Order matters: Auth before tenancy, tenancy before app operations
- Located in: `packages/server/src/middleware/`, `packages/backend-core/src/middleware/`
## Entry Points
- Location: `packages/server/src/index.ts`
- Triggers: Process startup, `yarn dev:server` or production deployment
- Responsibilities: Initialize database, load middleware, start HTTP server on port 4001, graceful shutdown
- Location: `packages/worker/src/index.ts`
- Triggers: Process startup, `yarn dev:server` (parallel process)
- Responsibilities: User/workspace management, admin endpoints, SCIM integration, event processing
- Location: `packages/builder/src/main.js`
- Triggers: `yarn dev:builder` or Vite dev server
- Responsibilities: Serve editor UI, hot module reloading, API integration
- Location: `packages/server/src/startup/index.ts`
- Called from: `packages/server/src/app.ts` after Koa setup
- Sequence: Initialize routes, wait for migrations, check pro licensing, rehydrate scheduled automations, set state to "ready"
## Error Handling
- Controllers wrap SDK calls in try/catch
- SDK functions throw typed errors (HTTPError with status code from backend-core)
- Middleware intercepts errors via `middleware.errorHandling` for consistent formatting
- Unhandled exceptions trigger graceful shutdown via process handlers in Koa/Worker setup
## Cross-Cutting Concerns
- Framework: Pino (via backend-core `middleware.pino`)
- Client code uses `console.log()` which is redirected to Pino in production
- Correlation IDs added via `middleware.correlation` for request tracing
- Joi validators in middleware (`joi-validator.ts`)
- Zod validators in some newer endpoints (`zod-validator.ts`)
- Type-level validation via TypeScript types in request/response bodies
- Bearer token + API key support
- Session cookies with CSRF tokens
- Built by `auth.buildAuthMiddleware()` from backend-core
- Pro licensing integration
- Role-based access control (RBAC) via role IDs
- App-specific permissions checked by `api.controllers.permission`
- Tenancy middleware ensures app isolation
- Redis for multi-tenant instance caching (formulas, views, auth tokens)
- In-memory for request lifecycle
- Cache invalidation via events (table update clears view caches)
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

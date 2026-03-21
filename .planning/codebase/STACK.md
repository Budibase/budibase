# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript 5.9.2 - Used throughout server, backend-core, worker, and frontend packages
- Svelte 5.40.2 - UI framework for builder frontend and bbui component library
- JavaScript - Build scripts and configuration files

**Secondary:**
- SQL - Via Knex query builder for multiple database support
- YAML - Configuration and automation definitions
- XML - Data parsing and REST API handling

## Runtime

**Environment:**
- Node.js 22.18.0 (specified in `package.json` engines: `>=22.0.0 <23.0.0`)
- Configured via `.nvmrc` at repo root

**Package Manager:**
- Yarn 1.x (workspace monorepo setup)
- Lockfile: `yarn.lock` present (committed)

## Frameworks

**Backend:**
- Koa 3.1.2 - Web framework for server and worker (`packages/server`, `packages/worker`)
  - `@koa/router` 15.3.0 - Request routing
  - `koa-body` 7.0.1 - Body parsing
  - `koa-compress` 4.0.1 - Response compression
  - `koa-useragent` 4.1.0 - User agent detection
  - `koa-session` 5.13.1 - Session management
  - `koa-redis` 4.0.1 - Redis session store
  - `@koa/cors` 5.0.0 - CORS middleware

**Frontend:**
- Vite 7.1.11 - Build tool and dev server for builder, client, bbui, frontend-core
- Svelte 5.40.2 - Reactive UI components
- `svelte-check` 4.3.1 - Svelte type checking
- PostHog JS 1.118.0 - Analytics

**Testing:**
- Jest 30.0.5 - Test runner for backend packages
  - `@swc/jest` 0.2.39 - Fast TypeScript transpilation in tests
  - `supertest` 6.3.3 - HTTP assertion library
  - `nock` 13.5.4 - HTTP mocking
  - `timekeeper` 2.2.0 - Time mocking
- Vitest 3.2.4 - Test runner for frontend packages (builder, client, frontend-core)
- Testing Library - DOM and Svelte component testing

**Build & Code Quality:**
- ESLint 9.26.0 - Linting with TypeScript support
- Prettier 3.5.3 - Code formatting (configured in `.prettierrc.json`)
- SWC 1.13.5 - Fast JavaScript/TypeScript compiler
- Lerna 9.0.3 - Monorepo management
- NX - Build orchestration (nx.json configs in packages)

## Key Dependencies

**Critical Infrastructure:**
- `@budibase/nano` 10.1.5 - CouchDB nano client wrapper
- `pouchdb` 9.0.0 - Document database for offline support
- `pouchdb-find` 9.0.0 - PouchDB find plugin
- `ioredis` 5.3.2 - Redis client
- `redis` 4.x - Redis support (also listed as dependency)
- `bull` 4.10.1 - Job queue library

**Database Drivers:**
- `pg` 8.10.0 - PostgreSQL
- `mysql2` 3.9.8 - MySQL
- `mongodb` 6.7.0 - MongoDB
- `mssql` 11.0.1 - Microsoft SQL Server
- `oracledb` 6.5.1 - Oracle Database
- `snowflake-sdk` 1.15.0 - Snowflake
- `arangojs` 7.2.0 - ArangoDB (deprecated)
- `airtable` 0.12.2 - Airtable API client (deprecated)
- `@elastic/elasticsearch` 7.10.0 - Elasticsearch

**ORM & Query Building:**
- `knex` 2.4.2 - SQL query builder (used for all SQL databases)

**AI & LLM:**
- `ai` 6.0.116 - Unified AI SDK (Vercel)
- `@ai-sdk/openai` 3.0.41 - OpenAI provider for AI SDK
- `@ai-sdk/provider` 3.0.8 - AI SDK provider interface
- `@ai-sdk/svelte` 4.0.116 - Svelte AI SDK integration
- `openai` 6.32.0 - Direct OpenAI client (legacy)

**File Storage & Processing:**
- `@aws-sdk/client-s3` 3.709.0 - AWS S3 client
- `@aws-sdk/client-dynamodb` 3.709.0 - AWS DynamoDB client
- `@aws-sdk/lib-dynamodb` 3.709.0 - DynamoDB document client
- `@aws-sdk/s3-request-presigner` 3.709.0 - S3 presigned URLs
- `@aws-sdk/lib-storage` 3.709.0 - S3 multipart upload
- `pdf-parse` 2.4.5 - PDF text extraction
- `csvtojson` 2.0.13 - CSV parsing
- `archiver` 7.0.1 - ZIP archive creation
- `extract-zip` 2.0.1 - ZIP extraction

**Communication & Webhooks:**
- `socket.io` 4.8.1 - Real-time bidirectional communication
- `@socket.io/redis-adapter` 8.2.1 - Redis adapter for Socket.IO
- `socket.io-client` 4.7.5 - Socket.IO client (frontend)
- `chat` 4.20.0 - Chat protocol/framework
- `@chat-adapter/discord` 4.20.0 - Discord chat adapter
- `@chat-adapter/slack` 4.20.0 - Slack chat adapter
- `@chat-adapter/teams` 4.20.0 - Microsoft Teams chat adapter
- `@chat-adapter/state-ioredis` 4.20.0 - Redis state for chat adapters
- `@chat-adapter/state-memory` 4.20.0 - In-memory state for chat adapters

**Email & Messaging:**
- `nodemailer` 7.0.11 - Email sending (in worker package)
- `mailparser` 3.7.2 - Email parsing
- `imapflow` 1.1.0 - IMAP email protocol
- `html-to-text` 9.0.5 - HTML to text conversion
- `ical-generator` 4.1.0 - iCalendar generation

**Authentication & Security:**
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

**API & HTTP:**
- `node-fetch` 2.6.7 - Fetch API for Node.js
- `undici` 7.16.0 - High-performance HTTP client
- `curlconverter` 3.21.0 - Convert cURL to code
- `@apidevtools/swagger-parser` 12.1.0 - Swagger/OpenAPI parsing

**Code Execution & Sandboxing:**
- `isolated-vm` 6.0.1 - Sandboxed JavaScript VM for user code execution
- `worker-farm` 1.7.0 - Worker process management

**Data & Serialization:**
- `bson` 6.9.0 - BSON serialization
- `xml2js` 0.6.2 - XML to JSON conversion
- `jsonschema` 1.4.0 - JSON Schema validation
- `joi` 17.6.0 - Data validation
- `zod` 4.2.1 - TypeScript-first schema validation

**Date & Time:**
- `dayjs` 1.10.8 - Date manipulation (lightweight alternative to Moment)

**UI & Components:**
- Adobe Spectrum CSS components (extensive @spectrum-css/* packages) - Design system
  - 30+ @spectrum-css packages for components (buttons, tables, forms, etc.)
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

**Utilities:**
- `lodash` 4.17.23 - Utility functions
- `uuid` 8.3.2 - UUID generation
- `semver` 7.5.4 - Semantic versioning
- `validate.js` 0.13.1 - Validation library
- `js-yaml` 4.1.1 - YAML parsing

**Monitoring & Observability:**
- `dd-trace` 5.63.0 - Datadog APM tracing
- `pino` 8.11.0 - Logging framework (with pino-http)
- `pino-http` 8.3.3 - HTTP request logging
- `rotating-file-stream` 3.1.0 - Log file rotation
- `correlation-id` 4.0.0 - Request correlation tracking

**Development & Build:**
- Rollup - Module bundler for string-templates and SDK
- `@roxi/routify` 2.18.18 - Svelte file-based routing (builder)
- `ts-node` 10.8.1 - TypeScript execution
- `nodemon` 2.0.15 - File watching and auto-restart
- `rimraf` 3.0.2 - Cross-platform file deletion
- `copyfiles` 2.4.1 - File copying

## Configuration

**Environment:**
- `.env` file loading via `dotenv` (development only in `src/environment.ts`)
- Environment variables documented in `packages/server/src/environment.ts`
- Key env vars: `COUCH_DB_URL`, `REDIS_URL`, `MINIO_URL`, `WORKER_URL`, `AWS_REGION`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- LiteLLM configuration: `LITELLM_URL`, `LITELLM_MASTER_KEY`, `BBAI_LITELLM_KEY`

**Build:**
- `tsconfig.json` - TypeScript configuration in each package
- `tsconfig.build.json` - Build-specific TypeScript config
- `.prettierrc.json` - Prettier formatting rules (no semicolons, 2-space indent)
- ESLint config in `eslint.config.mjs` (ESLint 9 flat config)
- Jest config in `jest.config.ts` in backend packages
- Vitest config in `vite.config.mjs` in frontend packages

**Build Output:**
- Backend: TypeScript compiled to `dist/` directory
- Frontend (builder): Vite builds to `dist/` with assets
- Library packages export both CommonJS and ESM formats

## Platform Requirements

**Development:**
- Node.js 22.18.0 (exact version for consistency)
- Yarn package manager
- Docker (for dev services: CouchDB, Redis, MinIO, Nginx)
- Git LFS (required for pre-push hook)

**Production:**
- Node.js 22.x runtime
- CouchDB 2.1.0+ (primary document database via nano/pouchdb)
- Redis 4.x (caching, sessions, queues)
- MinIO or AWS S3 (file storage)
- PostgreSQL/MySQL/MongoDB/etc. (optional data source connections)
- SMTP server (optional for email automation)

**Services (Docker-based dev stack):**
- Nginx proxy (port 10000) - routes to services
- Builder frontend (port 3000) - Vite dev server
- Server (port 4001) - Koa API
- Worker (port 4002) - Background jobs
- CouchDB (port 4005) - Primary database
- CouchDB SQS (port 4006) - Change stream processor
- Redis (port 6379) - Cache and sessions
- MinIO (port 4004) - S3-compatible storage
- LiteLLM (port 4000, optional) - AI proxy

---

*Stack analysis: 2026-03-21*

# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Databases & Data Sources:**
- PostgreSQL - via `pg` driver in `packages/server/src/integrations/postgres.ts`
- MySQL - via `mysql2` driver in `packages/server/src/integrations/mysql.ts`
- MongoDB - via `mongodb` driver in `packages/server/src/integrations/mongodb.ts`
- Microsoft SQL Server - via `mssql` driver in `packages/server/src/integrations/microsoftSqlServer.ts`
- Oracle Database - via `oracledb` driver in `packages/server/src/integrations/oracle.ts`
- Snowflake - via `snowflake-sdk` in `packages/server/src/integrations/snowflake.ts`
- ArangoDB - via `arangojs` in `packages/server/src/integrations/arangodb.ts` (deprecated)
- Airtable - via `airtable` package in `packages/server/src/integrations/airtable.ts` (deprecated)
- Elasticsearch - via `@elastic/elasticsearch` in `packages/server/src/integrations/elasticsearch.ts`
- Firebase/Firestore - via `@google-cloud/firestore` in `packages/server/src/integrations/firebase.ts`
- Google Sheets - via custom `@budibase/google-spreadsheet` wrapper in `packages/server/src/integrations/googlesheets.ts`
- Redis - via `redis` and `ioredis` in `packages/server/src/integrations/redis.ts`
- CouchDB - via `@budibase/nano` in `packages/server/src/integrations/couchdb.ts`
- REST API - universal HTTP client in `packages/server/src/integrations/rest.ts`

**Integration Hub:**
- Location: `packages/server/src/integrations/`
- Registry: `packages/server/src/integrations/index.ts` - maps `SourceName` enum to integration classes
- Query execution via `DatasourcePlus` interface with `query()` method

**Cloud Storage:**
- AWS S3 - via `@aws-sdk/client-s3` in `packages/server/src/integrations/s3.ts`
  - Presigned URLs: `@aws-sdk/s3-request-presigner`
  - Multipart uploads: `@aws-sdk/lib-storage`
- MinIO - S3-compatible interface, same SDK
- File attachment storage: Budibase stores in MinIO/S3 bucket
  - Temp bucket: `tmp-file-attachments`

**AI & Language Models:**
- OpenAI - via `openai` package (direct client)
  - Located: `packages/server/src/tests/utilities/mocks/ai/openai.ts`
  - Models: GPT-4, GPT-3.5-turbo supported
- Vercel AI SDK - via `ai` and `@ai-sdk/openai` packages
  - Unified AI interface in `packages/server/src/sdk/workspace/ai/`
  - OpenAI provider wrapper in `packages/server/src/sdk/workspace/ai/llm/litellm.ts`
- LiteLLM - Proxy service for multiple LLM providers
  - Config: `packages/server/src/sdk/workspace/ai/configs/litellm.ts`
  - Default endpoint: `http://localhost:4000` (configurable via `LITELLM_URL`)
  - Auth: `LITELLM_MASTER_KEY` environment variable
  - Budibase AI: `BBAI_LITELLM_KEY` for internal use

**Communication & Chat:**
- Discord - via `@chat-adapter/discord@4.20.0`
  - Agent endpoint: `packages/server/src/api/routes/tests/ai/agentDiscord.spec.ts`
  - Webhook handler: `packages/server/src/api/controllers/webhook/discord.ts`
- Slack - via `@chat-adapter/slack@4.20.0`
  - Agent endpoint: `packages/server/src/api/routes/tests/ai/agentSlack.spec.ts`
  - Webhook handler: `packages/server/src/api/controllers/webhook/slack.ts`
- Microsoft Teams - via `@chat-adapter/teams@4.20.0`
  - Agent endpoint: `packages/server/src/api/routes/tests/ai/agentTeams.spec.ts`
- State Management for Chat:
  - Redis: `@chat-adapter/state-ioredis@4.20.0`
  - In-memory: `@chat-adapter/state-memory@4.20.0`

**Email Services:**
- Nodemailer - SMTP email sending via `nodemailer@7.0.11`
  - Located in `packages/worker` (background email processing)
  - IMAP support via `imapflow@1.1.0` for reading/managing emails
  - Mailparser: `mailparser@3.7.2` for email parsing
- Email automation triggers: `packages/server/src/automations/email/`
  - Email state management: `packages/server/src/automations/email/state.ts`
  - Message fetching: `packages/server/src/automations/email/utils/fetchMessages.ts`
- Development: MailDev mock SMTP server (`maildev@2.2.1`)

**Google Services:**
- Google OAuth 2.0 - via `passport-google-oauth@2.0.0` and `google-auth-library@10.5.0`
  - Environment: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Google Sheets - Custom wrapper `@budibase/google-spreadsheet@4.1.5`
  - Integration: `packages/server/src/integrations/googlesheets.ts`

**AWS Services:**
- S3 - Object storage (file uploads, backups)
- DynamoDB - NoSQL database option
- Region: `AWS_REGION` environment variable
- Session token: `AWS_SESSION_TOKEN` for temporary credentials

**Microsoft/Azure:**
- Azure AD/Entra - via `@azure/msal-node@2.5.1`
  - OAuth 2.0 OIDC: `@govtechsg/passport-openidconnect@1.0.3`
- Microsoft 365 - Teams chat integration

**Authentication & Identity:**
- OAuth 2.0 - Generic provider support
  - Config: `packages/server/src/api/routes/oauth2.ts`
  - Controllers: `packages/server/src/api/controllers/oauth2.ts`
  - Token refresh: `passport-oauth2-refresh@2.1.0`
- OpenID Connect - OIDC provider support
  - Strategy: `@govtechsg/passport-openidconnect@1.0.3`
- Local Authentication - Username/password
  - Strategy: `passport-local@1.0.0`
- Passport.js - Authentication middleware via `koa-passport@6.0.0`

**Monitoring & Observability:**
- Datadog - Distributed tracing via `dd-trace@5.63.0`
  - LLM observability annotations in `packages/server/src/sdk/workspace/ai/llm/litellm.ts`
- PostHog - Product analytics
  - Client: `posthog-js@1.118.0` (frontend)
  - Node: `posthog-node@4.0.1` (backend)

**Job Queues & Task Processing:**
- Bull - Job queue library via `bull@4.10.1`
- Redis backend for queue storage
- Bull Board - Job queue UI via `@bull-board/api@5.10.2` and `@bull-board/koa@5.10.2`

**Utilities & Helpers:**
- Atlassian integration
  - Environment: `ATLASSIAN_API_TOKEN`, `ATLASSIAN_EMAIL`, `ATLASSIAN_BASE_URL`
- BambooHR integration
  - Environment: `BAMBOOHR_API_KEY`, `BAMBOOHR_SUBDOMAIN`

## Data Storage

**Databases:**
- CouchDB 2.1.0+
  - Connection: `COUCH_DB_URL` environment variable (typically `http://localhost:4005`)
  - Client: `@budibase/nano@10.1.5` (CouchDB client wrapper)
  - Secondary client: `pouchdb@9.0.0` (offline sync, browser use)
  - SQL API: `COUCH_DB_SQL_URL` for SQL queries over documents
- Connected Data Sources (via integrations)
  - PostgreSQL, MySQL, MongoDB, MSSQL, Oracle, Snowflake, Elasticsearch, Firebase, etc.

**File Storage:**
- MinIO S3-compatible storage (default for dev/self-hosted)
  - Connection: `MINIO_URL` environment variable
  - Credentials: `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`
  - Port: 4004 (dev)
- AWS S3 (cloud deployments)
  - Region: `AWS_REGION`
  - SDK: `@aws-sdk/client-s3`
- Buckets created:
  - `prod-budi-app-assets` - Application assets
  - `backups` - Backups
  - `templates` - Templates
  - `global` - Global files
  - `plugins` - Plugin files
  - `tmp-file-attachments` - Temporary uploads

**Caching:**
- Redis
  - Connection: `REDIS_URL` environment variable
  - Port: 6379 (dev)
  - Password: `REDIS_PASSWORD` (optional)
  - Clustering: `REDIS_CLUSTERED` flag
  - Client: `ioredis@5.3.2`
  - Sessions: `koa-session@5.13.1` with Redis store via `koa-redis@4.0.1`
  - Queues: Bull job queue stores in Redis
  - Locks: `redlock@4.2.0` for distributed locking

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication
  - Token library: `jsonwebtoken@9.0.2`
  - Password hashing: `bcrypt@6.0.0`
  - Routes: `packages/server/src/api/routes/auth.ts`
  - Controllers: `packages/server/src/api/controllers/auth.ts`
- OAuth 2.0 (generic provider support)
  - Routes: `packages/server/src/api/routes/oauth2.ts`
- OIDC Support
  - Provider: `@govtechsg/passport-openidconnect`

**Specific Providers:**
- Google OAuth - `google-auth-library`, `passport-google-oauth`
- Azure/Microsoft - `@azure/msal-node`
- Custom OpenID Connect - `@govtechsg/passport-openidconnect`

**Session Management:**
- Koa sessions via `koa-session@5.13.1`
- Redis-backed session store
- Session cookie handling

## Monitoring & Observability

**Error Tracking:**
- Datadog - via `dd-trace@5.63.0`
  - LLM observability in AI operations
  - Distributed tracing support

**Logs:**
- Pino - Structured logging via `pino@8.11.0`
  - HTTP logging: `pino-http@8.3.3`
  - File rotation: `rotating-file-stream@3.1.0`
  - Pretty printing (dev): `pino-pretty@10.0.0`
- Console.log redirection to Pino in production
- Correlation IDs: `correlation-id@4.0.0`

**Analytics:**
- PostHog
  - Frontend: `posthog-js@1.118.0`
  - Backend: `posthog-node@4.0.1`
  - Enabled via `ENABLE_ANALYTICS` environment variable

## CI/CD & Deployment

**Hosting:**
- Self-hosted or cloud deployment
- Docker containers (builder, server, worker, database, cache)
- Nginx proxy routing (port 10000)

**CI Pipeline:**
- GitHub Actions (inferred from repo structure)

**Build Process:**
- Lerna monorepo orchestration
- NX for build caching and incremental builds
- Docker compose for dev environment

## Environment Configuration

**Required env vars (selected):**
- `COUCH_DB_URL` - Primary database connection
- `REDIS_URL` - Cache and session store
- `MINIO_URL` - File storage
- `WORKER_URL` - Worker service endpoint
- `PORT` / `APP_PORT` / `APPS_PORT` - Server port
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `NODE_ENV` - Environment (development, production, test)
- `LITELLM_URL`, `LITELLM_MASTER_KEY` - AI proxy configuration
- `BBAI_LITELLM_KEY` - Budibase AI key
- `AWS_REGION` - AWS region for S3/DynamoDB
- `RECAPTCHA_SITE_KEY` - reCAPTCHA configuration

**Secrets location:**
- Environment variables via `.env` file (development)
- Injected via container runtime variables (production)
- AWS Secrets Manager or similar for cloud deployments

## Webhooks & Callbacks

**Incoming Webhooks:**
- Generic webhook endpoint: `packages/server/src/api/routes/webhook.ts`
- Controllers: `packages/server/src/api/controllers/webhook.ts`
- Chat webhook handlers:
  - Discord: `packages/server/src/api/controllers/webhook/discord.ts`
  - Slack: `packages/server/src/api/controllers/webhook/slack.ts`
- Email webhooks: `packages/server/src/api/controllers/webhook/chatHandler.ts`

**Outgoing Webhooks:**
- Automation triggers can send HTTP requests to external systems
- REST integration: `packages/server/src/integrations/rest.ts`
- HTTP client: `node-fetch@2.6.7` or `undici@7.16.0`

**Real-time Communication:**
- WebSocket via Socket.IO
  - Server: `socket.io@4.8.1`
  - Client: `socket.io-client@4.7.5`
  - Redis adapter: `@socket.io/redis-adapter@8.2.1`
  - Namespace for real-time app updates

---

*Integration audit: 2026-03-21*

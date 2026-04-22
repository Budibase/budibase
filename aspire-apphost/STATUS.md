# Budibase Aspire AppHost status

## Deliverable

This folder contains a source-backed TypeScript Aspire AppHost for Budibase.

- `apphost.ts` runs Budibase from the local repository source instead of Budibase app containers.
- Infrastructure sidecars remain containerized under Aspire.
- The folder also includes the local TypeScript AppHost config needed to run it (`aspire.config.json`, `apphost.run.json`, `package.json`, `tsconfig*.json`, `nginx.dev.conf`).

## Resources created

### Executables from local source

- `string-templates-dev`
- `client-dev`
- `builder-dev`
- `worker-service`
- `app-service`

### Container resources

- `litellm-db`
- `litellm-service`
- `minio-service`
- `couchdb-service`
- `redis-service`
- `proxy-service`

### Aspire parameters

- `api-encryption-key`
- `encryption-key`
- `jwt-secret`
- `minio-access-key`
- `minio-secret-key`
- `couch-db-user`
- `couch-db-password`
- `redis-password`
- `internal-api-key`
- `litellm-master-key`
- `litellm-salt-key`
- `litellm-db-user`
- `litellm-db-name`
- `litellm-db-password`
- `bb-admin-user-email`
- `bb-admin-user-password`

## What was achieved

- Budibase runs from the local clone source with Aspire orchestration.
- Secrets are modeled as Aspire parameters, and sensitive values now use generated persisted secret parameters instead of hard-coded literals in the AppHost.
- Most service URLs are injected from Aspire resource references or derived endpoint values instead of hard-coded `localhost` URLs.
- The remaining LiteLLM startup issue was fixed by using the Budibase compose-equivalent container-local database target `litellm-db:5432`.
- In the validated working environment, the stack returned HTTP 200 from:
  - `http://localhost:4001/health`
  - `http://localhost:4002/health`
  - `http://localhost:10000/builder`
  - `http://localhost:4000`

## Local run notes

- Budibase itself requires Node 22.x for the source-backed workflow.
- The validated environment used Aspire CLI `13.3.0-preview.1.26221.2` from the Aspire daily/dev channel.
- The validated environment also needed Budibase native module rebuilds under Node 22:
  - `npm rebuild leveldown --build-from-source`
  - `npm rebuild isolated-vm --build-from-source`
- On the validating machine, port 3000 was already occupied, so the AppHost runs the Budibase builder on port 3100 and points the included `nginx.dev.conf` at that port.
- After switching LiteLLM DB credentials to generated secrets, the validating run needed a one-time reset of `aspire-apphost/data/litellm-db` so Postgres could reinitialize with the new password.

## Remaining limitations

- Budibase does not currently expose an obvious OTEL/OTLP bootstrap path in `packages/server` or `packages/worker`, so OTEL export could not be enabled from the AppHost alone. This appears to be Budibase-specific rather than an Aspire dashboard limitation.
- The generated Aspire TypeScript surface does not currently expose the .NET `HostAndPort` endpoint-expression path. Because of that, the LiteLLM container database URL cannot yet be authored as a pure resolved endpoint expression for container-network usage. The working workaround is the container alias `litellm-db:5432`.

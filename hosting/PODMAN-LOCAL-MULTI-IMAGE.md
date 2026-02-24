# Budibase local multi-image deployment (Podman)

This guide runs Budibase with separate service images and no ECR push.

## 1) Service definitions (from `hosting/docker-compose.yaml`)

- `app-service`
  - Image: `budibase/apps`
  - Port: internal `4002`
  - Depends on: `worker-service`, `redis-service`
  - Key envs: `COUCH_DB_URL`, `WORKER_URL`, `MINIO_URL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `INTERNAL_API_KEY`, `BUDIBASE_ENVIRONMENT`, `PORT`, `API_ENCRYPTION_KEY`, `JWT_SECRET`, `REDIS_URL`, `REDIS_PASSWORD`, `REDIS_USERNAME`, `BB_ADMIN_USER_EMAIL`, `BB_ADMIN_USER_PASSWORD`, `PLUGINS_DIR`, `OFFLINE_MODE`
- `worker-service`
  - Image: `budibase/worker`
  - Port: internal `4003`
  - Depends on: `redis-service`, `minio-service`
  - Key envs: `PORT`, `CLUSTER_PORT`, `API_ENCRYPTION_KEY`, `JWT_SECRET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_URL`, `APPS_URL`, `COUCH_DB_USERNAME`, `COUCH_DB_PASSWORD`, `COUCH_DB_URL`, `INTERNAL_API_KEY`, `REDIS_URL`, `REDIS_PASSWORD`, `REDIS_USERNAME`, `OFFLINE_MODE`
- `proxy-service`
  - Image: `budibase/proxy`
  - Port: `${MAIN_PORT}:10000` (from `hosting/.env`, default `10000`)
  - Depends on: `minio-service`, `worker-service`, `app-service`, `couchdb-service`
  - Key envs: `PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND`, `PROXY_RATE_LIMIT_API_PER_SECOND`, `APPS_UPSTREAM_URL`, `WORKER_UPSTREAM_URL`, `MINIO_UPSTREAM_URL`, `COUCHDB_UPSTREAM_URL`, `RESOLVER`
- `couchdb-service`
  - Image: `budibase/database:2.0.0`
  - Depends on: none
- `minio-service`
  - Image: `minio/minio`
  - Depends on: none
- `redis-service`
  - Image: `redis`
  - Depends on: none

## 2) Keep separate Dockerfiles per service

- Apps: `packages/server/Dockerfile.multi`
- Worker: `packages/worker/Dockerfile.multi`
- Proxy: `hosting/proxy/Dockerfile`

## 3) Build all service images with one release tag

From repo root (PowerShell):

```powershell
$RELEASE_TAG = "v1.2.3"
$BUDIBASE_VERSION = $RELEASE_TAG

# Optional: build monorepo artifacts first
yarn lerna run build --stream --concurrency 1 --scope @budibase/server --scope @budibase/worker

podman build --build-arg BUDIBASE_VERSION=$BUDIBASE_VERSION -t budibase/apps:$RELEASE_TAG -f packages/server/Dockerfile.multi .
podman build --build-arg BUDIBASE_VERSION=$BUDIBASE_VERSION -t budibase/worker:$RELEASE_TAG -f packages/worker/Dockerfile.multi .
podman build -t budibase/proxy:$RELEASE_TAG -f hosting/proxy/Dockerfile hosting/proxy
```

## 4) Deploy with local tagged images

Use `hosting/docker-compose.local-tag.yaml` to pin service images to `v1.2.3`.

```powershell
podman compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-tag.yaml --env-file hosting/.env up -d
```

## 5) Verify

```powershell
podman compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-tag.yaml --env-file hosting/.env ps
curl http://localhost:10000/health
```

## 6) Stop

```powershell
podman compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-tag.yaml --env-file hosting/.env down
```

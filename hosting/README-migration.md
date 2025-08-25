# Migration Docker Compose

This directory contains scripts to generate and run parallel instances Budibase for testing purposes for selfhosters.

## Quick Start

### 1. Generate Migration Compose File

```bash
./generate-migration-compose.sh
```

This creates `docker-compose.migration.yaml` with migration instance of your services.

### 2. Start Services

**Prerequisites:** Make sure your main Budibase instance is running first:

Then start the migration instances:
```bash
docker compose -f docker-compose.migration.yaml --env-file .env up -d
```

### 3. Access Services

- **Main Budibase**: http://url:10000
- **Migration Budibase**: http://url:10001

## What It Does

The script creates migration instances of:

- `app-service` → `app-service-migration`
- `worker-service` → `worker-service-migration` 
- `proxy-service` → `proxy-service-migration`

## Use Cases

- **A/B Testing**: Compare different versions side by side
- **Migration Testing**: Test data migrations safely
- **Feature Development**: Test new features without affecting main instance
- **Rollback Testing**: Verify rollback procedures

## Cleanup

```bash
# Stop migration services
docker compose -f docker-compose.migration.yaml down

# Stop all services
docker compose -f docker-compose.yaml down
```

## Environment Variables

The new instances use the same `.env` file as the main services.

**Note:** `MAIN_PORT` is not needed for migration instances (they use fixed port 10001).

## Regeneration

Re-run `./generate-migration-compose.sh` anytime you update the main `docker-compose.yaml` to keep the migration file in sync.
# Migration Docker Compose

This directory contains scripts to add parallel migration instances to your main `docker-compose.yaml` for TESTING purposes.

## Quick Start

### 1. Add Migration Services

```bash
./generate-migration-compose.sh
```

This adds migration services directly to your `docker-compose.yaml` file.

### 2. Start Services

Start all services (including migration services):
```bash
docker compose up -d
```

**Data Copying**: The `couchdb-replicator` service automatically copies all databases and files from your main instance to the migration instance. Monitor progress with:
```bash
docker logs -f couchdb-replicator
```

Or start only specific services:
```bash
docker compose up -d app-service worker-service proxy-service        # Main services only
docker compose up -d couchdb-service couchdb-service-migration couchdb-replicator  # Copy databases first
docker compose up -d app-service-migration worker-service-migration proxy-service-migration  # Then start migration services
```

### 3. Access Services

- **Main Budibase**: http://localhost:10000
- **Migration Budibase**: http://localhost:10001

✅ **SAFE TESTING**: Migration instances use completely isolated databases and Redis instances, so you can safely test without affecting your main services or data.

## What It Does

The script creates isolated migration instances of:

- `couchdb-service` → `couchdb-service-migration` (ports 15984, 14984)
- `redis-service` → `redis-service-migration`
- `app-service` → `app-service-migration`
- `worker-service` → `worker-service-migration` 
- `proxy-service` → `proxy-service-migration`
- `couchdb-replicator` → Automatic database copying service

## Use Cases

- **A/B Testing**: Compare different versions side by side
- **Migration Testing**: Test data migrations safely
- **Feature Development**: Test new features without affecting main instance
- **Rollback Testing**: Verify rollback procedures

## Cleanup

```bash
# Stop migration services only
docker compose down couchdb-service-migration redis-service-migration app-service-migration worker-service-migration proxy-service-migration

# Remove migration services from compose file
cp docker-compose.yaml.backup docker-compose.yaml
```

## Environment Variables

The new instances use the same `.env` file as the main services.

**Note:** `MAIN_PORT` is not needed for migration instances (they use fixed port 10001).

## Regeneration

Re-run `./generate-migration-compose.sh` anytime you update the main services to refresh the migration services.

**Note:** The script automatically creates a backup (`docker-compose.yaml.backup`) before making changes.
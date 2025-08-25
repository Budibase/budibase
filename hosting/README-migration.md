# Migration Docker Compose

This directory contains scripts to add parallel migration instances to your main `docker-compose.yaml` for TESTING purposes.

## Quick Start

### 1. Add Migration Services

```bash
./generate-migration-compose.sh
```

This adds migration services directly to your `docker-compose.yaml` file.

### 2. Start Services

Start all services (including migration instances):
```bash
docker compose up -d
```

Or start only specific services:
```bash     # Main services only
docker compose up -d app-service-migration worker-service-migration proxy-service-migration  # Migration services only
```

### 3. Access Services

- **Main Budibase**: http://localhost:10000
- **Migration Budibase**: http://localhost:10001

⚠️ **WARNING**: Migration instances share the same database as your main services. To safely test migrations:

1. **Create a copy** of your live app instance before testing
2. **Access the copied app only** from the migration service (http://localhost:10001)
3. **Never access live apps** from the migration instance as this will modify production data

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
# Stop migration services only
docker compose stop app-service-migration worker-service-migration proxy-service-migration

# Remove migration services from compose file
cp docker-compose.yaml.backup docker-compose.yaml
```

## Environment Variables

The new instances use the same `.env` file as the main services.

**Note:** `MAIN_PORT` is not needed for migration instances (they use fixed port 10001).

## Regeneration

Re-run `./generate-migration-compose.sh` anytime you update the main services to refresh the migration services.

**Note:** The script automatically creates a backup (`docker-compose.yaml.backup`) before making changes.
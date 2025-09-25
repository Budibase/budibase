# Migration Docker Compose

This directory contains scripts to add parallel migration instances to your main `docker-compose.yaml` for TESTING purposes.

## ⚠️ CRITICAL WARNING ⚠️

**THE MIGRATION INSTANCE IS A COMPLETE COPY OF YOUR PRODUCTION DATA**

- **All emails will be sent** from the migration instance using your production SMTP settings
- **All automations will run** with real triggers and actions
- **All webhooks will fire** to production endpoints
- **All API calls will be made** to production services
- **All third-party integrations** (Slack, payment processors, etc.) will execute with production credentials

**USE ONLY FOR SAFE TESTING** where you can guarantee no production impact, or disable external services before starting migration instances.

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

**Data Copying**: The `env-replicator` service automatically copies all databases and files from your main instance to the migration instance. Monitor progress with:
```bash
docker logs -f env-replicator
```

Or start only specific services:
```bash
docker compose up -d app-service worker-service proxy-service        # Main services only
docker compose up -d couchdb-service couchdb-service-migration env-replicator  # Copy databases first
docker compose up -d app-service-migration worker-service-migration proxy-service-migration  # Then start migration services
```

### 3. Access Services

- **Main Budibase**: http://localhost:10000
- **Migration Budibase**: http://localhost:10001

⚠️ **DATA ISOLATION ONLY**: While databases are isolated, the migration instance contains a complete copy of your production data and will execute all automations, send emails, and trigger integrations with production credentials.

## What It Does

The script creates isolated migration instances of:

- `couchdb-service` → `couchdb-service-migration` (ports 15984, 14984)
- `redis-service` → `redis-service-migration`
- `app-service` → `app-service-migration`
- `worker-service` → `worker-service-migration` 
- `proxy-service` → `proxy-service-migration`
- `env-replicator` → Automatic database copying service

## Use Cases

⚠️ **Only use these migration instances when you can ensure no production impact:**

- **A/B Testing**: Compare different versions side by side (disable external integrations first)
- **Migration Testing**: Test data migrations safely (ensure automations won't trigger production actions)
- **Feature Development**: Test new features without affecting main instance (with production data copied)
- **Rollback Testing**: Verify rollback procedures (disable email/webhook sending first)

**Recommended safety measures:**
- Disable SMTP settings or use test email servers
- Disable webhook endpoints or redirect to test servers  
- Use test API keys for third-party services
- Review all automations before starting migration instance

## Cleanup

```bash
# Remove migration services from compose file
cp docker-compose.yaml.backup docker-compose.yaml

# Stop migration services only
docker compose down couchdb-service-migration redis-service-migration app-service-migration worker-service-migration proxy-service-migration
```

## Environment Variables

The new instances use the same `.env` file as the main services.

**Note:** `MAIN_PORT` is not needed for migration instances (they use fixed port 10001).

## Regeneration

Re-run `./generate-migration-compose.sh` anytime you update the main services to refresh the migration services.

**Note:** The script automatically creates a backup (`docker-compose.yaml.backup`) before making changes.
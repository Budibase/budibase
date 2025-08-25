#!/bin/bash

# Generate migration services for docker-compose.yaml
# Usage: ./generate-migration-compose.sh

set -e

INPUT_FILE="docker-compose.yaml"
BACKUP_FILE="docker-compose.yaml.backup"

# Check if input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo "❌ Error: ${INPUT_FILE} not found!"
    exit 1
fi

echo "🔄 Adding migration services to ${INPUT_FILE}..."

# Create backup
cp "$INPUT_FILE" "$BACKUP_FILE"
echo "💾 Created backup: ${BACKUP_FILE}"

# Function to extract and transform a service
extract_service() {
    local source_service="$1"
    local target_service="$2"
    
    awk -v source="$source_service" -v target="$target_service" '
    BEGIN { 
        in_service = 0
        indent_level = 0
    }
    
    # Find the source service
    /^[[:space:]]*[a-zA-Z0-9_-]+:/ {
        if ($0 ~ "^[[:space:]]*" source ":") {
            in_service = 1
            indent_level = match($0, /[^ ]/) - 1
            print "  " target ":"
            next
        } else if (in_service && match($0, /[^ ]/) <= indent_level) {
            in_service = 0
        }
    }
    
    # Process lines within the service
    in_service {
        current_indent = match($0, /[^ ]/) - 1
        if (current_indent <= indent_level && NF > 0) {
            in_service = 0
            next
        }
        
        line = $0
        
        # Transform the line for migration service
        transform_line(line)
    }
    
    function transform_line(line) {
        # Update container name
        if (line ~ /container_name:/) {
            gsub(/container_name: */, "", line)
            gsub(/^[ \t]*/, "", line)
            gsub(/[ \t]*$/, "", line)
            print "    container_name: " line "-migration"
            return
        }
        
        # Update image to use latest tag
        if (line ~ /^[[:space:]]*image:/) {
            if (line ~ /image:.*:/) {
                gsub(/:[^[:space:]]*[[:space:]]*$/, ":latest", line)
            } else {
                gsub(/[[:space:]]*$/, ":latest", line)
            }
        }
        
        # Update service URLs
        gsub(/worker-service:/, "worker-service-migration:", line)
        gsub(/app-service:/, "app-service-migration:", line)
        gsub(/couchdb-service:/, "couchdb-service-migration:", line)
        gsub(/redis-service:/, "redis-service-migration:", line)
        gsub(/minio-service:/, "minio-service-migration:", line)
        
        # Update ports for specific services
        if (target == "proxy-service-migration" && line ~ /- "?\${MAIN_PORT}:10000"?/) {
            gsub(/\${MAIN_PORT}/, "10001", line)
        }
        # Skip specific sections for migration services
        if (target ~ /-migration$/) {
            # Skip volumes section completely (ephemeral data)
            if (line ~ /^[[:space:]]*volumes:/) {
                return
            }
            if (line ~ /^[[:space:]]*- .*_data.*:/) {
                return
            }
        }
        
        # Skip ports section for CouchDB and MinIO migration services (internal access only)
        if ((target == "couchdb-service-migration" || target == "minio-service-migration")) {
            if (line ~ /^[[:space:]]*ports:/) {
                return
            }
            if (line ~ /^[[:space:]]*- "?.*:/) {
                return
            }
        }
        
        # Update depends_on references
        if (line ~ /^[[:space:]]*- /) {
            gsub(/- app-service$/, "- app-service-migration", line)
            gsub(/- worker-service$/, "- worker-service-migration", line)
            gsub(/- couchdb-service$/, "- couchdb-service-migration", line)
            gsub(/- redis-service$/, "- redis-service-migration", line)
            gsub(/- minio-service$/, "- minio-service-migration", line)
        }
        
        # Add dependency on env-replicator for proxy-service-migration
        if (target == "proxy-service-migration" && line ~ /^[[:space:]]*depends_on:/) {
            print line
            print "      - env-replicator"
            return
        }
        
        print line
    }
    ' "$INPUT_FILE"
}

# Function to create replication service
create_replication_service() {
    cat << 'EOF'
  # Database replication service
  env-replicator:
    image: redis:alpine
    container_name: env-replicator
    restart: "no"
    depends_on:
      - couchdb-service
      - couchdb-service-migration
      - redis-service-migration
      - minio-service
      - minio-service-migration
    environment:
      - COUCH_DB_USER=${COUCH_DB_USER}
      - COUCH_DB_PASSWORD=${COUCH_DB_PASSWORD}
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
    command:
      - sh
      - -c
      - |
        echo "Installing curl..."
        apk add --no-cache curl
        
        echo "Waiting for CouchDB services to be ready..."
        
        # Wait for main CouchDB
        until curl -f -s -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" http://couchdb-service:5984/_up > /dev/null 2>&1; do
          echo "  Waiting for couchdb-service..."
          sleep 2
        done
        echo "✅ couchdb-service is ready"
        
        # Wait for migration CouchDB
        until curl -f -s -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" http://couchdb-service-migration:5984/_up > /dev/null 2>&1; do
          echo "  Waiting for couchdb-service-migration..."
          sleep 2
        done
        echo "✅ couchdb-service-migration is ready"
        
        echo "Starting database replication..."
        
        # Get list of databases
        DBS=$$(curl -s -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" http://couchdb-service:5984/_all_dbs | sed 's/\[//g' | sed 's/\]//g' | sed 's/"//g' | tr ',' '\n')
        
        for db in $$DBS; do
          if [ "$$db" != "_replicator" ] && [ "$$db" != "_users" ] && [ "$$db" != "_global_changes" ]; then
            echo "Replicating database: $$db"
            curl -X POST -H "Content-Type: application/json" \
              -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" \
              -d "{\"source\":\"http://$$COUCH_DB_USER:$$COUCH_DB_PASSWORD@couchdb-service:5984/$$db\",\"target\":\"http://$$COUCH_DB_USER:$$COUCH_DB_PASSWORD@couchdb-service-migration:5984/$$db\",\"create_target\":true,\"continuous\":false}" \
              http://couchdb-service:5984/_replicate > /dev/null 2>&1
            echo "  ✅ Replicated: $$db"
          fi
        done
        
        echo "🎉 Database replication completed!"
        
        # Sync MinIO data after DB replication
        echo "📁 Syncing MinIO files..."
        
        # Wait for MinIO services to be ready
        until wget -q --spider http://minio-service:9000/minio/health/live > /dev/null 2>&1; do
          echo "  Waiting for minio-service..."
          sleep 2
        done
        echo "✅ minio-service is ready"
        
        until wget -q --spider http://minio-service-migration:9000/minio/health/live > /dev/null 2>&1; do
          echo "  Waiting for minio-service-migration..."
          sleep 2
        done
        echo "✅ minio-service-migration is ready"
        
        # Install minio client
        apk add --no-cache wget
        wget https://dl.min.io/client/mc/release/linux-amd64/mc -O /usr/local/bin/mc
        chmod +x /usr/local/bin/mc
        
        # Configure minio client aliases
        mc alias set source http://minio-service:9000 "$$MINIO_ACCESS_KEY" "$$MINIO_SECRET_KEY"
        mc alias set target http://minio-service-migration:9000 "$$MINIO_ACCESS_KEY" "$$MINIO_SECRET_KEY"
        
        # Sync all buckets and objects
        mc mirror source target --overwrite --remove
        echo "✅ MinIO data synced!"
        
        # Flush Redis cache after DB replication
        echo "🧹 Flushing Redis cache..."
        
        # Wait for Redis to be ready
        until redis-cli -h redis-service-migration -p 6379 -a "$$REDIS_PASSWORD" ping > /dev/null 2>&1; do
          echo "  Waiting for redis-service-migration..."
          sleep 2
        done
        echo "✅ redis-service-migration is ready"
        
        # Flush the Redis cache
        redis-cli -h redis-service-migration -p 6379 -a "$$REDIS_PASSWORD" FLUSHALL > /dev/null 2>&1
        echo "✅ Redis cache flushed!"

EOF
}

# Remove existing migration services if they exist
if grep -q ".*-migration:" "$INPUT_FILE" || grep -q "env-replicator:" "$INPUT_FILE"; then
    echo "⚠️  Migration services already exist in ${INPUT_FILE}"
    echo "🔄 Removing existing migration services first..."
    
    awk '
    /^[[:space:]]*[a-zA-Z0-9_-]+-migration:/ || /^[[:space:]]*env-replicator:/ { 
        in_migration = 1
        indent_level = match($0, /[^ ]/) - 1
        next 
    }
    /^[[:space:]]*# Migration services/ || /^[[:space:]]*# Database replication service/ { 
        next 
    }
    in_migration && /^[[:space:]]*[a-zA-Z0-9_-]+:/ {
        current_indent = match($0, /[^ ]/) - 1
        if (current_indent <= indent_level && NF > 0) {
            in_migration = 0
        }
    }
    !in_migration { print }
    ' "$INPUT_FILE" > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"
    
    # Also remove migration volumes from volumes section
    awk '
    /^volumes:/ { 
        in_volumes = 1
        print
        next
    }
    in_volumes && /^[a-zA-Z]+:/ && !/^volumes:/ {
        in_volumes = 0
    }
    in_volumes && /replication_state:/ {
        # Skip replication state volume and its driver line
        getline
        next
    }
    { print }
    ' "$INPUT_FILE" > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"
fi

# Generate the new compose file with migration services
{
    # Output everything up to volumes section
    awk '/^volumes:/ { exit } { print }' "$INPUT_FILE"
    
    echo ""
    echo "  # Migration services (generated)"
    
    # Add migration services
    extract_service "couchdb-service" "couchdb-service-migration"
    echo ""
    
    extract_service "redis-service" "redis-service-migration" 
    echo ""
    
    extract_service "minio-service" "minio-service-migration"
    echo ""
    
    extract_service "app-service" "app-service-migration"
    echo ""
    
    extract_service "worker-service" "worker-service-migration"
    echo ""
    
    extract_service "proxy-service" "proxy-service-migration"
    echo ""
    
    # Add replication service
    create_replication_service
    echo ""
    
    # Add volumes section with migration volumes
    echo "volumes:"
    awk '/^volumes:/,0 { 
        if (/^volumes:/) next
        print
    }' "$INPUT_FILE"
    # Migration services don't persist data - no migration volumes needed
    
} > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"

echo "✅ Added migration services to ${INPUT_FILE} successfully!"
echo ""
echo "📋 Added migration services:"
echo "   - couchdb-service-migration"
echo "   - redis-service-migration"
echo "   - minio-service-migration"
echo "   - app-service-migration (port 4002)"
echo "   - worker-service-migration (port 4003)"
echo "   - proxy-service-migration (port 10001)"
echo "   - env-replicator (automatic database + file copying)"
echo ""
echo "🌐 Access points:"
echo "   - Main services: http://localhost:10000"
echo "   - Migration services: http://localhost:10001"
echo ""
echo "💾 Backup saved as: ${BACKUP_FILE}"
echo "🔄 To remove migration services: cp ${BACKUP_FILE} ${INPUT_FILE}"
echo ""
echo "🚀 To start with database and file replication:"
echo "   docker compose up -d                    # Starts all services + automatic DB/file copy"
echo "   docker logs -f env-replicator       # Watch replication progress"
echo ""
echo "🔄 To wipe migration data for fresh testing:"
echo "   docker compose down couchdb-service-migration redis-service-migration app-service-migration worker-service-migration proxy-service-migration && docker compose up -d    # Recreates containers = fresh data"
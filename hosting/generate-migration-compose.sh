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
        
        # Update ports for specific services
        if (target == "proxy-service-migration" && line ~ /- "?\${MAIN_PORT}:10000"?/) {
            gsub(/\${MAIN_PORT}/, "10001", line)
        }
        if (target == "couchdb-service-migration") {
            if (line ~ /- "?\${COUCH_DB_PORT}:5984"?/) {
                gsub(/\${COUCH_DB_PORT}/, "15984", line)
            }
            if (line ~ /- "?\${COUCH_DB_SQS_PORT}:4984"?/) {
                gsub(/\${COUCH_DB_SQS_PORT}/, "14984", line)
            }
        }
        
        # Update volume names
        gsub(/couchdb3_data:/, "couchdb3_data_migration:", line)
        gsub(/redis_data:/, "redis_data_migration:", line)
        
        # Update depends_on references
        if (line ~ /^[[:space:]]*- /) {
            gsub(/- app-service$/, "- app-service-migration", line)
            gsub(/- worker-service$/, "- worker-service-migration", line)
            gsub(/- couchdb-service$/, "- couchdb-service-migration", line)
            gsub(/- redis-service$/, "- redis-service-migration", line)
        }
        
        # Add dependency on couchdb-replicator for proxy-service-migration
        if (target == "proxy-service-migration" && line ~ /^[[:space:]]*depends_on:/) {
            print line
            print "      - couchdb-replicator"
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
  couchdb-replicator:
    image: redis:alpine
    container_name: couchdb-replicator
    restart: "no"
    depends_on:
      - couchdb-service
      - couchdb-service-migration
      - redis-service-migration
    environment:
      - COUCH_DB_USER=${COUCH_DB_USER}
      - COUCH_DB_PASSWORD=${COUCH_DB_PASSWORD}
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
        
        echo "🧹 Wiping existing databases from migration CouchDB..."
        
        # Get list of existing databases in migration instance
        EXISTING_DBS=$$(curl -s -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" http://couchdb-service-migration:5984/_all_dbs | sed 's/\[//g' | sed 's/\]//g' | sed 's/"//g' | tr ',' '\n')
        
        for db in $$EXISTING_DBS; do
          if [ "$$db" != "_replicator" ] && [ "$$db" != "_users" ] && [ "$$db" != "_global_changes" ]; then
            echo "  🗑️  Deleting database: $$db"
            curl -X DELETE -u "$$COUCH_DB_USER:$$COUCH_DB_PASSWORD" http://couchdb-service-migration:5984/$$db > /dev/null 2>&1
          fi
        done
        echo "✅ Migration CouchDB wiped clean"
        
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
if grep -q ".*-migration:" "$INPUT_FILE" || grep -q "couchdb-replicator:" "$INPUT_FILE"; then
    echo "⚠️  Migration services already exist in ${INPUT_FILE}"
    echo "🔄 Removing existing migration services first..."
    
    awk '
    /^[[:space:]]*[a-zA-Z0-9_-]+-migration:/ || /^[[:space:]]*couchdb-replicator:/ { 
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
    in_volumes && /_migration:/ {
        # Skip migration volume and its driver line
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
    echo "  couchdb3_data_migration:"
    echo "    driver: local"
    echo "  redis_data_migration:"
    echo "    driver: local"
    
} > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"

echo "✅ Added migration services to ${INPUT_FILE} successfully!"
echo ""
echo "📋 Added migration services:"
echo "   - couchdb-service-migration (ports 15984, 14984)"
echo "   - redis-service-migration"
echo "   - app-service-migration (port 4002)"
echo "   - worker-service-migration (port 4003)"
echo "   - proxy-service-migration (port 10001)"
echo "   - couchdb-replicator (automatic database copying)"
echo ""
echo "🌐 Access points:"
echo "   - Main services: http://localhost:10000"
echo "   - Migration services: http://localhost:10001"
echo ""
echo "💾 Backup saved as: ${BACKUP_FILE}"
echo "🔄 To remove migration services: cp ${BACKUP_FILE} ${INPUT_FILE}"
echo ""
echo "🚀 To start with database replication:"
echo "   docker compose up -d                    # Starts all services + automatic DB copy"
echo "   docker logs -f couchdb-replicator       # Watch replication progress"
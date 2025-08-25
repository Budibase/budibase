#!/bin/bash

# Generate migration docker-compose file from main compose file
# Usage: ./generate-migration-compose.sh

set -e

INPUT_FILE="docker-compose.yaml"
OUTPUT_FILE="docker-compose.migration.yaml"

echo "🔄 Generating migration docker-compose.yaml from ${INPUT_FILE}..."

# Check if input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo "❌ Error: ${INPUT_FILE} not found!"
    exit 1
fi

# Extract service configuration from the main compose file
extract_service() {
    local service_name=$1
    local output_service_name=$2
    
    # Extract the entire service block
    awk -v service="$service_name:" -v output_name="$output_service_name" '
    BEGIN { in_service=0; indent_level=0; service_found=0 }
    
    # Find the service definition
    /^[[:space:]]*[a-zA-Z0-9_-]+:/ {
        if ($0 ~ "^[[:space:]]*" service "[[:space:]]*$") {
            service_found=1
            in_service=1
            indent_level = match($0, /[^ ]/) - 1
            print "  " output_name ":"
            next
        } else if (in_service && match($0, /[^ ]/) <= indent_level) {
            in_service=0
        }
    }
    
    # Process lines within the service
    in_service && service_found {
        current_indent = match($0, /[^ ]/) - 1
        if (current_indent <= indent_level && NF > 0) {
            in_service=0
            next
        }
        
        line = $0
        
        # Update container name
        if (line ~ /container_name:/) {
            # Extract the container name and append -migration
            gsub(/container_name: */, "", line)
            gsub(/^[ \t]*/, "", line)  # trim leading spaces
            gsub(/[ \t]*$/, "", line)  # trim trailing spaces
            line = "    container_name: " line "-migration"
        }
        
        # Update image to use latest tag
        if (line ~ /^[[:space:]]*image:/) {
            if (line ~ /image:.*:/) {
                # Has existing tag - replace with :latest
                # Match pattern: image: imagename:version -> image: imagename:latest
                gsub(/:[^[:space:]]*[[:space:]]*$/, ":latest", line)
            } else {
                # No tag specified, add :latest
                gsub(/[[:space:]]*$/, ":latest", line)
            }
        }
        
        # Update environment variables for inter-service communication
        if (line ~ /WORKER_URL:.*worker-service:/) {
            gsub(/worker-service:/, "worker-service-migration:", line)
        }
        if (line ~ /APPS_URL:.*app-service:/) {
            gsub(/app-service:/, "app-service-migration:", line)
        }
        
        # Update proxy environment variables
        if (line ~ /APPS_UPSTREAM_URL:.*app-service:/) {
            gsub(/app-service:/, "app-service-migration:", line)
        }
        if (line ~ /WORKER_UPSTREAM_URL:.*worker-service:/) {
            gsub(/worker-service:/, "worker-service-migration:", line)
        }
        # Handle array format environment variables for proxy
        if (line ~ /- APPS_UPSTREAM_URL=.*app-service:/) {
            gsub(/app-service:/, "app-service-migration:", line)
        }
        if (line ~ /- WORKER_UPSTREAM_URL=.*worker-service:/) {
            gsub(/worker-service:/, "worker-service-migration:", line)
        }
        
        # Update ports for proxy service (change main port to 10001)
        if (line ~ /- "?\${MAIN_PORT}:10000"?/) {
            gsub(/\${MAIN_PORT}/, "10001", line)
        }
        
        # Handle depends_on section - exclude external services
        if (line ~ /depends_on:/) {
            depends_on_line = line
            in_depends=1
            has_dependencies=0
            next
        }
        if (in_depends && line ~ /^[[:space:]]*-/) {
            # Extract dependency name (more portable approach)
            gsub(/^[[:space:]]*- */, "", line)
            dep = line
            gsub(/[[:space:]]*$/, "", dep)  # trim trailing spaces
            
            if (dep == "redis-service" || dep == "minio-service" || dep == "couchdb-service") {
                next  # Skip external dependencies
            }
            
            # If this is the first valid dependency, print the depends_on: line
            if (has_dependencies == 0) {
                print depends_on_line
                has_dependencies = 1
            }
            
            if (dep == "app-service") {
                line = "      - app-service-migration"
            } else if (dep == "worker-service") {
                line = "      - worker-service-migration"
            } else {
                line = "      - " dep
            }
        }
        if (in_depends && line !~ /^[[:space:]]*-/ && line !~ /^[[:space:]]*$/) {
            in_depends=0
            has_dependencies=0
        }
        
        print line
    }
    ' "$INPUT_FILE"
}

# Get version from original file
VERSION=$(grep '^version:' "$INPUT_FILE" | head -1)

# Start writing the output file
cat > "$OUTPUT_FILE" << EOF
${VERSION}

# Generated migration compose file
# This file creates migration versions of app and worker services
# Infrastructure services (couchdb, redis, minio) are external

services:
EOF

# Extract and transform each service
extract_service "app-service" "app-service-migration" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_service "worker-service" "worker-service-migration" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_service "proxy-service" "proxy-service-migration" >> "$OUTPUT_FILE"

# Add networks section
cat >> "$OUTPUT_FILE" << 'EOF'

networks:
  default:
    external: true
    name: hosting_default
EOF

echo "✅ Generated ${OUTPUT_FILE} successfully!"
echo ""
echo "📋 Created migration services:"
echo "   - app-service-migration (port 4002)"
echo "   - worker-service-migration (port 4003)" 
echo "   - proxy-service-migration (port 10001)"
echo ""
echo "🚀 To start migration services:"
echo "   docker compose -f docker-compose.yaml up -d                    # Start infrastructure"
echo "   docker compose -f ${OUTPUT_FILE} --env-file ../.env up -d      # Start migration services"
echo ""
echo "🌐 Access points:"
echo "   - Main services: http://localhost:10000"
echo "   - Migration services: http://localhost:10001"
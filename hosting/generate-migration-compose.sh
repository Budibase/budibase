#!/bin/bash

# Add migration services to existing docker-compose.yaml
# Usage: ./generate-migration-compose.sh

set -e

INPUT_FILE="docker-compose.yaml"
BACKUP_FILE="docker-compose.yaml.backup"

# Check if input file exists
if [[ ! -f "$INPUT_FILE" ]]; then
    echo "❌ Error: ${INPUT_FILE} not found!"
    exit 1
fi

# Check if script is being called to extract a single service
if [[ "$1" == "extract_service" ]]; then
    service_name="$2"
    output_name="$3"
    
    # Suppress all output for extraction mode
    exec 2>/dev/null
    
    awk -v service="$service_name:" -v output_name="$output_name" '
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
            gsub(/container_name: */, "", line)
            gsub(/^[ \t]*/, "", line)
            gsub(/[ \t]*$/, "", line)
            line = "    container_name: " line "-migration"
        }
        
        # Update image to use latest tag
        if (line ~ /^[[:space:]]*image:/) {
            if (line ~ /image:.*:/) {
                gsub(/:[^[:space:]]*[[:space:]]*$/, ":latest", line)
            } else {
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
        
        # Handle depends_on section - update service references
        if (line ~ /depends_on:/) {
            print line
            in_depends=1
            next
        }
        if (in_depends && line ~ /^[[:space:]]*-/) {
            gsub(/^[[:space:]]*- */, "", line)
            dep = line
            gsub(/[[:space:]]*$/, "", dep)
            
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
        }
        
        print line
    }
    ' "$INPUT_FILE"
    exit 0
fi

# Main execution starts here

echo "🔄 Adding migration services to ${INPUT_FILE}..."

# Create backup
cp "$INPUT_FILE" "$BACKUP_FILE"
echo "💾 Created backup: ${BACKUP_FILE}"

# Check if migration services already exist
if grep -q "app-service-migration:" "$INPUT_FILE"; then
    echo "⚠️  Migration services already exist in ${INPUT_FILE}"
    echo "🔄 Removing existing migration services first..."
    
    # Remove existing migration services
    awk '
    /^[[:space:]]*[a-zA-Z0-9_-]+-migration:/ { 
        in_migration=1; 
        indent_level = match($0, /[^ ]/) - 1;
        next 
    }
    /^[[:space:]]*# Migration services/ { next }
    in_migration && /^[[:space:]]*[a-zA-Z0-9_-]+:/ {
        current_indent = match($0, /[^ ]/) - 1
        if (current_indent <= indent_level && NF > 0) {
            in_migration=0
        }
    }
    !in_migration { print }
    ' "$INPUT_FILE" > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"
fi

# Append migration services at the end of the services section
# Find the last service and add migration services after it
awk '
BEGIN { last_service_line = 0; in_services = 0 }

# Track if we are in services section
/^services:/ { in_services = 1 }

# Track the last line of services section
in_services && /^[[:space:]]*[a-zA-Z0-9_-]+:/ { 
    last_service_line = NR 
}

# When we hit volumes, networks, or end of file, insert migration services
/^volumes:/ || /^networks:/ || /^[a-zA-Z]+:/ && !/^services:/ && in_services {
    if (in_services && last_service_line > 0) {
        # Insert migration services before this section
        print ""
        print "  # Migration services (generated)"
        system("'"$0"' extract_service app-service app-service-migration 2>/dev/null")
        print ""
        system("'"$0"' extract_service worker-service worker-service-migration 2>/dev/null") 
        print ""
        system("'"$0"' extract_service proxy-service proxy-service-migration 2>/dev/null")
        print ""
        in_services = 0
    }
}

# Print all original lines
{ print }

# If we reach end of file and still in services, add migration services
END {
    if (in_services && last_service_line > 0) {
        print ""
        print "  # Migration services (generated)"
        system("'"$0"' extract_service app-service app-service-migration 2>/dev/null")
        print ""
        system("'"$0"' extract_service worker-service worker-service-migration 2>/dev/null")
        print ""
        system("'"$0"' extract_service proxy-service proxy-service-migration 2>/dev/null")
    }
}
' "$INPUT_FILE" > "${INPUT_FILE}.tmp" && mv "${INPUT_FILE}.tmp" "$INPUT_FILE"

echo "✅ Added migration services to ${INPUT_FILE} successfully!"
echo ""
echo "📋 Added migration services:"
echo "   - app-service-migration"
echo "   - worker-service-migration"
echo "   - proxy-service-migration"
echo ""
echo "🌐 Access points:"
echo "   - Main services: http://localhost:10000"
echo "   - Migration services: http://localhost:10001"
echo ""
echo "💾 Backup saved as: ${BACKUP_FILE}"
echo "🔄 To remove migration services: cp ${BACKUP_FILE} ${INPUT_FILE}"
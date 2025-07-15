#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
FIXTURES_DIR="$SCRIPT_DIR/../src/fixtures"

# Default configuration
COMMAND=""
FROM_VERSION=""
TO_VERSION="current"
APP_EXPORT=""
TEST_APP=""
CLEANUP=true
VERBOSE=false

# Environment configuration - no defaults, script sets everything
INTERNAL_API_KEY="budibase"
BB_ADMIN_USER_EMAIL="admin@example.com"
BB_ADMIN_USER_PASSWORD="admin123!"

# Generate unique container names to avoid collisions
RANDOM_SUFFIX=$(echo "$RANDOM$(date +%s)" | sha256sum | head -c 8)
CONTAINER_NAME="budibase-upgrade-test-${RANDOM_SUFFIX}"
VOLUME_NAME="budibase-upgrade-data-${RANDOM_SUFFIX}"

# --- Helper Functions ---

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_section() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

usage() {
    cat << EOF
Budibase Upgrade Test Runner

This script runs upgrade tests for Budibase, supporting both CI and local development.

Usage: $0 <command> [options]

Commands:
  full --from <version>     Run full upgrade test from specified version to current
                           (imports car-rental app by default if no --app specified)
  pre --from <version>      Run only pre-upgrade tests
                           (imports car-rental app by default if no --app specified)
  post                      Run only post-upgrade tests
                           (requires TEST_APP_ID to be set)
  import <app>              Import an app into running Budibase
  list-versions             List available Budibase versions
  help                      Show this help message

Options:
  --from <version>          The Budibase version to upgrade from (required for full/pre)
  --to <version>            The version to upgrade to (default: current)
  --app <path|name>         Path to app export or fixture name to import
  --test-app <name>         Test only a specific app
  --no-cleanup              Don't clean up containers after test
  --verbose                 Show detailed output

Environment Variables (set by script):
  BUDIBASE_URL              URL of Budibase instance (set dynamically from container port)
  INTERNAL_API_KEY          API key for authentication (set to: budibase)
  BB_ADMIN_USER_EMAIL       Admin user email (set to: admin@example.com)
  BB_ADMIN_USER_PASSWORD    Admin user password (set to: admin123!)
  TEST_APP_ID               App ID to test (set after importing app)
  BUDIBASE_CONTAINER_NAME   Container name (auto-generated)

Examples:
  # Run full upgrade test from version 3.12.0
  $0 full --from 3.12.0

  # Run pre-upgrade tests with a specific app
  $0 pre --from 3.12.0 --app car-rental

  # Import an app into running Budibase
  $0 import basic-app

  # Run post-upgrade tests only
  $0 post

  # List available versions
  $0 list-versions
EOF
}

# --- Docker Management Functions ---

cleanup() {
    if [ "$CLEANUP" = true ]; then
        print_info "Cleaning up containers..."
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        docker rm "$CONTAINER_NAME" 2>/dev/null || true
        docker volume rm "$VOLUME_NAME" 2>/dev/null || true
    fi
}

wait_for_budibase() {
    print_info "Waiting for Budibase to be healthy..."
    local max_attempts=90  # 90 * 2s = 180s timeout
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        # Use Docker's built-in health check status
        local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "")
        
        if [ "$health_status" = "healthy" ]; then
            print_info "Budibase is healthy!"
            return 0
        fi
        
        # Check if container is still running
        local container_status=$(docker inspect --format='{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "")
        if [ "$container_status" != "running" ]; then
            print_error "Container stopped unexpectedly with status: $container_status"
            print_error "Container logs:"
            docker logs --tail 100 "$CONTAINER_NAME"
            exit 1
        fi
        
        attempt=$((attempt + 1))
        if [ $((attempt % 10)) -eq 0 ]; then
            print_info "Still waiting... ($attempt/$max_attempts) - Health: $health_status"
        fi
        sleep 2
    done
    
    print_error "Budibase failed to become healthy after $max_attempts attempts"
    print_error "Container logs:"
    docker logs --tail 100 "$CONTAINER_NAME"
    exit 1
}

# --- App Import Functions ---

get_app_path() {
    local app_name="$1"
    local app_path=""
    
    # Check if it's a direct file path
    if [ -f "$app_name" ]; then
        app_path="$app_name"
    else
        # Try to find in fixtures
        app_path="$FIXTURES_DIR/${app_name}.tar.gz"
        if [ ! -f "$app_path" ]; then
            # Try without .tar.gz extension
            app_path="$FIXTURES_DIR/$app_name"
        fi
    fi
    
    if [ -f "$app_path" ]; then
        echo "$app_path"
    else
        return 1
    fi
}

list_available_apps() {
    if [ -d "$FIXTURES_DIR" ]; then
        find "$FIXTURES_DIR" -name "*.tar.gz" -type f -exec basename {} .tar.gz \; | sort
    fi
}

import_app() {
    local app_path="$1"
    
    if [ -z "$app_path" ]; then
        print_error "No app specified"
        print_info "Available apps:"
        list_available_apps | while read -r app; do
            echo "  - $app"
        done
        return 1
    fi
    
    app_path=$(get_app_path "$app_path")
    if [ -z "$app_path" ]; then
        print_error "App not found: $1"
        print_info "Available apps:"
        list_available_apps | while read -r app; do
            echo "  - $app"
        done
        return 1
    fi
    
    print_info "Importing app: $(basename "$app_path")"
    
    # Extract app name from file path
    local app_name
    app_name=$(basename "$app_path" .tar.gz | tr '-' ' ')
    
    print_info "Uploading app file..."
    local import_response
    
    if [ "$VERBOSE" = true ]; then
        print_info "Import URL: $BUDIBASE_URL/api/applications"
        print_info "App name: $app_name"
        print_info "File path: $app_path"
        print_info "File size: $(ls -lh "$app_path" | awk '{print $5}')"
    fi
    
    # Import using the internal API key
    import_response=$(curl -s -w '\n%{http_code}' -X POST \
        -H "x-budibase-api-key: $INTERNAL_API_KEY" \
        -F "fileToImport=@$app_path;type=application/gzip" \
        -F "name=$app_name" \
        -F "useTemplate=true" \
        "$BUDIBASE_URL/api/applications" 2>&1)
    
    local curl_exit=$?
    if [ $curl_exit -ne 0 ]; then
        print_error "curl command failed with exit code: $curl_exit"
        echo "Error output: $import_response"
        return 1
    fi
    
    # Extract status code from last line
    local status_code
    status_code=$(echo "$import_response" | tail -1)
    # Remove status code from response
    local body
    body=$(echo "$import_response" | sed '$d')
    
    if [ "$VERBOSE" = true ]; then
        print_info "Import response status: $status_code"
        print_info "Import response body: $body"
    fi
    
    # Check if status code is numeric
    if ! [[ "$status_code" =~ ^[0-9]+$ ]]; then
        print_error "Failed to get valid HTTP status code"
        print_error "Raw response:"
        echo "$import_response"
        return 1
    fi
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
        # Success - extract app ID
        local app_id
        app_id=$(echo "$body" | grep -o '"appId":"[^"]*' | cut -d'"' -f4)
        
        if [ -z "$app_id" ]; then
            # Try alternative field name
            app_id=$(echo "$body" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
        fi
        
        if [ -n "$app_id" ] && [[ "$app_id" =~ ^app_ ]]; then
            export TEST_APP_ID="$app_id"
            print_info "App imported successfully with ID: $app_id (set as TEST_APP_ID)"
            return 0
        else
            print_error "Failed to extract app ID from response"
            if [ "$VERBOSE" = true ]; then
                echo "Response body: $body"
            fi
            return 1
        fi
    else
        print_error "Failed to import app - HTTP status: $status_code"
        echo "Response: $body"
        return 1
    fi
}

# --- Test Execution Functions ---

run_tests() {
    local phase="$1"
    
    cd "$SCRIPT_DIR/.."
    
    # Export all required environment variables
    export TEST_PHASE="$phase"
    export BUDIBASE_URL
    export INTERNAL_API_KEY
    export BB_ADMIN_USER_EMAIL
    export BB_ADMIN_USER_PASSWORD
    export BUDIBASE_CONTAINER_NAME="$CONTAINER_NAME"
    export OLD_VERSION="$FROM_VERSION"
    export CURRENT_VERSION="$TO_VERSION"
    
    [ -n "$TEST_APP" ] && export TEST_APP
    
    # If TEST_APP_ID is not set at this point, it means no apps were imported
    # The tests will fail with a clear error message
    if [ -n "$TEST_APP_ID" ]; then
        export TEST_APP_ID
    fi
    
    print_info "Running $phase tests..."
    if [ "$VERBOSE" = true ]; then
        yarn test
    else
        yarn test --silent
    fi
}

# --- Main Commands ---

cmd_full_upgrade() {
    if [ -z "$FROM_VERSION" ]; then
        print_error "--from <version> is required"
        exit 1
    fi
    
    print_section "Starting Full Upgrade Test"
    print_info "Upgrading from $FROM_VERSION to $TO_VERSION"
    print_info "Using container: $CONTAINER_NAME"
    
    # Set up cleanup trap
    trap cleanup EXIT
    
    # Clean up any existing containers
    cleanup
    
    # Clean up any previous upgrade context
    local context_file="$SCRIPT_DIR/../.upgrade-context.json"
    if [ -f "$context_file" ]; then
        print_info "Removing previous upgrade context file..."
        rm -f "$context_file"
    fi
    
    # Create volume
    print_info "Creating Docker volume..."
    docker volume create "$VOLUME_NAME"
    
    # Start old version
    print_section "Starting Budibase $FROM_VERSION"
    print_info "Admin credentials: $BB_ADMIN_USER_EMAIL / $BB_ADMIN_USER_PASSWORD"
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        -P \
        -e INTERNAL_API_KEY="$INTERNAL_API_KEY" \
        -e MULTI_TENANCY=0 \
        -e SELF_HOSTED=1 \
        -e REDIS_PASSWORD="budibase" \
        -e BB_ADMIN_USER_EMAIL="$BB_ADMIN_USER_EMAIL" \
        -e BB_ADMIN_USER_PASSWORD="$BB_ADMIN_USER_PASSWORD" \
        -v "$VOLUME_NAME:/data" \
        "budibase/budibase:$FROM_VERSION"
    
    # Get port and wait for health
    local port
    port=$(docker port "$CONTAINER_NAME" 80 | cut -d: -f2)
    export BUDIBASE_URL="http://localhost:$port"
    
    wait_for_budibase
    
    # Give Budibase extra time to fully initialize admin user
    print_info "Waiting for admin user to be created..."
    sleep 10
    
    if [ "$VERBOSE" = true ]; then
        print_info "Checking container logs for admin user creation..."
        docker logs "$CONTAINER_NAME" 2>&1 | grep -i "admin" | tail -10 || true
    fi
    
    # Import apps
    if [ -n "$APP_EXPORT" ]; then
        # Import specified app
        if ! import_app "$APP_EXPORT"; then
            print_error "Failed to import app: $APP_EXPORT"
            exit 1
        fi
    else
        # Import default app (car-rental) if no app specified
        print_info "No app specified, importing default car-rental app..."
        if ! import_app "car-rental"; then
            print_error "Failed to import default app"
            exit 1
        fi
    fi
    
    # Run pre-upgrade tests
    print_section "Pre-Upgrade Tests"
    run_tests "pre-upgrade"
    
    # Stop old version
    print_info "Stopping Budibase $FROM_VERSION..."
    docker stop "$CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"
    
    # Build/start current version
    print_section "Starting Budibase $TO_VERSION"
    
    if [ "$TO_VERSION" = "current" ]; then
        print_info "Building current version..."
        cd "$PROJECT_ROOT"
        docker build -f hosting/single/Dockerfile -t budibase:current \
            --build-arg BUDIBASE_VERSION="0.0.0+local" --build-arg TARGETBUILD=single .
        cd - >/dev/null
        
        docker run -d \
            --name "$CONTAINER_NAME" \
            -P \
            -e INTERNAL_API_KEY="$INTERNAL_API_KEY" \
            -e MULTI_TENANCY=0 \
            -e SELF_HOSTED=1 \
            -e REDIS_PASSWORD="budibase" \
            -e BB_ADMIN_USER_EMAIL="$BB_ADMIN_USER_EMAIL" \
            -e BB_ADMIN_USER_PASSWORD="$BB_ADMIN_USER_PASSWORD" \
            -v "$VOLUME_NAME:/data" \
            budibase:current
    else
        docker run -d \
            --name "$CONTAINER_NAME" \
            -P \
            -e INTERNAL_API_KEY="$INTERNAL_API_KEY" \
            -e MULTI_TENANCY=0 \
            -e SELF_HOSTED=1 \
            -e REDIS_PASSWORD="budibase" \
            -e BB_ADMIN_USER_EMAIL="$BB_ADMIN_USER_EMAIL" \
            -e BB_ADMIN_USER_PASSWORD="$BB_ADMIN_USER_PASSWORD" \
            -v "$VOLUME_NAME:/data" \
            "budibase/budibase:$TO_VERSION"
    fi
    
    # Get new port and wait for health
    port=$(docker port "$CONTAINER_NAME" 80 | cut -d: -f2)
    export BUDIBASE_URL="http://localhost:$port"
    
    wait_for_budibase
    
    # Run post-upgrade tests
    print_section "Post-Upgrade Tests"
    run_tests "post-upgrade"
    
    print_section "Upgrade Test Completed Successfully!"
}

cmd_pre_upgrade() {
    if [ -z "$FROM_VERSION" ]; then
        print_error "--from <version> is required"
        exit 1
    fi
    
    print_section "Running Pre-Upgrade Tests Only"
    print_info "Version: $FROM_VERSION"
    
    # Check if BUDIBASE_URL is already set (existing instance)
    if [ -z "$BUDIBASE_URL" ]; then
        print_info "BUDIBASE_URL not set. Assuming Budibase is already running locally."
        # For standalone pre-upgrade tests, assume default local instance
        export BUDIBASE_URL="http://localhost:10000"
    fi
    
    print_info "Using Budibase at: $BUDIBASE_URL"
    
    # Import apps
    if [ -n "$APP_EXPORT" ]; then
        # Import specified app
        if ! import_app "$APP_EXPORT"; then
            print_error "Failed to import app: $APP_EXPORT"
            exit 1
        fi
    else
        # Import default app (car-rental) if no app specified
        print_info "No app specified, importing default car-rental app..."
        if ! import_app "car-rental"; then
            print_error "Failed to import default app"
            exit 1
        fi
    fi
    
    run_tests "pre-upgrade"
}

cmd_post_upgrade() {
    print_section "Running Post-Upgrade Tests Only"
    
    # For standalone post-upgrade tests, TEST_APP_ID must be provided
    if [ -z "$TEST_APP_ID" ]; then
        print_error "TEST_APP_ID environment variable is required for post-upgrade tests"
        print_info "Either:"
        print_info "  1. Run the full upgrade test: $0 full --from <version>"
        print_info "  2. Set TEST_APP_ID manually: export TEST_APP_ID=<app-id>"
        exit 1
    fi
    
    run_tests "post-upgrade"
}

cmd_import() {
    if [ -z "$1" ]; then
        print_error "App name or path required"
        print_info "Available apps:"
        list_available_apps | while read -r app; do
            echo "  - $app"
        done
        exit 1
    fi
    
    import_app "$1"
}

cmd_list_versions() {
    cd "$SCRIPT_DIR/.."
    node scripts/list-versions.js
}

# --- Argument Parsing ---

# Parse command
if [ $# -eq 0 ]; then
    usage
    exit 1
fi

COMMAND="$1"
shift

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --from)
            FROM_VERSION="$2"
            shift 2
            ;;
        --to)
            TO_VERSION="$2"
            shift 2
            ;;
        --app)
            APP_EXPORT="$2"
            shift 2
            ;;
        --test-app)
            TEST_APP="$2"
            shift 2
            ;;
        --no-cleanup)
            CLEANUP=false
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            # For import command, treat as app name
            if [ "$COMMAND" = "import" ]; then
                APP_EXPORT="$1"
                shift
            else
                print_error "Unknown option: $1"
                exit 1
            fi
            ;;
    esac
done

# Execute command
case $COMMAND in
    full)
        cmd_full_upgrade
        ;;
    pre)
        cmd_pre_upgrade
        ;;
    post)
        cmd_post_upgrade
        ;;
    import)
        cmd_import "$APP_EXPORT"
        ;;
    list-versions)
        cmd_list_versions
        ;;
    help)
        usage
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        usage
        exit 1
        ;;
esac
#!/usr/bin/env bash
# Build 3 Budibase images from source (apps, worker, proxy) for use with Podman/Docker.
# Database (budibase/database:2.0.0) is pulled from Docker Hub at compose time.
#
# Usage:
#   ./scripts/build-multi-images.sh              # full build
#   ./scripts/build-multi-images.sh --skip-build  # images only
#   ./scripts/build-multi-images.sh --use-docker   # use Docker instead of Podman
#
# Then run 6 containers:
#   podman compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-images.yaml --env-file hosting/.env up -d

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

TAG="local"
VERSION="0.0.0+local"
SKIP_BUILD=false
USE_DOCKER=false

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --use-docker) USE_DOCKER=true ;;
  esac
done

echo "=========================================================="
echo " Budibase multi-image build"
echo " apps:$TAG  worker:$TAG  proxy:$TAG (built locally)"
echo " database:2.0.0 (from Docker Hub)"
echo "=========================================================="
echo ""

# ---------------------------------------------------------------
# Step 1: Monorepo build
# ---------------------------------------------------------------
if [ "$SKIP_BUILD" = false ]; then
  export DISABLE_V8_COMPILE_CACHE=1
  export NODE_OPTIONS="--max-old-space-size=4096"
  echo "[1/4] Running monorepo build (server, worker and deps)..."
  if command -v yarn &>/dev/null; then
    yarn lerna run build --stream --concurrency 1 --scope @budibase/server --scope @budibase/worker
  else
    npx lerna run build --stream --concurrency 1 --scope @budibase/server --scope @budibase/worker
  fi
else
  echo "[1/4] Skipping monorepo build (--skip-build)."
fi

# ---------------------------------------------------------------
# Detect container engine
# ---------------------------------------------------------------
ENGINE="podman"
if [ "$USE_DOCKER" = true ]; then
  if command -v docker &>/dev/null; then
    ENGINE="docker"
    echo "Using docker (--use-docker)."
  else
    echo "ERROR: docker not found in PATH." >&2
    exit 1
  fi
elif ! command -v podman &>/dev/null; then
  if command -v docker &>/dev/null; then
    ENGINE="docker"
    echo "Podman not in PATH; falling back to docker."
  else
    echo "ERROR: neither podman nor docker found in PATH." >&2
    exit 1
  fi
fi
echo "Container engine: $ENGINE"
echo ""

# ---------------------------------------------------------------
# Step 2-4: Build images
# ---------------------------------------------------------------
echo "[2/4] Building budibase/apps:$TAG ..."
$ENGINE build --build-arg BUDIBASE_VERSION="$VERSION" -t "budibase/apps:$TAG" -f packages/server/Dockerfile.multi .

echo "[3/4] Building budibase/worker:$TAG ..."
$ENGINE build --build-arg BUDIBASE_VERSION="$VERSION" -t "budibase/worker:$TAG" -f packages/worker/Dockerfile.multi .

echo "[4/4] Building budibase/proxy:$TAG ..."
$ENGINE build -t "budibase/proxy:$TAG" -f hosting/proxy/Dockerfile hosting/proxy

# ---------------------------------------------------------------
# Done
# ---------------------------------------------------------------
echo ""
echo "=========================================================="
echo " Done. 3 images built:"
echo "   budibase/apps:$TAG"
echo "   budibase/worker:$TAG"
echo "   budibase/proxy:$TAG"
echo " Database: budibase/database:2.0.0 (pulled at compose time)"
echo "=========================================================="
echo ""
echo "Run 6 containers:"
echo "  podman compose -f hosting/docker-compose.yaml -f hosting/docker-compose.local-images.yaml --env-file hosting/.env up -d"
echo ""
echo "Open: http://localhost:10000"
echo ""

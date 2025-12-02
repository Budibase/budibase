#!/bin/bash
cd "$(dirname "$0")/.."

version=$(./scripts/getCurrentVersion.sh)

docker run -d \
  --name budibase-single \
  -p 80:80 \
  -p 443:443 \
  -p 4000:4000 \
  -v budibase_data:/data \
  -e APP_PORT=4001 \
  -e CLUSTER_PORT=80 \
  -e WORKER_PORT=4002 \
  -e MINIO_URL="http://127.0.0.1:9000" \
  -e REDIS_URL="127.0.0.1:6379" \
  -e BUDIBASE_ENVIRONMENT="PRODUCTION" \
  -e DEPLOYMENT_ENVIRONMENT="docker" \
  -e SELF_HOSTED="1" \
  -e NODE_ENV="production" \
  -e BUDIBASE_VERSION=$version \
  budibase:latest

echo "Budibase single image is running. Access it at http://localhost:80"
echo "LiteLLM dashboard available at http://localhost:4000"
echo "To stop the container, run: docker stop budibase-single"
echo "To remove the container, run: docker rm budibase-single"
echo "To view logs, run: docker logs budibase-single -f"

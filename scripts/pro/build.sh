#!/bin/bash

# This script is designed for building the pro repo after the backend-core build has completed.
# This ensures that any changes in core that are required by pro are done in the correct order.

set -e

# Go to parent of budibase
cd ../../../

if [[ -d "budibase-pro" ]]; then
  cd budibase-pro
  echo "Building pro"
  yarn build
fi
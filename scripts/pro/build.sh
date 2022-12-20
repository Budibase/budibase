#!/bin/bash

# This script is designed for building the pro repo after the backend-core has completed.
# This ensures that any changes in core that are required by pro are done in the correct order.

set -e

pwd

cd ../../../
pwd
ls

if [[ -d "../../../budibase-pro" ]]; then
  echo "Building pro"
  cd "../../../budibase-pro"
  yarn build
  cd -
fi
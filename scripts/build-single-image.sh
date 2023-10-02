#!/bin/bash
source ${BASH_SOURCE%/*}/updateVersions.sh
yarn build --scope @budibase/server --scope @budibase/worker
source ${BASH_SOURCE%/*}/removeWorkspaceDependencies.sh
docker build -f hosting/single/Dockerfile -t budibase:latest .
source ${BASH_SOURCE%/*}/resetVersions.sh

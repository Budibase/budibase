#!/bin/bash
set -ex

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--max-old-space-size=4096 --no-node-snapshot $NODE_OPTIONS"
  jest --maxWorkers="${JEST_MAX_WORKERS:-4}" --forceExit --workerIdleMemoryLimit=2000MB --bail "$@"
else
  # Pass --coverage explicitly if you need a coverage report locally
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --maxWorkers="${JEST_MAX_WORKERS:-4}" --forceExit --workerIdleMemoryLimit=2000MB "$@"
fi

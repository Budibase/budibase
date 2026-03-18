#!/bin/bash
set -e

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--max-old-space-size=4096 --no-node-snapshot $NODE_OPTIONS"
  jest --maxWorkers=4 --forceExit --workerIdleMemoryLimit=2000MB --bail "$@"
else
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --coverage --maxWorkers=2 --forceExit "$@"
fi

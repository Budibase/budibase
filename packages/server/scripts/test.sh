#!/bin/bash
set -ex

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--max-old-space-size=4096 --no-node-snapshot $NODE_OPTIONS"
  jest --coverage --maxWorkers=4 --forceExit --workerIdleMemoryLimit=2000MB --bail "$@"
else
  # --maxWorkers performs better in development
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --coverage --maxWorkers=2 --forceExit "$@"
fi
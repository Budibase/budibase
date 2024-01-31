#!/bin/bash
set -e

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--max-old-space-size=4096 --no-node-snapshot"
  echo "jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=2000MB --bail $@"
  jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=2000MB --bail $@
else
  # --maxWorkers performs better in development
  export NODE_OPTIONS="--no-node-snapshot"
  echo "jest --coverage --maxWorkers=2 --forceExit $@"
  jest --coverage --maxWorkers=2 --forceExit $@
fi
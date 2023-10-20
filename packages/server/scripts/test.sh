#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # Running in ci, where resources are limited
  export NODE_OPTIONS="--max-old-space-size=4096"
  echo "jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=2000MB --bail"
  jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=2000MB --bail
else
  # --maxWorkers performs better in development
  echo "jest --coverage --maxWorkers=2 --forceExit"
  jest --coverage --maxWorkers=2 --forceExit
fi
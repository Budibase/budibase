#!/bin/bash
set -e

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--experimental-vm-modules $NODE_OPTIONS"
  # Running in ci, where resources are limited
  echo "jest --maxWorkers=2 --forceExit --bail $@"
  jest --maxWorkers=2 --forceExit --bail $@
else
  export NODE_OPTIONS="--experimental-vm-modules $NODE_OPTIONS"
  # --maxWorkers performs better in development
  echo "jest --coverage --detectOpenHandles $@"
  jest --coverage --detectOpenHandles $@
fi

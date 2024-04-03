#!/bin/bash
set -e

export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"

if [[ -n $CI ]]
then
  echo "jest --coverage --maxWorkers=4 --forceExit --bail $@"
  jest --coverage --maxWorkers=2 --forceExit --bail $@
else
  echo "jest --coverage --maxWorkers=2 --forceExit $@"
  jest --coverage --maxWorkers=2 --forceExit $@
fi
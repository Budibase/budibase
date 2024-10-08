#!/bin/bash
set -ex

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --coverage --maxWorkers=75% --forceExit --bail --ci $@
else
  # --maxWorkers performs better in development
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --coverage --maxWorkers=2 --forceExit $@
fi
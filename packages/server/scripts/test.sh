#!/bin/bash
set -ex

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --maxWorkers=150% --forceExit --bail --ci $@
else
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"
  jest --maxWorkers=75% --forceExit $@
fi
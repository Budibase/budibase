#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  export NODE_OPTIONS="--max-old-space-size=4096"
  echo "jest --coverage --runInBand --forceExit"
  jest --coverage --runInBand --forceExit
else
  # --maxWorkers performs better in development
  echo "jest --coverage --maxWorkers=2 --forceExit"
  jest --coverage --maxWorkers=2 --forceExit
fi
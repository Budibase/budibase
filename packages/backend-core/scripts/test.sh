#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --runInBand --forceExit $*"
  jest --runInBand --forceExit "$@"
else
  # --maxWorkers performs better in development
  echo "jest --coverage --forceExit --detectOpenHandles $*"
  jest --coverage --forceExit --detectOpenHandles "$@"
fi

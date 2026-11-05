#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --runInBand --forceExit $*"
  jest --runInBand --forceExit "$@"
else
  # Pass --coverage or --detectOpenHandles explicitly if you need them locally;
  # --detectOpenHandles forces Jest to run in band
  echo "jest --maxWorkers=${JEST_MAX_WORKERS:-4} --forceExit $*"
  jest --maxWorkers="${JEST_MAX_WORKERS:-4}" --forceExit "$@"
fi

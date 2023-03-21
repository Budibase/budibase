#!/bin/bash

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  echo "jest --coverage --runInBand --forceExit --workerIdleMemoryLimit=1000MB"
  jest --coverage --runInBand --forceExit --workerIdleMemoryLimit=1000MB
else
  # --maxWorkers performs better in development
  echo "jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=1000MB"
  jest --coverage --maxWorkers=2 --forceExit --workerIdleMemoryLimit=1000MB
fi

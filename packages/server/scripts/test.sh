#!/bin/bash
set -e

if [[ -n $CI ]]
then
  # --runInBand performs better in ci where resources are limited
  export NODE_OPTIONS="--max-old-space-size=4096"
  node ../../node_modules/jest/bin/jest.js --version
  echo "node --expose-gc --no-compilation-cache ../../node_modules/jest/bin/jest.js"
  node --expose-gc --no-compilation-cache ../../node_modules/jest/bin/jest.js --logHeapUsage
else
  # --maxWorkers performs better in development
  echo "jest --coverage --maxWorkers=2 --forceExit"
  jest --coverage --maxWorkers=2 --forceExit
fi
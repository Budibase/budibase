#!/bin/bash
set -e

if [[ -n $CI ]]
then
  export NODE_OPTIONS="--max-old-space-size=4096 --no-node-snapshot $NODE_OPTIONS"

  max_workers="${JEST_MAX_WORKERS:-4}"
  jest_args=(
    --maxWorkers=$max_workers
    --workerIdleMemoryLimit=2000MB
    --bail
  )
else
  export NODE_OPTIONS="--no-node-snapshot $NODE_OPTIONS"

  max_workers="${JEST_MAX_WORKERS:-50%}"
  jest_args=(
    --maxWorkers=$max_workers
  )
fi

jest "${jest_args[@]}" "$@"

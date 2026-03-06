#!/bin/bash
set -e

if [[ -n $CI ]]
then
  max_workers="${JEST_MAX_WORKERS:-50%}"
  jest_args=(
    --maxWorkers=$max_workers
    --bail
  )
else
  max_workers="${JEST_MAX_WORKERS:-50%}"
  jest_args=(--maxWorkers=$max_workers)
fi

jest "${jest_args[@]}" "$@"

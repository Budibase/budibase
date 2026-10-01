#!/bin/bash

# Pulls the given images in parallel, retrying each one, and fails if any of
# them could not be pulled.
#

set -uo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <image> [image...]" >&2
  exit 1
fi

ATTEMPTS=${PULL_ATTEMPTS:-5}

# Bash arithmetic treats a non-numeric value as 0, which would skip the retry
# loop entirely and report a pull failure for an image never pulled.
if [[ ! $ATTEMPTS =~ ^[0-9]+$ ]] || ((10#$ATTEMPTS < 1)); then
  echo "::error::PULL_ATTEMPTS must be a positive integer, got '$ATTEMPTS'" >&2
  exit 1
fi

ATTEMPTS=$((10#$ATTEMPTS))

pull_with_retry() {
  local image=$1
  local delay=2
  local attempt

  for ((attempt = 1; attempt <= ATTEMPTS; attempt++)); do
    if docker pull --quiet "$image"; then
      return 0
    fi

    if [ "$attempt" -lt "$ATTEMPTS" ]; then
      echo "Failed to pull $image (attempt $attempt/$ATTEMPTS), retrying in ${delay}s..." >&2
      sleep "$delay"
      delay=$((delay * 2))
    fi
  done

  echo "::error::Failed to pull $image after $ATTEMPTS attempts" >&2
  return 1
}

pids=()
for image in "$@"; do
  pull_with_retry "$image" &
  pids+=("$!")
done

status=0
for pid in "${pids[@]}"; do
  wait "$pid" || status=1
done

exit "$status"

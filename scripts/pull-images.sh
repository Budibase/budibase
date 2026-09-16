#!/bin/bash

# Pulls the given images in parallel, retrying each one, and fails if any of
# them could not be pulled.
#
# Pulls fail intermittently in CI. Amazon ECR Public allows a single
# unauthenticated pull per second per IP address, and GitHub-hosted runners
# share egress IPs, so a busy matrix run trips that limit.
#
# Such a failure used to go unnoticed twice over. The pulls were backgrounded
# and awaited with `wait $(jobs -p)`, which only reports the exit status of the
# last PID, so a failed pull left the step green. testcontainers then treated
# its own failed pull as a success - it resolves as soon as the pull stream
# ends, without checking the stream for errors - and the run died later in
# globalSetup with a confusing 404 "No such image" from the Docker daemon.

set -uo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <image> [image...]" >&2
  exit 1
fi

ATTEMPTS=${PULL_ATTEMPTS:-5}

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

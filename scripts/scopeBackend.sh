#!/bin/bash

# Define the packages
PACKAGES=("@budibase/backend-core" "@budibase/worker" "@budibase/server" "@budibase/string-templates" "@budibase/types" "@budibase/shared-core")

# Generate the scope arguments
SCOPE_ARGS=""
for PACKAGE in "${PACKAGES[@]}"; do
  SCOPE_ARGS+="--scope $PACKAGE "
done

# Run the commands with the scope arguments
for COMMAND in "$@"; do
  echo "Running: $COMMAND $SCOPE_ARGS"
  yarn $COMMAND $SCOPE_ARGS
done

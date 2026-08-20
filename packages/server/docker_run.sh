#!/usr/bin/env bash

# exec so that node replaces this shell as PID 1 and receives SIGTERM directly.
# Going through yarn left a ~81MB node process resident for the lifetime of the
# container, and bash does not forward signals to a foreground child, so
# graceful shutdown never ran.

NODE_ARGS=()
if [ "$DISABLE_SOURCE_MAPS" != "1" ]; then
  # ~150MB of retained source map per process - see run:docker in package.json.
  NODE_ARGS+=(--enable-source-maps)
fi

if [ -z "$CLUSTER_MODE" ]; then
  exec node "${NODE_ARGS[@]}" dist/index.js
else
  exec pm2-runtime start pm2.config.js
fi

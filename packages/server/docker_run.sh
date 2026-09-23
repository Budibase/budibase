#!/usr/bin/env bash


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

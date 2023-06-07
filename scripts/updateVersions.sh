#!/bin/bash
version=$(cat lerna.json \
  | grep version \
  | head -1 \
  | awk -F: '{gsub(/"/,"",$2);gsub(/[[:space:]]*/,"",$2); print $2}' \
  | sed 's/[",]//g')
echo "Setting version $version"
yarn lerna exec "yarn version --no-git-tag-version --new-version=$version"
echo "Updating dependencies"
node scripts/syncLocalDependencies.js $version
echo "Syncing yarn workspace"
yarn

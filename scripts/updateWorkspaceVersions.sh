#!/bin/bash
version=$1
echo "Setting version $version"
yarn lerna exec "yarn version --no-git-tag-version --new-version=$version"
echo "Updating dependencies"
node scripts/syncLocalDependencies.js $version
echo "Syncing yarn workspace"
yarn

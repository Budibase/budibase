#!/bin/bash
echo "Resetting package versions"
yarn lerna exec "yarn version --no-git-tag-version --new-version=0.0.0"
echo "Updating dependencies"
node scripts/syncLocalDependencies.js "0.0.0"
git checkout package.json
echo "Package versions reset!"

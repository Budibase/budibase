#!/bin/bash

if [ -z "$1" ]
then
  echo "Error: bump type is required. Usage: $0 [major|minor|patch|prerelease]"
  exit 1
fi

# Bump the version in lerna.json
node ./bumpVersion.js $1


NEW_VERSION=$(node -p "require('../lerna.json').version")
git add ../lerna.json
git commit -m "Bump version to $NEW_VERSION"
git tag $NEW_VERSION
git push
git push --tags
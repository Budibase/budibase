#!/bin/bash
set -euo pipefail

if [ -z "${1:-}" ]
then
  echo "Error: bump type is required. Usage: $0 [minor|major]"
  exit 1
fi

BUMP_TYPE=$1

if [[ "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  echo "Error: bump type must be 'minor' or 'major'"
  exit 1
fi

# Bump the version in hosting/couchdb/VERSION
node ./bumpDatabaseVersion.js "$BUMP_TYPE"

NEW_VERSION=$(cat ../hosting/couchdb/VERSION | tr -d '[:space:]')

# Update all hardcoded references to the database image version
sed -i.bak "s|budibase/database:[0-9]*\.[0-9]*\.[0-9]*|budibase/database:${NEW_VERSION}|g" \
  ../package.json \
  ../hosting/docker-compose.yaml \
  ../hosting/docker-compose.dev.yaml \
  ../hosting/single/Dockerfile \
  ../hosting/tests/Dockerfile \
  ../globalSetup.ts

# Update the Helm chart value
sed -i.bak "s|tag: \"[0-9]*\.[0-9]*\.[0-9]*\"|tag: \"${NEW_VERSION}\"|g" \
  ../charts/budibase/values.yaml

# Clean up .bak files
find .. -name "*.bak" -delete

git add ../hosting/couchdb/VERSION \
  ../package.json \
  ../hosting/docker-compose.yaml \
  ../hosting/docker-compose.dev.yaml \
  ../hosting/single/Dockerfile \
  ../hosting/tests/Dockerfile \
  ../globalSetup.ts \
  ../charts/budibase/values.yaml

git commit -m "Bump database version to $NEW_VERSION"
git tag "database-$NEW_VERSION"
git push
git push --tags

#!/bin/bash 

if [[ -z "${CI}" ]]; then
  echo 'Cannot run release.sh unless in CI'
  exit 0
fi

# Release pro as same version as budibase
VERSION=$(jq -r .version lerna.json)
echo "Version: $VERSION"
COMMAND=$1
echo "Command: $COMMAND"

# Go to pro package
cd ../budibase-pro

# Install NPM credentials
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} >> .npmrc 

# Determine tag to use
TAG=""
if [[ $COMMAND == "develop" ]]; then
  TAG="develop"
else
  TAG="latest"
fi

echo "Releasing version $VERSION"
echo "Releasing tag $TAG"
lerna publish $VERSION --yes --force-publish --dist-tag $TAG

# reset main and types to point to src for dev
cd packages/pro
jq '.main = "src/index.ts" | .types = "src/index.ts"' package.json > package.json.tmp && mv package.json.tmp package.json
cd -
git add packages/pro/package.json
git commit -m 'Prep dev'
git push 

cd ../budibase

if [[ $COMMAND == "develop" ]]; then
  # Pin pro version for develop container build
  echo "Pinning pro version"
  cd packages/server
  jq '.dependencies."@budibase/pro"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json
  cd -
  cd packages/worker
  jq '.dependencies."@budibase/pro"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json
fi

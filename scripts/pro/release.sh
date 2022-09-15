#!/bin/bash 

if [[ -z "${CI}" ]]; then
  echo 'Cannot run release.sh unless in CI'
  exit 0
fi

#############################################
#                   SETUP                   #
#############################################

# Release pro with same version as budibase
VERSION=$(jq -r .version lerna.json)
echo "Version: $VERSION"
COMMAND=$1
echo "Command: $COMMAND"

# Determine tag to use
TAG=""
if [[ $COMMAND == "develop" ]]; then
  TAG="develop"
else
  TAG="latest"
fi

echo "Releasing version $VERSION"
echo "Releasing tag $TAG"

#############################################
#                PRE-PUBLISH                #
#############################################

# Go to pro repo root
cd ../budibase-pro

# Install NPM credentials
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} >> .npmrc 

# Sync budibase dependency versions in packages/pro/package.json
# Ensures pro does not use out of date dependency
cd packages/pro
jq '.dependencies."@budibase/backend-core"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json
jq '.dependencies."@budibase/types"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json

# Go back to pro repo root
cd -

# Update lockfile with new dependency versions
yarn clean -y && yarn bootstrap

# Commit and push
git add packages/pro/yarn.lock
git commit -m "Update dependency versions to $VERSION"
git push

#############################################
#                  PUBLISH                  #
#############################################

lerna publish $VERSION --yes --force-publish --dist-tag $TAG

#############################################
#             POST-PUBLISH - PRO            #
#############################################

# Revert build changes on packages/pro/package.json
cd packages/pro
jq '.main = "src/index.ts" | .types = "src/index.ts"' package.json > package.json.tmp && mv package.json.tmp package.json

# Go back to pro repo root
cd -

# Commit and push changes
git add packages/pro/package.json
git commit -m "Prep next development iteration"
git push 

#############################################
#            POST-PUBLISH - BUDIBASE        #
#############################################

# Go to budibase repo root
cd ../budibase

# Update pro version in packages/server/package.json
cd packages/server
jq '.dependencies."@budibase/pro"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json

# Go back to budibase repo root
cd -

# Update pro version in packages/worker/package.json
cd packages/worker
jq '.dependencies."@budibase/pro"="'$VERSION'"' package.json > package.json.tmp && mv package.json.tmp package.json

# Go back to budibase repo root
cd -

# Update lockfile with new pro version
yarn clean -y && yarn bootstrap

# Commit and push changes
git add packages/server/package.json
git add packages/server/yarn.lock
git add packages/worker/package.json
git add packages/worker/yarn.lock
git commit -m "Update pro version to $VERSION"
git push

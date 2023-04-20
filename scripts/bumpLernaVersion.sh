#!/bin/bash

# Bump the version in lerna.json
CURRENT_VERSION=$(node -p "require('./lerna.json').version")
NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. -v OFS=. '{++$NF; print}')
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" lerna.json

lerna version prerelease --no-git-tag-version --force-publish --no-push --y
git add lerna.json
git commit -m "Bump version to $NEW_VERSION"
git tag v$NEW_VERSION
git push
git push --tags



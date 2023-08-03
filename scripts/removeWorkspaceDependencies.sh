#!/bin/bash

package_json=$(cat "$1")

root_package_json=$(cat "package.json")


for workspace_package in $(echo "$root_package_json" | jq -r '.workspaces.packages[]' ); do
  package_name=$(cat "$workspace_package/package.json" | jq -r '.name')
  has_changes=false

  if echo "$package_json" | jq -e --arg package_name "$package_name" '.dependencies | has($package_name)' > /dev/null; then

    package_json=$(echo "$package_json" | jq "del(.dependencies[\"$package_name\"])")
    has_changes=true
  fi

  if [ "$has_changes" = true ]; then
    echo "$package_json" > "$1"
  fi
done

echo "$root_package_json" | jq "del(.resolutions)" > "package.json"
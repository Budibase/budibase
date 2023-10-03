#!/bin/bash
root_package_json=$(cat "package.json")

process_package() {
  local pkg="$1"
  local package_json=$(cat "$pkg/package.json")
  local has_changes=false

  

  while IFS= read -r package_name; do
    if echo "$package_json" | jq -e --arg package_name "$package_name" '.dependencies | has($package_name)' > /dev/null; then
      package_json=$(echo "$package_json" | jq "del(.dependencies[\"$package_name\"])")
      has_changes=true
    fi
  done < "packageNames.txt"

  if [ "$has_changes" = true ]; then
    echo "$package_json" > "$1/package.json"
  fi
}


for pkg in $(echo "$root_package_json" | jq -r '.workspaces.packages[]' ); do
  if [[ "$pkg" == *"*"* ]]; then
    # Use find to iterate through immediate subdirectories
    find "$pkg" -maxdepth 1 -type d -print | while read -r workspace_package; do
      process_package "$workspace_package"
    done
  else
    process_package "$pkg"
  fi
done

echo "$root_package_json" | jq "del(.resolutions)" > "package.json"
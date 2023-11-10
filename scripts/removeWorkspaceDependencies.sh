#!/bin/sh

packages_to_remove="@budibase/backend-core @budibase/bbui @budibase/builder @budibase/cli @budibase/client @budibase/frontend-core @budibase/pro @budibase/sdk @budibase/server @budibase/shared-core @budibase/string-templates @budibase/types @budibase/worker"

package_json_path="$1"
package_json=$(cat "$package_json_path")

process_package() {
  pkg_path="$1"
  package_json=$(cat "$pkg_path")
  has_changes=false

  for package_name in $packages_to_remove; do
    if echo "$package_json" | jq -e --arg package_name "$package_name" '.dependencies | has($package_name)' > /dev/null; then
      package_json=$(echo "$package_json" | jq "del(.dependencies[\"$package_name\"])")
      has_changes=true
    fi
  done

  if [ "$has_changes" = true ]; then
    echo "$package_json" > "$pkg_path"
  fi
}

process_package "$package_json_path"

package_json=$(cat "$package_json_path")
echo "$package_json" | jq "del(.resolutions)" > "$1"

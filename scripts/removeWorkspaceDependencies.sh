#!/bin/sh

packages_to_remove="@budibase/backend-core @budibase/bbui @budibase/builder @budibase/cli @budibase/client @budibase/frontend-core @budibase/pro @budibase/sdk @budibase/server @budibase/shared-core @budibase/string-templates @budibase/types @budibase/worker"

package_json_path="$1"

process_package() {
  pkg_path="$1"

  for package_name in $packages_to_remove; do
    jq "del(.dependencies[\"$package_name\"])" $pkg_path > tmp_file.json && mv tmp_file.json $pkg_path
    jq "del(.resolutions[\"$package_name\"])" $pkg_path > tmp_file.json && mv tmp_file.json $pkg_path
  done
}

process_package "$package_json_path"

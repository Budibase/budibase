#!/bin/bash

workspace_info=$(yarn --silent workspaces info)

package_names_file="packageNames.txt"

rm -f $package_names_file


packages=$(echo "$workspace_info" | jq -r 'keys[]')
echo "$packages" > $package_names_file

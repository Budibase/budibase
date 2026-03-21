#!/bin/bash
# generate-hardened-package.sh
#
# Generates a package.hardened.json from a service package.json by adding a
# resolutions block that forces patched versions of HIGH/CRITICAL CVE packages.
#
# Usage: bash scripts/generate-hardened-package.sh <path-to-package.json>
#
# Example:
#   bash scripts/generate-hardened-package.sh packages/server/package.json
#   bash scripts/generate-hardened-package.sh packages/worker/package.json

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <path-to-package.json>" >&2
  exit 1
fi

SOURCE="$1"

if [ ! -f "$SOURCE" ]; then
  echo "Error: $SOURCE not found" >&2
  exit 1
fi

OUTPUT="$(dirname "$SOURCE")/package.hardened.json"

jq --argjson resolutions '{"fast-xml-parser":"4.5.4","axios":"1.13.5","tar":">=7.5.11","minimatch":"9.0.7","koa":">=2.16.4","glob":"10.5.0"}' \
  '. + {resolutions: $resolutions}' \
  "$SOURCE" > "$OUTPUT"

echo "Written: $OUTPUT"

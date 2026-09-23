#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -z "${SCIM_TOKEN:-}" && -f "${repo_root}/.env" ]]; then
  SCIM_TOKEN="$(sed -n 's/^SCIM_TOKEN=//p' "${repo_root}/.env" | head -n 1)"
  case "${SCIM_TOKEN}" in
    \"*\")
      SCIM_TOKEN="${SCIM_TOKEN#\"}"
      SCIM_TOKEN="${SCIM_TOKEN%\"}"
      ;;
    \'*\')
      SCIM_TOKEN="${SCIM_TOKEN#\'}"
      SCIM_TOKEN="${SCIM_TOKEN%\'}"
      ;;
  esac
  export SCIM_TOKEN
fi

if [[ -z "${SCIM_TOKEN:-}" ]]; then
  echo "SCIM_TOKEN is required. Copy the provisioning token from Settings > Auth > SCIM."
  exit 1
fi

SCIM_URL="${SCIM_URL:-http://host.docker.internal:10000/api/global/scim/v2}"

docker run -i --rm \
  --add-host=host.docker.internal:host-gateway \
  -e "SCIM_URL=${SCIM_URL}" \
  -e SCIM_TOKEN \
  alpine:3.20 sh -s <<'SCIM_SCRIPT'
set -eu

apk add --no-cache curl jq >/dev/null

auth_header="Authorization: Bearer ${SCIM_TOKEN}"
global_url="${SCIM_URL%/scim/v2}"

echo "Deleting all SCIM-provisioned users and groups from ${SCIM_URL}"

delete_resources() {
  resource_type="$1"
  if ! response=$(curl --compressed -fsS "${SCIM_URL}/${resource_type}" \
    -H "${auth_header}"); then
    echo "Failed to list SCIM ${resource_type}" >&2
    return 1
  fi
  if ! ids=$(echo "${response}" | jq -r '.Resources[]?.id'); then
    echo "Invalid SCIM ${resource_type} response" >&2
    return 1
  fi
  if ! count=$(echo "${response}" | jq -er '.Resources | length'); then
    echo "Invalid SCIM ${resource_type} response" >&2
    return 1
  fi
  failed=0

  echo "Found ${count} SCIM ${resource_type}"
  for id in ${ids}; do
    if curl --compressed -fsS -X DELETE "${SCIM_URL}/${resource_type}/${id}" \
      -H "${auth_header}" >/dev/null; then
      echo "Deleted SCIM ${resource_type%?}: ${id}"
    else
      echo "Failed to delete SCIM ${resource_type%?}: ${id}" >&2
      failed=1
    fi
  done

  return "${failed}"
}

delete_users() {
  if ! response=$(curl --compressed -fsS "${global_url}/users" \
    -H "${auth_header}"); then
    echo "Failed to list global users" >&2
    return 1
  fi
  if ! ids=$(echo "${response}" | jq -r '.[] | select(.scimInfo?.isSync == true) | ._id'); then
    echo "Invalid global users response" >&2
    return 1
  fi
  if ! count=$(echo "${ids}" | awk 'NF { count++ } END { print count + 0 }'); then
    echo "Unable to count SCIM users" >&2
    return 1
  fi
  failed=0

  echo "Found ${count} SCIM users"
  for id in ${ids}; do
    if curl --compressed -fsS -X DELETE "${global_url}/users/${id}" \
      -H "${auth_header}" >/dev/null; then
      echo "Deleted SCIM user: ${id}"
    else
      echo "Failed to delete SCIM user: ${id}" >&2
      failed=1
    fi
  done

  return "${failed}"
}

failed=0
delete_resources groups || failed=1
delete_users || failed=1

if [ "${failed}" -ne 0 ]; then
  exit 1
fi
SCIM_SCRIPT

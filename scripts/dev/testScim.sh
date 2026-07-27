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
content_header="Content-Type: application/scim+json"
suffix="$(date +%s)"

user_response=$(curl -fsS -X POST "${SCIM_URL}/users" \
  -H "${auth_header}" \
  -H "${content_header}" \
  -d "$(jq -n --arg suffix "$suffix" '{
    schemas: [
      "urn:ietf:params:scim:schemas:core:2.0:User",
      "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
    ],
    externalId: ("local-user-" + $suffix),
    userName: ("local.user." + $suffix + "@example.com"),
    active: true,
    emails: [{
      value: ("local.user." + $suffix + "@example.com"),
      type: "work",
      primary: true
    }],
    name: {
      givenName: "Local",
      familyName: "SCIM",
      formatted: "Local SCIM"
    },
    meta: { resourceType: "User" },
    roles: []
  }')")
user_id=$(echo "$user_response" | jq -er '.id')

group_response=$(curl -fsS -X POST "${SCIM_URL}/groups" \
  -H "${auth_header}" \
  -H "${content_header}" \
  -d "$(jq -n --arg suffix "$suffix" '{
    schemas: [
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      "http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/2.0/Group"
    ],
    externalId: ("local-group-" + $suffix),
    displayName: ("Local Azure Test Group " + $suffix),
    meta: { resourceType: "Group" }
  }')")
group_id=$(echo "$group_response" | jq -er '.id')

curl -fsS -X PATCH "${SCIM_URL}/groups/${group_id}" \
  -H "${auth_header}" \
  -H "${content_header}" \
  -d "$(jq -n --arg user_id "$user_id" '{
    schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    Operations: [{
      op: "add",
      path: "members",
      value: [{ value: $user_id }]
    }]
  }')" >/dev/null

echo "Created SCIM user: $user_id"
echo "Created SCIM group: $group_id"
echo "Group display name: Local Azure Test Group $suffix"
SCIM_SCRIPT

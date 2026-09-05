#!/bin/bash
set -uo pipefail

DATA_DIR="${DATA_DIR:-/data}"
APPLY=0
COMMAND="diagnose"
VERIFY_URL="${VERIFY_URL:-http://127.0.0.1:5984}"
VERIFY_USER="${COUCHDB_USER:-}"
VERIFY_PASSWORD="${COUCHDB_PASSWORD:-}"

usage() {
  cat <<USAGE
This script must be run against the CouchDB data volume while the CouchDB
container is STOPPED, and the volume should be backed up first, e.g.:

  docker run --rm -v <couchdb_volume>:/data -v \$(pwd):/backup busybox \\
    tar czf /backup/couchdb-data-backup.tar.gz -C /data .

Usage: $0 [diagnose|migrate|verify] [--data-dir PATH] [--apply]
         [--url URL] [--user USER] [--password PASSWORD]

  diagnose (default)  Report the orphaned files without changing anything.
  migrate             Merge orphaned files into the current layout. Without
                       --apply this only prints the plan (dry run).
  verify              Compare CouchDB's _all_dbs against shard files on disk.
                       Run this against a running instance after migrating.
USAGE
}

if [ $# -gt 0 ] && [ "${1#-}" = "$1" ]; then
  COMMAND="$1"
  shift
fi

while [ $# -gt 0 ]; do
  case "$1" in
    --data-dir)
      DATA_DIR="$2"
      shift 2
      ;;
    --apply)
      APPLY=1
      shift
      ;;
    --url)
      VERIFY_URL="$2"
      shift 2
      ;;
    --user)
      VERIFY_USER="$2"
      shift 2
      ;;
    --password)
      VERIFY_PASSWORD="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

NEW_DBS_DIR="${DATA_DIR}/couch/dbs"
NEW_VIEWS_DIR="${DATA_DIR}/couch/views"

MOVED=0
CONFLICTS=0

merge_dir() {
  local src="$1"
  local dst="$2"

  if [ ! -d "$src" ]; then
    return 0
  fi

  mkdir -p "$dst"

  local entry rel target
  find "$src" -mindepth 1 -print0 | while IFS= read -r -d '' entry; do
    rel="${entry#"$src"/}"
    target="${dst}/${rel}"

    if [ -d "$entry" ]; then
      if [ "$APPLY" = "1" ]; then
        mkdir -p "$target"
      fi
      continue
    fi

    if [ -e "$target" ]; then
      echo "CONFLICT: ${entry} (destination already exists at ${target}, left in place for manual review)"
      echo "conflict" >> "$STATE_FILE"
      continue
    fi

    echo "MOVE: ${entry} -> ${target}"
    if [ "$APPLY" = "1" ]; then
      mkdir -p "$(dirname "$target")"
      mv "$entry" "$target"
    fi
    echo "moved" >> "$STATE_FILE"
  done

  if [ "$APPLY" = "1" ]; then
    find "$src" -depth -type d -empty -delete 2>/dev/null
    rmdir "$src" 2>/dev/null || true
  fi
}

merge_root_couch_files() {
  local f target
  shopt -s nullglob
  for f in "${DATA_DIR}"/*.couch; do
    target="${NEW_DBS_DIR}/$(basename "$f")"
    if [ -e "$target" ]; then
      echo "CONFLICT: ${f} (destination already exists at ${target}, left in place for manual review)"
      echo "conflict" >> "$STATE_FILE"
      continue
    fi
    echo "MOVE: ${f} -> ${target}"
    if [ "$APPLY" = "1" ]; then
      mkdir -p "$NEW_DBS_DIR"
      if ! mv "$f" "$target"; then
        echo "ERROR: failed to move ${f} -> ${target}" >&2
        exit 1
      fi
    fi
    echo "moved" >> "$STATE_FILE"
  done
  shopt -u nullglob
}

run_migration() {
  STATE_FILE="$(mktemp)"
  trap 'rm -f "$STATE_FILE"' EXIT

  echo "=== CouchDB shard recovery ==="
  echo "DATA_DIR=${DATA_DIR}"
  if [ "$APPLY" = "1" ]; then
    echo "Mode: APPLY (files will be moved)"
  else
    echo "Mode: DRY RUN (pass --apply to actually move files)"
  fi
  echo ""

  merge_root_couch_files
  merge_dir "${DATA_DIR}/shards" "${NEW_DBS_DIR}/shards"
  merge_dir "${DATA_DIR}/.shards" "${NEW_DBS_DIR}/.shards"
  merge_dir "${DATA_DIR}/_nodes" "${NEW_DBS_DIR}/_nodes"

  MOVED=$(grep -c '^moved$' "$STATE_FILE" || true)
  CONFLICTS=$(grep -c '^conflict$' "$STATE_FILE" || true)

  echo ""
  echo "=== Summary ==="
  echo "Files moved: ${MOVED}"
  echo "Conflicts (left untouched): ${CONFLICTS}"

  if [ "$APPLY" = "1" ]; then
    chown -R 5984:5984 "${NEW_DBS_DIR}" "${NEW_VIEWS_DIR}" 2>/dev/null || true
    echo ""
    echo "Ownership reset to 5984:5984 on ${NEW_DBS_DIR} and ${NEW_VIEWS_DIR}."
    echo "You can now start CouchDB and run '$0 verify' against it."
  elif [ "$MOVED" -gt 0 ] || [ "$CONFLICTS" -gt 0 ]; then
    echo ""
    echo "Re-run with --apply to perform the moves above. Make sure CouchDB is stopped and the volume is backed up first."
  else
    echo ""
    echo "No orphaned files found under ${DATA_DIR}. This instance does not show signs of the partial-migration bug."
  fi
}

run_verify() {
  local auth=()
  if [ -n "$VERIFY_USER" ] && [ -n "$VERIFY_PASSWORD" ]; then
    auth=(-u "${VERIFY_USER}:${VERIFY_PASSWORD}")
  fi

  local all_dbs
  all_dbs="$(curl -s "${auth[@]}" "${VERIFY_URL}/_all_dbs")"
  if [ -z "$all_dbs" ]; then
    echo "Could not reach ${VERIFY_URL}/_all_dbs. Is CouchDB running and are --user/--password correct?" >&2
    exit 1
  fi

  echo "=== Databases reported missing/unavailable ==="
  local dbs db status_code missing=0
  dbs=$(echo "$all_dbs" | tr -d '[]"' | tr ',' '\n')
  for db in $dbs; do
    [ -z "$db" ] && continue
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "${auth[@]}" "${VERIFY_URL}/${db}")
    if [ "$status_code" != "200" ]; then
      echo "  ${db}: HTTP ${status_code}"
      missing=$((missing + 1))
    fi
  done

  echo ""
  echo "=== Summary ==="
  echo "Databases checked: $(echo "$dbs" | grep -c .)"
  echo "Databases not returning 200: ${missing}"
  if [ "$missing" -gt 0 ]; then
    echo ""
    echo "These are known to CouchDB's registry but their shard files could not be opened."
    echo "If you have not already, run '$0 migrate --apply' against the stopped data volume, then restart CouchDB and re-run verify."
  fi
}

case "$COMMAND" in
  diagnose)
    APPLY=0
    run_migration
    ;;
  migrate)
    run_migration
    ;;
  verify)
    run_verify
    ;;
  *)
    echo "Unknown command: ${COMMAND}" >&2
    usage
    exit 1
    ;;
esac

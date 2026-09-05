#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/create-hotfix.sh [--version VERSION] [--dry-run]

Creates the release base branch and its hotfix branch from the latest cloud
release tag. VERSION is the base version, for example 3.44.1; it is normally
detected automatically from the latest vX.Y.Z-cloud[.N] tag.
EOF
}

version_override=""
dry_run=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      if [[ $# -lt 2 ]]; then
        echo "--version requires a value" >&2
        usage >&2
        exit 1
      fi
      version_override="$2"
      shift 2
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "$dry_run" != true && -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean; commit or stash changes before creating a hotfix." >&2
  exit 1
fi

git fetch origin --tags

cloud_tag=""
if [[ -n "$version_override" ]]; then
  if [[ ! "$version_override" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Invalid version: $version_override (expected X.Y.Z)" >&2
    exit 1
  fi

  cloud_tag=$(git tag -l "v${version_override}-cloud*" --sort=-v:refname | \
    grep -E "^v${version_override//./\\.}-cloud(\\.[0-9]+)?$" | head -n 1 || true)
else
  cloud_tag=$(git tag -l "v*-cloud*" --sort=-v:refname | \
    grep -E '^v[0-9]+\.[0-9]+\.[0-9]+-cloud(\.[0-9]+)?$' | head -n 1 || true)
fi

if [[ -z "$cloud_tag" ]]; then
  if [[ -n "$version_override" ]]; then
    echo "No cloud release tag found for version $version_override." >&2
  else
    echo "No cloud release tags matching vX.Y.Z-cloud[.N] were found." >&2
  fi
  exit 1
fi

version="${cloud_tag#v}"
version="${version%-cloud*}"
base_branch="$version"
hotfix_branch="hotfix/$version"

if git show-ref --verify --quiet "refs/heads/$base_branch" || \
  git ls-remote --exit-code --heads origin "$base_branch" >/dev/null 2>&1; then
  echo "Base branch already exists: $base_branch" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$hotfix_branch" || \
  git ls-remote --exit-code --heads origin "$hotfix_branch" >/dev/null 2>&1; then
  echo "Hotfix branch already exists: $hotfix_branch" >&2
  exit 1
fi

echo "Cloud release tag: $cloud_tag"
echo "Base branch: $base_branch"
echo "Hotfix branch: $hotfix_branch"

if [[ "$dry_run" == true ]]; then
  exit 0
fi

git switch -c "$base_branch" "$cloud_tag"
git push --set-upstream origin "$base_branch"
git switch -c "$hotfix_branch" "$base_branch"
git push --set-upstream origin "$hotfix_branch"

cat <<EOF

Hotfix branches created from $cloud_tag.
You are now on $hotfix_branch. Apply the fix or cherry-pick it from master,
then push the resulting commit(s).
EOF

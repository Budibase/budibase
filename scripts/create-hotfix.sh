#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/create-hotfix.sh [--version VERSION] [--dry-run] [--force]

Creates the release base branch and its hotfix branch from the latest cloud
release tag. VERSION is the base version, for example 3.44.1; it is normally
detected automatically from the latest vX.Y.Z-cloud[.N] tag.

Use --force to replace existing release and hotfix branches. This deletes the
matching remote branches and resets matching local branches to the cloud tag.
Replacement is refused if either target branch is checked out in a worktree.
EOF
}

version_override=""
dry_run=false
force=false

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
    --force)
      force=true
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

if [[ -n "$version_override" && ! "$version_override" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid version: $version_override (expected X.Y.Z)" >&2
  exit 1
fi

if ! remote_tags=$(git ls-remote --tags --refs origin "refs/tags/v*-cloud*"); then
  echo "Unable to retrieve cloud release tags from origin." >&2
  exit 1
fi

cloud_tag=""
best_version=(0 0 0 0)

while IFS=$'\t' read -r _ ref; do
  tag="${ref#refs/tags/}"
  if [[ ! "$tag" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)-cloud(\.([0-9]+))?$ ]]; then
    continue
  fi

  tag_version="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.${BASH_REMATCH[3]}"
  if [[ -n "$version_override" && "$tag_version" != "$version_override" ]]; then
    continue
  fi

  candidate_version=(
    "$((10#${BASH_REMATCH[1]}))"
    "$((10#${BASH_REMATCH[2]}))"
    "$((10#${BASH_REMATCH[3]}))"
    "$((10#${BASH_REMATCH[5]:-0}))"
  )
  is_newer=false
  if [[ -z "$cloud_tag" ]]; then
    is_newer=true
  else
    for index in 0 1 2 3; do
      if (( candidate_version[index] > best_version[index] )); then
        is_newer=true
        break
      fi
      if (( candidate_version[index] < best_version[index] )); then
        break
      fi
    done
  fi

  if [[ "$is_newer" == true ]]; then
    cloud_tag="$tag"
    best_version=("${candidate_version[@]}")
  fi
done <<< "$remote_tags"

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

remote_branch_commit() {
  local branch="$1"
  local expected_ref="refs/heads/$branch"
  local remote_refs

  if ! remote_refs=$(git ls-remote --heads origin "$expected_ref"); then
    echo "Unable to check branch $branch on origin." >&2
    return 1
  fi

  awk -v expected_ref="$expected_ref" '$2 == expected_ref { print $1 }' <<< "$remote_refs"
}

branch_exists() {
  local branch="$1"
  local local_commit remote_commit

  local_commit=$(git show-ref --verify --hash "refs/heads/$branch" 2>/dev/null || true)
  if ! remote_commit=$(remote_branch_commit "$branch"); then
    return 2
  fi
  [[ -n "$local_commit" || -n "$remote_commit" ]]
}

echo "Cloud release tag: $cloud_tag"
echo "Base branch: $base_branch"
echo "Hotfix branch: $hotfix_branch"

check_target_worktrees() {
  local worktree_list current_worktree="" line branch

  if ! worktree_list=$(git worktree list --porcelain); then
    echo "Unable to inspect git worktrees." >&2
    return 1
  fi

  while IFS= read -r line; do
    case "$line" in
      worktree\ *)
        current_worktree="${line#worktree }"
        ;;
      branch\ refs/heads/*)
        branch="${line#branch refs/heads/}"
        if [[ "$branch" == "$base_branch" || "$branch" == "$hotfix_branch" ]]; then
          echo "Cannot replace branch $branch: it is checked out in $current_worktree." >&2
          return 1
        fi
        ;;
    esac
  done <<< "$worktree_list"
}

if [[ "$force" == true ]]; then
  check_target_worktrees
fi

if [[ "$dry_run" == true ]]; then
  for branch in "$base_branch" "$hotfix_branch"; do
    if branch_exists "$branch"; then
      if [[ "$force" == true ]]; then
        echo "Would replace existing branch: $branch"
      else
        echo "Branch already exists: $branch (use --force to replace it)." >&2
        exit 1
      fi
    else
      branch_status=$?
      if (( branch_status == 2 )); then
        exit 1
      fi
    fi
  done
  exit 0
fi

git fetch --no-tags origin "refs/tags/$cloud_tag"
cloud_commit=$(git rev-parse --verify 'FETCH_HEAD^{commit}')

if [[ "$force" == true ]]; then
  delete_remote_branch() {
    local branch="$1"
    local remote_commit

    if ! remote_commit=$(remote_branch_commit "$branch"); then
      return 1
    fi
    if [[ -n "$remote_commit" ]]; then
      echo "Deleting remote branch: $branch"
      git push origin --delete "$branch"
    fi
  }

  delete_remote_branch "$base_branch"
  delete_remote_branch "$hotfix_branch"
fi

ensure_branch() {
  local branch="$1"
  local local_commit remote_commit

  local_commit=$(git show-ref --verify --hash "refs/heads/$branch" 2>/dev/null || true)
  if ! remote_commit=$(remote_branch_commit "$branch"); then
    return 1
  fi

  if [[ "$force" == true ]]; then
    if [[ -n "$local_commit" ]]; then
      git branch -f "$branch" "$cloud_commit"
    else
      git branch "$branch" "$cloud_commit"
    fi
  else
    if [[ -n "$local_commit" && "$local_commit" != "$cloud_commit" ]]; then
      echo "Local branch $branch does not point to $cloud_tag." >&2
      return 1
    fi
    if [[ -n "$remote_commit" && "$remote_commit" != "$cloud_commit" ]]; then
      echo "Remote branch $branch does not point to $cloud_tag." >&2
      return 1
    fi

    if [[ -z "$local_commit" ]]; then
      git branch "$branch" "$cloud_commit"
    fi
  fi

  git push --set-upstream origin "$branch"
}

ensure_branch "$base_branch"
ensure_branch "$hotfix_branch"
git switch "$hotfix_branch"

cat <<EOF

Hotfix branches created from $cloud_tag.
You are now on $hotfix_branch. Apply the fix or cherry-pick it from master,
then push the resulting commit(s).
EOF

#!/usr/bin/env bash
# Pre-commit hook for Helm chart validation.
# Only runs when files under charts/ are staged.
set -euo pipefail

CHART_DIR="charts/budibase"

# Check if any chart files are staged
STAGED_CHART_FILES=$(git diff --cached --name-only -- "$CHART_DIR" 2>/dev/null || true)
if [ -z "$STAGED_CHART_FILES" ]; then
  exit 0
fi

echo "Helm chart files changed — running validation..."

# 1. helm lint
if command -v helm &>/dev/null; then
  echo "  → helm lint"
  helm lint "$CHART_DIR"
else
  echo "  ⚠ helm not found, skipping lint"
fi

# 2. helm-unittest (if plugin installed)
if helm plugin list 2>/dev/null | grep -q unittest; then
  echo "  → helm unittest"
  helm unittest "$CHART_DIR"
else
  echo "  ⚠ helm-unittest plugin not installed, skipping unit tests"
  echo "    Install with: helm plugin install https://github.com/helm-unittest/helm-unittest.git"
fi

# 3. kubeconform (if installed)
if command -v kubeconform &>/dev/null; then
  echo "  → kubeconform"
  helm template budibase "$CHART_DIR" --set services.couchdb.enabled=false | \
    kubeconform -strict -summary -output text
else
  echo "  ⚠ kubeconform not found, skipping schema validation"
  echo "    Install from: https://github.com/yannh/kubeconform/releases"
fi

echo "Helm validation passed."

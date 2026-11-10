#!/usr/bin/env bash
# Deploy this repository's Helm chart to an existing Kubernetes cluster.
set -euo pipefail
umask 077

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
COMMAND=up
CONFIG=
CONTEXT=
NAMESPACE=budibase
RELEASE=budibase
APP_VERSION=
STORAGE_CLASS=
STATE_DIR=
PORT=10000
HELM_FLAGS=(--wait --timeout 15m)

die() { echo "ERROR: $*" >&2; exit 1; }
usage() {
  cat <<'EOF'
Usage: scripts/deploy-k8s.sh [up|serve|status] --kubeconfig FILE [options]

Deploy this checkout's Helm chart to an existing local or remote cluster.
up is the default command. No Docker or kind installation is required.

  --kubeconfig FILE       Required kubeconfig file (one file, not a path list)
  --context NAME          Context in that file (defaults to its current-context)
  --namespace NAME        Namespace to create/use (default: budibase)
  --release NAME          Helm release name (default: budibase)
  --app-version TAG       Required for up, e.g. v3.50.0; use on every deployment
  --storage-class NAME    Storage class for CouchDB, MinIO, and Redis
                         (omitting this uses the cluster's default class)
  -f, --values FILE       Additional Helm values; repeatable, later files win
  --state-dir DIR        Private directory for generated values and target identity
                         (default: ~/.local/state/budibase-k8s/<target hash>)
  --port NUMBER          Local loopback port for serve (default: 10000)
  -h, --help             Show this help

Defaults deploy one replica per service, bundled CouchDB/MinIO/Redis with
persistent storage, and no ingress. Values files override those defaults.
CLI --app-version and --storage-class override values files. Keep the same
state directory for upgrades. The chart currently supports one Budibase
release per namespace because several resource names are fixed.

Example:
  scripts/deploy-k8s.sh --kubeconfig ./config --context staging \
    --namespace budibase-test --app-version v3.50.0 --storage-class standard
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    up|serve|status) COMMAND=$1; shift ;;
    -h|--help) usage; exit 0 ;;
    --kubeconfig|--context|--namespace|--release|--app-version|--storage-class|--state-dir|--port|-f|--values)
      [ "$#" -ge 2 ] && [ -n "$2" ] || die "$1 requires a value."
      case "$1" in
        --kubeconfig) CONFIG=$2 ;;
        --context) CONTEXT=$2 ;;
        --namespace) NAMESPACE=$2 ;;
        --release) RELEASE=$2 ;;
        --app-version) APP_VERSION=$2 ;;
        --storage-class) STORAGE_CLASS=$2 ;;
        --state-dir) STATE_DIR=$2 ;;
        --port) PORT=$2 ;;
        -f|--values)
          [ -f "$2" ] || die "Values file not found: $2"
          HELM_FLAGS+=(-f "$2") ;;
      esac
      shift 2 ;;
    *) die "Unknown argument: $1 (use --help)." ;;
  esac
done

[ -n "$CONFIG" ] && [ -f "$CONFIG" ] || die "Pass --kubeconfig with an existing file."
[[ "$NAMESPACE" =~ ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$ ]] && [ "${#NAMESPACE}" -le 63 ] || die "Invalid namespace."
[[ "$RELEASE" =~ ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$ ]] && [ "${#RELEASE}" -le 53 ] || die "Release must be a DNS label of at most 53 characters."
[[ "$PORT" =~ ^[0-9]+$ ]] && [ "$PORT" -ge 1 ] && [ "$PORT" -le 65535 ] || die "Invalid port."
if [ "$COMMAND" = up ]; then
  [[ "$APP_VERSION" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$ ]] || die "Pass --app-version with a published Budibase image tag."
fi
for tool in kubectl helm jq openssl; do
  command -v "$tool" >/dev/null || die "Missing dependency: $tool"
done
if [ -z "$CONTEXT" ]; then
  CONTEXT=$(kubectl --kubeconfig "$CONFIG" config current-context)
fi
[ -n "$CONTEXT" ] || die "The kubeconfig has no current-context; pass --context."
k() { kubectl --kubeconfig "$CONFIG" --context "$CONTEXT" -n "$NAMESPACE" "$@"; }

case "$COMMAND" in
  up)
    TARGET=$(k config view --minify -o json | jq -cS --arg context "$CONTEXT" \
      --arg namespace "$NAMESPACE" --arg release "$RELEASE" \
      '{server: .clusters[0].cluster.server, context: $context, namespace: $namespace, release: $release}')
    k --request-timeout=15s get --raw=/version >/dev/null
    if [ -z "$STATE_DIR" ]; then
      TARGET_HASH=$(printf '%s' "$TARGET" | openssl dgst -sha256 | awk '{print $NF}')
      STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/budibase-k8s/$TARGET_HASH"
    fi
    mkdir -p "$STATE_DIR"
    if [ -f "$STATE_DIR/target.json" ]; then
      [ "$(cat "$STATE_DIR/target.json")" = "$TARGET" ] || die "STATE_DIR belongs to another cluster/context, namespace, or release."
    else
      printf '%s\n' "$TARGET" > "$STATE_DIR/target.json"
    fi
    if [ ! -f "$STATE_DIR/values.yaml" ]; then
      EXISTING=$(helm --kubeconfig "$CONFIG" --kube-context "$CONTEXT" -n "$NAMESPACE" \
        list --deployed --failed --pending --uninstalling --uninstalled --filter "^$RELEASE$" -o json)
      [ "$(printf '%s' "$EXISTING" | jq 'length')" = 0 ] || die "Release already exists. Restore its saved values.yaml in STATE_DIR before deploying."
      cat > "$STATE_DIR/values.yaml" <<EOF
ingress:
  enabled: false
podDisruptionBudget:
  enabled: false
globals:
  appVersion: "$APP_VERSION"
  enableAnalytics: "0"
  internalApiKey: "$(openssl rand -hex 32)"
  jwtSecret: "$(openssl rand -hex 32)"
  apiEncryptionKey: "$(openssl rand -hex 16)"
  bbEncryptionKey: "$(openssl rand -hex 16)"
services:
  proxy:
    replicaCount: 1
    preStopDelaySeconds: 0
  apps:
    replicaCount: 1
    preStopDelaySeconds: 0
  worker:
    replicaCount: 1
    preStopDelaySeconds: 0
  automationWorkers:
    replicaCount: 1
  objectStore:
    region: us-east-1
    accessKey: "$(openssl rand -hex 16)"
    secretKey: "$(openssl rand -hex 32)"
  redis:
    password: "$(openssl rand -hex 24)"
couchdb:
  adminUsername: admin
  adminPassword: "$(openssl rand -hex 24)"
  cookieAuthSecret: "$(openssl rand -hex 32)"
  erlangFlags:
    setcookie: "$(openssl rand -hex 24)"
  persistentVolume:
    enabled: true
    mountPath: /data
  extraEnvs:
    - name: DATA_DIR
      value: /data
EOF
    fi
    if [ -n "$STORAGE_CLASS" ]; then
      HELM_FLAGS+=(--set-string "couchdb.persistentVolume.storageClass=$STORAGE_CLASS"
        --set-string "services.redis.storageClass=$STORAGE_CLASS"
        --set-string "services.objectStore.storageClass=$STORAGE_CLASS")
    fi
    echo "Deploying $RELEASE to context $CONTEXT, namespace $NAMESPACE"
    echo "Retained values: $STATE_DIR/values.yaml"
    helm upgrade --install "$RELEASE" "$ROOT/charts/budibase" \
      --kubeconfig "$CONFIG" --kube-context "$CONTEXT" \
      --namespace "$NAMESPACE" --create-namespace -f "$STATE_DIR/values.yaml" \
      "${HELM_FLAGS[@]}" --set-string "globals.appVersion=$APP_VERSION"
    echo "Ready. Use serve with the same kubeconfig/context/namespace to open http://127.0.0.1:$PORT" ;;
  serve)
    helm --kubeconfig "$CONFIG" --kube-context "$CONTEXT" -n "$NAMESPACE" status "$RELEASE" >/dev/null
    echo "Budibase: http://127.0.0.1:$PORT (Ctrl-C stops forwarding)"
    exec kubectl --kubeconfig "$CONFIG" --context "$CONTEXT" -n "$NAMESPACE" \
      port-forward --address 127.0.0.1 svc/proxy-service "$PORT:10000" ;;
  status)
    helm --kubeconfig "$CONFIG" --kube-context "$CONTEXT" -n "$NAMESPACE" status "$RELEASE"
    k get deployments,statefulsets,pods,pvc ;;
esac

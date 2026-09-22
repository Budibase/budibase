#!/bin/bash
# Runs the container structure tests against the single image.
# See: https://github.com/googlecontainertools/container-structure-test
set -eo pipefail
cd "$(dirname "$0")/.."

CONFIG="hosting/single/structure-test.yaml"
CST_VERSION="${CST_VERSION:-v1.16.0}"

if [[ -z "${IMAGE:-}" ]]; then
    IMAGE="budibase:latest"
    echo "Building local ${IMAGE} before running structure tests..."
    ./scripts/build-single-image.sh
fi

if ! docker image inspect "${IMAGE}" >/dev/null 2>&1; then
    echo "Image ${IMAGE} not found."
    exit 1
fi

if command -v container-structure-test >/dev/null 2>&1; then
    CST="container-structure-test"
else
    case "$(uname -s)" in
        Darwin) os="darwin" ;;
        *) os="linux" ;;
    esac
    case "$(uname -m)" in
        arm64 | aarch64) arch="arm64" ;;
        *) arch="amd64" ;;
    esac
    CST="$(mktemp -d)/container-structure-test"
    echo "Downloading container-structure-test ${CST_VERSION} (${os}-${arch})..."
    curl -sSLo "${CST}" \
        "https://storage.googleapis.com/container-structure-test/${CST_VERSION}/container-structure-test-${os}-${arch}"
    chmod +x "${CST}"
fi

echo "Testing ${IMAGE} against ${CONFIG}"
exec "${CST}" test --image "${IMAGE}" --config "${CONFIG}"

#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="${SCRIPT_DIR}/certs"

mkdir -p "${CERT_DIR}"

openssl req \
  -x509 \
  -nodes \
  -newkey rsa:2048 \
  -sha256 \
  -days 3650 \
  -keyout "${CERT_DIR}/ca.key" \
  -out "${CERT_DIR}/ca.crt" \
  -subj "/CN=Budibase Redis TLS CA" \
  -addext "basicConstraints=critical,CA:TRUE" \
  -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -addext "subjectKeyIdentifier=hash"

openssl req \
  -nodes \
  -newkey rsa:2048 \
  -keyout "${CERT_DIR}/server.key" \
  -out "${CERT_DIR}/server.csr" \
  -subj "/CN=localhost"

cat > "${CERT_DIR}/server.ext" <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
subjectAltName=DNS:localhost,IP:127.0.0.1
extendedKeyUsage=serverAuth
EOF

openssl x509 \
  -req \
  -in "${CERT_DIR}/server.csr" \
  -CA "${CERT_DIR}/ca.crt" \
  -CAkey "${CERT_DIR}/ca.key" \
  -CAcreateserial \
  -out "${CERT_DIR}/server.crt" \
  -days 3650 \
  -sha256 \
  -extfile "${CERT_DIR}/server.ext"

rm -f "${CERT_DIR}/server.csr" "${CERT_DIR}/server.ext" "${CERT_DIR}/ca.srl"
chmod 600 "${CERT_DIR}/ca.key" "${CERT_DIR}/server.key"

echo "TLS certs generated in ${CERT_DIR}"

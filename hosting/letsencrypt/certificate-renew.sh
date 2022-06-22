#!/bin/bash
CUSTOM_DOMAIN="$1"

if [[ ! -z "${CUSTOM_DOMAIN}" ]]; then
    certbot certonly --webroot --webroot-path="/var/www/html" \
        --register-unsafely-without-email \
        --domains $CUSTOM_DOMAIN \
        --rsa-key-size 4096 \
        --agree-tos \
        --force-renewal

    nginx -s reload
fi

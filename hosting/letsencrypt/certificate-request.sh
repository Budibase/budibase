#!/bin/bash
CUSTOM_DOMAIN="$1"
# Request from Lets Encrypt
certbot certonly --webroot --webroot-path="/var/www/html" \
    --register-unsafely-without-email \
    --domains $CUSTOM_DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal

if (($? != 0)); then
    echo "ERROR: certbot request failed for $CUSTOM_DOMAIN use http on port 80 - exiting"
    exit 1
else
    cp /app/letsencrypt/options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf
    cp /app/letsencrypt/ssl-dhparams.pem /etc/letsencrypt/ssl-dhparams.pem
    cp /app/letsencrypt/nginx-ssl.conf /etc/nginx/sites-available/nginx-ssl.conf
    sed -i "s/CUSTOM_DOMAIN/$CUSTOM_DOMAIN/g" /etc/nginx/sites-available/nginx-ssl.conf
    ln -s /etc/nginx/sites-available/nginx-ssl.conf /etc/nginx/sites-enabled/nginx-ssl.conf

    echo "INFO: restart nginx after certbot request"
    /etc/init.d/nginx restart
fi

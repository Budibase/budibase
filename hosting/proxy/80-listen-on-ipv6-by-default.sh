#!/bin/sh
# vim:sw=4:ts=4:et

set -e

ME=$(basename $0)
NGINX_CONF_FILE="/etc/nginx/nginx.conf"
DEFAULT_CONF_FILE="/etc/nginx/conf.d/default.conf"

# check if we have ipv6 available
if [ ! -f "/proc/net/if_inet6" ]; then
    # ipv6 not available so delete lines from nginx conf
    if [ -f "$NGINX_CONF_FILE" ]; then
        sed -i '/listen  \[::\]/d' $NGINX_CONF_FILE
    fi
    if [ -f "$DEFAULT_CONF_FILE" ]; then
        sed -i '/listen  \[::\]/d' $DEFAULT_CONF_FILE
    fi
    echo "$ME: info: ipv6 not available so delete lines from nginx conf"
else
    echo "$ME: info: ipv6 is available so no need to delete lines from nginx conf"
fi

exit 0
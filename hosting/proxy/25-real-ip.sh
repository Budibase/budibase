#!/bin/sh
# Expands PROXY_REAL_IP_FROM into one set_real_ip_from directive per entry.
# nginx has no way to take a list in a single directive, so this cannot be done
# with the envsubst pass that handles the rest of the template.
set -eu

output=/etc/nginx/real-ip.conf
: > "$output"

for cidr in $(printf '%s' "${PROXY_REAL_IP_FROM:-}" | tr ',;' '  '); do
  case "$cidr" in
    # these mean "let anyone claim to be anyone", which defeats the point of
    # having a trusted proxy list at all
    0.0.0.0/0 | ::/0 | any)
      echo "PROXY_REAL_IP_FROM must not contain $cidr: it would trust X-Forwarded-For from every client, making rate limiting and login lockout trivially spoofable. List your load balancer's CIDRs instead." >&2
      exit 1
      ;;
    *[!0-9a-fA-F.:/]*)
      echo "PROXY_REAL_IP_FROM contains an invalid entry: $cidr" >&2
      exit 1
      ;;
  esac
  echo "set_real_ip_from $cidr;" >> "$output"
done

if [ ! -s "$output" ]; then
  echo "PROXY_REAL_IP_FROM is empty, X-Forwarded-For will be ignored and \$remote_addr will be the peer that connected. Set it to your load balancer's CIDRs if this proxy sits behind one." >&2
fi

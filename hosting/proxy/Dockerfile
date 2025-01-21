FROM nginx:latest

# nginx.conf
# use the default nginx behaviour for *.template files which are processed with envsubst
# override the output dir to output directly to /etc/nginx instead of /etc/nginx/conf.d
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
COPY nginx.prod.conf /etc/nginx/templates/nginx.conf.template

# IPv6 removal needs to happen after envsubst
RUN rm -rf /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
COPY 80-listen-on-ipv6-by-default.sh /docker-entrypoint.d/80-listen-on-ipv6-by-default.sh
RUN chmod +x /docker-entrypoint.d/80-listen-on-ipv6-by-default.sh

# Error handling
COPY error.html /usr/share/nginx/html/error.html

# Default environment
ENV PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND=10
ENV PROXY_RATE_LIMIT_API_PER_SECOND=20
# Use docker-compose values as defaults for backwards compatibility
ENV APPS_UPSTREAM_URL=http://app-service:4002
ENV WORKER_UPSTREAM_URL=http://worker-service:4003
ENV MINIO_UPSTREAM_URL=http://minio-service:9000
ENV COUCHDB_UPSTREAM_URL=http://couchdb-service:5984
ENV RESOLVER=127.0.0.11

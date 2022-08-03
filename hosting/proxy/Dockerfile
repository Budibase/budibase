FROM nginx:latest

ENV ENABLE_DYNAMIC_CONFIG=0
ENV APPS_UPSTREAM_URL=http://app-service:4002
ENV WORKER_UPSTREAM_URL=http://worker-service:4003
ENV MINIO_UPSTREAM_URL=http://minio-service:9000
ENV WATCHTOWER_UPSTREAM_URL=http://watchtower-service:8080
ENV RESOLVER=127.0.0.11

COPY 99-envsubst-nginx-conf.sh /docker-entrypoint.d
COPY .generated-nginx-dyn.prod.conf /etc/nginx/nginx-dyn.conf.template

# nginx.conf
# use the default nginx behaviour for *.template files which are processed with envsubst
# override the output dir to output directly to /etc/nginx instead of /etc/nginx/conf.d
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
COPY .generated-nginx.prod.conf /etc/nginx/templates/nginx.conf.template

# Error handling
COPY error.html /usr/share/nginx/html/error.html

# Default environment
ENV PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND=10

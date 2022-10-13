FROM nginx:latest

# nginx.conf
# use the default nginx behaviour for *.template files which are processed with envsubst
# override the output dir to output directly to /etc/nginx instead of /etc/nginx/conf.d
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx
COPY .generated-nginx.prod.conf /etc/nginx/templates/nginx.conf.template
COPY 10-listen-on-ipv6-by-default.sh /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Error handling
COPY error.html /usr/share/nginx/html/error.html

# Default environment
ENV PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND=10
ENV PROXY_RATE_LIMIT_API_PER_SECOND=20
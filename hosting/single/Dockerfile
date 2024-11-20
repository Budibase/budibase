ARG BASEIMG=budibase/couchdb:v3.3.3-sqs-v2.1.1
FROM node:20-slim as build

# install node-gyp dependencies
RUN apt-get update && apt-get install -y --no-install-recommends g++ make python3 jq

# copy and install dependencies
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY lerna.json .
COPY .yarnrc .

COPY packages/server/package.json packages/server/package.json
COPY packages/worker/package.json packages/worker/package.json


COPY scripts/removeWorkspaceDependencies.sh scripts/removeWorkspaceDependencies.sh
RUN chmod +x ./scripts/removeWorkspaceDependencies.sh
RUN ./scripts/removeWorkspaceDependencies.sh packages/server/package.json
RUN ./scripts/removeWorkspaceDependencies.sh packages/worker/package.json

RUN jq 'del(.scripts.postinstall)' package.json > temp.json && mv temp.json package.json
RUN ./scripts/removeWorkspaceDependencies.sh package.json
ARG TARGETPLATFORM
RUN --mount=type=cache,target=/root/.yarn/${TARGETPLATFORM} YARN_CACHE_FOLDER=/root/.yarn/${TARGETPLATFORM} yarn install --production --frozen-lockfile

# copy the actual code
COPY packages/server/dist packages/server/dist
COPY packages/server/pm2.config.js packages/server/pm2.config.js
COPY packages/server/client packages/server/client
COPY packages/server/builder packages/server/builder
COPY packages/worker/dist packages/worker/dist
COPY packages/worker/pm2.config.js packages/worker/pm2.config.js


FROM $BASEIMG as runner
ARG TARGETARCH
ENV TARGETARCH $TARGETARCH
#TARGETBUILD can be set to single (for single docker image) or aas (for azure app service)
# e.g. docker build --build-arg TARGETBUILD=aas ....
ARG TARGETBUILD=single
ENV TARGETBUILD $TARGETBUILD

# install base dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends software-properties-common nginx uuid-runtime redis-server libaio1

# Install postgres client for pg_dump utils
RUN apt install -y software-properties-common apt-transport-https ca-certificates gnupg \
  && curl -fsSl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /usr/share/keyrings/postgresql.gpg > /dev/null \
  && echo deb [arch=amd64,arm64,ppc64el signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main | tee /etc/apt/sources.list.d/postgresql.list \
  && apt update -y \
  && apt install postgresql-client-15 -y \
  && apt remove software-properties-common apt-transport-https gpg -y

# We use pm2 in order to run multiple node processes in a single container
RUN npm install --global pm2

# setup nginx
COPY hosting/single/nginx/nginx.conf /etc/nginx
COPY hosting/single/nginx/nginx-default-site.conf /etc/nginx/sites-enabled/default
RUN mkdir -p /var/log/nginx && \
  touch /var/log/nginx/error.log && \
  touch /var/run/nginx.pid && \
  usermod -a -G tty www-data

# setup minio
WORKDIR /minio
COPY scripts/install-minio.sh ./install.sh
RUN chmod +x install.sh && ./install.sh

# setup redis
COPY hosting/single/redis.conf /etc/redis/redis.conf

# setup runner file
WORKDIR /
COPY hosting/single/runner.sh .
RUN chmod +x ./runner.sh
COPY hosting/single/healthcheck.sh .
RUN chmod +x ./healthcheck.sh

# Script below sets the path for storing data based on $DATA_DIR
# For Azure App Service install SSH & point data locations to /home
COPY hosting/single/ssh/sshd_config /etc/
COPY hosting/single/ssh/ssh_setup.sh /tmp

#  setup letsencrypt certificate
RUN apt-get install -y certbot python3-certbot-nginx
COPY hosting/letsencrypt /app/letsencrypt
RUN chmod +x /app/letsencrypt/certificate-request.sh /app/letsencrypt/certificate-renew.sh

COPY --from=build /app/node_modules /node_modules
COPY --from=build /app/package.json /package.json
COPY --from=build /app/packages/server /app
COPY --from=build /app/packages/worker /worker


EXPOSE 80
EXPOSE 443
# Expose port 2222 for SSH on Azure App Service build
EXPOSE 2222
VOLUME /data

ARG BUDIBASE_VERSION
# Ensuring the version argument is sent
RUN test -n "$BUDIBASE_VERSION"
ENV BUDIBASE_VERSION=$BUDIBASE_VERSION

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/healthcheck.sh"

# must set this just before running
ENV NODE_ENV=production
# this is required for isolated-vm to work on Node 20+
ENV NODE_OPTIONS="--no-node-snapshot"
WORKDIR /

CMD ["./runner.sh"]

FROM node:18-slim as build

# install node-gyp dependencies
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends apt-utils cron g++ make python3

# add pin script
WORKDIR /
ADD scripts/cleanup.sh ./
RUN chmod +x /cleanup.sh

# build server
WORKDIR /app
ADD packages/server .
COPY yarn.lock .
RUN yarn install --production=true --network-timeout 100000
RUN /cleanup.sh

# build worker
WORKDIR /worker
ADD packages/worker .
COPY yarn.lock .
RUN yarn install --production=true --network-timeout 100000
RUN /cleanup.sh

FROM budibase/couchdb
ARG TARGETARCH
ENV TARGETARCH $TARGETARCH
#TARGETBUILD can be set to single (for single docker image) or aas (for azure app service)
# e.g. docker build --build-arg TARGETBUILD=aas ....
ARG TARGETBUILD=single
ENV TARGETBUILD $TARGETBUILD

COPY --from=build /app /app
COPY --from=build /worker /worker

# install base dependencies
RUN apt-get update && \
  apt-get install -y --no-install-recommends software-properties-common nginx uuid-runtime redis-server

# Install postgres client for pg_dump utils
RUN apt install software-properties-common apt-transport-https gpg -y \
    && curl -fsSl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /usr/share/keyrings/postgresql.gpg > /dev/null \
    && echo deb [arch=amd64,arm64,ppc64el signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main | tee /etc/apt/sources.list.d/postgresql.list \
    && apt update -y \
    && apt install postgresql-client-15 -y \
    && apt remove software-properties-common apt-transport-https gpg -y

# install other dependencies, nodejs, oracle requirements, jdk8, redis, nginx
WORKDIR /nodejs
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh && \
  bash /tmp/nodesource_setup.sh && \
  apt-get install -y --no-install-recommends libaio1 nodejs && \
  npm install --global yarn pm2

# setup nginx
ADD hosting/single/nginx/nginx.conf /etc/nginx
ADD hosting/single/nginx/nginx-default-site.conf /etc/nginx/sites-enabled/default
RUN mkdir -p /var/log/nginx && \
  touch /var/log/nginx/error.log && \
  touch /var/run/nginx.pid && \
  usermod -a -G tty www-data

WORKDIR /
RUN mkdir -p scripts/integrations/oracle
ADD packages/server/scripts/integrations/oracle scripts/integrations/oracle
RUN /bin/bash -e ./scripts/integrations/oracle/instantclient/linux/install.sh

# setup minio
WORKDIR /minio
ADD scripts/install-minio.sh ./install.sh
RUN chmod +x install.sh && ./install.sh

# setup runner file
WORKDIR /
ADD hosting/single/runner.sh .
RUN chmod +x ./runner.sh
ADD hosting/single/healthcheck.sh .
RUN chmod +x ./healthcheck.sh

# Script below sets the path for storing data based on $DATA_DIR
# For Azure App Service install SSH & point data locations to /home
ADD hosting/single/ssh/sshd_config /etc/
ADD hosting/single/ssh/ssh_setup.sh /tmp
RUN /build-target-paths.sh

# cleanup cache
RUN yarn cache clean -f

EXPOSE 80
EXPOSE 443
# Expose port 2222 for SSH on Azure App Service build
EXPOSE 2222
VOLUME /data

#  setup letsencrypt certificate
RUN apt-get install -y certbot python3-certbot-nginx
ADD hosting/letsencrypt /app/letsencrypt
RUN chmod +x /app/letsencrypt/certificate-request.sh /app/letsencrypt/certificate-renew.sh
# Remove cached files
RUN rm -rf \
  /root/.cache \
  /root/.npm \
  /root/.pip \
  /usr/local/share/doc \
  /usr/share/doc \
  /usr/share/man \
  /var/lib/apt/lists/* \
  /tmp/*

HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/healthcheck.sh"

# must set this just before running
ENV NODE_ENV=production
WORKDIR /

CMD ["./runner.sh"]

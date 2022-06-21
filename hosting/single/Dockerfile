FROM node:14-slim as build

# install node-gyp dependencies
RUN apt-get update && apt-get install -y --no-install-recommends g++ make python

# add pin script
WORKDIR /
ADD scripts/pinVersions.js scripts/cleanup.sh ./
RUN chmod +x /cleanup.sh

# build server
WORKDIR /app
ADD packages/server .
RUN node /pinVersions.js && yarn && yarn build && /cleanup.sh

# build worker
WORKDIR /worker
ADD packages/worker .
RUN node /pinVersions.js && yarn && yarn build && /cleanup.sh

FROM couchdb:3.2.1

ARG TARGETARCH

COPY --from=build /app /app
COPY --from=build /worker /worker

ENV DEPLOYMENT_ENVIRONMENT=docker \
  POSTHOG_TOKEN=phc_fg5I3nDOf6oJVMHSaycEhpPdlgS8rzXG2r6F2IpxCHS \
  COUCHDB_PASSWORD=budibase \
  COUCHDB_USER=budibase \
  COUCH_DB_URL=http://budibase:budibase@localhost:5984 \
  BUDIBASE_ENVIRONMENT=PRODUCTION \
  MINIO_URL=http://localhost:9000 \
  REDIS_URL=localhost:6379 \
  WORKER_URL=http://localhost:4002 \
  INTERNAL_API_KEY=budibase \
  JWT_SECRET=testsecret \
  MINIO_ACCESS_KEY=budibase \
  MINIO_SECRET_KEY=budibase \
  SELF_HOSTED=1 \
  CLUSTER_PORT=10000 \
  REDIS_PASSWORD=budibase \
  APP_PORT=4001 \
  WORKER_PORT=4002

# install base dependencies
RUN apt-get update && \
  apt-get install software-properties-common wget -y && \
  apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main' && \
  apt-get update

# install other dependencies, nodejs, oracle requirements, jdk8, redis, nginx
WORKDIR /nodejs
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh && \
  bash /tmp/nodesource_setup.sh && \
  apt-get install libaio1 nodejs nginx openjdk-8-jdk redis-server unzip -y && \
  npm install --global yarn pm2

# setup nginx
ADD hosting/single/nginx.conf /etc/nginx
RUN mkdir /etc/nginx/logs && \
  useradd www && \
  touch /etc/nginx/logs/error.log && \
  touch /etc/nginx/logs/nginx.pid

WORKDIR /
RUN mkdir -p scripts/integrations/oracle
ADD packages/server/scripts/integrations/oracle scripts/integrations/oracle
RUN /bin/bash -e ./scripts/integrations/oracle/instantclient/linux/install.sh

# setup clouseau
WORKDIR /
RUN wget https://github.com/cloudant-labs/clouseau/releases/download/2.21.0/clouseau-2.21.0-dist.zip && \
  unzip clouseau-2.21.0-dist.zip && \
  mv clouseau-2.21.0 /opt/clouseau && \
  rm clouseau-2.21.0-dist.zip

WORKDIR /opt/clouseau
RUN mkdir ./bin
ADD hosting/single/clouseau ./bin/
ADD hosting/single/log4j.properties hosting/single/clouseau.ini ./
RUN chmod +x ./bin/clouseau

# setup CouchDB
WORKDIR /opt/couchdb
ADD hosting/single/vm.args ./etc/

# setup minio
WORKDIR /minio
RUN wget https://dl.min.io/server/minio/release/linux-${TARGETARCH}/minio && chmod +x minio

# setup runner file
WORKDIR /
ADD hosting/single/runner.sh .
RUN chmod +x ./runner.sh

# cleanup cache
RUN yarn cache clean -f

EXPOSE 10000
VOLUME /opt/couchdb/data
VOLUME /minio

# must set this just before running
ENV NODE_ENV=production
WORKDIR /

CMD ["./runner.sh"]

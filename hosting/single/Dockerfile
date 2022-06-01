FROM couchdb

ENV DEPLOYMENT_ENVIRONMENT=docker
ENV COUCHDB_PASSWORD=budibase
ENV COUCHDB_USER=budibase
ENV COUCH_DB_URL=http://budibase:budibase@localhost:5984
ENV BUDIBASE_ENVIRONMENT=PRODUCTION
ENV MINIO_URL=http://localhost:9000
ENV REDIS_URL=localhost:6379
ENV WORKER_URL=http://localhost:4002
ENV INTERNAL_API_KEY=budibase
ENV JWT_SECRET=testsecret
ENV MINIO_ACCESS_KEY=budibase
ENV MINIO_SECRET_KEY=budibase
ENV SELF_HOSTED=1
ENV CLUSTER_PORT=10000
ENV REDIS_PASSWORD=budibase
ENV ARCHITECTURE=amd
ENV APP_PORT=4001
ENV WORKER_PORT=4002

RUN apt-get update
RUN apt-get install software-properties-common wget nginx -y
RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main'
RUN apt-get update

# setup nginx
ADD hosting/single/nginx.conf /etc/nginx
RUN mkdir /etc/nginx/logs
RUN useradd www
RUN touch /etc/nginx/logs/error.log
RUN touch /etc/nginx/logs/nginx.pid

# install java
RUN apt-get install openjdk-8-jdk -y

# setup nodejs
WORKDIR /nodejs
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt-get install nodejs
RUN npm install --global yarn
RUN npm install --global pm2

# setup redis
RUN apt install redis-server -y

# setup server
WORKDIR /app
ADD packages/server .
RUN ls -al
RUN yarn
RUN yarn build
# Install client for oracle datasource
RUN apt-get install unzip libaio1
RUN /bin/bash -e scripts/integrations/oracle/instantclient/linux/x86-64/install.sh

# setup worker
WORKDIR /worker
ADD packages/worker .
RUN yarn
RUN yarn build

# setup clouseau
WORKDIR /
RUN wget https://github.com/cloudant-labs/clouseau/releases/download/2.21.0/clouseau-2.21.0-dist.zip
RUN unzip clouseau-2.21.0-dist.zip
RUN mv clouseau-2.21.0 /opt/clouseau
RUN rm clouseau-2.21.0-dist.zip

WORKDIR /opt/clouseau
RUN mkdir ./bin
ADD hosting/single/clouseau ./bin/
ADD hosting/single/log4j.properties .
ADD hosting/single/clouseau.ini .
RUN chmod +x ./bin/clouseau

# setup CouchDB
WORKDIR /opt/couchdb
ADD hosting/single/vm.args ./etc/

# setup minio
WORKDIR /minio
RUN wget https://dl.min.io/server/minio/release/linux-${ARCHITECTURE}64/minio
RUN chmod +x minio

# setup runner file
WORKDIR /
ADD hosting/single/runner.sh .
RUN chmod +x ./runner.sh

EXPOSE 10000
VOLUME /opt/couchdb/data
VOLUME /minio

# must set this just before running
ENV NODE_ENV=production
CMD ["./runner.sh"]

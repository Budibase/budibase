FROM node:18-slim

LABEL com.centurylinklabs.watchtower.lifecycle.pre-check="scripts/watchtower-hooks/pre-check.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update="scripts/watchtower-hooks/pre-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-update="scripts/watchtower-hooks/post-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-check="scripts/watchtower-hooks/post-check.sh"

WORKDIR /app

ENV PORT=4001
ENV COUCH_DB_URL=https://couchdb.budi.live:5984
ENV BUDIBASE_ENVIRONMENT=PRODUCTION
ENV SERVICE=app-service
ENV POSTHOG_TOKEN=phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU
ENV TENANT_FEATURE_FLAGS=*:LICENSING,*:USER_GROUPS,*:ONBOARDING_TOUR
ENV ACCOUNT_PORTAL_URL=https://account.budibase.app
ENV TOP_LEVEL_PATH=/

# handle node-gyp
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make python3
RUN yarn global add pm2

# Install client for oracle datasource
RUN apt-get install unzip libaio1
COPY scripts/integrations/oracle/ scripts/integrations/oracle/
RUN /bin/bash -e scripts/integrations/oracle/instantclient/linux/x86-64/install.sh 

# Install postgres client for pg_dump utils
RUN apt update && apt upgrade -y \
    && apt install software-properties-common apt-transport-https curl gpg -y \
    && curl -fsSl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /usr/share/keyrings/postgresql.gpg > /dev/null \
    && echo deb [arch=amd64,arm64,ppc64el signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main | tee /etc/apt/sources.list.d/postgresql.list \
    && apt update -y \
    && apt install postgresql-client-15 -y \
    && apt remove software-properties-common apt-transport-https curl gpg -y


COPY package.json .
COPY dist/yarn.lock .
RUN yarn install --production=true \
    # Remove unneeded data from file system to reduce image size
    && yarn cache clean && apt-get remove -y --purge --auto-remove g++ make python \
    && rm -rf /tmp/* /root/.node-gyp /usr/local/lib/node_modules/npm/node_modules/node-gyp

COPY dist/ dist/
COPY docker_run.sh .
COPY builder/ builder/
COPY client/ client/

EXPOSE 4001

# have to add node environment production after install
# due to this causing yarn to stop installing dev dependencies
# which are actually needed to get this environment up and running
ENV NODE_ENV=production
ENV CLUSTER_MODE=${CLUSTER_MODE}
ENV TOP_LEVEL_PATH=/app

CMD ["./docker_run.sh"]

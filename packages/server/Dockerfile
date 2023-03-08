FROM node:14-slim

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

# copy files and install dependencies
COPY . ./
# handle node-gyp
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make python \
    && yarn \
    && yarn cache clean \
    && apt-get remove -y --purge --auto-remove g++ make python \
    && rm -rf /tmp/* /root/.node-gyp /usr/local/lib/node_modules/npm/node_modules/node-gyp
RUN yarn global add pm2
RUN yarn build

# Install client for oracle datasource
RUN apt-get install unzip libaio1
RUN /bin/bash -e scripts/integrations/oracle/instantclient/linux/x86-64/install.sh 

EXPOSE 4001

# have to add node environment production after install
# due to this causing yarn to stop installing dev dependencies
# which are actually needed to get this environment up and running
ENV NODE_ENV=production
ENV CLUSTER_MODE=${CLUSTER_MODE}
CMD ["./docker_run.sh"]

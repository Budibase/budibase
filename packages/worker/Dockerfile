FROM node:20-alpine

LABEL com.centurylinklabs.watchtower.lifecycle.pre-check="scripts/watchtower-hooks/pre-check.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update="scripts/watchtower-hooks/pre-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-update="scripts/watchtower-hooks/post-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-check="scripts/watchtower-hooks/post-check.sh"


# handle node-gyp
RUN apk add --no-cache --virtual .gyp python3 make g++ jq
RUN yarn global add pm2

WORKDIR /

COPY scripts/removeWorkspaceDependencies.sh scripts/removeWorkspaceDependencies.sh
RUN chmod +x ./scripts/removeWorkspaceDependencies.sh




WORKDIR /app
COPY packages/worker/package.json .
COPY packages/worker/dist/yarn.lock .

RUN ../scripts/removeWorkspaceDependencies.sh package.json

ARG TARGETPLATFORM
RUN --mount=type=cache,target=/root/.yarn/${TARGETPLATFORM} YARN_CACHE_FOLDER=/root/.yarn/${TARGETPLATFORM} yarn install --production
# Remove unneeded data from file system to reduce image size
RUN apk del .gyp \
    && yarn cache clean

COPY packages/worker/dist/ dist/
COPY packages/worker/docker_run.sh .
COPY packages/server/pm2.config.js .

EXPOSE 4001

# have to add node environment production after install
# due to this causing yarn to stop installing dev dependencies
# which are actually needed to get this environment up and running
ENV NODE_ENV=production
# this is required for isolated-vm to work on Node 20+
ENV NODE_OPTIONS="--no-node-snapshot"
ENV CLUSTER_MODE=${CLUSTER_MODE}
ENV SERVICE=worker-service
ENV POSTHOG_TOKEN=phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU
ENV ACCOUNT_PORTAL_URL=https://account.budibase.app

ARG BUDIBASE_VERSION
ARG GIT_COMMIT_SHA
# Ensuring the version argument is sent
RUN test -n "$BUDIBASE_VERSION"
ENV BUDIBASE_VERSION=$BUDIBASE_VERSION
ENV DD_GIT_REPOSITORY_URL=https://github.com/budibase/budibase
ENV DD_GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ENV DD_VERSION=$BUDIBASE_VERSION

CMD ["./docker_run.sh"]

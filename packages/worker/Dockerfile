FROM node:18-alpine

LABEL com.centurylinklabs.watchtower.lifecycle.pre-check="scripts/watchtower-hooks/pre-check.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update="scripts/watchtower-hooks/pre-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-update="scripts/watchtower-hooks/post-update.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-check="scripts/watchtower-hooks/post-check.sh"

WORKDIR /app

# handle node-gyp
RUN apk add --no-cache --virtual .gyp python3 make g++
RUN yarn global add pm2


COPY package.json .
COPY dist/yarn.lock .
RUN yarn install --production=true
# Remove unneeded data from file system to reduce image size
RUN apk del .gyp \
    && yarn cache clean

COPY dist/ dist/
COPY docker_run.sh .

EXPOSE 4001

# have to add node environment production after install
# due to this causing yarn to stop installing dev dependencies
# which are actually needed to get this environment up and running
ENV NODE_ENV=production
ENV CLUSTER_MODE=${CLUSTER_MODE}
ENV SERVICE=worker-service
ENV POSTHOG_TOKEN=phc_bIjZL7oh2GEUd2vqvTBH8WvrX0fWTFQMs6H5KQxiUxU
ENV TENANT_FEATURE_FLAGS=*:LICENSING,*:USER_GROUPS,*:ONBOARDING_TOUR
ENV ACCOUNT_PORTAL_URL=https://account.budibase.app

CMD ["./docker_run.sh"]

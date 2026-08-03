# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY packages/functions-runner/package.json package.json
COPY yarn.lock yarn.lock

# @budibase/types is bundled into the runner output. The image only installs
# the external runtime dependencies used by the child and isolate.
RUN node -e 'const fs = require("node:fs"); const pkg = require("./package.json"); delete pkg.dependencies["@budibase/types"]; fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2))'

RUN apt-get update \
    && apt-get install --yes --no-install-recommends g++ make python3 \
    && yarn install --production --frozen-lockfile --non-interactive \
    && yarn cache clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /root/.cache /root/.node-gyp

FROM node:22-bookworm-slim

LABEL org.opencontainers.image.title="Budibase Functions runner"
LABEL org.opencontainers.image.source="https://github.com/Budibase/budibase"

ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"
ENV FUNCTIONS_RUNNER_HOST=0.0.0.0
ENV FUNCTIONS_RUNNER_PORT=4007

WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules node_modules
COPY --chown=node:node packages/functions-runner/dist/start.js dist/start.js
COPY --chown=node:node packages/functions-runner/dist/child.js dist/child.js
COPY --chown=node:node packages/functions-runner/dist/isolate-bootstrap.js dist/isolate-bootstrap.js

USER node

EXPOSE 4007

HEALTHCHECK --interval=5s --timeout=2s --start-period=5s --retries=5 \
  CMD ["node", "-e", "const port = process.env.FUNCTIONS_RUNNER_PORT || 4007; fetch(`http://127.0.0.1:${port}/health`).then(response => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"]

ENTRYPOINT ["node", "dist/start.js"]

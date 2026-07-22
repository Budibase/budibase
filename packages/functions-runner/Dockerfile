# Standalone image for the Budibase Functions (Alpha) runner.
#
# Design goals (see issue #19275 / spec E1):
#   - Contains ONLY the runtime dependencies the supervisor + isolate need.
#   - Runs as a non-root user.
#   - Compatible with a read-only root filesystem (only /tmp needs to be
#     writable, mount it as tmpfs at runtime).
#   - Ships NO Budibase or datasource credentials.

# ---------- build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# isolated-vm is a native addon and needs a toolchain to compile. These build
# tools live ONLY in this stage and never reach the runtime image.
RUN apk add --no-cache g++ make python3

COPY package.json ./
RUN yarn install --network-timeout 1000000

COPY tsconfig.json ./
COPY src ./src
RUN yarn build

# Drop dev dependencies while keeping the already-compiled isolated-vm binding.
RUN yarn install --production --network-timeout 1000000 && yarn cache clean

# ---------- runtime stage ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Required for isolated-vm on Node 20+.
ENV NODE_OPTIONS="--no-node-snapshot"
ENV FUNCTIONS_RUNNER_HOST=0.0.0.0
ENV FUNCTIONS_RUNNER_PORT=4008

# Only the compiled output and production node_modules are copied in - no source
# toolchain, no secrets, no application config.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# node:*-alpine ships a non-root `node` user (uid 1000).
USER node

EXPOSE 4008

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${FUNCTIONS_RUNNER_PORT}/health" || exit 1

CMD ["node", "--no-node-snapshot", "--enable-source-maps", "dist/index.js"]

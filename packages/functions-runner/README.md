# Budibase Functions runner

The Functions runner is a separate process for executing self-hosted Functions.
It does not run inside the Budibase server or worker and must not receive
Budibase, datasource, CouchDB, Redis, MinIO, or Docker credentials.

## Local development

The normal root `yarn dev` command starts the runner on port `4007` alongside
the server, worker, and builder. To start only the runner from the repository
root, run:

```sh
yarn dev:functions-runner
```

Verify it with:

```sh
curl http://localhost:4007/health
```

The generated root `.env` configures the server to use
`http://localhost:4007` and the runner to use the broker at
`http://localhost:4001`. Functions remain disabled unless the separate
`BUDIBASE_FUNCTIONS_ENABLED` administrator opt-in and the Functions feature
flag are both enabled.

## Container image

Build the runner package and local image from the repository root:

```sh
yarn build:docker:functions-runner
```

The image runs as the non-root `node` user and supports a read-only root
filesystem. Verify its health, contents, protocol execution, and restart path:

```sh
yarn verify:docker:functions-runner
```

The verification starts an isolated temporary container without application
credentials and removes it when complete.

## Self-hosted Docker Compose

The official Docker Compose configuration deploys the runner on an internal
network without published ports. Enable Functions by setting:

```sh
BUDIBASE_FUNCTIONS_ENABLED=true
```

The runner is still deployed when this setting is empty, but the server and
worker will not dispatch work to it. The separate Functions feature flag must
also be enabled.

The runner reaches `/api/internal/functions/query` through the internal
`http://app-service:4002` broker URL. The scoped run grant is the only authority
sent with query requests; the runner does not receive a Budibase API key or
application credentials.

The default container limits can be adjusted in `.env`:

```sh
FUNCTIONS_RUNNER_MEMORY_LIMIT=512m
FUNCTIONS_RUNNER_CPU_LIMIT=1.0
FUNCTIONS_RUNNER_PIDS_LIMIT=128
```

Verify the production and local-build Compose configurations with:

```sh
yarn verify:compose:functions-runner
```

## Native build requirements

`isolated-vm` contains a native Node addon. Building outside the supplied
Dockerfile requires Node 22, Python 3, Make, and a C++ compiler. The Dockerfile
installs these tools only in its dependency stage; they are not copied into the
runtime image.

Build the image on the architecture where it will run, or use Docker Buildx
with `linux/amd64` or `linux/arm64`. Native `node_modules` must never be copied
between host and container architectures.

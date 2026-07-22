# @budibase/functions-runner

Standalone, sandboxed runner for **Budibase Functions (Alpha)**.

It runs Function code in a short-lived [`isolated-vm`](https://github.com/laverdet/isolated-vm)
isolate, in its **own process/container**, deliberately isolated from the
Budibase `server`, `worker`, and any datasource credentials. It is _not_ folded
into `server` or `worker` - stopping or restarting the runner does not stop
those services or non-Function automations.

> Alpha boundary: this runner assumes **trusted Function authors**. It is not a
> multi-tenant / hostile-author sandbox. See the threat model for details.

## Protocol

The runner exposes a tiny HTTP protocol:

| Method | Path       | Purpose                                             |
| ------ | ---------- | --------------------------------------------------- |
| `GET`  | `/health`  | Liveness/readiness + whether `isolated-vm` loaded.  |
| `POST` | `/execute` | Execute a Function (`ExecuteRequest` → `ExecuteResponse`). |

`ExecuteRequest`/`ExecuteResponse` are defined in [`src/protocol.ts`](./src/protocol.ts).
A deterministic `PROTOCOL_FIXTURE` is exported there and exercised by the tests
and by container smoke checks.

Example:

```bash
curl -s localhost:4008/execute \
  -H 'content-type: application/json' \
  -d '{"id":"1","code":"return input.a + input.b","input":{"a":2,"b":3}}'
# => {"id":"1","status":"ok","result":5,"durationMs":3}
```

## Configuration

All configuration is via environment variables (no credentials required):

| Variable                              | Default   | Description                       |
| ------------------------------------- | --------- | --------------------------------- |
| `FUNCTIONS_RUNNER_HOST`               | `0.0.0.0` | Bind host                         |
| `FUNCTIONS_RUNNER_PORT`               | `4008`    | Bind port                         |
| `FUNCTIONS_RUNNER_DEFAULT_TIMEOUT_MS` | `5000`    | Default per-execution timeout     |
| `FUNCTIONS_RUNNER_MAX_TIMEOUT_MS`     | `30000`   | Upper bound for caller timeouts   |
| `FUNCTIONS_RUNNER_DEFAULT_MEMORY_MB`  | `64`      | Default isolate memory limit      |
| `FUNCTIONS_RUNNER_MAX_MEMORY_MB`      | `128`     | Upper bound for isolate memory    |
| `FUNCTIONS_RUNNER_MAX_BODY_BYTES`     | `524288`  | Max `/execute` request body size  |

## Local development

```bash
# from the repo root
yarn workspace @budibase/functions-runner dev     # ts-node, hot start
# or run the containerised runner alongside the dev stack:
docker compose -f hosting/docker-compose.dev.yaml up functions-runner-service
```

The runner is included in `hosting/docker-compose.dev.yaml`. It has no
dependency on CouchDB/Redis/Minio and can be started, stopped and restarted
independently of the rest of the stack.

## Building the image

```bash
docker build -t budibase/functions-runner:dev packages/functions-runner
```

Run it with a read-only root filesystem (only `/tmp` needs to be writable):

```bash
docker run --rm -p 4008:4008 \
  --read-only --tmpfs /tmp \
  --user 1000 \
  budibase/functions-runner:dev
```

### `isolated-vm` native build requirements

`isolated-vm` is a native addon compiled with `node-gyp`, so the build stage
needs a C++ toolchain. The runtime image does **not** contain these tools - the
compiled binding is copied from the build stage.

| Architecture       | Build tooling (build stage only)                    |
| ------------------ | --------------------------------------------------- |
| `linux/amd64`      | `g++`, `make`, `python3` (installed in Dockerfile)  |
| `linux/arm64`      | same (`node:22-alpine` supports arm64)              |
| macOS (local dev)  | Xcode Command Line Tools (`xcode-select --install`) |

`NODE_OPTIONS=--no-node-snapshot` is required for `isolated-vm` on Node 20+ and
is set in the image and the `start` script.

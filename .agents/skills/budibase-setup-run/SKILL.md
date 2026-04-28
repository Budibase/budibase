---
name: budibase-setup-run
description: Set up, bootstrap, run, and troubleshoot the Budibase monorepo for local development and automated VM environments. Use when an AI coding agent or developer needs to install prerequisites, clone Budibase, run yarn setup/build/dev/dev:agent, start or verify the local dev stack, log in locally, run package tests, or explain Budibase development ports and services.
---

# Budibase Setup Run

## Core Path

Use this workflow for a fresh local Budibase checkout.

1. Clone and enter the repo:

```bash
git clone https://github.com/Budibase/budibase.git
cd budibase
```

2. Use the Node version pinned by the repo:

```bash
nvm install
nvm use
node -v
```

Budibase requires Node `>=22.0.0 <23.0.0`; this repo pins `v22.18.0` in `.nvmrc`.

3. Install Yarn if needed:

```bash
npm install -g yarn
yarn -v
```

4. Confirm Docker and Compose are available and running:

```bash
docker --version
docker compose version
docker info
```

5. Bootstrap and run the project for normal local development:

```bash
yarn setup
```

`yarn setup` configures submodules, checks Docker prerequisites, installs dependencies, builds packages, and starts the dev environment.

For automated VM environments where dependencies and build outputs can be cached, prefer the agent path:

```bash
yarn
yarn build
yarn dev:agent
```

`yarn dev:agent` preserves existing build artifacts by skipping the root clean/prebuild step. Use it after a successful build or when restoring a VM image that already contains valid `dist` outputs.

## Manual Setup

Use the manual path when `yarn setup` fails partway through or the user wants separate steps:

```bash
yarn
yarn build
yarn dev
```

On first setup, `yarn build` is required before the dev loop. Later edits to shared packages such as `@budibase/shared-core`, `@budibase/backend-core`, or types may require another build.

## Running Locally

Start the local development environment from the repo root:

```bash
yarn dev
```

This command:

- Creates or updates `.env` through `scripts/dev/manage.js`.
- Frees app ports through `yarn kill-all`.
- Runs package prebuilds.
- Starts the server, worker, builder, and Docker-backed development stack.

For automated VM runs after a successful build, use:

```bash
yarn dev:agent
```

This keeps the normal developer workflow unchanged while reducing startup work in cached environments.

Access Budibase at:

- Main proxy: `http://localhost:10000`
- Builder: `http://localhost:10000/builder`

Default local login:

- Email: `local@budibase.com`
- Password: `cheekychuckles`

## Services And Ports

Expect these local services:

| Service | Port | Notes |
| --- | ---: | --- |
| Nginx proxy | `10000` | Main entry point |
| Builder | `3000` | Vite/Svelte dev server |
| Server | `4001` | Koa API for apps |
| Worker | `4002` | Background jobs and platform APIs |
| MinIO | `4004` | S3-compatible storage |
| CouchDB | `4005` | Primary database |
| CouchDB SQS | `4006` | Queue-related CouchDB service |
| Redis | `6379` | Cache, sessions, queues |
| LiteLLM | `4000` | Optional AI proxy, token `budibase` |

Health checks:

```bash
curl http://localhost:4001/health
curl http://localhost:4002/health
```

## Common Commands

Build everything:

```bash
yarn build
```

Run type checks:

```bash
yarn check:types
```

Run lint:

```bash
yarn lint
```

Run a package test from inside that package:

```bash
cd packages/server
yarn test path/to/test-file.test.ts
```

Run only server and worker:

```bash
yarn dev:server
```

Run the optimized automated-environment startup path:

```bash
yarn dev:agent
```

Run frontend/dev stack without local server processes:

```bash
yarn dev:noserver
```

Switch development modes:

```bash
yarn mode:self
yarn mode:cloud
yarn mode:account
```

## Troubleshooting

If Docker commands fail, ensure Docker Desktop or the Docker daemon is running before rerunning setup.

If ports are stale, run:

```bash
yarn kill-all
```

If dependencies or build outputs look corrupt, rebuild without deleting Docker-backed data:

```bash
yarn restore
```

If the user is in a cloud VM with nested Docker, Docker may need to be started manually before `yarn dev`:

```bash
sudo dockerd
```

Do not change `/var/run/docker.sock` to be world-writable. If Docker permission errors persist, use the environment's approved Docker group, rootless Docker, or VM provisioning setup.

If local mode changes do not appear in the browser, clear Budibase cookies for `localhost`.

## Contributor Notes

Use `@budibase/` scoped imports between packages. The main package split is:

- Backend: `packages/server`, `packages/worker`, `packages/backend-core`
- Frontend: `packages/builder`, `packages/frontend-core`, `packages/bbui`
- Shared: `packages/shared-core`

For server API tests, prefer `TestConfiguration` from `packages/server/src/tests/TestConfiguration.ts`. For automation tests, use `createAutomationBuilder` from `packages/server/src/automations/tests/utilities/AutomationTestBuilder.ts`.

# Building the Budibase single image with Podman

## Prerequisites

- **Podman** installed and running.
  - On Windows: install [Podman Desktop](https://podman-desktop.io/) or Podman CLI, then run `podman machine start` (or start Podman Desktop) so the Podman VM is running.
  - On Linux: Podman is usually available from your package manager; no machine is needed.
- **Node 22.x** only if you build on the host (see “Build on host” below). The PowerShell script does **not** require Node or Yarn on the host.

## Build steps (recommended: no Node on host)

From the **budibase repo root** in PowerShell:

```powershell
.\scripts\build-single-image-podman.ps1
```

What the script does:

1. Checks that Podman is running.
2. Creates a tarball of the repo (excluding `node_modules`, `.git`, etc.).
3. Runs a **Node 22** container that:
   - Extracts the tarball,
   - Installs system deps (git, python3, make, g++),
   - Installs Yarn globally,
   - Runs `yarn install --ignore-engines`,
   - Runs `yarn build --scope @budibase/server --scope @budibase/worker --include-dependencies` (builds server, worker, and their dependencies including **client** and **builder**).
4. Copies build artifacts from the container to the host (`packages/server/dist`, `packages/server/client`, `packages/server/builder`, `packages/worker/dist`).
5. Builds the image with Podman: `podman build -f hosting/single/Dockerfile -t budibase:latest ...`.

The first run can take a long time (base images, installs, full build).

## Build on host (Node 22 and Yarn)

If you have **Node 22.x** and Yarn on the host:

- **Windows:** use **Git Bash** (the root `build` / `build:apps` scripts use Unix-style env vars).
- **Linux / macOS:** use your normal shell.

From the budibase repo root:

```bash
# Set env vars (Unix/Git Bash); optional if your Node is 22.x and you have enough memory
export DISABLE_V8_COMPILE_CACHE=1
export NODE_OPTIONS="--max-old-space-size=1500"

# Install and build (includes client via --include-dependencies)
yarn install --ignore-engines
yarn build --scope @budibase/server --scope @budibase/worker --include-dependencies

# Build the image
version=$(node -p "require('./lerna.json').version")
podman build -f hosting/single/Dockerfile -t budibase:latest \
  --build-arg BUDIBASE_VERSION=$version \
  --build-arg TARGETBUILD=single \
  .
```

If you hit **“The engine 'node' is incompatible”**, use Node 22 (e.g. `nvm use 22` or `fnm use 22`), or run the PowerShell script instead (it uses a Node 22 container and `YARN_IGNORE_ENGINES=1`).

## Run the container

```bash
podman run -d -p 80:80 -p 443:443 -v budibase_data:/data --name budibase budibase:latest
```

Then open http://localhost (or http://localhost:80). For another host port (e.g. 8080):

```bash
podman run -d -p 8080:80 -p 443:443 -v budibase_data:/data --name budibase budibase:latest
```

**Windows: Port 443 without Administrator**
If you get `pasta failed ... Permission denied` when binding port 443, use the older network driver so 443 works without elevation:

```bash
podman run -d --network slirp4netns -p 10000:80 -p 443:443 -v budibase_data:/data --name budibase4 budibase:latest
```

## Notes

- The Dockerfile **HEALTHCHECK** is not OCI-compliant; Podman ignores it. The container still runs normally.
- You may be prompted for the registry when pulling the CouchDB base image (`budibase/database:2.0.0`); Docker Hub is the default.
- The script uses `--include-dependencies` so the **client** (and builder) are built; the single image needs `packages/server/client` and `packages/server/builder` for the app and Module Federation.

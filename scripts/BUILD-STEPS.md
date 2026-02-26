# Budibase single-image build steps (Podman / Windows)

This doc covers the **build script** and **why the /embed page still shows "Preview"** after building.

## Build script name

The script in this repo is:

- **`scripts\build-single-image-podman.ps1`**

If you use a copy named **`build-budibase-single.ps1`**, it should do the same thing (or call this script). There is no separate file named `build-budibase-single.ps1` in the repo.

---

## Root cause: why /embed still shows Preview after building

The **Demo app** at `http://localhost:5173/embed#/employees` loads the Budibase **client** from whatever Budibase server you point it at (via proxy or `VITE_BUDIBASE_URL`).

- The **“live view” (no Preview bar)** only appears when the **built** client is served (the one that includes the hide-dev-tools logic).
- The build script produces that built client and puts it in **`packages/server/client`** and then into the **Podman image**.

So:

1. If you run **Budibase in dev** (`yarn dev` on port 10000), the dev server may **not** be serving the same built client that the script produced. So you still see Preview.
2. If you run the **Podman container** but the **Demo app** proxies to a different port (e.g. 10000 where `yarn dev` is running), you are still hitting the dev server, not the built image. So you still see Preview.

So the issue is usually: **you are not serving the Budibase app from the built output (image or server using `packages/server/client`).**

---

## Build steps (using the script)

### 1. Prerequisites

- **Podman** installed and running (`podman machine start` or Podman Desktop).
- **tar** in PATH (Windows 10+ or Git for Windows).

### 2. Run the build script

From the **budibase repo root** in PowerShell:

```powershell
.\scripts\build-single-image-podman.ps1
```

What it does:

1. Creates a tarball of the repo (excluding `node_modules`, `.git`, etc.).
2. Runs a **Node 22** container that:
   - Mounts the repo (or tarball location),
   - Extracts the tarball,
   - Installs system deps and Yarn,
   - Runs `yarn install --ignore-engines`,
   - Runs `yarn build --scope @budibase/server --scope @budibase/worker --include-dependencies` (builds server, worker, **client**, builder).
3. Copies build artifacts from the container to the host:
   - `packages/server/dist`
   - `packages/server/client`  ← **built client (needed for live view at /embed)**
   - `packages/server/builder`
   - `packages/worker/dist`
4. Builds the Podman image `budibase:latest`.

If the script reports that **`packages\server\client\budibase-client.js` was not copied**, the client build failed inside the container; check the container build output for errors.

### 3. If the container step fails with “path not found” (volume mount)

On Windows, Podman may not resolve the host path. Try:

- Edit the script and set the host path explicitly. For example, after the `$repoPath = ...` line, add:
  - `$hostPathForMount = "C:/path/to/your/budibase"` (use your real path with forward slashes).
- Or configure Podman machine with volume access (see Podman docs for your version).

---

## After building: how to see live view at /embed

You must **serve Budibase from the built output** and point the Demo app at that server.

### Option A: Run the Podman image and point the Demo app at it

1. Run the image (e.g. on port **10000** so it matches the Demo app’s proxy):

   ```powershell
   podman run -d -p 10000:80 -v budibase_data:/data --name budibase budibase:latest
   ```

2. In the **Demo app**, ensure the proxy targets this server. For example in `.env` or when starting the Demo app:
   - `VITE_BUDIBASE_URL=http://localhost:10000`
   - And keep the proxy enabled (e.g. `/budibase-proxy` → `http://localhost:10000`).

3. Open **`http://localhost:5173/embed#/employees`**. The request goes to the container (via proxy); the container serves the **built** client, so you should see the **live view** (no Preview bar).

### Option B: Run the Budibase server from the host (using copied artifacts)

1. After the script, **do not** run `yarn dev` (that may serve a different client).
2. Run the **built** server so it uses `packages/server/client`:
   - From repo root: `node packages/server/dist/index.js` (or the same way the image runs the server), with the same env (e.g. NODE_ENV=production, Redis, DB, etc.) as the image.
3. Point the Demo app at that server (e.g. port 10000) and open `http://localhost:5173/embed#/employees`.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Run `.\scripts\build-single-image-podman.ps1` from repo root. |
| 2 | Confirm the script reports that build artifacts were copied and that `packages\server\client\budibase-client.js` exists. |
| 3 | Run Budibase **from the built output**: either `podman run ... budibase:latest` (e.g. on port 10000) or run the server from host using the copied `packages/server` (and `client`). |
| 4 | Point the Demo app at that Budibase URL (e.g. proxy to `http://localhost:10000`). |
| 5 | Open `http://localhost:5173/embed#/employees`; you should see the live view. |

If you run **`yarn dev`** for Budibase and point the Demo app at that, you are **not** using the client produced by the script, so the /embed page can still show Preview until you use the built server/client as above.

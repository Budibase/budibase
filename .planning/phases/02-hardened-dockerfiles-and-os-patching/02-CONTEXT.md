# Phase 2: Hardened Dockerfiles and OS Patching - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Create Dockerfile.hardened for server, worker, and couchdb — integrating Phase 1 npm patches and named OS package upgrades — producing images that pass Trivy 0.68.1 + Grype 0.109.0 locally with zero HIGH/CRITICAL findings.

</domain>

<decisions>
## Implementation Decisions

### Dockerfile approach
- **D-01:** Full copy approach — Dockerfile.hardened is a modified copy of the original Dockerfile, not an overlay (FROM base + layer).
- **D-02:** Script-generated — A generation script reads the original Dockerfile and applies patches (sed/envsubst) to produce Dockerfile.hardened. Keeps hardened files automatically in sync when originals change.
- **D-03:** Key modifications vs original: COPY package.hardened.json instead of package.json, add scoped OS package upgrades, add USER directive.

### Non-root USER (server/worker)
- **D-04:** Claude decides which user (likely `node` UID 1000 from node:22-alpine) based on what docker_run.sh and pm2 require. May need chown on /app and pm2 directories.
- **D-05:** CouchDB keeps current user model as-is — no USER change for the database image. CouchDB needs root for entrypoint permission fixes and config writes.

### OS patching strategy
- **D-06:** Server/worker (Alpine): scoped `apk add --upgrade zlib curl` for named CVE-affected packages only. No blanket `apk upgrade`.
- **D-07:** CouchDB (Debian bookworm): `apt-mark hold couchdb && apt-get upgrade -y` (matches existing pattern already in Dockerfile). Plus pin npm global packages (pm2) to non-vulnerable versions.

### Tag convention
- **D-08:** Images tagged `{version}-hardened` (e.g. `budibase/apps:3.0.0-hardened`). The ARG BUDIBASE_VERSION already exists in all Dockerfiles — hardened tag appends `-hardened` suffix.

### Claude's Discretion
- Exact generation script implementation (bash + sed vs more sophisticated templating)
- Whether to add a Makefile target or just a standalone script
- pm2 version pinning for CouchDB (needs to be non-vulnerable)
- Whether docker_run.sh needs modifications for non-root execution
- Build context handling (some Dockerfiles expect files from repo root)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Dockerfiles (source for generation)
- `packages/server/Dockerfile` — Server build: node:22-alpine, COPY package.json + dist/yarn.lock, apk add, yarn install, docker_run.sh CMD
- `packages/worker/Dockerfile` — Worker build: same Alpine pattern, .gyp virtual package
- `hosting/couchdb/Dockerfile` — CouchDB build: node:22-slim (Debian), multi-stage (base + runner), already has apt-get upgrade with couchdb held

### Phase 1 outputs (npm patches to integrate)
- `packages/server/package.hardened.json` — Standalone replacement with 6 CVE resolutions
- `packages/worker/package.hardened.json` — Same pattern
- `scripts/generate-hardened-package.sh` — Reference for generation script approach

### Workspace stripping (must preserve in hardened flow)
- `scripts/removeWorkspaceDependencies.sh` — Strips @budibase/* from deps/resolutions, non-budibase resolutions survive

### Vulnerability scan data
- `trivy_output.txt` — OS CVEs: zlib CVE-2026-22184 (CRITICAL), curl CVE-2026-3805 (HIGH)
- `grype_output.txt` — Same OS CVEs plus npm findings

### Research findings
- `.planning/research/PITFALLS.md` — Alpine apk upgrade must be scoped, scanner version mismatch risks
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow for hardened pipeline

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/generate-hardened-package.sh`: Phase 1 generation script — establishes the pattern for script-generated hardening artifacts
- `scripts/removeWorkspaceDependencies.sh`: Must be preserved in hardened Dockerfiles — strips @budibase/* workspace entries

### Established Patterns
- Server Dockerfile COPY sequence: package.json → dist/yarn.lock → removeWorkspaceDependencies.sh → yarn install. Hardened variant changes the package.json COPY to package.hardened.json.
- CouchDB already has `apt-mark hold couchdb && apt-get upgrade -y` at lines 123-126. Hardened variant reinforces this and adds npm global pinning.
- Both server and worker use `pm2` installed globally via `yarn global add pm2`.

### Integration Points
- `docker_run.sh` in both server and worker — entrypoint scripts that may need adjustment for non-root execution (file permissions, pm2 home directory)
- `ARG BUDIBASE_VERSION` — exists in all Dockerfiles, used for version tagging. Hardened build appends `-hardened` suffix.
- Build context: server Dockerfile COPYs from `packages/server/` and `scripts/`. CouchDB COPYs from `hosting/couchdb/` context.

</code_context>

<specifics>
## Specific Ideas

- The generation script approach mirrors Phase 1's `generate-hardened-package.sh` — keeps both hardening scripts in `scripts/` directory for consistency.
- CouchDB's hardened delta should be minimal since it already does OS upgrades. Main addition is npm global version pinning.
- Non-root USER for server/worker is defense-in-depth — docker_run.sh likely needs chown on /app before dropping to node user.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-hardened-dockerfiles-and-os-patching*
*Context gathered: 2026-03-21*

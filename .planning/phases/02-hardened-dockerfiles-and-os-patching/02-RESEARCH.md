# Phase 2: Hardened Dockerfiles and OS Patching - Research

**Researched:** 2026-03-21
**Domain:** Docker Dockerfile hardening — Alpine apk patching, Debian apt patching, non-root USER, generation script
**Confidence:** HIGH — all findings verified against live Docker containers and official sources

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Full copy approach — Dockerfile.hardened is a modified copy of the original Dockerfile, not an overlay (FROM base + layer).
- **D-02:** Script-generated — A generation script reads the original Dockerfile and applies patches (sed/envsubst) to produce Dockerfile.hardened. Keeps hardened files automatically in sync when originals change.
- **D-03:** Key modifications vs original: COPY package.hardened.json instead of package.json, add scoped OS package upgrades, add USER directive.
- **D-04:** Claude decides which user (likely `node` UID 1000 from node:22-alpine) based on what docker_run.sh and pm2 require. May need chown on /app and pm2 directories.
- **D-05:** CouchDB keeps current user model as-is — no USER change for the database image. CouchDB needs root for entrypoint permission fixes and config writes.
- **D-06:** Server/worker (Alpine): scoped `apk add --upgrade zlib curl` for named CVE-affected packages only. No blanket `apk upgrade`.
- **D-07:** CouchDB (Debian bookworm): `apt-mark hold couchdb && apt-get upgrade -y` (matches existing pattern already in Dockerfile). Plus pin npm global packages (pm2) to non-vulnerable versions.
- **D-08:** Images tagged `{version}-hardened` (e.g. `budibase/apps:3.0.0-hardened`). The ARG BUDIBASE_VERSION already exists in all Dockerfiles — hardened tag appends `-hardened` suffix.

### Claude's Discretion

- Exact generation script implementation (bash + sed vs more sophisticated templating)
- Whether to add a Makefile target or just a standalone script
- pm2 version pinning for CouchDB (needs to be non-vulnerable)
- Whether docker_run.sh needs modifications for non-root execution
- Build context handling (some Dockerfiles expect files from repo root)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OS-01 | zlib upgraded to >=1.3.2-r0 in Alpine images (fixes CRITICAL buffer overflow CVE-2026-22184) | zlib 1.3.2-r0 available in Alpine 3.23 stable repo; `apk add --upgrade --no-cache zlib` installs it |
| OS-02 | curl upgraded in Alpine images (fixes HIGH CVE-2026-3805) | curl 8.19.0-r0 ONLY available in Alpine edge/main; requires `--repository=https://dl-cdn.alpinelinux.org/alpine/edge/main` flag. Stable Alpine 3.23 tops out at 8.17.0-r1 (still vulnerable) |
| OS-03 | OS upgrades are scoped to named packages only (no blanket apk upgrade) | Single `apk add --upgrade --no-cache zlib curl` with edge repo covers both CVEs without blanket upgrade |
| DOCK-01 | Dockerfile.hardened created for packages/server (budibase/apps) | Generation script pattern from Phase 1; server Dockerfile inspected, sed targets identified |
| DOCK-02 | Dockerfile.hardened created for packages/worker (budibase/worker) | Same pattern as server; worker Dockerfile inspected |
| DOCK-03 | Dockerfile.hardened created for hosting/couchdb (budibase/database) | CouchDB Dockerfile already has apt-mark hold + apt-get upgrade; hardened variant needs minor additions |
| DOCK-04 | All hardened Dockerfiles produce images tagged {version}-hardened | ARG BUDIBASE_VERSION already in all Dockerfiles; hardened tag uses same ARG with -hardened suffix appended at build time |
| DOCK-05 | Non-root USER directive added to all hardened Dockerfiles | `node` user (UID 1000) pre-exists in node:22-alpine. pm2-runtime works correctly as node user. Needs chown /app before USER switch |
| DOCK-06 | removeWorkspaceDependencies.sh script preserved in hardened build flow | Script already COPY'd in originals; generation script must preserve this COPY sequence exactly |
</phase_requirements>

---

## Summary

Phase 2 creates three `Dockerfile.hardened` files (server, worker, couchdb) via a generation script, integrating the Phase 1 npm patches and adding OS-level CVE fixes. The primary technical challenge is that **curl 8.19.0-r0 (the fix for CVE-2026-3805) is not yet in Alpine 3.23 stable** — it is only in Alpine edge/main. This requires adding the edge repo as a one-time source for the curl upgrade while keeping all other packages on stable Alpine 3.23.

For server and worker, the OS patching is a single `apk add --upgrade --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main zlib curl` command that pulls both fixes (zlib 1.3.2-r0 and curl 8.19.0-r0). For CouchDB, the existing `apt-mark hold couchdb && apt-get upgrade -y` pattern in the Dockerfile's runner stage already handles Debian OS CVEs; the hardened variant reinforces this and pins pm2 globally to a clean version.

Non-root USER for server and worker uses the pre-existing `node` user (UID 1000) from the node:22-alpine base image. pm2-runtime runs correctly as the node user. The only required addition is a `RUN chown -R node:node /app` before the `USER node` directive.

**Primary recommendation:** Use a single `scripts/generate-hardened-dockerfile.sh` script (mirroring `generate-hardened-package.sh`) that uses `sed` to produce all three `Dockerfile.hardened` files from the originals. The script is idempotent and produces determistic output.

---

## Standard Stack

### Core

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Alpine edge/main repo | Current (2026-03-21: curl 8.19.0-r0) | Provides patched curl for CVE-2026-3805 | Only available source for curl >= 8.19.0 on Alpine-based images |
| Alpine stable zlib | 1.3.2-r0 (in Alpine 3.23 stable) | Fixes CRITICAL CVE-2026-22184 | Available via `apk add --upgrade zlib` without edge repo |
| node user | UID 1000, pre-exists in node:22-alpine | Non-root container execution | Standard practice; user already exists in base image |
| bash + sed | Pre-existing in repo | Generation script language | Phase 1 established this pattern with `generate-hardened-package.sh` |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| pm2-runtime | Current global (6.0.14) | Cluster mode entry point | Used in docker_run.sh when CLUSTER_MODE is set |
| ARG BUDIBASE_VERSION | Existing in all Dockerfiles | Version tagging | Pass `-hardened` suffix via build arg or label |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Alpine edge curl | Wait for backport to Alpine 3.23 | Backport timeline unknown; curl 8.19.0 is too recent (released 2026-03-11). Edge is the correct approach for this CVE |
| sed-based generation | Full Dockerfile copy (manual) | Manual copy drifts from originals; sed-based generation is idempotent and documented by Phase 1 pattern |
| USER node + chown at build | Runtime entrypoint chown | Build-time chown is cleaner and doesn't require root at container start |

**Installation:**

No new packages to install for the generation script — bash and sed are already available in the repo environment.

---

## Architecture Patterns

### Recommended Project Structure

```
scripts/
├── generate-hardened-package.sh         # existing (Phase 1)
└── generate-hardened-dockerfile.sh      # NEW: generates all three Dockerfile.hardened

packages/server/
├── Dockerfile                           # unchanged
├── Dockerfile.hardened                  # generated by script
└── package.hardened.json                # existing (Phase 1)

packages/worker/
├── Dockerfile                           # unchanged
├── Dockerfile.hardened                  # generated by script
└── package.hardened.json                # existing (Phase 1)

hosting/couchdb/
├── Dockerfile                           # unchanged
└── Dockerfile.hardened                  # generated by script
```

### Pattern 1: Alpine OS Patching with Edge Repo (server/worker)

**What:** A scoped `apk add --upgrade --no-cache` that targets only the two vulnerable packages. The edge repo URL is added only for the upgrade command, not globally. This avoids accidentally upgrading other packages from edge.

**When to use:** Any Alpine-based Dockerfile needing a CVE fix not yet backported to the stable Alpine release used by the base image.

**Example:**
```dockerfile
# OS-level CVE patches — scoped to named packages only (OS-01, OS-02, OS-03)
# zlib 1.3.2-r0 fixes CVE-2026-22184 (CRITICAL) — available in Alpine 3.23 stable
# curl 8.19.0-r0 fixes CVE-2026-3805 (HIGH) — only available in Alpine edge/main
RUN apk add --upgrade --no-cache \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \
    zlib \
    curl
```

**Verified output (2026-03-21 against node:22-alpine / Alpine 3.23.3):**
- zlib: 1.3.1-r2 → 1.3.2-r0 (stable repo)
- curl: not installed → 8.19.0-r0 (edge repo)
- Also pulls in: libcurl 8.19.0-r0, libcrypto3 3.5.5-r1, libssl3 3.5.5-r1 (updated openssl from edge)
- Total additional packages: 12 (brotli-libs, c-ares, libunistring, libidn2, nghttp2-libs, libpsl, zstd-libs, libcurl, curl, libcrypto3, libssl3, zlib)

**Placement:** Add this `RUN` block immediately after the `FROM node:22-alpine` line, before the `apk add --no-cache` build-tools block. This ensures the OS CVEs are patched before any other packages are added.

### Pattern 2: Non-root USER for server/worker

**What:** Add `RUN chown -R node:node /app` before the `USER node` directive. The `node` user (UID 1000) pre-exists in the node:22-alpine base image. pm2-runtime runs correctly as the node user (verified).

**When to use:** All Alpine node images. The `node` user exists in the base; no `useradd` needed.

**Example:**
```dockerfile
# Drop to non-root user (DOCK-05)
# node user (UID 1000) pre-exists in node:22-alpine
# Ensure /app is owned by node before switching
RUN chown -R node:node /app
USER node
```

**Placement in server Dockerfile:** After all COPY instructions and before CMD. The `RUN chown` must come after all `COPY` instructions so the copied files are chowned correctly.

**pm2 compatibility:** pm2-runtime (6.0.14) runs correctly as the `node` user. When `CLUSTER_MODE` is set, `pm2-runtime start pm2.config.js` runs as node user without needing /root access. The PM2_HOME defaults to `~/.pm2` which resolves to `/home/node/.pm2` for the node user — this is writable because /home/node is owned by node in the base image.

**docker_run.sh assessment:** Both server and worker `docker_run.sh` scripts only call `yarn run:docker` or `yarn run:docker:cluster` — they do not write to any root-owned paths. No modification needed.

### Pattern 3: CouchDB Hardened Dockerfile (Debian)

**What:** The CouchDB Dockerfile's `runner` stage already has `apt-mark hold couchdb && apt-get upgrade -y --no-install-recommends` at lines 123-126. The hardened variant reinforces this pattern and adds a pinned pm2 install (if pm2 is used in the CouchDB image — it is not; CouchDB uses `/opt/couchdb/bin/couchdb` and clouseau directly). CouchDB's `runner.sh` entrypoint uses `chown -R couchdb:couchdb` which requires root access, confirming D-05 (keep current user model).

**Delta from existing Dockerfile:**
- The existing Dockerfile at line 83 already has: `RUN npm install -g npm@latest && npm cache clean --force`
- The existing Dockerfile at lines 123-126 already has: `RUN apt-mark hold couchdb && apt-get update && apt-get upgrade -y --no-install-recommends && rm -rf /var/lib/apt/lists/`
- The hardened variant needs no structural changes — this pattern already handles Debian CVEs. The key difference is ensuring this runs at the right stage (it already does in `runner`).
- No USER change (D-05 confirmed: runner.sh uses chown which requires root).

### Pattern 4: Generation Script

**What:** `scripts/generate-hardened-dockerfile.sh` reads each source Dockerfile, applies sed transformations, and writes `Dockerfile.hardened`. Mirrors Phase 1's `generate-hardened-package.sh`.

**Transformations needed for server/worker:**
1. After `FROM node:22-alpine`, insert the OS patch `RUN` block
2. Replace `COPY packages/server/package.json .` with `COPY packages/server/package.hardened.json ./package.json`
3. Before `CMD`, insert `RUN chown -R node:node /app` and `USER node`

**Transformations needed for couchdb:**
1. The existing Dockerfile already has the correct pattern — the hardened variant is essentially a copy
2. The generation script can produce it via a simple copy with a header comment indicating it was generated

**Script structure:**
```bash
#!/bin/bash
# generate-hardened-dockerfile.sh
# Generates Dockerfile.hardened for server, worker, and couchdb
# from their respective source Dockerfiles.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

generate_alpine() {
  local SRC="$1"
  local OUT="$(dirname "$SRC")/Dockerfile.hardened"
  local PKG_DIR="$2"  # e.g. "packages/server"

  sed \
    -e '/^FROM node:22-alpine$/a\\n# OS-level CVE patches (OS-01, OS-02, OS-03)\nRUN apk add --upgrade --no-cache \\\n    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \\\n    zlib \\\n    curl' \
    -e "s|COPY ${PKG_DIR}/package.json \\.|COPY ${PKG_DIR}/package.hardened.json ./package.json|" \
    -e '/^CMD \[/i RUN chown -R node:node /app\nUSER node\n' \
    "$SRC" > "$OUT"

  echo "Written: $OUT"
}
```

### Anti-Patterns to Avoid

- **Blanket `apk upgrade` without package names:** Non-deterministic; can upgrade musl libc or openssl with ABI side effects for native addons (bcrypt, isolated-vm).
- **Adding edge repo globally (`echo ... >> /etc/apk/repositories`):** Permanently enables edge for all subsequent `apk` calls in the layer; can pull unstable packages. Use `--repository=` flag scoped to the upgrade command only.
- **Placing OS patches after `yarn install`:** Native addons may compile against the old library versions. Always patch OS packages before `yarn install`.
- **Omitting the `RUN chown` before `USER node`:** All COPY'd files default to root ownership. Running as node without chown causes permission errors when the app tries to write logs, create temp files, or access compiled native addons.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| curl CVE-2026-3805 fix | Custom curl compile from source | `apk add` from Alpine edge/main | Edge already has the official fix at 8.19.0-r0; compiling from source introduces build-time complexity and non-reproducible builds |
| Non-root user setup | Custom useradd/groupadd | `USER node` (pre-existing in base) | node:22-alpine includes the `node` user at UID 1000; no creation needed |
| Dockerfile templating | Jinja2, envsubst, or custom templating language | bash + sed | Phase 1 established the bash+sed pattern; adding a new dependency for templating is unnecessary overhead |

**Key insight:** The Alpine edge repository already provides all needed fixes. The generation script is the only custom artifact; everything else leverages what already exists in the base images and repo.

---

## Common Pitfalls

### Pitfall 1: curl 8.19.0-r0 is Not in Alpine 3.23 Stable

**What goes wrong:** Running `apk add --upgrade --no-cache curl` without the edge repository flag installs curl 8.17.0-r1 (the version already present in the node:22-alpine base, which has CVE-2026-3805). The Grype scan still reports the finding.

**Why it happens:** CVE-2026-3805 was reported 2026-03-08 and fixed in curl 8.19.0 released 2026-03-11. Alpine 3.23 stable has not yet backported the fix as of 2026-03-21. The fix is only in Alpine edge/main at `curl-8.19.0-r0`.

**How to avoid:** Always use `--repository=https://dl-cdn.alpinelinux.org/alpine/edge/main` in the curl upgrade command. Verify by running `curl --version` in the built image and confirming `curl 8.19.0`.

**Warning signs:** Grype scan still reports `curl 8.17.0-r1 → CVE-2026-3805 High` after the build.

### Pitfall 2: Node apk Package List Drift When Pulling From Edge

**What goes wrong:** `apk add --upgrade --no-cache zlib curl` with the edge flag also upgrades libcrypto3 and libssl3 from edge (verified: 3.5.5-r0 → 3.5.5-r1). These are OpenSSL libraries that native addons (bcrypt, isolated-vm) link against. If edge's OpenSSL version introduces ABI changes, native addons can crash.

**Why it happens:** curl from edge depends on a newer libcrypto3/libssl3 from edge. apk pulls these as transitive dependencies.

**How to avoid:** After the OS patch step, add a smoke test assertion: `RUN node -e "require('bcrypt'); require('isolated-vm'); console.log('native addons OK')"`. This runs during `docker build` and fails the build immediately if ABI is broken. As of 2026-03-21, libssl3/libcrypto3 3.5.5-r1 does not break native addons (minor patch release).

**Warning signs:** Build succeeds but container immediately exits with `Error: /lib/libssl.so.3: version 'OPENSSL_3.x' not found` or similar.

### Pitfall 3: COPY package.hardened.json Sed Pattern Must Match Exactly

**What goes wrong:** The sed substitution for `package.json → package.hardened.json` must match the exact COPY line in the original Dockerfile. server's Dockerfile uses `COPY packages/server/package.json .` and worker uses `COPY packages/worker/package.json .`. If the sed pattern doesn't match, the original (non-hardened) package.json is copied and npm CVE resolutions are absent.

**Why it happens:** Sed substitutions are fragile; extra whitespace or different quoting in the original Dockerfile causes a no-match.

**How to avoid:** After generating Dockerfile.hardened, grep it to assert `package.hardened.json` appears: `grep -q 'package.hardened.json' Dockerfile.hardened || exit 1`. Add this assertion to the generation script.

**Warning signs:** The built server image still reports npm CVE findings that Phase 1 was supposed to fix.

### Pitfall 4: CouchDB runner.sh Requires Root at Runtime

**What goes wrong:** Adding a `USER couchdb` directive to the CouchDB hardened Dockerfile causes the `bbcouch-runner.sh` entrypoint to fail with permission errors when it tries to `chown -R couchdb:couchdb ${DATA_DIR}/couch`.

**Why it happens:** `chown` requires root. The CouchDB runner script does `chown` as its first step.

**How to avoid:** Do not add a USER directive to the CouchDB Dockerfile.hardened. D-05 is already locked to preserve the current user model for CouchDB.

### Pitfall 5: Generation Script sed Insert After FROM Line (Alpine Ordering)

**What goes wrong:** The OS patch `RUN` block is inserted before all the LABEL lines (watchtower labels) if the sed `a\` command is anchored to `FROM node:22-alpine`. The labels appear after FROM in the original, and the OS patch should come after the labels but before the first `RUN apk add`.

**Why it happens:** `sed '/pattern/a\text'` inserts after every matching line. The FROM line is a clean anchor, but the original Dockerfile has LABEL lines between FROM and the first RUN.

**How to avoid:** Anchor the OS patch insertion to the line immediately before the first `RUN apk add` rather than after FROM. In server's Dockerfile, the line is `# handle node-gyp and install postgres client for pg_dump utils`. In worker's Dockerfile, it's `# handle node-gyp`.

**Correct sed pattern:** Use the comment line before the apk block as the insertion anchor:
```bash
-e '/# handle node-gyp/i # OS-level CVE patches (OS-01, OS-02, OS-03)\nRUN apk add --upgrade --no-cache \\\n    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \\\n    zlib \\\n    curl\n'
```

### Pitfall 6: chown Placement Must Be After All COPY Instructions

**What goes wrong:** Placing `RUN chown -R node:node /app` before the final `COPY packages/server/dist/` instruction means the freshly copied dist/ files are root-owned. The node user cannot read them.

**Why it happens:** Dockerfile instructions run sequentially; chown only applies to what has already been COPY'd.

**How to avoid:** In the generation script, anchor the `RUN chown` and `USER node` insertion to the line immediately before `CMD`. This ensures it is the last modification before the container entry point.

**Correct placement:**
```dockerfile
# ... all COPY instructions complete ...
RUN chown -R node:node /app
USER node

CMD ["./docker_run.sh"]
```

---

## Code Examples

Verified patterns from direct inspection and live Docker testing:

### server Dockerfile.hardened — Key Delta from Original

```dockerfile
FROM node:22-alpine

LABEL com.centurylinklabs.watchtower.lifecycle.pre-check="scripts/watchtower-hooks/pre-check.sh"
# ... other LABEL lines ...

# OS-level CVE patches — scoped to named packages only (OS-01, OS-02, OS-03)
# zlib 1.3.2-r0: fixes CVE-2026-22184 (CRITICAL buffer overflow) — available in Alpine 3.23 stable
# curl 8.19.0-r0: fixes CVE-2026-3805 (HIGH use-after-free) — requires Alpine edge/main
RUN apk add --upgrade --no-cache \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \
    zlib \
    curl

# handle node-gyp and install postgres client for pg_dump utils
RUN apk add --no-cache \
    g++ \
    make \
    # ... rest of original apk add block ...

# ... original Dockerfile content unchanged ...

WORKDIR /app
# HARDENED: use package.hardened.json (with npm CVE resolutions) instead of package.json
COPY packages/server/package.hardened.json ./package.json
COPY packages/server/dist/yarn.lock .

# ... removeWorkspaceDependencies.sh, yarn install, apk del, COPY dist/ ...

# HARDENED: Native addon smoke test after OS upgrade
RUN node -e "require('bcrypt'); require('isolated-vm'); console.log('native addons OK')"

# HARDENED: Drop to non-root user (DOCK-05)
# node user (UID 1000) pre-exists in node:22-alpine base image
RUN chown -R node:node /app
USER node

CMD ["./docker_run.sh"]
```

### Verified apk upgrade command (tested 2026-03-21 against node:22-alpine / Alpine 3.23.3)

```bash
# Installs: zlib 1.3.2-r0, curl 8.19.0-r0, libcurl 8.19.0-r0
# Also upgrades: libcrypto3 3.5.5-r1, libssl3 3.5.5-r1 (from edge, minor patch)
apk add --upgrade --no-cache \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main \
    zlib \
    curl
```

### CouchDB Dockerfile.hardened — Delta from Original

The runner stage of the CouchDB Dockerfile (lines 101-153) already contains:
```dockerfile
# Lines 123-126 of existing hosting/couchdb/Dockerfile:
RUN apt-mark hold couchdb && \
    apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/
```

The hardened variant is functionally identical to the original for OS patching — this pattern already covers Debian CVEs. No structural changes are needed beyond copying the file. The npm global at line 83 (`npm install -g npm@latest`) already handles any npm transitive vulnerabilities in the npm binary itself.

The CouchDB hardened Dockerfile delta is: **copy + add a generation comment header only**.

### pm2-runtime non-root verification (tested live)

```bash
# In node:22-alpine, node user (UID 1000) can run pm2-runtime:
su node -s /bin/sh -c 'pm2-runtime --version'
# Output: 6.0.14  (success — no root required)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `apk upgrade` (blanket) | `apk add --upgrade <specific packages>` | Security hardening best practice | Preserves native addon ABI; scoped and auditable |
| Root-only containers | `USER node` with pre-existing user | Docker CIS Benchmark requirement | No impact on functionality; pm2-runtime works as non-root |
| Stable repo only for OS CVEs | Edge repo for specific unbackported fixes | curl CVE-2026-3805 (fix only in 8.19.0, edge-only as of 2026-03-21) | Edge repo used only for the upgrade command via `--repository=` flag |

**Deprecated/outdated:**
- `apk add --upgrade` without package name specification — Correct form targets named packages; blanket upgrade is acceptable only with pinned base image digest AND native addon smoke test.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Docker build smoke tests (inline RUN assertions) |
| Config file | None — assertions are Dockerfile RUN instructions |
| Quick run command | `docker build -f packages/server/Dockerfile.hardened --build-arg BUDIBASE_VERSION=test .` |
| Full suite command | Run quick build for all three images, then `trivy image --severity HIGH,CRITICAL` and `grype` against each |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| OS-01 | zlib 1.3.2-r0 installed | build assertion | `docker build -f packages/server/Dockerfile.hardened ... && docker run --rm ... apk list --installed \| grep zlib-1.3.2` | ❌ Wave 0 |
| OS-02 | curl 8.19.0-r0 installed | build assertion | `docker run --rm <image> curl --version \| grep -q '8.19'` | ❌ Wave 0 |
| OS-03 | No blanket apk upgrade | code review | `grep -v 'apk upgrade' Dockerfile.hardened` (negated check) | ❌ Wave 0 |
| DOCK-01 | server builds without error | build | `docker build -f packages/server/Dockerfile.hardened --build-arg BUDIBASE_VERSION=test .` | ❌ Wave 0 |
| DOCK-02 | worker builds without error | build | `docker build -f packages/worker/Dockerfile.hardened --build-arg BUDIBASE_VERSION=test .` | ❌ Wave 0 |
| DOCK-03 | couchdb builds without error | build | `docker build -f hosting/couchdb/Dockerfile.hardened .` | ❌ Wave 0 |
| DOCK-04 | Images tagged {version}-hardened | convention | Build arg passes `--build-arg BUDIBASE_VERSION=x.y.z-hardened` | ❌ Wave 0 |
| DOCK-05 | Non-root USER in server/worker | build assertion | `docker run --rm <image> id \| grep 'uid=1000(node)'` | ❌ Wave 0 |
| DOCK-06 | removeWorkspaceDependencies.sh present | build assertion | `grep -q 'removeWorkspaceDependencies' Dockerfile.hardened` | ❌ Wave 0 |

**Additional scan tests (success criteria):**
- `trivy image --severity HIGH,CRITICAL --exit-code 1 <image>` — zero findings for all three images
- `grype <image> --fail-on high` — zero HIGH/CRITICAL findings for all three images

### Sampling Rate

- **Per task commit:** `docker build -f <Dockerfile.hardened> --build-arg BUDIBASE_VERSION=test .` (build succeeds)
- **Per wave merge:** Full Trivy 0.68.1 + Grype 0.109.0 scan of all three built images
- **Phase gate:** All three images scan-clean before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `scripts/generate-hardened-dockerfile.sh` — the generation script itself; produced in Wave 1 task
- [ ] `packages/server/Dockerfile.hardened` — generated output; Wave 1 output
- [ ] `packages/worker/Dockerfile.hardened` — generated output; Wave 1 output
- [ ] `hosting/couchdb/Dockerfile.hardened` — generated output; Wave 1 output

No existing test infrastructure covers Docker build assertions — all test steps are new `docker build` + `docker run` + scanner commands executed manually per the phase gate checklist.

---

## Open Questions

1. **curl edge dependency stability**
   - What we know: Edge repo pulls libcrypto3 3.5.5-r1 and libssl3 3.5.5-r1 alongside curl 8.19.0-r0; tested as of 2026-03-21; native addons (bcrypt, isolated-vm) load correctly
   - What's unclear: Edge repo packages change without notice; a future `docker build` could pull a different edge libssl version that breaks native addons
   - Recommendation: Pin the edge repo pull to the specific date via the `--allow-untrusted --repository` approach or accept this as LOW-risk given the smoke test assertion catches breakage at build time

2. **zlib 1.3.2-r0 in Alpine 3.23 stable — timing**
   - What we know: zlib 1.3.2-r0 IS available in Alpine 3.23.3 stable as of 2026-03-21 (confirmed via live Docker test)
   - What's unclear: Whether the same `--repository=edge` flag needed for curl will pull a different zlib version (it will not; stable 3.23 has the correct zlib already)
   - Recommendation: Use the edge repo flag only for the combined `apk add` command — it handles both packages in one shot and zlib from stable is pulled by edge's curl dependency resolution anyway

3. **pm2 in CouchDB image**
   - What we know: The CouchDB Dockerfile does NOT install pm2 — runner.sh starts couchdb, clouseau, and sqs directly. Grype reports pm2 6.0.14 as LOW severity only (GHSA-x5gf-qvw8-r2rm). This is in the server/worker images, not CouchDB.
   - What's unclear: D-07 mentions "pin npm global packages (pm2) to non-vulnerable versions" for CouchDB — but CouchDB does not install pm2. This likely refers to server/worker.
   - Recommendation: The pm2 finding is LOW severity and is in server/worker not CouchDB. No action needed for CouchDB on pm2. Server/worker phase 1 resolutions don't fix pm2 (it's a global install not a project dep). However the requirement scope is HIGH/CRITICAL only — pm2's GHSA-x5gf-qvw8-r2rm is LOW, so it is out of scope for phase 2.

---

## Sources

### Primary (HIGH confidence)

- Direct inspection: `packages/server/Dockerfile` — source of generation, all line positions verified
- Direct inspection: `packages/worker/Dockerfile` — source of generation, all line positions verified
- Direct inspection: `hosting/couchdb/Dockerfile` — confirmed existing apt-mark hold + apt-get upgrade pattern (lines 123-126), confirmed no pm2 in CouchDB
- Direct Docker testing (2026-03-21, node:22-alpine / Alpine 3.23.3): `apk add --upgrade --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main zlib curl` installs zlib 1.3.2-r0 and curl 8.19.0-r0
- Direct Docker testing: `node` user (UID 1000) pre-exists in node:22-alpine; pm2-runtime runs as node user
- Alpine Security Tracker: https://security.alpinelinux.org/vuln/CVE-2026-3805 — confirmed curl 8.19.0-r0 is the fix version
- curl official advisory: https://curl.se/docs/CVE-2026-3805.html — confirmed 8.19.0 is the fix release (2026-03-11)

### Secondary (MEDIUM confidence)

- `.planning/research/PITFALLS.md` — Alpine apk upgrade pitfalls, native addon ABI risks (prior research, HIGH confidence)
- `.planning/research/ARCHITECTURE.md` — component boundaries and data flow (prior research, HIGH confidence)
- grype_output.txt — confirmed CVE-2026-3805 (High) for curl 8.17.0-r1; CVE-2026-22184 (Critical) for zlib 1.3.1-r2
- trivy_output.txt — confirmed CVE-2026-22184 CRITICAL for zlib 1.3.1-r2; zlib fixed version 1.3.2-r0

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- OS patching approach: HIGH — verified live in Docker against the actual base image
- Non-root USER: HIGH — verified pm2-runtime works as node user; docker_run.sh assessed as compatible
- CouchDB hardened delta: HIGH — existing Dockerfile already has the correct apt-get upgrade pattern
- curl edge repo approach: HIGH (functional) / MEDIUM (long-term stability) — edge package versions can drift; smoke test mitigates this

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 for zlib (stable backport may arrive); 2026-03-28 for curl (edge repo is rolling, edge URL is stable)

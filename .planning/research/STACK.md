# Stack Research

**Domain:** Docker image hardening pipeline — vulnerability patching for published container images
**Researched:** 2026-03-21
**Confidence:** HIGH (verified against official sources, CVE databases, and release pages)

---

## Context: What This Stack Must Solve

The existing build produces three images from:
- `node:22-alpine` — server (`budibase/apps`) and worker (`budibase/worker`)
- `node:22-slim` (Debian Bookworm) — database (`budibase/database`)

The existing monorepo uses **Yarn Classic v1** (lockfile at root, workspace hoisting). Server/worker Dockerfiles install production deps via `yarn install --production` using a copy of the root `yarn.lock` that is bundled into `dist/` at build time (via `postbuild` copyfiles step).

The hardened pipeline must patch 34 HIGH/CRITICAL findings without modifying existing Dockerfiles and without waiting for upstream packages to release new versions.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Yarn Classic resolutions | v1 (existing) | Force patched transitive dep versions into `yarn.lock` | The repo already uses Yarn Classic. The `resolutions` field in root `package.json` is the established, idiomatic way to force transitive versions in Yarn v1 — changes propagate to the lockfile automatically on `yarn install`. Do not introduce npm overrides alongside Yarn; mixing package managers in a Yarn workspace breaks determinism. |
| `apk add --upgrade <pkg>` | Alpine 3.21+ | Patch specific Alpine packages (zlib, curl) in `Dockerfile.hardened` | `apk add --upgrade zlib` upgrades only the named package without touching the rest of the image, which avoids surprise breakage. `apk upgrade` (no package name) is risky in production because it upgrades everything including CouchDB-adjacent libs. For Alpine, `--upgrade` on a named package is the surgical, reproducible approach. |
| `apt-get upgrade -y` with `apt-mark hold <pkg>` | Debian Bookworm | Patch Debian OS packages while protecting pinned versions | The CouchDB Dockerfile already uses this pattern (`apt-mark hold couchdb && apt-get upgrade -y`). Continue it. Holding CouchDB before running a blanket upgrade prevents the CouchDB package from being inadvertently updated when Debian backports catch up. |
| `aquasecurity/trivy-action` | v0.35.0 | Gate CI on scan results — fail if HIGH/CRITICAL remain | Trivy is the scanner already used in the GitLab/Gravity scanning pipeline (Trivy 0.68.1). Using the same scanner locally and in GitHub Actions means the CI gate catches the exact same findings that the downstream scan will report. Pin to `v0.35.0` (with `v` prefix) — this is the only safe tag after the March 2025 supply chain compromise of the trivy-action repository where 75/76 historical version tags were force-pushed with malicious payloads. |
| `anchore/scan-action` | v7.4.0 | Secondary scan with Grype (mirrors GitLab scanner) | GitLab Gravity uses Grype 0.109.0 as the second scanner. Running `anchore/scan-action@v7` in GitHub Actions with `severity-cutoff: high` and `fail-build: true` validates that the image will also pass the Grype gate. Grype v0.110.0 is bundled in v7.4.0. |
| `docker/build-push-action` | v7.0.0 | Build multi-arch hardened images and push `{version}-hardened` tags | The existing `release-database.yml` uses `docker/build-push-action@v5`. Upgrade to v7 for the hardened workflows — v7 ships with Node 24 runtime (required by Actions runner v2.327.1+) and drops legacy export-build support that is irrelevant here. |
| `peter-evans/repository-dispatch` | v2 (existing) | Trigger `budibase-deploys` to build/push hardened images on release | Already used in `tag-release.yml`. Same pattern; emit a separate `hardened-release-prod` event type alongside `release-prod` to avoid coupling the hardened pipeline to the standard release flow. |

### npm/Yarn Vulnerability Remediation

| Package | Vulnerable Version | Fixed Version | Remediation Mechanism | Confidence |
|---------|-------------------|---------------|----------------------|------------|
| `fast-xml-parser` | 4.4.1 | **4.5.4** (4.x) or 5.3.5 (5.x) | Add/update `"fast-xml-parser": ">=4.5.4"` to root `resolutions` | HIGH — CVE-2026-25896 CVSS 9.3, confirmed fixed in 4.5.4 |
| `axios` | 1.7.7 | **1.8.2** | Update `"axios": "1.8.2"` in root `resolutions` (already present at 1.7.7) | HIGH — CVE-2025-27152 (SSRF) fixed in 1.8.2 |
| `tar` | 6.2.1 / 7.4.3 | **7.5.11** | Add `"tar": ">=7.5.11"` to root `resolutions` | HIGH — CVE-2026-31802 (path traversal) fixed in 7.5.11; earlier 7.x patches exist but 7.5.11 is the most recent cumulative fix |
| `minimatch` | 9.0.1 / 9.0.5 | **9.0.6** | Add `"minimatch": ">=9.0.6"` to root `resolutions` | HIGH — CVE-2026-26996 ReDoS fixed in 9.0.6 |
| `koa` | 2.15.4 | **3.1.2** (3.x) or 2.16.4 (2.x) | `koa` is a direct dependency in both `packages/server/package.json` and `packages/worker/package.json` — bump direct deps to 3.1.2 (already at 3.1.2 per server package.json). For worker, verify dep and bump if needed. Add `"koa": ">=3.1.2"` to resolutions to cover transitive pulls. | HIGH — CVE-2026-27959 host header injection fixed in 3.1.2 and 2.16.4 |
| `glob` | 10.4.5 | **10.5.0** | Add `"glob": ">=10.5.0"` to root `resolutions` | HIGH — CVE-2025-64756 CLI command injection fixed in 10.5.0 |

**Critical note on how Yarn resolutions work in Docker builds:** The server and worker Dockerfiles copy `packages/server/dist/yarn.lock` (and `packages/worker/dist/yarn.lock`) into the image — these lockfiles are generated during `yarn build` via the `postbuild` copyfiles step that copies the root `yarn.lock`. This means resolutions added to the root `package.json` will propagate into the lockfile used by Docker, provided `yarn install` is re-run at the monorepo root after adding the resolutions. The hardened build pipeline must ensure a fresh lockfile is generated from patched resolutions before the Docker build runs.

### OS-Level Vulnerability Remediation

| CVE | Package | Base OS | Vulnerable Version | Fixed Version | Dockerfile Approach |
|-----|---------|---------|-------------------|---------------|---------------------|
| CVE-2026-22184 | `zlib` | Alpine (server/worker) | 1.3.1-r2 | **1.3.2-r0** | Add `RUN apk add --no-cache --upgrade zlib` to `Dockerfile.hardened` after base FROM statement |
| CVE-2026-3805 | `curl` / `libcurl` | Alpine (server/worker) | 8.17.0-r1 | **8.19.0** (when available in Alpine repos) | Add `RUN apk add --no-cache --upgrade curl libcurl` to `Dockerfile.hardened`. If Alpine edge does not yet contain 8.19.0, pin Alpine to edge/testing temporarily or install curl from source — flag this for phase-specific research |
| CVE-2026-3805 | `libcurl4` | Debian Bookworm (database) | Bundled with bookworm | Fixed in 8.19.0 | The CouchDB Dockerfile already runs `apt-get upgrade -y` with `apt-mark hold couchdb`. If backports carry 8.19.0, this is already handled. If not, add `deb bookworm-backports` source and `apt-get install -y -t bookworm-backports curl libcurl4`. |

### GitHub Actions Workflow Infrastructure

| Component | Choice | Why |
|-----------|--------|-----|
| Workflow trigger in this repo | `repository_dispatch` event-type `hardened-release-prod` | Mirrors the existing `release-prod` pattern in `tag-release.yml`. Decoupled — hardened builds can trigger independently of standard releases. |
| Remote workflow location | `.github/workflows/remote/` in this repo for manual transfer to `budibase-deploys` | Matches constraint in PROJECT.md: remote workflows placed in a directory for manual transfer. |
| Image tag format | `{version}-hardened` (e.g., `3.0.0-hardened`) | Specified in PROJECT.md. Use the same `BUDIBASE_VERSION` ARG pattern as existing Dockerfiles. |
| Multi-arch | `linux/arm64,linux/amd64` via `docker/setup-qemu-action@v3` + `docker/setup-buildx-action@v3` | Matches the pattern in `release-database.yml`. Required for Apple Silicon dev environments. |
| Scan gate position | After push to registry, before marking workflow as success | Images must be pushed to get a real OCI artifact; Trivy and Grype scan the pushed image not the local build context. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `docker/setup-qemu-action` | v3 | Multi-arch emulation for ARM builds | Required; same version as existing `release-database.yml` |
| `docker/setup-buildx-action` | v3 | Docker Buildx for multi-platform builds | Required; same version as existing workflows |
| `docker/login-action` | v3 | Authenticate to Docker Hub | Required; same version as existing workflows |

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Yarn `resolutions` in root `package.json` | npm `overrides` in a per-package `package.json` | Use npm overrides only if you migrate the entire monorepo to npm. Mixing Yarn resolutions (root) with npm overrides (Docker layer package.json) is not supported — npm ignores `resolutions` fields and Yarn ignores `overrides` fields. Do not introduce npm into a Yarn workspace. |
| `apk add --upgrade <pkg>` (named package only) | `apk upgrade` (all packages) | Use blanket `apk upgrade` only on a base image that you control end-to-end. In images with complex native deps (node-gyp, isolated-vm, pg), blanket upgrades can break compiled modules. Surgical named-package upgrade is safer. |
| Copacetic (`copa`) for OS patching | Rebuilding full base image from scratch | Copa is appropriate for images you cannot rebuild (e.g., third-party images). For Budibase, we control the Dockerfiles, so a `Dockerfile.hardened` layer is more transparent, auditable, and compatible with the existing lockfile-based build process. Copa **cannot patch npm vulnerabilities** (only OS packages), making it insufficient for the 33 npm findings. |
| Chainguard `cgr.dev/chainguard/node` base image | `node:22-alpine` + hardening layer | Chainguard images have zero known CVEs and rebuild daily. They are the ideal long-term solution. However, they require migration of native modules (isolated-vm, bcrypt, oracledb) to verify musl/glibc compatibility and cannot be done as a `Dockerfile.hardened` overlay without functional validation. This is a milestone-2+ consideration, not a v1 hardening approach. |
| `aquasecurity/trivy-action@v0.35.0` (pinned with `v` prefix) | SHA-pinned action | SHA pinning is the most secure option (prevents tag compromise), but SHA references are opaque and hard to audit in PRs. Given that trivy-action has already had a supply chain incident, v0.35.0 is the confirmed clean tag. Accept the minor risk versus the readability cost. Review periodically. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `aquasecurity/trivy-action` at any version tag other than `v0.35.0` (with `v` prefix) | In March 2025, 75 of 76 version tags in the trivy-action repository were force-pushed with malicious payloads. Tags like `@0.34.2`, `@0.33.0`, `@0.18.0` executed malicious code. Only `v0.35.0` was confirmed unaffected at time of incident. | `aquasecurity/trivy-action@v0.35.0` — verify on each update by checking official release notes |
| `npm audit fix` or `npm audit fix --force` in Docker build | These commands rewrite `package-lock.json` but the repo uses `yarn.lock`. Running npm commands in a Yarn workspace corrupts the lockfile determinism and may generate a `package-lock.json` that conflicts with Yarn. | Yarn `resolutions` in `package.json` + re-run `yarn install` |
| Manual edits to `yarn.lock` | Brittle, undocumented, easily reverted by the next `yarn install`. Security scanners look at actual installed versions, not intended resolutions. | Yarn `resolutions` field — the lockfile is regenerated correctly on every `yarn install` |
| `FROM node:22-alpine AS base` in `Dockerfile.hardened` without the `apk add --upgrade` patches | The base image ships `zlib@1.3.1-r2` and `curl@8.17.0-r1`. Starting FROM the same base and not patching means the hardened image inherits the same OS vulnerabilities. | Always add the upgrade RUN step in `Dockerfile.hardened` after the base FROM |
| Blanket `apk upgrade` (no package name) in server/worker Dockerfiles | Can upgrade Alpine packages that native Node modules were compiled against (libssl, musl), causing runtime failures for isolated-vm, bcrypt, oracledb. | `apk add --no-cache --upgrade zlib curl libcurl` — named packages only |
| Ignoring the `--ignore-unfixed` flag in Trivy | Without it, Trivy will report CVEs that have no fix available, and the gate will fail on findings that cannot be resolved, blocking releases permanently. | Use `ignore-unfixed: true` in `trivy-action` configuration to match the GitLab pipeline's actionable-only posture |

---

## Stack Patterns by Variant

**For server and worker (`node:22-alpine` base):**
- Use `FROM node:22-alpine` identical to original Dockerfile
- Add `RUN apk add --no-cache --upgrade zlib curl libcurl` immediately after base layers
- Build from patched `yarn.lock` (generated from updated `resolutions`)
- Tag: `budibase/apps:{version}-hardened`, `budibase/worker:{version}-hardened`

**For database (`node:22-slim` / Debian Bookworm base):**
- The CouchDB Dockerfile already has `apt-mark hold couchdb && apt-get upgrade -y` in the runner stage
- If `libcurl4 >= 8.19.0` is not in standard bookworm repos, add bookworm-backports source before the upgrade step
- Tag: `budibase/database:{couchdb-version}-hardened` (sourced from `hosting/couchdb/VERSION`)

**For the GitHub Actions workflow in this repo:**
- Use `workflow_dispatch` with `version` input (same as existing workflows) OR trigger via tag push
- Emit `repository_dispatch` to `budibase-deploys` with event-type `hardened-release-prod`
- Payload: `{"TAG": "{version}", "HARDENED": true}` to allow budibase-deploys to route to hardened workflow

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `fast-xml-parser@4.5.4` | AWS SDK v3, @aws-sdk/client-* | AWS SDK bundles fast-xml-parser internally; the Yarn resolution will override the bundled version for top-level resolution but not nested within node_modules of packages that bundle their own copy. Verify scan result post-fix. |
| `axios@1.8.2` | All direct consumers in server/worker | 1.8.x is a minor bump from 1.7.x; no breaking API changes. The root `resolutions` already pins axios at 1.7.7 — bump it to 1.8.2. |
| `tar@7.5.11` | Node 22, all platform archs | tar 7.x requires Node >= 18. Compatible with Node 22. The 6.x series (also affected) becomes unreachable once 7.5.11 is resolved at the top level. |
| `minimatch@9.0.6` | Node 22 | 9.x uses ES module syntax internally but ships a CJS wrapper. Compatible with CommonJS consumers. |
| `koa@3.1.2` | @koa/router 15.3.0, @koa/cors 5.0.0 | Koa 3 is already in use as a direct dependency in server. Worker uses koa 3.1.2 as well per its package.json. Transitive pulls of older koa (2.x) from subdeps should be overridden by resolution. |
| `glob@10.5.0` | Node 22, minimatch 9.x | glob 10.x depends on minimatch 9.x — updating both together is consistent. |

---

## Sources

- [aquasecurity/trivy-action releases](https://github.com/aquasecurity/trivy-action/releases) — Confirmed v0.35.0 is latest (March 20, 2025); supply chain incident documented. HIGH confidence.
- [anchore/scan-action releases](https://github.com/anchore/scan-action/releases) — Confirmed v7.4.0 latest (March 20, 2025), bundles Grype v0.110.0. HIGH confidence.
- [docker/build-push-action releases](https://github.com/docker/build-push-action/releases) — Confirmed v7.0.0 latest (March 5, 2025). HIGH confidence.
- [CVE-2026-22184 / Alpine Security Tracker](https://security.alpinelinux.org/vuln/CVE-2026-22184) — zlib 1.3.2-r0 is fixed version in Alpine. HIGH confidence.
- [CVE-2026-3805 / curl.se](https://curl.se/docs/CVE-2026-3805.html) — Fixed in libcurl 8.19.0 (released March 11, 2026). Alpine package availability requires verification. MEDIUM confidence on Alpine package timing.
- [CVE-2026-25896 / fast-xml-parser](https://advisories.gitlab.com/pkg/npm/fast-xml-parser/CVE-2026-25896/) — Fixed in fast-xml-parser 4.5.4. HIGH confidence.
- [CVE-2025-27152 / axios SSRF](https://osv.dev/vulnerability/CVE-2025-27152) — Fixed in axios 1.8.2. HIGH confidence.
- [CVE-2026-31802 / node-tar](https://advisories.gitlab.com/pkg/npm/tar/CVE-2026-31802/) — Fixed in tar 7.5.11. HIGH confidence.
- [CVE-2026-26996 / minimatch ReDoS](https://github.com/advisories/GHSA-3ppc-4f35-3m26) — Fixed in minimatch 9.0.6. HIGH confidence.
- [CVE-2025-64756 / glob command injection](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) — Fixed in glob 10.5.0. HIGH confidence.
- [CVE-2026-27959 / koa host header injection](https://github.com/koajs/koa/security/advisories/GHSA-7gcc-r8m5-44qm) — Fixed in koa 2.16.4 and 3.1.2. HIGH confidence.
- [Yarn selective version resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) — Official Yarn Classic docs. HIGH confidence.
- [Trivy supply chain attack — Socket.dev](https://socket.dev/blog/trivy-under-attack-again-github-actions-compromise) — Documents the March 2025 tag compromise. HIGH confidence.
- [Copacetic FAQ](https://project-copacetic.github.io/copacetic/website/faq) — Confirmed Copa cannot patch npm/application-level vulnerabilities. HIGH confidence.

---

*Stack research for: Docker image hardening pipeline (Budibase)*
*Researched: 2026-03-21*

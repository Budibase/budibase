# Project Research Summary

**Project:** Docker image hardening pipeline — vulnerability patching for published Budibase container images
**Domain:** CI/CD security pipeline (brownfield monorepo addition)
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

This project is a targeted vulnerability remediation pipeline for three published Docker images (`budibase/apps`, `budibase/worker`, `budibase/database`) that currently carry 34 HIGH/CRITICAL findings detected by the GitLab/Gravity scanner (Trivy 0.68.1 + Grype 0.109.0). The recommended approach is a thin overlay: create `Dockerfile.hardened` variants alongside existing Dockerfiles (without modifying them), patch OS-level CVEs via named `apk`/`apt-get` package upgrades, and patch npm transitive CVEs via a `package.hardened.json` file with a `resolutions` block that forces patched versions of `fast-xml-parser`, `axios`, `tar`, `minimatch`, `koa`, and `glob` into each image's standalone `yarn install`. A new `release-hardened.yml` workflow fires a `repository_dispatch` to `budibase-deploys` after each release, which builds and pushes images tagged `{version}-hardened`.

The single most important architectural constraint — confirmed by direct codebase inspection — is that the root monorepo's `resolutions` block in `package.json` does NOT reach the Docker build. The Docker build uses a stripped per-package `package.json` and a `dist/yarn.lock` generated at monorepo build time. Resolutions must live in `package.hardened.json` files that are explicitly `COPY`'d into the Docker build context. This is not an edge case; it is the central mechanism for npm vulnerability patching and must be validated by asserting installed package versions inside the running container.

The primary risks are: (1) version-bump API breakage from major bumps (tar 6→7, fast-xml-parser 4→5), which require targeted testing of archiving and XML parsing code paths; (2) Alpine `apk upgrade` breaking native addon ABI (`bcrypt`, `isolated-vm`, `oracledb`) if scoped incorrectly or if the base image tag is too loose; and (3) scanner version mismatch — the hardened image must be verified against the exact Trivy 0.68.1 and Grype 0.109.0 versions used in Gravity CI, not whatever is current on the developer's machine. Both scanners must pass; they differ in CVE scoring for vendor-backported packages.

## Key Findings

### Recommended Stack

The repo already uses Yarn Classic v1 with a `resolutions` block in the root `package.json`. Extending this pattern into per-package `package.hardened.json` files is the idiomatic approach and requires no new tooling. For OS patching: `apk add --no-cache --upgrade <pkg>` (named packages only) on Alpine images; `apt-mark hold couchdb && apt-get upgrade -y` on the Debian/Bookworm CouchDB image (this pattern is already present in the existing CouchDB Dockerfile at line 123). For CI scanning gates: `aquasecurity/trivy-action@v0.35.0` (the only confirmed-clean tag after the March 2025 supply chain compromise) and `anchore/scan-action@v7.4.0` (bundles Grype 0.110.0, mirroring the Grype version in Gravity). Cross-repo triggering uses the existing `peter-evans/repository-dispatch@v2` pattern with a distinct `event-type: hardened-release`.

**Core technologies:**
- `package.hardened.json` + Yarn `resolutions`: Force patched transitive npm dep versions into the Docker build — this is the only mechanism that works given the stripped workspace context inside Docker
- `apk add --no-cache --upgrade zlib curl` (named packages): Surgical Alpine OS patching that avoids breaking native addon ABI
- `apt-get upgrade -y` + `apt-mark hold couchdb`: Debian OS patching already established in the existing CouchDB Dockerfile
- `aquasecurity/trivy-action@v0.35.0`: CI scan gate matching the Gravity scanner, using the sole safe tag after the March 2025 supply chain incident
- `anchore/scan-action@v7.4.0`: Secondary Grype gate matching Gravity CI's second scanner
- `peter-evans/repository-dispatch@v2` with `event-type: hardened-release`: Cross-repo trigger to budibase-deploys, decoupled from the existing `release-prod` event

### Expected Features

**Must have (P1 — required to pass scan gates):**
- `packages/server/Dockerfile.hardened` and `package.hardened.json` — OS patches + npm transitive dep overrides for server image
- `packages/worker/Dockerfile.hardened` and `package.hardened.json` — same CVE exposure as server, same solution
- `hosting/couchdb/Dockerfile.hardened` — Debian-based OS upgrade targeting zlib/curl CVEs while holding CouchDB version
- `.github/workflows/release-hardened.yml` — trigger workflow that fires `repository_dispatch` on release with both `TAG` (app version) and `DB_VERSION` (from `hosting/couchdb/VERSION`, which is independently versioned)
- `.budibase-deploys-workflows/build-hardened-images.yml` — remote workflow template with three parallel build-and-push jobs producing `{version}-hardened` tags

**Should have (P2 — add before or shortly after first hardened release):**
- Post-build scan verification step in CI — fast-fail gate before images reach Gravity
- Non-root `USER` enforcement in Dockerfile.hardened — defense-in-depth, likely flagged in compliance review
- SBOM generation as CI artifact — required by DoD/IL2 compliance frameworks

**Defer (v2+):**
- Cosign keyless image signing — requires Rekor transparency log infrastructure decisions
- Automated re-scan scheduling — natural Phase 2 addition after pipeline proves stable
- Chainguard/wolfi base image migration — eliminates ongoing manual patching but requires full compatibility testing of native modules

### Architecture Approach

The architecture is a thin overlay pattern: all hardening lives in `.hardened` suffixed files placed alongside existing files, with zero changes to the existing Dockerfiles. The `release-hardened.yml` workflow in this repo fires after each release, dispatching to `budibase-deploys` which performs the actual multi-arch builds and Docker Hub pushes. The CouchDB database image uses an independent version track (`hosting/couchdb/VERSION`, currently `2.1.0`) — the dispatch payload must carry both `TAG` (app version) and `DB_VERSION` separately.

**Major components:**
1. `Dockerfile.hardened` (three variants) — fork of existing Dockerfiles adding OS package upgrades and substituting `package.hardened.json` before `yarn install`
2. `package.hardened.json` (server + worker) — standalone package manifest with `resolutions` block pinning patched npm dep versions; this is the critical mechanism for npm CVE remediation inside Docker
3. `.github/workflows/release-hardened.yml` — trigger layer in this repo; reads both version tracks and fires repository_dispatch
4. `.budibase-deploys-workflows/build-hardened-images.yml` — remote workflow template; three parallel build jobs producing `{version}-hardened` tags; requires one-time manual bootstrap into budibase-deploys
5. Scanner gates (Trivy + Grype) — scan after push, before marking workflow successful; must use pinned versions matching Gravity CI

### Critical Pitfalls

1. **Yarn resolutions don't reach the Docker build** — The root `package.json` resolutions are stripped by `removeWorkspaceDependencies.sh`. Overrides must live in `package.hardened.json` explicitly `COPY`'d into the Docker context. Verify by running `docker run --rm <image> node -e "console.log(require('<pkg>/package.json').version)"` for each patched dep.

2. **tar 6→7 API breaking changes** — Forcing all consumers to `tar@7` via a blanket resolution override can break `node-gyp`, `archiver`, and callers accessing streaming internals. Run `yarn test` in `packages/server` specifically exercising archiving and extraction paths before enabling this resolution. Use scoped package-level overrides if needed.

3. **fast-xml-parser 4→5 requires API audit** — Some CVEs are only fully closed in 5.x. The v5 boundary introduces ESM/CJS changes. Grep for `XMLBuilder` imports before bumping; run local Trivy at the pinned version to confirm the target version closes the specific CVEs in scope.

4. **Alpine `apk upgrade` can break native addon ABI** — Blanket `apk upgrade` risks upgrading musl libc, breaking `isolated-vm`, `bcrypt`, `oracledb` compiled against the original musl version. Always scope to named packages: `apk add --no-cache --upgrade zlib curl`. Add a native addon smoke test (`RUN node -e "require('bcrypt'); require('isolated-vm')"`) in the Dockerfile.hardened build.

5. **Scanner version mismatch invalidates verification** — The image must pass Trivy 0.68.1 AND Grype 0.109.0 (the exact Gravity CI versions), not latest. Trivy and Grype differ on vendor-backported OS packages; an image can pass one and fail the other. Always test against both pinned versions before declaring findings closed.

## Implications for Roadmap

Based on research, the work naturally falls into three sequential phases with a clear dependency chain: npm vulnerabilities must be patched first (they account for 33/34 findings and require the most validation), OS vulnerabilities second (simpler to apply but require native addon smoke tests), and the CI/CD pipeline third (wraps everything into a releasable pipeline and adds drift prevention).

### Phase 1: npm Transitive Dependency Patching

**Rationale:** 33 of 34 scan findings are npm packages. This is the highest-leverage phase and sets up the `package.hardened.json` mechanism that the Dockerfiles in Phase 2 depend on. npm patching requires the most careful testing (tar 6→7 API surface, fast-xml-parser version chain, axios integration compatibility) and must be validated before OS patching layers on top.

**Delivers:** `package.hardened.json` for server and worker with verified resolutions for `fast-xml-parser`, `axios`, `tar`, `minimatch`, `koa`, `glob`. Verified installed versions inside a Docker build context.

**Addresses:** npm transitive dep overrides (P1 table stakes), `{version}-hardened` tag groundwork

**Avoids:**
- Pitfall 1 (resolutions not reaching Docker) — via `package.hardened.json` COPY pattern
- Pitfall 2 (tar 6→7 breakage) — via targeted test coverage before enabling resolution
- Pitfall 3 (fast-xml-parser incomplete fix) — via Trivy verification at pinned scanner version
- Pitfall 4 (axios integration conflicts) — via integration test suite for Airtable, Google Sheets, SMTP

### Phase 2: OS Package Patching and Dockerfile.hardened Creation

**Rationale:** Depends on Phase 1 completing `package.hardened.json`. The three hardened Dockerfiles wire together both the OS patches and the npm resolution mechanism. The CouchDB image is Debian-based (completely different patching approach from Alpine) and requires independent handling. OS patching must be tested with native addon smoke tests before the pipeline proceeds.

**Delivers:** Three `Dockerfile.hardened` files (server/worker/couchdb) that build images passing Trivy + Grype at HIGH/CRITICAL threshold when tested locally with Trivy 0.68.1 and Grype 0.109.0.

**Uses:** `apk add --no-cache --upgrade zlib curl` (Alpine), `apt-get upgrade -y` with `apt-mark hold couchdb` (Debian), `package.hardened.json` COPY pattern from Phase 1

**Implements:** Forked Dockerfile with shared build arguments (Architecture Pattern 1)

**Avoids:**
- Pitfall 5 (apk upgrade breaking native addons) — scoped named-package upgrade + native addon smoke test in Docker build
- Pitfall 7 (scanner false positives from backported packages) — test against both Trivy 0.68.1 AND Grype 0.109.0 before declaring findings closed

### Phase 3: CI/CD Pipeline and Cross-Repo Dispatch

**Rationale:** Wraps the verified Dockerfiles and package.hardened.json files into a releasable pipeline. Must come after the hardened images are confirmed clean in Phase 2. The remote workflow template for budibase-deploys requires a one-time manual bootstrap. This phase also establishes drift prevention (scheduled scans, BUDIBASE_VERSION label verification) to prevent the hardened images from becoming stale.

**Delivers:** `release-hardened.yml` trigger workflow, `.budibase-deploys-workflows/build-hardened-images.yml` remote template, three parallel build-and-push jobs producing `{version}-hardened` tags on Docker Hub, scanner gate steps (Trivy + Grype) blocking on HIGH/CRITICAL findings.

**Uses:** `peter-evans/repository-dispatch@v2`, `aquasecurity/trivy-action@v0.35.0`, `anchore/scan-action@v7.4.0`, `docker/build-push-action@v7.0.0`

**Avoids:**
- Pitfall 6 (hardened image drift) — pipeline triggered on every release, BUDIBASE_VERSION label check, scheduled re-scan
- Anti-pattern of reusing `release-prod` dispatch event — use distinct `hardened-release` event type

### Phase Ordering Rationale

- npm patching first because 33/34 findings are npm-sourced and `package.hardened.json` is a build dependency of the Dockerfiles
- OS patching second because it requires a Docker build context to validate, and the Dockerfiles are the natural unit of work for combining npm + OS patches into a testable image
- Pipeline last because it wraps already-validated images; building the pipeline around unvalidated images wastes CI time and obscures whether a failure is a patch problem or a pipeline problem
- CouchDB treated as a separate track within Phase 2 because its Debian base and independent version number (`hosting/couchdb/VERSION`) mean it cannot share the Alpine `apk` approach and requires independent scanner verification

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** The tar 6→7 API compatibility question may require deeper code path analysis in `packages/server` and `packages/worker` — specifically which packages call `tar` and whether any use internal APIs changed in v7. Run `yarn why tar` and review caller source. Similarly, confirm whether fast-xml-parser 4.5.4 closes all CVEs in scope or whether a 5.x jump is required (check the exact CVE IDs against the project's scan output).
- **Phase 2:** The Alpine availability of `curl@8.19.0` (fix for CVE-2026-3805) requires verification against the Alpine 3.21 package repository at build time. If the package is not yet available in Alpine 3.21 stable, a temporary pin to Alpine edge/testing or a source build may be needed — this contingency needs explicit research at planning time.

Phases with standard patterns (skip additional research-phase):
- **Phase 3:** The `repository_dispatch` cross-repo trigger pattern is already established in this codebase (`tag-release.yml`, `force-release.yml`) and is well-documented. Scanner action versions are pinned with verified rationale. No additional research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official docs, CVE databases, and confirmed action versions. The trivy-action supply chain incident is documented and the safe version is confirmed. One MEDIUM-confidence item: Alpine package availability for `curl@8.19.0` requires runtime verification. |
| Features | HIGH | Based on direct codebase inspection of all three Dockerfiles and existing workflows. Feature set is tightly scoped to a concrete list of 34 CVEs. No ambiguity about must-haves. |
| Architecture | HIGH | Architecture patterns are confirmed by direct inspection of existing Dockerfiles, `removeWorkspaceDependencies.sh`, `tag-release.yml`, and root `package.json`. The overlay pattern is a thin delta on existing structure. |
| Pitfalls | HIGH | Most pitfalls are grounded in direct code inspection (the workspace stripping issue is confirmed by reading the actual script). Version-bump API risks are confirmed against official changelogs and CVE databases. |

**Overall confidence:** HIGH

### Gaps to Address

- **Alpine curl@8.19.0 availability:** STACK.md flags this as MEDIUM confidence — Alpine package availability for the curl CVE fix must be verified against the exact Alpine 3.x release used in the `node:22-alpine` base image at build time. If unavailable in stable, a contingency approach (edge/testing repo, backports source, or deferred closure) needs a decision. Flag for Phase 2 planning.

- **tar v7 caller surface in packages/server:** The resolution forces `tar@7.5.11` on all consumers including `node-gyp`. The exact set of packages in the dependency tree that access `tar` internals (not just list it as a peer dep) needs to be enumerated before the resolution is committed. This is a verification step, not a blocker, but skipping it risks a broken Docker build that is expensive to diagnose.

- **fast-xml-parser CVE closure version:** STACK.md recommends `4.5.4` but PITFALLS.md notes that some entity expansion CVEs (CVE-2026-33036) may only be fully closed in 5.x. The specific CVE IDs from the project scan output must be cross-referenced against the fix versions before choosing 4.5.4 vs 5.x as the target.

- **budibase-deploys bootstrap:** The remote workflow template must be manually transferred to `budibase-deploys`. This is a coordination dependency with whoever owns that repository. Needs explicit scheduling as part of Phase 3 planning.

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection: `packages/server/Dockerfile`, `packages/worker/Dockerfile`, `hosting/couchdb/Dockerfile`, `.github/workflows/tag-release.yml`, `.github/workflows/release-database.yml`, `scripts/removeWorkspaceDependencies.sh`, root `package.json` lines 114-135
- [aquasecurity/trivy-action releases](https://github.com/aquasecurity/trivy-action/releases) — v0.35.0 confirmed safe after March 2025 supply chain incident
- [anchore/scan-action releases](https://github.com/anchore/scan-action/releases) — v7.4.0 confirmed, Grype 0.110.0 bundled
- [docker/build-push-action releases](https://github.com/docker/build-push-action/releases) — v7.0.0 confirmed
- CVE advisories: CVE-2026-22184 (zlib), CVE-2026-3805 (curl), CVE-2026-25896 (fast-xml-parser), CVE-2025-27152 (axios), CVE-2026-31802 (tar), CVE-2026-26996 (minimatch), CVE-2025-64756 (glob), CVE-2026-27959 (koa)
- [Yarn selective version resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) — official Yarn Classic docs
- [Trivy supply chain attack — Socket.dev](https://socket.dev/blog/trivy-under-attack-again-github-actions-compromise)
- [Copacetic FAQ](https://project-copacetic.github.io/copacetic/website/faq) — confirmed Copa cannot patch npm vulnerabilities
- node-tar v7 changelog and breaking changes documentation

### Secondary (MEDIUM confidence)

- [CVE-2026-3805 / curl.se](https://curl.se/docs/CVE-2026-3805.html) — fixed in libcurl 8.19.0; Alpine package availability requires verification
- Trivy false positive / OS vendor backport handling documentation — vendor advisory vs NVD discrepancy confirmed but specific Grype behavior for Budibase's Alpine version needs runtime verification

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*

# Pitfalls Research

**Domain:** Docker image hardening pipeline for a Yarn-workspace Node.js monorepo
**Researched:** 2026-03-21
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Yarn Resolutions Don't Apply Inside the Docker Build

**What goes wrong:**
The `resolutions` field in the root `package.json` forces specific transitive dependency versions during monorepo development. But the Docker build uses `packages/server/dist/yarn.lock` (copied in by the `postbuild` script), a standalone `package.json` stripped of all `@budibase/*` workspace entries, and a plain `yarn install --production`. The `resolutions` field from the root `package.json` is NOT present in the image at build time. If a resolution override (e.g., `"axios": "1.8.2"`) exists only at the root level and is not present in the individual package's `package.json` or the copied `yarn.lock`, the vulnerable transitive version will be installed.

**Why it happens:**
`removeWorkspaceDependencies.sh` strips `@budibase/*` entries and their resolutions. The root-level `resolutions` block never makes it into the Docker context. Developers verify overrides work locally (against the workspace lockfile) but don't verify what version actually lands in the image layer.

**How to avoid:**
- Run `yarn why <package>` inside a running container or in a dry-run `docker build` to verify the installed version.
- Add `RUN cat node_modules/<package>/package.json | grep '"version"'` checks in the Dockerfile.hardened as build-time assertions.
- Alternatively, add an explicit `"overrides"` or `"resolutions"` block in each affected package's `package.json` (server/worker) so it survives the workspace-stripping step.
- In the hardened Dockerfile, after `yarn install`, add a `RUN node -e "require('<package>'); console.log(require('<package>/package.json').version)"` assertion for each patched dependency.

**Warning signs:**
- A package shows different versions between `yarn list <pkg>` in local dev vs. `docker run image yarn list <pkg>`.
- The hardened image still fails scanner after you thought a resolution fixed the issue.
- `packages/server/dist/yarn.lock` references an older version of a patched package.

**Phase to address:**
Phase 1 (npm vulnerability patching) — before any hardened Dockerfile is committed.

---

### Pitfall 2: Major Version Bump Breaking Application Code — tar 6→7

**What goes wrong:**
`tar` is pinned at `7.5.11` in `packages/server/package.json`, but transitive consumers (node-gyp, npm, archiver) reference `tar@6.x`. Forcing all of them to `tar@7` via a `resolutions` override breaks callers that use the v6 API. Specifically: node-tar v7 changed the default `chmod` behavior (now off by default), dropped CJS `require()` for some sub-paths, and switched to a dual ESM/CJS build. Callers that do `const tar = require('tar')` continue to work, but callers accessing `tar.Pack` or streaming internals directly may fail silently or throw at runtime.

**Why it happens:**
The resolution is applied globally to all consumers regardless of their API surface. Security scanners report `tar@6.x` as vulnerable, so the instinct is to bump everything to `7.x`. The package appears to install successfully but runtime failures emerge under specific code paths (archiving, extraction).

**How to avoid:**
- Use a narrow resolution: only force `tar@7.x` for packages that are direct consumers under your control (`@budibase/server`). Keep indirect consumers pinned at `tar@6.x` where your code doesn't call them.
- Review the node-tar v7 changelog before applying a blanket resolution override. The critical API differences are: `chmod` default changed, ESM-only export paths for some sub-modules.
- Run the full integration test suite (`yarn test` in `packages/server`) after the resolution change before shipping.
- Check which packages in the dependency tree actually call `tar` (not just which ones list it) by running `yarn why tar` and reviewing callers' source.

**Warning signs:**
- Tests using `archiver`, `extract-zip`, or anything touching `.tgz` files start failing after the override.
- `node-gyp` build errors during `yarn install` inside the Docker build — node-gyp depends on `tar@6.x`.
- Error messages like `tar.Pack is not a constructor` or unexpected `undefined` for `tar` sub-exports.

**Phase to address:**
Phase 1 (npm vulnerability patching) — test coverage for affected paths is mandatory before enabling the resolution.

---

### Pitfall 3: fast-xml-parser Vulnerability Fix Requires Major Version Jump (4→5)

**What goes wrong:**
The root `package.json` resolutions currently pin `fast-xml-parser` at `4.4.1`. The CVE (XSS via DOCTYPE) was reported in 4.x but the complete fix for all known entity expansion bypasses (CVE-2026-25896, CVE-2026-33036) is only in `5.5.6+`. Bumping `fast-xml-parser` to `5.x` is a minor API change (ESM support added), but `XMLBuilder` is being deprecated and some import patterns change. Any code in `@budibase/server` or `@budibase/backend-core` that imports `XMLBuilder` from `fast-xml-parser` will need to be audited.

**Why it happens:**
Developers bump to the nearest patched 4.x release and assume the CVE is closed. They don't check that the scanner still fires for newer CVEs that only have fixes in 5.x. The incomplete-fix chain (4.4.1 → 4.5.4 → 5.x) means a 4.x resolution may still produce scanner findings.

**How to avoid:**
- Check the full CVE list on Snyk for `fast-xml-parser` before picking a target version. As of 2026-03, the clean version is `5.5.7`.
- Grep the codebase for `XMLBuilder` and `new XMLParser` imports and verify they are API-compatible with v5 before landing the bump.
- Confirm with the scanner (local Trivy run) that the target version produces zero findings before wiring it into CI.

**Warning signs:**
- Trivy still reports `fast-xml-parser` findings after the resolution bump — this indicates you landed on an intermediate 4.x that doesn't close all CVEs.
- New `import` errors at startup — v5 switches to dual ESM/CJS, which can cause issues in CommonJS-only environments if the `require()` path resolves to the ESM entrypoint.

**Phase to address:**
Phase 1 (npm vulnerability patching).

---

### Pitfall 4: axios Transitive Version Conflicts — koa/bull/AWS SDK Pinning Conflicts

**What goes wrong:**
`axios` is currently pinned to `1.7.7` in root resolutions, but 3 CVEs (SSRF CVE-2025-27152, DoS CVE-2025-58754, proto pollution) require `1.8.2+`. Bumping the resolution to `1.8.2+` is safe for application code, but some packages in the tree (older AWS SDK v3 sub-packages, `@elastic/elasticsearch@7.10.0`, `airtable@0.12.2`) ship peer dependency constraints or internal usages tied to `1.7.x` ranges. When forced to `1.8.x+`, they may emit peer dependency warnings or, in rare cases, fail to initialize if they access internal axios internals that changed (interceptor chain rebuild in `1.8.0`).

**Why it happens:**
The SSRF fix in `1.8.0` changed how `baseURL` + absolute URL interactions work. Packages that rely on this (intentional or accidental) SSRF-adjacent behavior will behave differently after the bump. The issue goes unnoticed in unit tests (which mock HTTP) but surfaces in integration tests or production.

**How to avoid:**
- After bumping `axios` resolution, run the full API integration test suite with live HTTP calls, not just mocked tests.
- Check each direct dependent's changelog for notes on axios compatibility at the `1.8.x` boundary.
- In Budibase's case: verify Airtable, Google Sheets, and SMTP integrations still work end-to-end, as these are the most likely HTTP-active code paths.

**Warning signs:**
- `baseURL` combined with absolute URL requests begin routing differently (intentional fix, but breaks callers relying on old behavior).
- Integration test failures in datasource connectors after the resolution bump.
- `Cannot read properties of undefined` errors in axios interceptors at startup for any library that instantiates an axios instance in its module initializer.

**Phase to address:**
Phase 1 (npm vulnerability patching) — integration test coverage required before finalising the resolution.

---

### Pitfall 5: Alpine apk Upgrade Introduces Node.js ABI or glibc Incompatibilities

**What goes wrong:**
The hardened Dockerfiles for `budibase/apps` and `budibase/worker` are based on `node:22-alpine`. Running `apk upgrade` to patch `zlib` (CVE-2026-22184) and `curl` (CVE-2026-3805) pulls in whatever is current in the Alpine package repository at build time. Alpine's package repository is rolling — packages are periodically removed or updated without notice. An `apk upgrade` today may pull in a musl libc version that is incompatible with native Node add-ons (`bcrypt`, `oracledb`, `isolated-vm`) compiled for the original base image's musl version.

**Why it happens:**
`apk upgrade` without version pins upgrades everything available. Native addons (`.node` files) compiled against musl 1.2.4 will crash with symbol lookup errors if musl is upgraded to 1.2.5 with ABI changes. This is especially risky for `isolated-vm` and `bcrypt` which are compiled during `yarn install`.

**How to avoid:**
- Pin the Alpine base image tag precisely (`node:22.x.y-alpine3.20`) rather than `node:22-alpine`. This ensures `apk upgrade` only upgrades packages within a known Alpine release.
- Scope `apk upgrade` to just the vulnerable packages rather than upgrading everything: `apk upgrade zlib curl`.
- After an `apk upgrade`, verify native addons load correctly with: `RUN node -e "require('bcrypt'); require('isolated-vm'); console.log('native addons OK')"`.
- Add a build-time test step that starts the server and issues a health check request before tagging the image as `hardened`.

**Warning signs:**
- `Error: /lib/libcrypto.so.3: version 'OPENSSL_3.x.x' not found` or similar ABI errors in the image.
- `isolated-vm` crashes at startup with `Segmentation fault` or `SIGSEGV`.
- The hardened image build succeeds but the container immediately exits with code 139 or a module load error.

**Phase to address:**
Phase 2 (OS-level vulnerability patching) — scoped apk upgrade must be tested with native addon smoke tests.

---

### Pitfall 6: Hardened Images Drift from Standard Releases Over Time

**What goes wrong:**
The initial hardened images are built and pass scans. Six months later, the standard images get new dependencies, the base image moves to Alpine 3.22, and the hardened Dockerfiles still reference the old `apk upgrade` approach against a different Alpine release. New vulnerabilities are introduced in the drift period. The hardened pipeline silently produces stale images that diverge from what's actually being deployed.

**Why it happens:**
The hardened pipeline is a separate workflow (by design — `repository_dispatch` to `budibase-deploys`). If it isn't triggered on every release with the same dependency inputs as the standard images, the two diverge. Teams assume "hardened = secure" but the hardened image is running older application code or dependency versions.

**How to avoid:**
- The `repository_dispatch` trigger from `tag-release.yml` must fire on every release, not just security-focused ones.
- The hardened Dockerfile must `COPY` from the same build artifacts as the standard Dockerfile — it must not pin versions of application packages separately.
- Include a scheduled scan job (weekly Trivy scan against the published `hardened` tag) to detect regressions between releases.
- Document which `BUDIBASE_VERSION` each hardened image was built from — verify this in the CI workflow so mismatches are caught at tag time.

**Warning signs:**
- The `*-hardened` image's `BUDIBASE_VERSION` label does not match the corresponding standard image.
- Trivy/Grype scans of the hardened image return findings that weren't present at the time of the last release.
- The `Dockerfile.hardened` still references a `node:22-alpine3.20` pin while the standard `Dockerfile` has moved to `3.21`.

**Phase to address:**
Phase 3 (CI/CD pipeline) — drift prevention must be baked into the pipeline design from the start.

---

### Pitfall 7: Scanner False Positives from Unfixed/Backported OS Packages

**What goes wrong:**
Trivy and Grype source vulnerability data from the OS vendor's advisory database AND the NVD. Alpine backports security fixes without incrementing the upstream package version. A package may be patched in Alpine 3.20's `zlib-1.3.1-r4` but NVD records the fix as "fixed in upstream 1.3.2". Trivy reports the Alpine package as still vulnerable because it compares the version string against the NVD upstream fixed version, not the vendor backport.

**Why it happens:**
Grype and Trivy differ in their vendor advisory trust — Trivy prefers the OS vendor advisory (which knows about backports), but Grype's default behavior may compare against upstream NVD fixed versions. When the Gravity CI scanner is Grype, the image may pass Trivy locally but fail Grype remotely, or vice versa.

**How to avoid:**
- Always test with both the Trivy version AND Grype version used in the Gravity CI (Trivy 0.68.1 and Grype 0.109.0 per PROJECT.md). Do not only validate locally with the latest scanner version.
- For findings that appear to be false positives (package is present but patched by vendor), use `--ignore-unfixed` with Trivy and check Grype's `--only-fixed` behavior.
- Cross-reference Alpine security tracker (`security.alpinelinux.org/srcpkg/<package>`) to confirm whether a version is actually patched before declaring a finding closed.
- Accept a VEX/`.trivyignore` entry only after confirming with the Alpine security tracker that the installed version has the backport applied.

**Warning signs:**
- Scanner reports a finding against a package where `apk info -a <package>` shows a newer release date than the CVE.
- Trivy passes locally but Grype fails in Gravity CI for the same image.
- The Alpine security tracker shows `fixed` but the scanner shows `affected`.

**Phase to address:**
Phase 1 and Phase 2 — verify each scanner independently at the specific pinned versions used by Gravity.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Global `resolutions` override for all packages | Quick — one line in root package.json | Overrides don't reach the Docker build (see Pitfall 1); creates false sense of security | Never for Docker hardening — must verify impact inside the image |
| `apk upgrade` (all packages, no pins) | Patches OS CVEs in one command | Non-deterministic; pulls different packages on each rebuild; breaks native addons | Only acceptable if base image tag is pinned AND native addon smoke test runs after |
| Bump to latest version of patched package without testing | Fast CVE closure | Introduces API-level breaking changes (tar 6→7, fast-xml-parser 4→5) | Never without running `yarn test` in affected packages |
| Reuse standard `yarn.lock` without re-validating post-override | No lockfile churn | Lockfile may not reflect the overridden version if resolution wasn't present at lock time | Never — always `yarn install` fresh after adding an override |
| Pin hardened base image to specific digest instead of tag | Reproducible builds | Requires explicit updates when base image gets security patches | Acceptable in addition to (not instead of) tag pinning |
| Rely on a single scanner (Trivy only) for sign-off | Simpler pipeline | Misses findings that Grype catches (or vice versa); Gravity uses both | Never — must match the scanner set used by Gravity CI |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Actions → budibase-deploys repository_dispatch | Hardcoded version string in dispatch payload drifts from actual release | Read the version from `BUDIBASE_VERSION` build arg or the git tag, not a hardcoded constant |
| Alpine `apk` package pinning | Pinning to a version that has already been removed from the Alpine repo (rolling release) | Use `apk add --no-cache <package>=<version>` only for versions verified to exist in the target Alpine release; prefer upgrading only by package name without version pin |
| `removeWorkspaceDependencies.sh` and resolutions | Script strips `@budibase/*` resolutions but also silently drops non-workspace resolutions added for hardening | Audit the script output after adding any new `resolutions` entry; add an assertion that target packages survive the strip |
| CouchDB image (`node:22-slim` / Debian) vs. Alpine | `apt-get upgrade` (Debian) vs. `apk upgrade` (Alpine) have different CVE coverage timelines | Treat CouchDB image patching as a separate track — Debian bullseye/bookworm backport schedules differ from Alpine |
| `dist/yarn.lock` copy in Dockerfile | The lock file is captured at build time of the monorepo, not at Docker build time | Any `resolutions` added after the last `yarn build` won't be reflected in `dist/yarn.lock` — must rebuild the monorepo packages to refresh the copied lockfile |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Running `apk upgrade` without `--no-cache` followed by large Alpine index fetch | Docker build layer is large; cache invalidates on every rebuild | Always use `apk upgrade --no-cache` and combine with the `apk add` call in the same `RUN` to keep layer small | Every build if not combined in a single RUN layer |
| Separate `RUN apk update && RUN apk upgrade` commands | Splits the package index into two layers; cache miss on second layer if index changes | Combine: `RUN apk update && apk upgrade --no-cache <pkg> && rm -rf /var/cache/apk/*` | Whenever Alpine index is refreshed in CI |
| Rebuilding hardened image from scratch on every release | Slow CI pipeline — full `yarn install` for each of 3 images per release | Use Docker BuildKit cache mounts for yarn (`--mount=type=cache`) — already done in standard Dockerfiles, must be preserved in Dockerfile.hardened | At scale if cache mounts are dropped |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Verifying scans only against `latest` scanner versions locally, not the pinned Gravity versions (Trivy 0.68.1 / Grype 0.109.0) | Hardened image passes local scan but fails Gravity CI — wasted release cycle | Pin scanner versions in local verification scripts to match Gravity exactly |
| Leaving build tools (`g++`, `make`, `python3`, `git`) in the hardened image | Expands attack surface; these packages carry their own CVEs | The standard Dockerfile already deletes them (`apk del g++ make python3`) — ensure Dockerfile.hardened preserves this deletion |
| Adding `--ignore-unfixed` to scanner flags globally to suppress noise | Masks genuinely unfixed vulnerabilities that the customer scanner doesn't suppress | Use ignore rules narrowly and only for confirmed vendor-backported fixes with a written justification comment |
| Treating hardened images as a one-time fix | New CVEs emerge; the hardened image becomes vulnerable again | Scheduled weekly scan in CI; auto-trigger rebuild when base Alpine image is updated |
| Publishing the hardened image before verifying it boots | Image passes scan but crashes at startup (native addon ABI issue, missing env var, etc.) | Add a smoke test step: `docker run --rm <image> node -e "require('./dist/index.js')"` or a health check endpoint call before the push step |

---

## "Looks Done But Isn't" Checklist

- [ ] **npm overrides landed:** Verify the override is reflected in the installed version *inside the container*, not just in `yarn list` in local dev. Run `docker run --rm <image> node -e "console.log(require('<pkg>/package.json').version)"`.
- [ ] **All three images patched:** It's easy to fix `budibase/apps` and forget `budibase/worker` (different `dist/yarn.lock`) and `budibase/database` (completely different Debian/apt-based stack).
- [ ] **Scanner pinning:** The local verification uses the same Trivy and Grype versions as Gravity CI (0.68.1 and 0.109.0 respectively) — not whatever `trivy` points to on the developer's machine.
- [ ] **Native addon smoke test passed:** After any `apk upgrade`, confirm `bcrypt`, `isolated-vm`, `oracledb` native modules still load inside the hardened container.
- [ ] **`dist/yarn.lock` refreshed:** If a resolution was added or changed after the last `yarn build`, the monorepo must be rebuilt to copy the updated lockfile into `dist/` before the Docker build uses it.
- [ ] **CouchDB image version track correct:** `budibase/database` uses `hosting/couchdb/VERSION`, not the main app version — the release workflow for hardened database images must read from that file.
- [ ] **`repository_dispatch` payload correct:** The hardened build dispatch payload carries the exact version tag being released, not a previous cached value.
- [ ] **Image tags pushed to correct repo:** Hardened images go to the same Docker Hub repositories as standard images (`budibase/apps`, `budibase/worker`, `budibase/database`), just with the `-hardened` suffix — verify registry credentials cover those repos.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Yarn resolution not applied in Docker image | LOW | Add override to individual package.json, rebuild monorepo (`yarn build`), re-run Docker build, re-scan |
| Tar v7 breaking application code | MEDIUM | Revert the blanket resolution; add a scoped package-level override instead of root-level; add test coverage for tar-using code paths before re-attempting |
| fast-xml-parser v5 import failure | LOW | Check codebase for `XMLBuilder` usage (grep), update import paths if found, or stay on v4.5.x if the CVE in scope is not 5.x-only |
| apk upgrade breaks native addon ABI | MEDIUM | Pin the specific packages to upgrade (`apk upgrade zlib curl` not `apk upgrade`), rebuild with pinned base image digest, run native addon smoke test |
| Hardened image drifts from standard | HIGH | Re-derive Dockerfile.hardened from current standard Dockerfile; diff the two to find what diverged; do not try to patch the drift incrementally — start from the current standard Dockerfile as the base |
| Scanner false positive from backport | LOW | Add `.trivyignore` entry with a comment referencing the Alpine security tracker confirmation; document for the Gravity team that the package is patched via vendor backport |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Yarn resolutions not reaching Docker build | Phase 1: npm patching | Run `docker run --rm <image> node -e "console.log(require('<pkg>/package.json').version)"` for each patched dep |
| tar 6→7 API breaking changes | Phase 1: npm patching | Run `yarn test` in packages/server after adding resolution; specifically test archiver and extraction paths |
| fast-xml-parser 4→5 API delta | Phase 1: npm patching | Grep for `XMLBuilder` imports; run local Trivy with pinned version to confirm CVE is closed |
| axios transitive conflict with integrations | Phase 1: npm patching | Integration test suite for Airtable, Google Sheets, SMTP connectors; verify with live HTTP |
| apk upgrade breaking native addons | Phase 2: OS patching | Native addon smoke test in Docker build step; confirm bcrypt, isolated-vm, oracledb load |
| Hardened image drift from standard | Phase 3: CI/CD pipeline | Scheduled weekly scan in CI; BUDIBASE_VERSION label check in pipeline |
| Scanner false positives | Phase 1 and Phase 2 | Test against pinned Trivy 0.68.1 AND Grype 0.109.0 before declaring a finding closed |

---

## Sources

- Alpine security tracker, CVE-2026-22184: https://security.alpinelinux.org/vuln/CVE-2026-22184
- node-tar v7 breaking changes (Japanese source, verified): https://roboin.io/article/2024/04/17/node-tar-v7-includes-breaking-changes/
- node-tar changelog: https://github.com/isaacs/node-tar/blob/main/CHANGELOG.md
- axios CVE-2025-27152 SSRF: https://snyk.io/vuln/SNYK-JS-AXIOS-9292519
- fast-xml-parser CVE-2026-25896: https://snyk.io/vuln/SNYK-JS-FASTXMLPARSER-15307668
- fast-xml-parser v5 ESM support (no API breaks): https://github.com/NaturalIntelligence/fast-xml-parser/discussions/586
- Koa v3 migration guide: https://github.com/koajs/koa/blob/master/docs/migration-v2-to-v3.md
- Trivy false positive / OS vendor backport handling: https://trivy.dev/docs/latest/scanner/vulnerability/
- Container image scanner fallacies (false positives): https://www.augmentedmind.de/2025/08/27/image-security-1-fallacies-scanner/
- Yarn resolutions and production mode interaction: https://github.com/yarnpkg/yarn/issues/5850
- Docker hardened image drift and rebuild pipeline: https://docs.docker.com/dhi/explore/build-process/

---
*Pitfalls research for: Docker image hardening pipeline (budibase/apps, budibase/worker, budibase/database)*
*Researched: 2026-03-21*

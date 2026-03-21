# Feature Research

**Domain:** Docker image hardening pipeline (brownfield monorepo addition)
**Researched:** 2026-03-21
**Confidence:** HIGH — based on direct repository inspection, PROJECT.md constraints, and verified 2025/2026 industry sources

## Feature Landscape

### Table Stakes (Users Expect These)

Features that must exist or the hardened images fail their purpose. Missing any of these means Trivy/Grype scans will still fail — the pipeline has no value.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| npm transitive dep overrides (resolutions) | 33 of 34 scan findings are npm packages; without overrides the images still fail HIGH/CRITICAL gates | MEDIUM | Yarn `resolutions` block in `package.hardened.json` for each of server and worker; pins tar, minimatch, axios, fast-xml-parser, koa, glob to patched versions |
| OS package upgrades (zlib, curl) | Remaining HIGH OS CVE (zlib CVE-2026-22184, curl CVE-2026-3805) blocks scan pass | LOW | `apk add --upgrade zlib curl` in alpine Dockerfiles; `apt-get upgrade` for slim/couchdb; existing couchdb Dockerfile already does this at line 123 |
| Separate Dockerfile.hardened per image | Project constraint — must not modify existing Dockerfiles; also needed so standard and hardened builds are independent | LOW | Three files: `packages/server/Dockerfile.hardened`, `packages/worker/Dockerfile.hardened`, `hosting/couchdb/Dockerfile.hardened` |
| `{version}-hardened` tag convention | GitLab/Gravity scanner expects specific tag names to know which image to scan | LOW | App images use lerna version; database image uses `hosting/couchdb/VERSION` (independent track) |
| repository_dispatch trigger from this repo | Existing release pattern uses `peter-evans/repository-dispatch@v2` — hardened pipeline must follow same cross-repo pattern | LOW | New `release-hardened.yml` in `.github/workflows/`; uses distinct event-type `hardened-release` to avoid entangling with `release-prod` event |
| Remote workflow template in budibase-deploys | Actual build-and-push runs in budibase-deploys; that repo needs a workflow to receive the dispatch and build all three images | MEDIUM | `build-hardened-images.yml` stored in `.budibase-deploys-workflows/` for manual transfer; three parallel jobs (apps, worker, database) |
| Zero HIGH/CRITICAL findings on scan exit | The entire pipeline exists to pass Trivy 0.68.1 and Grype 0.109.0 gates at HIGH/CRITICAL threshold; build gate must enforce exit-code 1 on violations | LOW | Standard `--exit-code 1 --severity HIGH,CRITICAL` Trivy/Grype flags; well-documented and verified in trivy-action docs |
| DB_VERSION in dispatch payload | Database has independent version track; dispatching only the app TAG would produce a mistagged image | LOW | Payload carries both `TAG` (app version) and `DB_VERSION` (read from `hosting/couchdb/VERSION`) |

### Differentiators (Competitive Advantage)

Features that go beyond making the scans pass. Valuable for compliance posture but not required for the immediate scan-pass goal.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| SBOM generation (Syft/Trivy) | Produces a CycloneDX or SPDX artifact listing every package in the hardened image; required by DoD/IL2 compliance frameworks (NIST SP 800-218, EO 14028) | MEDIUM | Syft CLI or `trivy image --format cyclonedx`; attach to GitHub release artifact; SBOM attachments deprecated in cosign — use SBOM attestations instead |
| Cosign keyless image signing | Cryptographic proof the hardened image was produced by this specific GitHub Actions workflow; prevents supply chain substitution attacks | MEDIUM | `sigstore/cosign-installer` + `cosign sign --yes` using GitHub OIDC token; signs both hardened tag and records to Rekor transparency log |
| Post-build scan verification step | CI step that scans the just-built hardened image before push, making the pipeline self-auditing; fails fast rather than relying on downstream GitLab gate | LOW | Add `aquasecurity/trivy-action` or `anchore/scan-action` as a step after build, before push, with `exit-code: 1` and `severity: CRITICAL,HIGH` |
| Non-root USER enforcement | Defense-in-depth; reduces blast radius if a process inside the container is compromised | LOW | Add `USER node` (UID 1000 on node alpine) before CMD in Dockerfile.hardened; verify current Dockerfiles don't already do this |
| Chainguard/wolfi base image migration | Chainguard Node.js images have zero known CVEs, daily rebuild cadence, and built-in SBOM/provenance; would eliminate the need for manual OS package patching entirely | HIGH | Not appropriate for this milestone — requires full Dockerfile migration, compatibility testing (musl vs glibc), and adds third-party dependency on Chainguard for rebuild SLAs; future consideration |
| Automated re-scan scheduling | New CVEs are published continuously; hardened images are stale the day after they are built; scheduled scan catches regressions | MEDIUM | GitHub Actions `schedule:` trigger on cron; rescans published hardened images via registry pull; out-of-scope for this milestone but natural Phase 2 addition |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| `apk upgrade` / `apt-get upgrade` upgrading all packages blindly | Seems like it patches everything at once | Breaks reproducibility; can upgrade CouchDB itself (breaking the application); produces non-deterministic builds; already flagged as problematic by Docker best practices guides | Pin only the specific vulnerable packages: `apk add --upgrade zlib curl` (named packages only); use `apt-mark hold couchdb` before broad upgrade on couchdb image (pattern already in existing Dockerfile line 123) |
| Editing existing Dockerfiles to add patches | Keeps one file instead of two | Violates explicit project constraint; entangles standard and hardened builds; a structural change to the standard file breaks the hardened build silently | Maintain separate Dockerfile.hardened as a thin delta |
| Using the same `release-prod` dispatch event for hardened builds | Reuses existing infrastructure | Entangles pipelines; hardened build failure could block or confuse standard prod release handling in budibase-deploys | Distinct `event-type: hardened-release` routes to a separate workflow with independent failure handling |
| Storing resolutions only in root package.json | Root already has a resolutions block (lines 114-135); seems natural to extend it | Docker build uses a fresh `yarn install` inside the image from a stripped package.json — root monorepo resolutions are not present in this context and have no effect | Encode overrides in `package.hardened.json` which is explicitly COPY'd into the Docker build context before `yarn install` |
| SBOM attachments via `cosign attach sbom` | Older tutorials use this pattern | Deprecated in cosign as of 2024-02-22; support will be removed in an upcoming release | Use SBOM attestations: `cosign attest --predicate sbom.json --type cyclonedx` |
| Switching to distroless base images in this milestone | Maximally reduces attack surface | Requires shell-less runtime debugging, potential Alpine musl-to-glibc migration issues, full build system changes, and compatibility testing of all node native modules — scope far exceeds remediation goal | Patch OS packages in the existing Alpine/slim base; plan distroless migration as a separate future milestone |
| Pinning npm versions in Dockerfile via `npm install -g <pkg>@<version>` for all deps | Looks like direct control | Global npm packages are not the application's dependencies; does not fix the production dependency tree inside the app's node_modules | Use Yarn resolutions in package.hardened.json to force specific versions into the production install |

## Feature Dependencies

```
[npm transitive dep overrides (resolutions)]
    └──requires──> [package.hardened.json per service]
                       └──requires──> [Dockerfile.hardened COPY step]

[OS package upgrades]
    └──requires──> [Dockerfile.hardened]

[Dockerfile.hardened (all three)]
    └──requires──> [repository_dispatch trigger (release-hardened.yml)]
                       └──requires──> [remote workflow template (build-hardened-images.yml)]

[DB_VERSION in dispatch payload]
    └──requires──> [release-hardened.yml reads hosting/couchdb/VERSION]

[Post-build scan verification]
    └──requires──> [Dockerfile.hardened (built image must exist to scan)]

[SBOM generation]
    └──enhances──> [Cosign image signing] (sign the SBOM attestation with cosign)

[Cosign image signing]
    └──requires──> [Dockerfile.hardened push step] (must push image to registry before signing)

[Non-root USER enforcement]
    └──requires──> [Dockerfile.hardened] (add USER directive to hardened file)

[Chainguard base image migration]
    └──conflicts──> [OS package upgrades] (Chainguard images need no OS patching — strategy is mutually exclusive)
```

### Dependency Notes

- **npm overrides require package.hardened.json:** Yarn resolutions live in package.json; there is no other mechanism to inject them into a standalone Docker yarn install context. The root monorepo resolutions do not flow into Docker builds.
- **OS upgrades require Dockerfile.hardened:** The upgrade commands must be in the Dockerfile build steps; they cannot be applied after the fact without rebuilding the image.
- **Remote workflow requires manual bootstrap:** The `.budibase-deploys-workflows/build-hardened-images.yml` template must be manually copied into the budibase-deploys repo on first setup. This is a one-time operation, not an automated dependency.
- **DB_VERSION independence:** The database image version track is decoupled from the app version by design (`release-database.yml` reads `hosting/couchdb/VERSION` explicitly). The dispatch payload must carry both values.
- **SBOM attestation with cosign:** Cosign signing (keyless, OIDC) is the mechanism used to attach SBOM attestations. They are sequentially dependent — generate SBOM first, then attest with cosign, then the attestation is queryable from the signed image digest.
- **Post-build scan vs downstream scan:** The post-build CI scan is a fast-fail gate; it does not replace the GitLab/Gravity scan which is the authoritative compliance gate. Both serve different purposes (developer feedback vs compliance record).

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to make the hardened images pass Trivy/Grype at HIGH/CRITICAL threshold and publish to Docker Hub.

- [ ] `packages/server/Dockerfile.hardened` — with `apk add --upgrade zlib curl` + `COPY package.hardened.json` pattern
- [ ] `packages/server/package.hardened.json` — resolutions pinning fast-xml-parser, axios, tar, minimatch, koa, glob to patched versions
- [ ] `packages/worker/Dockerfile.hardened` — same OS patch + resolutions pattern as server
- [ ] `packages/worker/package.hardened.json` — resolutions block (worker shares the same CVE exposure as server for these transitive deps)
- [ ] `hosting/couchdb/Dockerfile.hardened` — apt-get upgrade with apt-mark hold for couchdb + npm global package pins; note existing Dockerfile already does `apt-mark hold couchdb && apt-get upgrade -y` at line 123, so hardened variant may need minimal delta
- [ ] `.github/workflows/release-hardened.yml` — listens for release push event, sends `repository_dispatch` with `event-type: hardened-release` carrying `TAG` and `DB_VERSION`
- [ ] `.budibase-deploys-workflows/build-hardened-images.yml` — three parallel build-and-push jobs, one per image, pushing `{TAG}-hardened` and `{DB_VERSION}-hardened` tags

### Add After Validation (v1.x)

Features to add once core scan-pass is confirmed working.

- [ ] Post-build scan verification step in CI — adds fast-fail feedback before images reach GitLab; trigger: first time a scan regression is caught too late in the downstream scanner
- [ ] Non-root USER enforcement — adds defense-in-depth; trigger: compliance review flags root user as a finding
- [ ] SBOM generation as CI artifact — trigger: DoD/IL2 customer asks for SBOM as part of delivery

### Future Consideration (v2+)

Features to defer until the pipeline is proven and stable.

- [ ] Cosign keyless image signing — valuable for supply chain compliance but requires Rekor transparency log infrastructure and key management decisions; defer until SBOM requirement is formalized
- [ ] Automated re-scan scheduling — scheduled daily scans of published hardened images to catch CVE regressions; defer until the pipeline has been running for one full release cycle
- [ ] Chainguard/wolfi base image migration — eliminates need for manual patching entirely but requires compatibility testing and structural Dockerfile migration; planned as a separate future milestone

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| npm transitive dep overrides | HIGH — unblocks 33/34 findings | MEDIUM — package.hardened.json + Dockerfile copy step | P1 |
| OS package upgrades (zlib, curl) | HIGH — closes remaining HIGH CVE | LOW — 1-2 RUN lines per Dockerfile | P1 |
| Separate Dockerfile.hardened (server, worker, couchdb) | HIGH — required structure | LOW — copy-and-patch of existing Dockerfiles | P1 |
| `{version}-hardened` tag convention | HIGH — scanner depends on tag names | LOW — build argument in workflow | P1 |
| release-hardened.yml dispatch trigger | HIGH — pipeline entry point | LOW — mirrors existing tag-release.yml pattern | P1 |
| build-hardened-images.yml remote template | HIGH — where actual builds run | MEDIUM — three parallel jobs with correct version routing | P1 |
| Post-build scan verification | MEDIUM — fast-fail convenience | LOW — add trivy-action step after build | P2 |
| Non-root USER enforcement | MEDIUM — compliance defense-in-depth | LOW — add USER directive to Dockerfile.hardened | P2 |
| SBOM generation | MEDIUM — compliance artifact | MEDIUM — syft/trivy + artifact upload | P2 |
| Cosign image signing | LOW (for this milestone) — supply chain hardening | MEDIUM — OIDC keyless setup | P3 |
| Automated re-scan scheduling | LOW (for this milestone) — regression detection | MEDIUM — cron workflow + registry pull | P3 |
| Chainguard base image migration | HIGH long-term | HIGH — full migration + compat testing | P3 |

**Priority key:**
- P1: Must have for launch — required to pass scan gates
- P2: Should have — add before or shortly after first hardened release
- P3: Nice to have — future milestone consideration

## Sources

- [How to Use Container Image Vulnerability Scanning Gates (OneUptime, 2026-02-09)](https://oneuptime.com/blog/post/2026-02-09-container-vulnerability-scanning-ci/view)
- [Docker Security Best Practices in 2026: Hardening Containers from Build to Runtime (ZeonEdge)](https://zeonedge.com/blog/docker-security-best-practices-2026-hardening-containers-build-runtime)
- [Trivy CI/CD Documentation (trivy.dev, current)](https://trivy.dev/docs/latest/ecosystem/cicd/)
- [aquasecurity/trivy-action GitHub repository](https://github.com/aquasecurity/trivy-action)
- [Docker Image Security Best Practices: SBOM, Non-Root, Provenance (bell-sw.com)](https://bell-sw.com/blog/docker-image-security-best-practices-for-production/)
- [SBOM Generation Guide for Docker and Containers (Sbomify)](https://sbomify.com/guides/docker/)
- [How to Sign an SBOM with Cosign — Chainguard Academy](https://edu.chainguard.dev/open-source/sigstore/cosign/how-to-sign-an-sbom-with-cosign/)
- [cosign SBOM attachment deprecation notice (sigstore/cosign)](https://github.com/sigstore/cosign/blob/main/doc/cosign_attach_sbom.md)
- [Software Supply Chain Security: Sigstore, SLSA, and Build Provenance (AquilaX)](https://aquilax.ai/blog/supply-chain-artifact-signing-slsa)
- [Zero-friction keyless signing with Github Actions (Chainguard)](https://www.chainguard.dev/unchained/zero-friction-keyless-signing-with-github-actions)
- [Choosing the best Node.js Docker image (Chainguard)](https://www.chainguard.dev/supply-chain-security-101/choosing-the-best-node-js-docker-image)
- [Avoid apk upgrade — Docker Security Rule (Code Pathfinder)](https://codepathfinder.dev/registry/docker/best-practice/DOCKER-BP-028)
- [The worst so-called "best practice" for Docker (pythonspeed.com)](https://pythonspeed.com/articles/security-updates-in-docker/)
- [A Guide to NPM Overrides: Take Control of Your Dependencies (HeroDevs)](https://www.herodevs.com/blog-posts/a-guide-to-npm-overrides-take-control-of-your-dependencies)
- [Fix a transitive npm dependency vulnerability (DEV Community)](https://dev.to/malykhinvi/fix-a-transitive-npm-dependency-vulnerability-4775)
- [Docker Security Cheat Sheet (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- Direct inspection: `packages/server/Dockerfile`, `packages/worker/Dockerfile`, `hosting/couchdb/Dockerfile`
- Direct inspection: `package.json` (root) lines 114-135 — existing yarn resolutions block
- Direct inspection: `.planning/PROJECT.md` — constraints, CVE inventory, tag conventions

---
*Feature research for: Docker image hardening pipeline (brownfield Budibase monorepo)*
*Researched: 2026-03-21*

# Requirements: Budibase Hardened Image Pipeline

**Defined:** 2026-03-21
**Core Value:** Every hardened image passes Trivy and Grype HIGH/CRITICAL scans with zero findings

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### NPM Vulnerability Remediation

- [ ] **NPM-01**: fast-xml-parser upgraded to >=4.5.4 in all images (fixes CRITICAL XSS CVE-2026-25896 + HIGH DoS CVE-2026-26278)
- [ ] **NPM-02**: axios upgraded to >=1.13.5 in all images (fixes HIGH SSRF CVE-2025-27152, HIGH DoS CVE-2025-58754, HIGH proto pollution CVE-2026-25639)
- [ ] **NPM-03**: tar upgraded to >=7.5.11 in all images (fixes 6 HIGH path traversal CVEs)
- [ ] **NPM-04**: minimatch upgraded to >=9.0.7 in all images (fixes 3 HIGH ReDoS CVEs)
- [ ] **NPM-05**: koa upgraded to >=2.16.4 in all images (fixes HIGH host header injection CVE-2026-27959)
- [ ] **NPM-06**: glob upgraded to >=10.5.0 in all images (fixes HIGH command injection CVE-2025-64756)
- [ ] **NPM-07**: package.hardened.json files created for server and worker with yarn resolutions targeting all HIGH/CRITICAL npm CVEs
- [ ] **NPM-08**: Hardened Dockerfiles COPY package.hardened.json and merge resolutions before yarn install

### OS Vulnerability Remediation

- [ ] **OS-01**: zlib upgraded to >=1.3.2-r0 in Alpine images (fixes CRITICAL buffer overflow CVE-2026-22184)
- [ ] **OS-02**: curl upgraded in Alpine images (fixes HIGH CVE-2026-3805)
- [ ] **OS-03**: OS upgrades are scoped to named packages only (no blanket apk upgrade)

### Hardened Dockerfiles

- [ ] **DOCK-01**: Dockerfile.hardened created for packages/server (budibase/apps)
- [ ] **DOCK-02**: Dockerfile.hardened created for packages/worker (budibase/worker)
- [ ] **DOCK-03**: Dockerfile.hardened created for hosting/couchdb (budibase/database)
- [ ] **DOCK-04**: All hardened Dockerfiles produce images tagged {version}-hardened
- [ ] **DOCK-05**: Non-root USER directive added to all hardened Dockerfiles
- [ ] **DOCK-06**: removeWorkspaceDependencies.sh script preserved in hardened build flow

### CI/CD Pipeline

- [ ] **CI-01**: release-hardened.yml GitHub Actions workflow triggers on every app release
- [ ] **CI-02**: release-hardened-database.yml GitHub Actions workflow triggers on every database release
- [ ] **CI-03**: Both workflows dispatch to budibase-deploys via repository_dispatch with TAG payload
- [ ] **CI-04**: Database dispatch carries DB_VERSION from hosting/couchdb/VERSION independently
- [ ] **CI-05**: Post-build Trivy scan step verifies zero HIGH/CRITICAL before push
- [ ] **CI-06**: Remote workflow template for budibase-deploys placed in .budibase-deploys-workflows/ directory
- [ ] **CI-07**: Remote workflow builds and pushes all three hardened images to Docker Hub (budibase/apps, budibase/worker, budibase/database)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Supply Chain Security

- **SBOM-01**: SBOM generation in CycloneDX format for all hardened images
- **SBOM-02**: Cosign keyless image signing using GitHub OIDC
- **SBOM-03**: SBOM attestation via cosign attest (not deprecated cosign attach sbom)

### Ongoing Maintenance

- **MAINT-01**: Automated re-scan scheduling on cron for published hardened images
- **MAINT-02**: Chainguard/wolfi base image migration to eliminate manual OS patching

## Out of Scope

| Feature | Reason |
|---------|--------|
| Modifying existing Dockerfiles | Explicit constraint — hardened files are separate overlays |
| Medium/Low severity fixes | Not scan-blocking; addressed opportunistically |
| Blanket apk upgrade / apt-get upgrade | Breaks reproducibility, can upgrade CouchDB itself |
| Distroless base images | Requires full build system migration, out of scope for remediation |
| GitLab CI scanner changes | We fix the vulns, not the scanner infrastructure |
| Runtime security policies (seccomp, AppArmor) | Image-level hardening only |
| Storing resolutions only in root package.json | Root resolutions don't reach Docker builds — must use package.hardened.json |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| NPM-01 | Phase 1 | Pending |
| NPM-02 | Phase 1 | Pending |
| NPM-03 | Phase 1 | Pending |
| NPM-04 | Phase 1 | Pending |
| NPM-05 | Phase 1 | Pending |
| NPM-06 | Phase 1 | Pending |
| NPM-07 | Phase 1 | Pending |
| NPM-08 | Phase 1 | Pending |
| OS-01 | Phase 2 | Pending |
| OS-02 | Phase 2 | Pending |
| OS-03 | Phase 2 | Pending |
| DOCK-01 | Phase 2 | Pending |
| DOCK-02 | Phase 2 | Pending |
| DOCK-03 | Phase 2 | Pending |
| DOCK-04 | Phase 2 | Pending |
| DOCK-05 | Phase 2 | Pending |
| DOCK-06 | Phase 2 | Pending |
| CI-01 | Phase 3 | Pending |
| CI-02 | Phase 3 | Pending |
| CI-03 | Phase 3 | Pending |
| CI-04 | Phase 3 | Pending |
| CI-05 | Phase 3 | Pending |
| CI-06 | Phase 3 | Pending |
| CI-07 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*

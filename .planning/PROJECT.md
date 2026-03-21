# Budibase Hardened Image Pipeline

## What This Is

A security hardening pipeline that publishes vulnerability-patched Docker images alongside the standard Budibase releases. For each release of budibase/apps, budibase/worker, and budibase/database, a corresponding `-hardened` tagged image is built with all HIGH/CRITICAL vulnerabilities remediated. Targets the existing GitLab/Gravity scanning pipeline requirements.

## Core Value

Every hardened image passes Trivy and Grype HIGH/CRITICAL scans with zero findings.

## Requirements

### Validated

- ✓ Fix all HIGH/CRITICAL npm vulnerabilities via package.hardened.json resolutions — Phase 1

### Active

- [x] Fix all HIGH/CRITICAL npm vulnerabilities identified in scans (fast-xml-parser, axios, tar, minimatch, koa, glob) — completed Phase 1
- [ ] Fix all HIGH/CRITICAL OS-level vulnerabilities (zlib CVE-2026-22184, curl CVE-2026-3805)
- [ ] Create Dockerfile.hardened for packages/server (budibase/apps)
- [ ] Create Dockerfile.hardened for packages/worker (budibase/worker)
- [ ] Create Dockerfile.hardened for hosting/couchdb (budibase/database)
- [ ] Hardened Dockerfiles produce images tagged `{version}-hardened` (e.g. budibase/apps:3.0.0-hardened)
- [ ] GitHub Actions workflow in this repo triggers budibase-deploys via repository_dispatch on every release
- [ ] Remote workflow templates for budibase-deploys that build and push hardened images
- [ ] budibase/database uses its own version track (hosting/couchdb/VERSION) for hardened tags
- [ ] budibase/apps and budibase/worker use the main app version for hardened tags
- [ ] Images published to the same Docker Hub registry/repository as standard images

### Out of Scope

- Medium/Low severity vulnerabilities — addressed opportunistically but not blocking
- Modifying existing Dockerfiles — hardened files are separate (Dockerfile.hardened)
- Modifying existing release workflows — hardened pipeline runs alongside, not replacing
- Runtime security policies (seccomp, AppArmor) — image-level hardening only
- Scanning infrastructure changes in GitLab — we fix the vulns, not the scanner config

## Context

**Current state:**
- Three Docker images: budibase/apps (server), budibase/worker, budibase/database (couchdb)
- All built on node:22-alpine (server/worker) or node:22-slim (database/couchdb)
- Releases triggered via tag-release.yml → repository_dispatch to budibase-deploys
- Database has separate version track via hosting/couchdb/VERSION and release-database.yml
- GitLab CI (Gravity) runs Trivy 0.68.1 and Grype 0.109.0 scans against published images
- Current scan: 34 HIGH/CRITICAL findings (33 npm + 1 OS), 25 MEDIUM, 12 LOW

**Key vulnerability groups from scans:**
- **CRITICAL:** fast-xml-parser 4.4.1 (XSS via DOCTYPE), zlib 1.3.1-r2 (buffer overflow), @budibase/server (VM2 escape — legacy advisory)
- **HIGH npm:** axios 1.7.7 (3 CVEs: SSRF, DoS, proto pollution), tar 6.2.1/7.4.3 (6 CVEs: path traversal), minimatch 9.0.1/9.0.5 (3 CVEs: ReDoS), koa 2.15.4 (host header injection), glob 10.4.5 (command injection), @budibase/server (PostgreSQL dump command injection)
- **HIGH OS:** curl 8.17.0-r1 (CVE-2026-3805)

**Scan environment:** GitLab runner on gitlab-il2.gravity.spaceforce.mil — images scanned as OCI tar artifacts

## Constraints

- **Separate files**: Hardened Dockerfiles must not modify existing Dockerfiles — kept as Dockerfile.hardened alongside originals
- **Same registry**: Hardened images published to same Docker Hub repos (budibase/apps, budibase/worker, budibase/database)
- **Tag convention**: `{version}-hardened` suffix (e.g. 3.0.0-hardened)
- **CI pattern**: GitHub Actions in this repo triggers budibase-deploys via repository_dispatch (same pattern as existing releases)
- **Remote workflows**: Placed in a directory in this repo for manual transfer to budibase-deploys

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Separate Dockerfile.hardened files | Keep standard images untouched, hardened as overlay | -- Pending |
| HIGH+CRITICAL scope only | Focus on scan-blocking findings; medium/low opportunistic | -- Pending |
| GitHub Actions triggering budibase-deploys | Matches existing release pattern | -- Pending |
| npm overrides for transitive deps | Many vulns are in transitive deps (tar, minimatch) — overrides force version bumps without waiting on upstream | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after Phase 1 completion*

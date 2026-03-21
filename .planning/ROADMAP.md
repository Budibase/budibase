# Roadmap: Budibase Hardened Image Pipeline

## Overview

Three sequential phases convert 34 HIGH/CRITICAL scan findings into a fully automated hardened-image pipeline. Phase 1 patches all npm transitive CVEs via `package.hardened.json` resolution overrides (33 of 34 findings). Phase 2 forks the three Dockerfiles into `Dockerfile.hardened` variants that wire together npm patches and OS-level CVE fixes (the remaining finding). Phase 3 wraps the verified images in a GitHub Actions trigger layer and remote workflow template that publishes `{version}-hardened` tagged images to Docker Hub on every release.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: npm Vulnerability Patching** - Create package.hardened.json files with yarn resolutions that force all HIGH/CRITICAL npm CVEs closed inside the Docker build context
- [ ] **Phase 2: Hardened Dockerfiles and OS Patching** - Create Dockerfile.hardened for server, worker, and couchdb — integrating npm patches and named OS package upgrades — producing images that pass Trivy + Grype locally
- [ ] **Phase 3: CI/CD Pipeline and Cross-Repo Dispatch** - Create release-hardened.yml trigger workflow and budibase-deploys remote template that build, scan, and publish hardened images on every release

## Phase Details

### Phase 1: npm Vulnerability Patching
**Goal**: All HIGH/CRITICAL npm CVEs are eliminated from server and worker images via yarn resolutions in package.hardened.json files that survive the Docker workspace stripping process
**Depends on**: Nothing (first phase)
**Requirements**: NPM-01, NPM-02, NPM-03, NPM-04, NPM-05, NPM-06, NPM-07, NPM-08
**Success Criteria** (what must be TRUE):
  1. Running `docker run --rm <server-image> node -e "console.log(require('fast-xml-parser/package.json').version)"` returns >=4.5.4 (or 5.x if required for full CVE closure)
  2. Running the same version check inside the built image for axios, tar, minimatch, koa, and glob returns versions at or above their respective fix thresholds
  3. `packages/server` and `packages/worker` each have a `package.hardened.json` with a `resolutions` block covering all six npm CVE groups
  4. Running Trivy 0.68.1 against a locally built server or worker image built from `package.hardened.json` reports zero HIGH/CRITICAL npm findings
**Plans:** 2 plans

Plans:
- [ ] 01-01-PLAN.md — Create generation script and package.hardened.json files for server and worker
- [ ] 01-02-PLAN.md — Validate yarn install with hardened package files produces correct versions

### Phase 2: Hardened Dockerfiles and OS Patching
**Goal**: Three Dockerfile.hardened variants exist for server, worker, and couchdb — each building an image that eliminates all remaining OS-level CVEs and integrates the Phase 1 npm patches — verified clean against both Trivy 0.68.1 and Grype 0.109.0
**Depends on**: Phase 1
**Requirements**: OS-01, OS-02, OS-03, DOCK-01, DOCK-02, DOCK-03, DOCK-04, DOCK-05, DOCK-06
**Success Criteria** (what must be TRUE):
  1. `docker build -f Dockerfile.hardened` succeeds for packages/server, packages/worker, and hosting/couchdb without error
  2. Built images run `node -e "require('bcrypt'); require('isolated-vm')"` without error (native addon ABI intact after OS package upgrade)
  3. Trivy 0.68.1 scan of all three locally built images reports zero HIGH/CRITICAL findings
  4. Grype 0.109.0 scan of all three locally built images reports zero HIGH/CRITICAL findings
  5. Images built from Dockerfile.hardened carry a non-root USER directive
**Plans**: TBD

### Phase 3: CI/CD Pipeline and Cross-Repo Dispatch
**Goal**: Every Budibase app and database release automatically triggers a hardened image build that scans clean and publishes to Docker Hub with `{version}-hardened` tags, with all workflow files in place for budibase-deploys bootstrap
**Depends on**: Phase 2
**Requirements**: CI-01, CI-02, CI-03, CI-04, CI-05, CI-06, CI-07
**Success Criteria** (what must be TRUE):
  1. `.github/workflows/release-hardened.yml` exists and triggers on the same release events as `tag-release.yml`, dispatching to budibase-deploys with TAG and DB_VERSION payloads
  2. `.budibase-deploys-workflows/build-hardened-images.yml` exists with three parallel build-push jobs producing `budibase/apps:{version}-hardened`, `budibase/worker:{version}-hardened`, and `budibase/database:{db-version}-hardened` on Docker Hub
  3. The remote workflow includes a post-push Trivy scan step that fails the workflow on any HIGH/CRITICAL finding
  4. DB_VERSION in the dispatch payload is read from `hosting/couchdb/VERSION` independently of the app version
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. npm Vulnerability Patching | 0/2 | Planning complete | - |
| 2. Hardened Dockerfiles and OS Patching | 0/TBD | Not started | - |
| 3. CI/CD Pipeline and Cross-Repo Dispatch | 0/TBD | Not started | - |

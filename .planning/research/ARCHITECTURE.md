# Architecture Research

**Domain:** Docker image hardening pipeline (brownfield monorepo addition)
**Researched:** 2026-03-21
**Confidence:** HIGH — based on direct inspection of existing Dockerfiles, workflows, and package.json files in the repository

## Standard Architecture

### System Overview

```
budibase/budibase (this repo)
┌─────────────────────────────────────────────────────────────────────┐
│  Trigger Layer                                                       │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │
│  │ tag-release.yml              │  │ release-database.yml         │ │
│  │ (workflow_dispatch: patch/   │  │ (workflow_dispatch: minor/   │ │
│  │  minor → bumps lerna version)│  │  major → bumps couchdb ver)  │ │
│  └──────────────┬───────────────┘  └──────────────┬───────────────┘ │
│                 │ repository_dispatch              │ build-and-push  │
│                 │ event-type: release-prod         │ (inline, no     │
│                 │ payload: { TAG: "3.x.x" }        │  dispatch)      │
│                 │                                  │                 │
│  ┌──────────────┴───────────────────────────────┐  │                 │
│  │ NEW: release-hardened.yml                    │  │                 │
│  │ (triggered by: release event OR workflow_    │  │                 │
│  │  dispatch → sends repository_dispatch to     │  │                 │
│  │  budibase-deploys with hardened tag payload) │  │                 │
│  └──────────────┬───────────────────────────────┘  │                 │
└─────────────────┼────────────────────────────────────┼───────────────┘
                  │ repository_dispatch                │ docker push
                  ▼                                    ▼
budibase/budibase-deploys (remote repo)         Docker Hub
┌────────────────────────────┐                  ┌─────────────────────┐
│ on: repository_dispatch    │                  │ budibase/apps       │
│ event-type: hardened-release│                 │   :3.x.x-hardened   │
│                            │                  │ budibase/worker     │
│ 1. checkout budibase repo  │  ─────push──────▶│   :3.x.x-hardened   │
│    at TAG                  │                  │ budibase/database   │
│ 2. build apps (hardened)   │                  │   :2.x.x-hardened   │
│ 3. build worker (hardened) │                  └─────────────────────┘
│ 4. build database (hardened│
│    uses DB version track)  │
└────────────────────────────┘

budibase/budibase — file layout (new files only)
┌─────────────────────────────────────────────────────────────────────┐
│  packages/server/                                                    │
│    Dockerfile                  ← unchanged                          │
│    Dockerfile.hardened         ← NEW: inherits FROM pattern,        │
│                                       applies npm overrides +        │
│                                       apk upgrade for zlib/curl      │
│    package.hardened.json       ← NEW: overrides section for         │
│                                       pinned vulnerable transitive   │
│                                       deps (tar, minimatch, etc.)    │
│                                                                     │
│  packages/worker/                                                    │
│    Dockerfile                  ← unchanged                          │
│    Dockerfile.hardened         ← NEW                                │
│    package.hardened.json       ← NEW                                │
│                                                                     │
│  hosting/couchdb/                                                    │
│    Dockerfile                  ← unchanged                          │
│    Dockerfile.hardened         ← NEW: apt-get upgrade targeting     │
│                                       specific CVEs (zlib, curl,     │
│                                       libssl) + npm global upgrade   │
│                                                                     │
│  .github/workflows/                                                  │
│    release-hardened.yml        ← NEW: trigger workflow              │
│                                                                     │
│  .budibase-deploys-workflows/  ← NEW: template directory            │
│    build-hardened-images.yml   ← workflow to copy into deploys repo │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Notes |
|-----------|----------------|-------|
| `packages/server/Dockerfile.hardened` | Builds budibase/apps with patched npm deps and upgraded OS packages | Parallel to existing Dockerfile; does not replace it |
| `packages/worker/Dockerfile.hardened` | Builds budibase/worker with same patch set | Shares same vulnerability profile as server (both node:22-alpine) |
| `hosting/couchdb/Dockerfile.hardened` | Builds budibase/database with Debian security upgrades | node:22-slim base; apt-based patching differs from apk-based server/worker |
| `packages/server/package.hardened.json` | Pins transitive dep versions via yarn `resolutions`/`overrides` to close npm CVEs | Copied into Docker build context and used in place of the standard package.json during hardened build |
| `packages/worker/package.hardened.json` | Same as above for worker | Worker has smaller dep tree but shares tar, minimatch exposure |
| `.github/workflows/release-hardened.yml` | Listens for release events in this repo; fires `repository_dispatch` to budibase-deploys | Mirrors the pattern in tag-release.yml — uses `peter-evans/repository-dispatch@v2`, `GH_ACCESS_TOKEN` secret |
| `.budibase-deploys-workflows/build-hardened-images.yml` | Template for the remote build workflow; checked into this repo for traceability | Must be manually transferred to budibase-deploys on first setup |

## Recommended Project Structure

```
packages/server/
├── Dockerfile                   # existing — unchanged
├── Dockerfile.hardened          # NEW: hardened variant
└── package.hardened.json        # NEW: resolutions/overrides for CVE pinning

packages/worker/
├── Dockerfile                   # existing — unchanged
├── Dockerfile.hardened          # NEW: hardened variant
└── package.hardened.json        # NEW: resolutions/overrides for CVE pinning

hosting/couchdb/
├── Dockerfile                   # existing — unchanged
└── Dockerfile.hardened          # NEW: hardened variant (no separate package.json needed)

.github/workflows/
├── tag-release.yml              # existing — unchanged
├── release-database.yml         # existing — unchanged
└── release-hardened.yml         # NEW: dispatch trigger

.budibase-deploys-workflows/
└── build-hardened-images.yml    # NEW: template for budibase-deploys
```

### Structure Rationale

- **Dockerfile.hardened alongside Dockerfile:** Constraint from PROJECT.md — hardened files must not touch existing Dockerfiles. The `.hardened` suffix creates a discoverable pairing without modifying the standard build.
- **package.hardened.json per package:** Yarn `resolutions` live inside a package.json. The root monorepo `resolutions` (root package.json line 114-135) only apply at workspace install time, not inside Docker where the package is re-installed from scratch with workspace deps stripped. Each hardened image needs its own standalone `resolutions` block alongside the production dependencies.
- **.budibase-deploys-workflows/ directory:** budibase-deploys is a separate repo with no automated sync. Storing workflow templates here keeps them version-controlled and auditable; operators manually copy them on first setup. This matches how other cross-repo workflows are managed in this codebase.

## Architectural Patterns

### Pattern 1: Forked Dockerfile with Shared Build Arguments

**What:** `Dockerfile.hardened` copies the structure of the original Dockerfile exactly but adds an extra `RUN` step before or after `yarn install` that: (a) upgrades pinned OS packages and (b) copies `package.hardened.json` over `package.json` before install.

**When to use:** When you need CVE patches without diverging structurally from the original. The hardened file stays a thin delta on top of the standard file.

**Trade-offs:** Any structural change to the original Dockerfile must be mirrored in the hardened variant. This is acceptable because release cadence is low and the hardened pipeline is an overlay, not a replacement.

**Example:**
```dockerfile
# Dockerfile.hardened — packages/server/
FROM node:22-alpine

# ... same LABEL, WORKDIR, ENV as Dockerfile ...

# OS-level patches — run before yarn install so openssl/curl are patched first
RUN apk add --no-cache --upgrade zlib curl

# ... same apk add block as Dockerfile ...

WORKDIR /app
COPY packages/server/package.hardened.json ./package.json
COPY packages/server/dist/yarn.lock .

# ... removeWorkspaceDependencies.sh, yarn install, COPY dist/ etc same as Dockerfile ...
```

### Pattern 2: Yarn Resolutions in package.hardened.json

**What:** A modified copy of the package's production `package.json` that adds a `resolutions` block (Yarn 1 / Yarn Berry classic) or `overrides` block (npm) pinning vulnerable transitive dependencies to patched versions.

**When to use:** When the vulnerable package is a transitive dependency (not a direct dep) and upgrading the direct dep is not yet feasible. Covers fast-xml-parser, tar, minimatch, axios, glob, koa CVEs.

**Trade-offs:** Overrides bypass the dependency tree's own constraints. A patch version bump is safe; a major bump can break API contracts. Validate by running `yarn install && yarn test` inside Docker after applying overrides. The root monorepo already uses this pattern (see root `package.json` `resolutions` block at line 114-135) — this extends the same approach into the Docker image build.

**Example (package.hardened.json additions):**
```json
{
  "resolutions": {
    "fast-xml-parser": "4.5.2",
    "axios": "1.8.2",
    "tar": "7.5.11",
    "minimatch": "9.0.5",
    "koa": "3.1.2",
    "glob": "11.0.2"
  }
}
```

### Pattern 3: repository_dispatch Mirroring

**What:** A new workflow (`release-hardened.yml`) fires `repository_dispatch` to budibase-deploys after each prod release, passing the same `TAG` payload format that `tag-release.yml` uses. The remote workflow builds hardened images tagged `{TAG}-hardened`.

**When to use:** Any cross-repo trigger in this codebase. Both `tag-release.yml` and `force-release.yml` use `peter-evans/repository-dispatch@v2` with `event-type: release-prod` — the hardened pipeline uses `event-type: hardened-release` to allow independent handling.

**Trade-offs:** The budibase-deploys workflow must be bootstrapped manually. The `GH_ACCESS_TOKEN` secret must have `repo` scope on the deploys repo. The database hardened build must read the DB version separately (from `hosting/couchdb/VERSION`) rather than the app TAG, since database has an independent version track (currently `2.1.0` vs app version).

## Data Flow

### Hardened Build Pipeline — End to End

```
1. Human triggers tag-release.yml (workflow_dispatch)
        |
        v
2. tag-release job bumps lerna version, creates git tag, outputs TAG=3.x.x
        |
        v
3. trigger-release job sends repository_dispatch {event-type: release-prod, TAG: "3.x.x"}
   to budibase-deploys  [EXISTING — unchanged]
        |
        v
4. release-hardened.yml also receives the release push event (OR is triggered
   via workflow_dispatch for the same TAG)
        |
        v
5. release-hardened.yml sends repository_dispatch {event-type: hardened-release,
   TAG: "3.x.x", DB_VERSION: "2.1.0"} to budibase-deploys
        |
        v
6. budibase-deploys: build-hardened-images.yml receives hardened-release event
        |
        ├── Job: build-apps-hardened
        │     checkout budibase @ TAG
        │     docker buildx build -f packages/server/Dockerfile.hardened
        │     push: budibase/apps:3.x.x-hardened
        │
        ├── Job: build-worker-hardened
        │     checkout budibase @ TAG
        │     docker buildx build -f packages/worker/Dockerfile.hardened
        │     push: budibase/worker:3.x.x-hardened
        │
        └── Job: build-database-hardened
              checkout budibase @ TAG
              docker buildx build -f hosting/couchdb/Dockerfile.hardened
              push: budibase/database:2.1.0-hardened
                    (uses DB_VERSION from payload, not app TAG)
        |
        v
7. GitLab/Gravity scanner pulls hardened images, runs Trivy + Grype
   → zero HIGH/CRITICAL findings = pass
```

### Patching Flow Inside Each Hardened Build

```
Dockerfile.hardened (server/worker)
        |
        v
FROM node:22-alpine
        |
        v
apk add --upgrade zlib curl        ← fixes OS CVEs (zlib CVE-2026-22184,
                                      curl CVE-2026-3805)
        |
        v
COPY package.hardened.json → package.json
                                   ← resolutions block pins npm transitive deps
        |
        v
removeWorkspaceDependencies.sh     ← strips @budibase/* workspace deps
        |
        v
yarn install --production          ← resolves with hardened resolutions,
                                      installs patched versions
        |
        v
COPY dist/                         ← application code (unchanged)
        |
        v
Image tagged: budibase/apps:3.x.x-hardened

Dockerfile.hardened (couchdb)
        |
        v
FROM node:22-slim (base stage)
        |
        v
... existing CouchDB install steps ...
        |
        v
apt-mark hold couchdb              ← prevents CouchDB from being upgraded
apt-get upgrade -y                 ← upgrades zlib, curl, libssl3, openssl
                                   ← fixes OS CVEs while preserving CouchDB
        |
        v
npm install -g npm@latest          ← upgrades global npm transitive deps
                                      (tar, minimatch, glob in npm itself)
        |
        v
Image tagged: budibase/database:2.1.0-hardened
```

Note: The existing `hosting/couchdb/Dockerfile` already has `RUN apt-mark hold couchdb && apt-get upgrade -y` at line 123. The hardened variant for couchdb may be a straightforward copy with the npm global version pins tightened.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| budibase-deploys repo | `repository_dispatch` via `peter-evans/repository-dispatch@v2` | Requires `GH_ACCESS_TOKEN` secret with `repo` scope on deploys repo; already in use for prod releases |
| Docker Hub | `docker/build-push-action@v5` + `docker/login-action@v3` | `DOCKER_USERNAME` and `DOCKER_API_KEY` secrets; same repos as standard images, different tag suffix |
| GitLab/Gravity scanner | Pull-based; scanner pulls from Docker Hub after push | No integration work needed on this side — images must be publicly accessible at the tagged name |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| release-hardened.yml <-> budibase-deploys | repository_dispatch JSON payload | Must carry both `TAG` (app version) and `DB_VERSION` (couchdb version) since they have independent tracks |
| Dockerfile.hardened <-> package.hardened.json | COPY instruction in Dockerfile | package.hardened.json must be committed to the repo so it is available in the docker build context when budibase-deploys checks out this repo at the release tag |
| hardened build context <-> removeWorkspaceDependencies.sh | existing COPY + chmod + exec pattern | The hardened Dockerfiles must replicate the same `COPY scripts/removeWorkspaceDependencies.sh` step as the originals — the script is already in the repo root |
| budibase-deploys <-> this repo workflows | manual copy of .budibase-deploys-workflows/ | One-time bootstrap; changes to the remote workflow require a manual copy operation |

## Anti-Patterns

### Anti-Pattern 1: Editing Existing Dockerfiles

**What people do:** Add security patches directly to `Dockerfile` to keep a single file.
**Why it's wrong:** Violates the explicit project constraint. Standard and hardened images have different objectives; mixing them means any future upstream change to the standard Dockerfile could accidentally break the hardened build, and vice versa.
**Do this instead:** Keep `Dockerfile.hardened` as a separate file. Accept the duplication cost — it is the correct trade-off for this project.

### Anti-Pattern 2: Putting Overrides Only in Root package.json

**What people do:** Add `resolutions` to the monorepo root `package.json` and assume they flow into Docker.
**Why it's wrong:** The Docker build for server and worker uses `packages/server/dist/yarn.lock` and a stripped `package.json` (via `removeWorkspaceDependencies.sh`) with a fresh `yarn install`. The root monorepo resolutions are not present in this context. The root `package.json` already has resolutions (line 114-135) that fix some of these same CVEs for local development but they have no effect inside the Docker build.
**Do this instead:** Encode overrides in `package.hardened.json` which is explicitly COPY'd into the Docker build context before `yarn install`.

### Anti-Pattern 3: Using the Same Event Type as Standard Releases

**What people do:** Reuse `event-type: release-prod` for the hardened dispatch.
**Why it's wrong:** The budibase-deploys repo handles `release-prod` for production deployments. Overloading it with hardened builds risks entangling the two pipelines — a hardened build failure could interfere with the standard release or trigger deployment steps prematurely.
**Do this instead:** Use a distinct `event-type: hardened-release` so the deploys repo can route it to a separate workflow with separate failure handling.

### Anti-Pattern 4: Using the App TAG for Database Hardened Images

**What people do:** Tag the hardened database image as `budibase/database:{app-TAG}-hardened`.
**Why it's wrong:** The database has an independent version track in `hosting/couchdb/VERSION` (currently `2.1.0`). The database release workflow (`release-database.yml`) reads this file explicitly. Using the app version would create a mismatch between what GitLab/Gravity expects to scan and what is actually tagged.
**Do this instead:** Pass `DB_VERSION` in the dispatch payload, read separately from `hosting/couchdb/VERSION`.

## Sources

- Direct inspection: `packages/server/Dockerfile` (line 1-87)
- Direct inspection: `packages/worker/Dockerfile` (line 1-72)
- Direct inspection: `hosting/couchdb/Dockerfile` (line 1-153, particularly line 82-84 for existing npm upgrade, line 123-126 for existing apt-get upgrade)
- Direct inspection: `.github/workflows/tag-release.yml` — repository_dispatch pattern
- Direct inspection: `.github/workflows/release-database.yml` — separate version track pattern, inline build pattern
- Direct inspection: `.github/workflows/force-release.yml` — confirms `peter-evans/repository-dispatch@v2` is the standard cross-repo trigger
- Direct inspection: `package.json` (root) lines 114-135 — existing `resolutions` block confirming yarn resolution override pattern is already in use
- Direct inspection: `scripts/removeWorkspaceDependencies.sh` — confirms workspace dep stripping in Docker context
- Direct inspection: `.planning/PROJECT.md` — constraints, CVE list, tag convention requirements

---
*Architecture research for: Docker image hardening pipeline (brownfield Budibase monorepo)*
*Researched: 2026-03-21*

---
phase: 02-hardened-dockerfiles-and-os-patching
plan: "01"
subsystem: infra
tags: [docker, alpine, apk, couchdb, hardening, cve, os-patching, non-root]

# Dependency graph
requires:
  - phase: 01-npm-vulnerability-patching
    provides: packages/server/package.hardened.json and packages/worker/package.hardened.json with npm CVE resolutions
provides:
  - scripts/generate-hardened-dockerfile.sh — idempotent generation script for all 3 Dockerfile.hardened files
  - packages/server/Dockerfile.hardened — hardened server image build
  - packages/worker/Dockerfile.hardened — hardened worker image build
  - hosting/couchdb/Dockerfile.hardened — hardened CouchDB image build
affects: [02-02, phase-03-github-actions-workflow]

# Tech tracking
tech-stack:
  added: [Python3 (used in generation script for reliable multiline text transformation)]
  patterns: [script-generated Dockerfile.hardened alongside originals, post-generation grep assertions, Python heredoc in bash for cross-platform text manipulation]

key-files:
  created:
    - scripts/generate-hardened-dockerfile.sh
    - packages/server/Dockerfile.hardened
    - packages/worker/Dockerfile.hardened
    - hosting/couchdb/Dockerfile.hardened
  modified: []

key-decisions:
  - "Used Python3 heredoc inside bash for Dockerfile transformation (macOS BSD sed incompatible with multiline i\\commands via shell variables)"
  - "OS patch block inserted before '# handle node-gyp' comment (not after FROM) per RESEARCH Pitfall 5 — preserves LABEL ordering"
  - "USER node + chown inserted before CMD (not after last COPY individually) per RESEARCH Pitfall 6 — catches all COPY'd files"
  - "CouchDB Dockerfile.hardened is header-only change — existing apt-mark hold + apt-get upgrade already provides full OS CVE coverage"

patterns-established:
  - "Pattern: generate_alpine() function pattern — OS patch + package.hardened.json COPY + USER node + smoke test, all in one Python transformation"
  - "Pattern: post-generation assertions via grep exit 1 validate every requirement before script exits"
  - "Pattern: Smoke test RUN node -e require('bcrypt') catches ABI breakage at docker build time, not at container start"

requirements-completed: [OS-01, OS-02, OS-03, DOCK-01, DOCK-02, DOCK-03, DOCK-04, DOCK-05, DOCK-06]

# Metrics
duration: 2min
completed: 2026-03-21
---

# Phase 02 Plan 01: Hardened Dockerfiles Generation Summary

**Python-based generation script produces 3 Dockerfile.hardened files with Alpine OS CVE patches (zlib 1.3.2-r0 + curl 8.19.0-r0 from edge), package.hardened.json COPY substitution, USER node directive, and native addon smoke test**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-21T23:03:17Z
- **Completed:** 2026-03-21T23:05:29Z
- **Tasks:** 2 (Task 1: create script + generate files; Task 2: verify structural correctness)
- **Files modified:** 4 (1 new script + 3 generated Dockerfiles)

## Accomplishments

- Created `scripts/generate-hardened-dockerfile.sh` with `generate_alpine()` and `generate_couchdb()` functions
- Generated all 3 Dockerfile.hardened files in one idempotent script run
- Server and worker hardened: OS patches (zlib 1.3.2-r0, curl 8.19.0-r0 from Alpine edge), package.hardened.json COPY, USER node (UID 1000), native addon smoke test before chown
- CouchDB hardened: header comment added; existing `apt-mark hold couchdb && apt-get upgrade` pattern at lines 123-126 preserved intact
- Script includes built-in post-generation assertions that exit 1 if any requirement is unmet

## Task Commits

Each task was committed atomically:

1. **Task 1: Create generate-hardened-dockerfile.sh + Task 2: Verify content correctness** - `b783f96867` (feat)

*Note: Task 2 was verification-only with no file changes; all files committed in Task 1's commit.*

## Files Created/Modified

- `scripts/generate-hardened-dockerfile.sh` — Generation script using Python heredoc transformations; idempotent; has built-in assertions for all 9 requirements
- `packages/server/Dockerfile.hardened` — Server hardened image: AUTO-GENERATED header, OS patch (zlib+curl from edge/main), package.hardened.json COPY, removeWorkspaceDependencies.sh intact, native addon smoke test, `RUN chown -R node:node /app`, `USER node`, CMD unchanged
- `packages/worker/Dockerfile.hardened` — Worker hardened image: same pattern as server with worker-specific paths
- `hosting/couchdb/Dockerfile.hardened` — CouchDB hardened image: AUTO-GENERATED header only addition; no USER change; existing apt-mark hold + apt-get upgrade preserved

## Decisions Made

- Switched from bash sed to Python heredoc inside bash: macOS BSD sed cannot accept multi-line text blocks as shell variables for the `i\` insert command. Python is universally available (required by Alpine build toolchain anyway), and the Python-in-bash pattern produces cleaner, more readable transformations.
- OS patch block anchored to `# handle node-gyp` comment (not `FROM node:22-alpine`): per Pitfall 5 in RESEARCH.md, anchoring to FROM would insert the block before the LABEL lines. The `# handle node-gyp` comment correctly places OS patches just before the first `RUN apk add`, ensuring build tools install AFTER OS CVE patches.
- chown + USER node + smoke test inserted before CMD (not after last individual COPY): per Pitfall 6, chown must run after ALL COPY instructions complete. Anchoring to CMD guarantees this regardless of future COPY additions to the original Dockerfile.
- CouchDB Dockerfile.hardened is a header-only change: the existing `apt-mark hold couchdb && apt-get upgrade -y` at lines 123-126 of the runner stage already provides full Debian CVE remediation. No structural modifications needed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Switched from bash sed to Python for multiline text insertion**
- **Found during:** Task 1 (create generation script)
- **Issue:** Initial script used bash variables containing newlines passed to BSD sed `i\` command — macOS BSD sed rejected the syntax with "extra characters after \ at the end of i command". The plan specified sed-based transformations but macOS and Linux sed handle multiline insertions differently.
- **Fix:** Replaced sed transformations with Python3 heredoc blocks embedded in bash. Python reads the source Dockerfile line-by-line, applies the same logical transformations (insert before `# handle node-gyp`, substitute COPY line, insert before CMD), and writes the output. The transformation logic is functionally equivalent to the plan's sed specification.
- **Files modified:** scripts/generate-hardened-dockerfile.sh
- **Verification:** Script runs successfully on macOS BSD environment; outputs identical to expected content; idempotency verified (md5sum before/after second run matches)
- **Committed in:** b783f96867 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 — blocking implementation issue)
**Impact on plan:** No scope change. The Python approach produces identical output to the planned sed approach. All acceptance criteria met.

## Issues Encountered

- macOS BSD sed vs GNU sed incompatibility for multiline insertions via shell variables. Resolved by using Python3 which has identical behavior on both platforms.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 3 Dockerfile.hardened files exist with correct content
- Plan 02-02 (image builds and scanning) can proceed immediately
- Docker must be available to build the hardened images
- The generated files are committed and stable

## Self-Check: PASSED

All created files verified to exist on disk:
- FOUND: scripts/generate-hardened-dockerfile.sh
- FOUND: packages/server/Dockerfile.hardened
- FOUND: packages/worker/Dockerfile.hardened
- FOUND: hosting/couchdb/Dockerfile.hardened
- FOUND: .planning/phases/02-hardened-dockerfiles-and-os-patching/02-01-SUMMARY.md

Commit b783f96867 verified in git log.

---
*Phase: 02-hardened-dockerfiles-and-os-patching*
*Completed: 2026-03-21*

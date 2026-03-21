# Phase 2: Hardened Dockerfiles and OS Patching - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-21
**Phase:** 02-hardened-dockerfiles-and-os-patching
**Areas discussed:** Dockerfile approach, Non-root USER, CouchDB delta

---

## Dockerfile approach

| Option | Description | Selected |
|--------|-------------|----------|
| Full copy + patch | Copy entire original, modify relevant lines. Standalone but can drift. | |
| FROM base + overlay | FROM budibase/apps:{version} then apply patches on top. Smaller but needs base image first. | (initially selected) |
| Templated generation | Script reads original and applies patches. Always in sync. | |

**User's choice:** Initially selected FROM base + overlay, then reconsidered.

### Follow-up: npm in overlay

| Option | Description | Selected |
|--------|-------------|----------|
| Full reinstall | rm -rf node_modules, yarn install from package.hardened.json. Doubles layers. | |
| Multi-stage hybrid | Fresh stage with package.hardened.json, COPY app from base. Complex. | |
| Reconsider full copy | Overlay doesn't work well with npm overrides — switch to full copy. | ✓ |

**User's choice:** Reconsider full copy — overlay approach creates more problems than it solves.

### Follow-up: Sync strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Manual sync | Standalone files, manually updated when original changes. | |
| Script generated | Script reads original, applies patches (sed). Always in sync. | ✓ |
| You decide | Claude picks based on line diff. | |

**User's choice:** Script generated

---

## Non-root USER

### Server/worker user

| Option | Description | Selected |
|--------|-------------|----------|
| node (UID 1000) | Built-in user in node:22-alpine. May need chown. | |
| Custom budibase user | Dedicated user with specific UID. | |
| You decide | Claude picks based on docker_run.sh and pm2 requirements. | ✓ |

**User's choice:** You decide

### CouchDB user

| Option | Description | Selected |
|--------|-------------|----------|
| Keep as-is | CouchDB needs root for entrypoint. Don't change. | ✓ |
| Drop to couchdb after setup | Add gosu/su-exec. More secure but complex. | |
| You decide | Claude picks. | |

**User's choice:** Keep as-is

---

## CouchDB delta

| Option | Description | Selected |
|--------|-------------|----------|
| OS upgrade + npm globals | apt-get upgrade with couchdb held + pin pm2. Minimal delta. | ✓ |
| Match Alpine approach | Named packages only, no blanket upgrade. | |
| You decide | Claude determines minimal delta. | |

**User's choice:** OS upgrade + npm globals

---

## Claude's Discretion

- Generation script implementation details
- Whether to add Makefile target
- pm2 version pinning for CouchDB
- docker_run.sh modifications for non-root
- Build context handling

## Deferred Ideas

None — discussion stayed within phase scope.

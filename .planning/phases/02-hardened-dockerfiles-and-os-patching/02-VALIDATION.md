---
phase: 2
slug: hardened-dockerfiles-and-os-patching
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Docker build + shell commands (structural checks + image smoke tests) |
| **Config file** | none — validation uses docker build and grep |
| **Quick run command** | `grep -q 'package.hardened.json' packages/server/Dockerfile.hardened && echo OK` |
| **Full suite command** | `for d in packages/server packages/worker hosting/couchdb; do docker build -f $d/Dockerfile.hardened $d && echo "$d OK"; done` |
| **Estimated runtime** | ~5 minutes (Docker builds) |

---

## Sampling Rate

- **After every task commit:** Run structural checks (grep for key patterns in Dockerfile.hardened)
- **After every plan wave:** Run Docker build for affected images
- **Before `/gsd:verify-work`:** Full suite must be green (all 3 images build + smoke test)
- **Max feedback latency:** 30 seconds (structural), 5 minutes (Docker build)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | DOCK-01 | build | `docker build -f packages/server/Dockerfile.hardened` | TBD | pending |
| TBD | TBD | TBD | DOCK-02 | build | `docker build -f packages/worker/Dockerfile.hardened` | TBD | pending |
| TBD | TBD | TBD | DOCK-03 | build | `docker build -f hosting/couchdb/Dockerfile.hardened` | TBD | pending |
| TBD | TBD | TBD | OS-01 | structural | `grep -q 'apk add --upgrade.*zlib' packages/server/Dockerfile.hardened` | TBD | pending |
| TBD | TBD | TBD | OS-02 | structural | `grep -q 'curl' packages/server/Dockerfile.hardened` | TBD | pending |
| TBD | TBD | TBD | DOCK-05 | structural | `grep -q 'USER node' packages/server/Dockerfile.hardened` | TBD | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — validation is structural (grep) and Docker build-based, no test framework needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Trivy zero findings | OS-01, OS-02, DOCK-01-03 | Requires Trivy 0.68.1 installed locally | `trivy image --severity HIGH,CRITICAL --exit-code 1 <image>` |
| Grype zero findings | OS-01, OS-02, DOCK-01-03 | Requires Grype 0.109.0 installed locally | `grype <image> --fail-on high` |
| Native addon ABI | DOCK-01-02 | Requires built image | `docker run --rm <image> node -e "require('bcrypt'); require('isolated-vm')"` |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (structural)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

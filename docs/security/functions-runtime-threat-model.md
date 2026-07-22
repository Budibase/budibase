# Budibase Functions (Alpha) — Runtime Threat Model

**Status:** Alpha review (spec E3)
**Scope:** The Function execution runtime — isolate, child process, supervisor,
grant/broker, and the Compose deployment boundary.
**Deployment assumption:** Self-hosted only, **trusted Function authors**. Not
enabled on Budibase Cloud. Not a hostile-author or multi-tenant containment
boundary.

> This document records the security review required before Alpha release
> validation. It identifies assets, trust boundaries, attack paths, mitigations,
> residual risks, and the explicit accepted-risk decisions for the Alpha.

---

## 1. Summary and risk decision

Budibase Functions let a trusted author write server-side code that runs in a
sandboxed [`isolated-vm`](https://github.com/laverdet/isolated-vm) isolate inside
a **standalone runner service/container** (`@budibase/functions-runner`),
separate from `server`, `worker`, and datasource credentials.

The Alpha security posture is **defence in depth against accidents and
low-effort escalation, under a trusted-author assumption** — not a guarantee of
containment against a determined hostile author. This is an **accepted risk for
the Alpha**, gated by:

- Self-host-only availability; **excluded on Cloud** (enforced server-side, not
  just in the UI — see `resolveFunctionsGate`).
- A product feature flag (`FUNCTIONS`) that is default-off.
- A user-facing **trusted-author warning** shown in the builder.

## 2. Assets

| # | Asset | Why it matters |
|---|-------|----------------|
| A1 | Budibase/datasource credentials (CouchDB, Redis, Minio, external DBs) | Full data compromise if leaked to Function code. |
| A2 | Host of the runner container | Lateral movement / RCE on infrastructure. |
| A3 | Other tenants' / workspaces' data | Confidentiality and integrity. |
| A4 | Grant/broker tokens (short-lived execution credentials) | Replay → unauthorised capability use. |
| A5 | The runner service availability | DoS starves all Functions. |
| A6 | Function source and outputs | Integrity/exfiltration of business logic and data. |

## 3. Trust boundaries

```
[ Builder UI ]  --auth-->  [ server / worker ]  --broker grant-->  [ functions-runner (supervisor) ]
   (trusted author)            (trusted)                                   |
                                                                           v
                                                             [ per-call isolate (untrusted-input code) ]
```

- **TB1 — server/worker ↔ runner:** network boundary between the credentialed
  application and the credential-free runner.
- **TB2 — supervisor ↔ isolate:** in-process boundary enforced by `isolated-vm`;
  the isolate is the primary containment mechanism.
- **TB3 — runner container ↔ host:** Compose/OCI boundary (namespaces, caps,
  filesystem, network).
- **TB4 — builder ↔ server:** authn/authz for who may author/run Functions.

## 4. Review by boundary

### 4.1 Isolate (TB2)

Reviewed: handle exposure, copied values, SDK wrappers, module/global access,
termination, and supervisor/isolate separation.

- **Handle exposure — OK.** Only a **copied** `input` value crosses into the
  isolate (`ExternalCopy(...).copyInto`). No host object, function reference, or
  `Reference`/`Callback` handle is set on the isolate global. Results leave the
  isolate via `{ copy: true }`, so no live handle is returned to the host.
  *Confirmed: no known path exposes a raw isolate handle.*
- **Global/module access — OK.** The isolate context is created empty; `require`,
  `process`, `global` (host), `Buffer`, timers, and network globals are absent.
  Verified by a regression test asserting `typeof process === "undefined"` and
  `typeof require === "undefined"` inside the isolate.
- **Termination — OK.** Each call runs in a **fresh isolate** with a wall-clock
  `timeout` and a `memoryLimit`; the isolate is disposed in a `finally` block.
  Runaway loops are terminated (regression test: `while (true) {}` → `timeout`).
- **Copied values — OK.** Input is a deep copy; the author cannot retain a
  reference to host memory.
- **Supervisor separation — OK.** The supervisor is a thin HTTP process; user
  code never executes in the supervisor context, only inside isolates.

### 4.2 Grant / broker (TB1)

Reviewed: grant entropy, TTL, replay protection, atomic budgets, execution
identity, capability mapping, and data/log redaction.

- The runner itself holds **no credentials** (A1 mitigated at the image level —
  see 4.4). Capability access is intended to be mediated by short-lived grants
  brokered by `server`/`worker`.
- **Alpha status / findings:** the broker-side grant issuance (entropy, TTL,
  single-use replay protection, atomic capability budgets, and execution
  identity binding) is delivered by the broker/grant work of the epic and must
  be validated against the tests in §5. See **Finding F1**.
- **Redaction:** runner logs must not echo `input`, results, or any brokered
  secret. See **Finding F2**.

### 4.3 Child / supervisor separation (TB2/TB3)

- The runner is a **separate service/process**, not folded into `server` or
  `worker`; stopping it does not stop the app or non-Function automations.
- Per-call isolates provide fault isolation between executions.

### 4.4 Compose / container (TB3)

Reviewed: networks, credentials, filesystem, Linux capabilities, resource/PID
limits, image contents, and internal reachability.

- **Credentials — OK.** The image carries **no** Budibase/datasource config or
  secrets; image inspection shows only compiled output + production
  `node_modules`.
- **User — OK.** Runs as the non-root `node` user (uid 1000).
- **Filesystem — OK.** Compatible with a **read-only root filesystem**; only
  `/tmp` needs to be writable (mounted `tmpfs`). Dev compose sets
  `read_only: true` + `tmpfs: /tmp`.
- **Image contents — OK.** Multi-stage build keeps the C++ toolchain out of the
  runtime image (minimal file set).
- **Findings (hardening owned by #19276):** production Compose must additionally
  set `cap_drop: [ALL]`, `security_opt: [no-new-privileges:true]`, `pids_limit`,
  CPU/memory limits, and place the runner on an **internal** network with no
  egress to datasources or the internet unless explicitly brokered. See
  **Finding F3**.

## 5. Hostile / failure test matrix (reconciliation)

| Attack path | Expected | Covered by |
|-------------|----------|------------|
| Access `process`/`require` inside isolate | Undefined | runner test (isolate) |
| Infinite loop / CPU burn | Timeout, isolate disposed | runner test (timeout) |
| Memory bomb | Killed at `memoryLimit` | isolate `memoryLimit` (add explicit test — F4) |
| Return a host handle | Impossible (copy-only) | design + isolate test |
| Oversized request body | Rejected (413/400) | supervisor `maxBodyBytes` |
| Grant replay | Rejected (single-use) | broker tests — **F1** |
| Egress to datasource without grant | Blocked by network policy | Compose hardening — **F3** |

## 6. Findings and residual risk

| ID | Severity | Finding | Owner | Remediation / link |
|----|----------|---------|-------|--------------------|
| F1 | **Blocking** | Grant entropy/TTL/replay/budget must be validated end-to-end before Alpha validation. | Broker/grant work (#19264) | Verify against §5 matrix; link PR before release validation. |
| F2 | High | Ensure runner logs redact `input`, results and brokered secrets. | Runner (#19275) | Add redaction + test. |
| F3 | **Blocking** | Production Compose hardening (caps, no-new-privileges, pids/cpu/mem limits, internal network). | Hardened Compose runner (#19276) | Land #19276; re-review 4.4. |
| F4 | Medium | Add an explicit memory-limit regression test. | Runner (#19275) | Add test to the runner suite. |

**Residual risk (accepted for Alpha):** a determined **hostile** author may find
isolate-escape or resource-exhaustion techniques not covered here. This is out of
scope for the Alpha trusted-author model and is mitigated operationally by
self-host-only availability, the default-off flag, Cloud exclusion, and the
trusted-author warning.

## 7. User/operator language check

- The builder shows: *"The local Function runner assumes trusted Function
  authors… only run Functions written by people you trust."* — **accurate**;
  it does **not** claim hostile-author or multi-tenant containment.
- Runner health states (`disabled`/`unhealthy`/`busy`) are surfaced as
  infrastructure states, **not** as source-code errors.
- Functions are **excluded on Cloud** and default-off on self-host — matches the
  implementation.

## 8. Acceptance checklist

- [x] Assets, trust boundaries, attack paths, mitigations, residual risks and
      supported deployment assumptions documented.
- [x] No known path exposes raw isolate handles or runner credentials.
- [x] Trusted-author warning and Cloud exclusion match the implementation.
- [ ] Blocking findings (F1, F3) remediated and linked before Alpha release
      validation.

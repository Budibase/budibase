# Ongoing email-abuse detection

Status: proposed for security, product, and support review. This restores and updates the design from [cloud-security#56](https://github.com/Budibase/cloud-security/pull/56), which was closed without merging. This design follows the paid-template entitlement and the completed incident investigation in [#189](https://github.com/Budibase/vulns/issues/189) and [#190](https://github.com/Budibase/vulns/issues/190). It addresses [#191](https://github.com/Budibase/vulns/issues/191) and the remaining prevention work in [#188](https://github.com/Budibase/vulns/issues/188).

## Decision

Use a tenant-wide send budget and behavior signals as the primary control. Keep the paid-template entitlement, but do not treat payment as proof that a tenant is safe. Record invitation attempts before mail is sent, retain the counts when users or templates are deleted, and review tenants whose sending and deletion patterns resemble abuse. Evaluate template-content classification offline first. It should inform review, not automatically ban tenants or be on the invitation delivery path until it has been measured against reviewed examples.

The initial enforcement point is `packages/worker/src/utilities/email.ts:sendEmail`, which also serves the worker email API and the user invitation flow in `packages/worker/src/sdk/users/users.ts`. A tenant-scoped guard at this point covers single and bulk invitations and avoids a second path with a different budget. Template saves in `packages/worker/src/api/controllers/global/templates.ts` provide the earlier content-analysis point. `getTemplateByPurpose` already selects trusted defaults when `CUSTOMISE_EMAILS` is unavailable; that entitlement remains a separate containment control.

## Event and decision model

For every attempted email, record a tenant ID, purpose, normalized recipient hash, time, immutable send attempt ID, template purpose and revision or default-template marker, actor ID when available, and the eventual provider outcome. Do not log invitation codes, rendered message bodies, or full recipient addresses in ordinary telemetry. Keep the original content in a restricted evidence store only when an alert requires review, with retention and access recorded. The recipient hash must use a rotating, secret keyed hash so different recipients can be counted without a reusable plain hash.

At send time, atomically reserve one unit in tenant-wide rolling 10-minute and 24-hour counters before transport is called. Retry with the same attempt ID must reuse its reservation. Record failed attempts separately and release a reservation only when no provider submission occurred. Successful sends, provider failures, and user deletions remain in the event history; deleting users or changing templates never resets the budget. Use an atomic shared store for the fast decision and a durable event stream for audit and rebuilding counters. The implementation must define how it reconciles the two after a crash before enforcement is enabled.

Signals and initial actions:

| Signal | Initial response |
| --- | --- |
| Known incident indicators in a saved template, including the recruiter impersonation and external contact address reported in #188 | Alert for human review; preserve template revision. Do not rely on these strings as the sole abuse definition. |
| A tenant less than seven days old attempts 50 distinct invitation recipients in 10 minutes or 100 in 24 hours | Flag and notify the review queue in shadow mode. After calibration, hold only sends above the threshold pending review. |
| Any tenant sends 50 invitations and deletes at least 20 invited users within one hour | High-priority review; after calibration, temporarily hold new invitation sends. The counts include deleted users. |
| An established tenant exceeds five times its own trailing seven-day daily peak, with at least 500 attempts in 24 hours | Review. Do not automatically block a legitimate import solely because of a volume spike. |
| Provider complaint or bounce spike | Join with send history and review. Never auto-ban from a single complaint, bounce, or classifier result. |
| Confirmed phishing or impersonation after human review | Restrict sending, preserve evidence, and follow the existing tenant-ban process. |

These numbers are proposed **shadow-mode alert thresholds**, not production hard limits. Security and support must compare their false-positive rate against recent legitimate imports and the reviewed #190 incident set before enabling holds. The target for the first enforcement phase is zero blocked legitimate invitation batches in the reviewed sample and detection of every confirmed #190 abusive tenant. Record how many minutes before the first harmful message each signal would have fired; a signal that only triggers after most mail is sent is insufficient.

## Content evaluation

Build a labeled, access-controlled sample from the reviewed #190 investigation and representative legitimate paid-customer templates. Include at least: a normal branded invitation, a legitimate recruiting-workspace invitation, a template with an external support link, the confirmed impersonation template from #188, and variants that change spacing, case, URLs, and contact address. Labels must be human decisions and include uncertainty. The issue text alone supplies one known abusive pattern and does not support a claimed measured accuracy yet.

Compare three approaches on the same held-out set: deterministic incident indicators and URL/domain checks; an optional classifier that sees the template plus purpose and tenant context; and behavior-only signals. Measure precision, recall, false-positive rate per 1,000 legitimate template saves, reviewer time, and detection latency. Require a human-readable reason and an evidence pointer for every alert. Do not send full invitation codes or recipient lists to a model. A classifier can run asynchronously once per changed template revision; cache its result by content hash and model version. Reviewers may override it, and their decision becomes a new labeled example. If it is unavailable or uncertain, continue with behavior controls and queue review rather than silently treating the template as safe.

Before using the private #190 evidence, these constructed cases exercise the proposed policy:

| Example | Expected result | What it tests |
| --- | --- | --- |
| A paid customer sends 80 branded invitations for a planned workspace import, without deleting users | A new tenant receives a shadow-mode volume alert; an established tenant normally does not. Neither is automatically banned. | Legitimate bulk import and review burden. |
| A new tenant sends 100 invitations, deletes those users, then sends 100 more | Volume and delete/reinvite signals fire; the second batch is held after calibrated enforcement. | The reported count-reset bypass. |
| A template impersonates a Budibase recruiter and directs recipients to the external contact address in #188 | A content indicator triggers human review before or during the first send. | Known incident signal and evidence capture. |
| A legitimate recruiting workspace uses the words “recruiting team” with its own verified business address | A content hit can be dismissed without a ban or persistent hold. | False positive from a broad phrase match. |
| A paid tenant sends ordinary invitations slowly but its provider complaints rise | Provider feedback triggers review without an automatic ban. | Behavior outside a short send-volume window. |

These are policy expectations, not measured classifier results. The first measured evaluation must use the reviewed #190 evidence and real legitimate imports; if it fails the targets below, revise thresholds before enforcement.

## Operating cost and latency

The send guard should add no more than 25 ms at p99 when the shared counter store is healthy; template classification is asynchronous and adds no send latency. Each send needs one atomic reservation and one outcome event. At one million invitations per month, that is approximately one million reservations and one million outcome events. If both records average 500 bytes, raw event storage is about 1 GB per month and 3 GB for 90 days, before indexes and replicas; measure actual serialized size before provisioning. Content classification runs only on changed template revisions. If a model is tested, monthly inference cost is `changed revisions × average input/output tokens × current provider token prices`, plus evidence storage and human review time. Measure the actual revision rate, tokens, and reviewer minutes in shadow mode before setting a budget. Deterministic scanning and counters do not require a per-message model call.

If the counter store is unavailable, hold invitation sends in a retryable queue and emit a high-priority operational alert. Password recovery and other account-access messages are outside the invitation budget and continue through their own controls. Resume queued invitations only after counters have been rebuilt from durable events; do not treat a restart as a new allowance. Provider callbacks can arrive late or twice; match them by immutable attempt ID and make processing idempotent. A missing provider callback is unknown, not proof of delivery or abuse.

## Review and recovery

Alerts enter a security/support queue with tenant ID, signal, time window, counts, template revision, and a restricted evidence link. Reviewers can mark benign, suspicious, or confirmed abuse and record a reason. Only confirmed abuse permits a tenant ban. Holds expire within 30 minutes unless an on-call security reviewer records a reason and a new expiry. Support must acknowledge a recovery request within one business hour. The tenant receives a neutral delivery-delay message and a support route. Queue age above 15 minutes pages the on-call owner. A false-positive override is tenant-specific, time-limited, and audited. Repeated alerts and operator decisions are visible in a single timeline so deleting users or templates cannot erase the incident history.

## Rollout and acceptance

1. Instrument attempts, outcomes, user deletions, and provider callbacks; validate event completeness and idempotency without changing delivery.
2. Run the proposed signals in shadow mode across free, trial, and paid tenants. Replay the reviewed #190 cases and legitimate import samples. Tune thresholds and publish measured false-positive and detection-time results.
3. Enable short holds for the calibrated high-confidence behavior signals on a small Cloud cohort. Monitor invite delivery, review queue load, appeals, and missed abuse; keep a rapid disable switch.
4. Expand to all Cloud tenants after operational sign-off. Consider self-hosted defaults separately because their SMTP and support ownership differ. Evaluate optional content classification only after its measured benefit exceeds review cost and false-positive risk.

The implementation is complete when counts survive delete/reinvite cycles, all invitation routes share the reservation, duplicate retries do not consume extra budget, existing legitimate invitations still deliver under normal conditions, and reviewers can trace every restriction to evidence and reverse it. Product and security must agree the calibrated thresholds and on-call owner before enforcement is enabled.

Implementation is tracked in [#205](https://github.com/Budibase/vulns/issues/205) for telemetry and shadow-mode counters and [#207](https://github.com/Budibase/vulns/issues/207) for reviewed holds and recovery. [#206](https://github.com/Budibase/vulns/issues/206), the earlier evaluation issue, was closed as not planned. The shadow-mode evaluation and measured threshold review must be explicitly accepted before #207 enables holds; #205 must supply that evidence or a replacement evaluation issue must be opened. Enforcement depends on both telemetry and measured evaluation.

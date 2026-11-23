# Security patch review ownership

Status: proposal for engineering and security review. This addresses [vulns#209](https://github.com/Budibase/vulns/issues/209).

## Decision to make

Assign one named security patch review owner for each working week. The Batman rotation is the default owner only after the rotation owner and engineering lead confirm that patch review is part of that week's capacity. If that cannot be confirmed, the engineering lead names another owner before the week begins. Record the name and backup in the security queue, not just in a calendar.

The owner is accountable for moving the review queue, not for personally reviewing every code path. They assign a technically qualified reviewer, arrange product validation, and escalate conflicts. The patch author remains responsible for a reproducible report, regression coverage, and a concise impact assessment. A reviewer cannot approve their own patch.

## Queue contract

1. Every ready security PR has an issue link, severity, requested reviewer, validation owner, and next action. Draft PRs remain visible but do not enter the review response clock.
2. The weekly owner checks the queue at the start and end of each working day. A ready PR without a reviewer is assigned one during the first check. If no qualified reviewer is available, the owner records the blocker and asks the engineering lead for capacity that day.
3. Confirmed critical or actively exploited fixes interrupt ordinary Batman work. Begin review within four working hours and arrange a same-day validation plan. High severity fixes receive a first review within one working day; other security fixes within two working days. These are response targets, not automatic merge deadlines.
4. The reviewer checks the reported exploit path, the regression failing before the fix and passing afterward, authorization boundaries, and effects on normal workflows. The validation owner checks the relevant product path, including a browser replay for user-facing changes. Failed or missing checks stay visible as blockers.
5. When a patch is ready, approved, and validated, follow the existing merge and release process. Only then update the vulnerability issue's release state. A draft PR or passing unit test alone does not mean the vulnerability is resolved.
6. If the owner is absent, the named backup takes over at the next queue check. If both are unavailable, the engineering lead appoints a replacement the same day.

## Priority and escalation

Security review capacity is reserved before ordinary Batman work is planned. If an active incident consumes that capacity, the engineering lead reassigns the non-incident queue owner instead of silently pausing reviews. A ready PR that misses its response target is raised in the engineering channel with the issue, blocker, and proposed reviewer. The owner keeps a visible count of ready PRs without reviewers and the age of the oldest ready PR.

On 23 November 2026, a queue check found 18 open `cloud-security` PRs, 14 ready for review, and 11 ready PRs without a requested reviewer. The oldest ready PRs were opened on 8 September. This is the baseline for measuring whether the owner assignment reduces unowned reviews.

## Trial and review

Run this process for two working weeks. Record daily: ready PR count, ready PRs without a reviewer, time to first review by severity, PRs blocked on product validation, and the age of the oldest ready PR. Engineering and security review the results at the end of the trial and adjust the rotation, capacity, and response targets. The trial owner should publish who holds the role each week and who is the backup before the trial starts.

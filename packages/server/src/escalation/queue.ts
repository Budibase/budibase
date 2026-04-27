import zlib from "zlib"
import type { Job } from "bull"
import { context, queue, utils } from "@budibase/backend-core"
import {
  AutomationActionStepId,
  DocumentType,
  EscalationContextDoc,
  EscalationNotificationDoc,
  SEPARATOR,
} from "@budibase/types"
import { automationQueue } from "../automations/bullboard"

export interface EscalationJob {
  phase: "notify" | "waiting"
  escalationId: string
  appId: string
  tenantId: string
  message?: string
  expiresAt?: string
  isTest?: boolean
}

const DEFAULT_CONCURRENCY = 1
const DEFAULT_TIMEOUT_MS = 30000

const getDocId = (escalationId: string): string =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

let escalationQueue: queue.BudibaseQueue<EscalationJob> | undefined
let escalationQueueInitialised = false

export function getQueue() {
  if (!escalationQueue) {
    escalationQueue = new queue.BudibaseQueue<EscalationJob>(
      queue.JobQueue.ESCALATION,
      {
        jobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: 1000,
          timeout: DEFAULT_TIMEOUT_MS,
        },
        jobTags: (data: EscalationJob) => ({
          phase: data.phase,
          escalationId: data.escalationId,
          appId: data.appId,
          tenantId: data.tenantId,
          message: data.message,
          isTest: data.isTest,
        }),
      }
    )
  }
  return escalationQueue
}

async function processNotify(job: Job<EscalationJob>) {
  const { escalationId, appId, message } = job.data

  console.log("Escalation notify: picked up", {
    jobId: job.id,
    escalationId,
    appId,
    message,
  })

  await context.doInContext(appId, async () => {
    const db = context.getWorkspaceDB()
    const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))

    if (!doc) {
      console.error("Escalation notify: context doc not found, discarding", {
        escalationId,
        jobId: job.id,
      })
      return
    }

    // TODO: send notification to reviewer using doc.context.automation and doc inputs
    // DEAN: escalationId must be included in the notification payload sent to recipients
    //   so they can reference it when responding via the response API.
    // DEAN: notification delivery needs to account for:
    //   - retry behaviour if the notification channel is unavailable (e.g. email/webhook failure)
    //   - re-notification delays (e.g. remind reviewer every N minutes if unresolved)
    //   - exponential backoff on transient failures before giving up
    //   - if the notification itself times out or hangs, the processor job will be killed by
    //     DEFAULT_TIMEOUT_MS - leaving the escalation with no resume job enqueued and no
    //     reviewer notified. needs a dead-letter / fallback strategy for this case

    // DEAN: where/how should these be surfaced

    const resumeJobId = `esc_${escalationId}_resume`

    // DONE: Write a notification doc per recipient so each can track its own response lifecycle.
    // escalationId must be included in any notification payload sent to recipients
    // so they can reference it when responding via the response API.
    // TODO: consider one Bull job per recipient rather than batching all in one job -
    // gives independent retry/backoff per channel so a Slack failure doesn't block Teams etc.
    // IF - we do this, then the bulkDocs call would be done first.

    // if (1 == 1) throw new Error("BORK BORK")
    if (doc.recipients?.length) {
      const sentAt = new Date().toISOString()
      const notifDocs: EscalationNotificationDoc[] = doc.recipients.map(
        recipient => ({
          _id: `${DocumentType.ESCALATION_NOTIFICATION}${SEPARATOR}${utils.newid()}`,
          escalationId,
          appId,
          tenantId: job.data.tenantId,
          recipient,
          sentAt,
        })
      )
      await db.bulkDocs(notifDocs)

      // TODO: dispatch actual notifications (email, webhook, etc.) to each recipient
    }

    await db.put({ ...doc, updatedAt: new Date().toISOString() })

    const resumeJob: EscalationJob = {
      phase: "waiting",
      escalationId,
      appId,
      tenantId: job.data.tenantId,
      message,
      expiresAt: new Date(Date.now() + doc.delay).toISOString(),
      isTest: job.data.isTest,
    }

    await addEscalationJob(resumeJob, doc.delay, resumeJobId)

    console.log("Escalation notify: resume job enqueued", {
      jobId: job.id,
      escalationId,
      message,
      resumeJobId,
      delayMs: doc.delay,
      expiresAt: new Date(Date.now() + doc.delay).toISOString(),
    })
  })
}

async function processResume(job: Job<EscalationJob>) {
  const { escalationId, appId } = job.data

  await context.doInContext(appId, async () => {
    const db = context.getWorkspaceDB()
    const doc = await db.tryGet<EscalationContextDoc>(getDocId(escalationId))

    if (!doc) {
      console.error("Escalation resume: context doc not found, discarding", {
        escalationId,
        jobId: job.id,
      })
      return
    }

    const resolvedAt = doc.resolvedAt ?? new Date().toISOString()
    const resolution = doc.resolution === "pending" ? "expired" : doc.resolution
    await db.put({ ...doc, resolvedAt, resolution, updatedAt: resolvedAt })

    console.log("Escalation resume: resuming automation", {
      jobId: job.id,
      escalationId,
      resolution: doc.resolution,
      resolvedAt,
    })

    const suspendedContext = doc.contextCompressed
      ? JSON.parse(
          zlib
            .inflateSync(
              Uint8Array.from(Buffer.from(doc.contextCompressed, "base64"))
            )
            .toString()
        )
      : doc.context

    const { automation, stepResults, state } = suspendedContext

    if (!automation?.definition) {
      console.error(
        "Escalation resume: automation snapshot missing from context, discarding",
        {
          escalationId,
          jobId: job.id,
        }
      )
      return
    }

    // The escalation step halts execution before its result is pushed to
    // stepResults, so we append it here with resolution data so downstream
    // steps can bind to {{ steps.Escalation.resolution }}, {{ steps.Escalation.resolvedAt }},
    // {{ steps.Escalation.response }}.
    const escalationStep = automation.definition.steps.find(
      (s: { id: string }) => s.id === doc.stepId
    )
    const escalationStepResult = {
      id: doc.stepId,
      stepId: AutomationActionStepId.ESCALATION,
      name: escalationStep?.name ?? "Escalation",
      inputs: escalationStep?.inputs ?? {},
      outputs: {
        success: true,
        escalationId,
        resolvedAt: new Date().toISOString(),
        resolution,
        ...(doc.response && { response: doc.response }),
        // what else could go here?
        // responses maybe? or let them fetch them if they want.
      },
    }

    const resolvedStepResults = [...stepResults, escalationStepResult]

    const escalationStepIndex = automation.definition.steps.findIndex(
      (s: { id: string }) => s.id === doc.stepId
    )
    if (escalationStepIndex === -1) {
      console.error(
        "Escalation resume: stepId not found in automation definition",
        {
          stepId: doc.stepId,
          automationId: doc.automationId,
        }
      )
      return
    }

    const remainingSteps = automation.definition.steps.slice(
      escalationStepIndex + 1
    )

    if (remainingSteps.length === 0) {
      console.log(
        "Escalation resume: no remaining steps, automation complete",
        {
          jobId: job.id,
        }
      )
      return
    }

    // DEAN: rehydrate ctx.user from doc.context.userId via
    // sdk.users.getUser(doc.context.userId) and pass it through resumeContext
    // to ensure fresh user data (roles, email etc.) is available to downstream
    // steps that bind to {{ user.* }}.

    const resumeAutomation = {
      ...automation,
      definition: {
        ...automation.definition,
        steps: remainingSteps,
      },
    }

    await automationQueue.add(
      {
        automation: resumeAutomation,
        event: {
          appId,
          isResume: true,
          resumeContext: { stepResults: resolvedStepResults, state },
        },
      },
      {}
    )

    // DEAN: emit ESCALATION_EXPIRED (auto) or ESCALATION_RESOLVED (manual) analytics event here
    console.log("Escalation resume: automation re-enqueued", {
      jobId: job.id,
      resolution: doc.resolution,
      remainingSteps: remainingSteps.length,
    })
  })
}

async function processEscalationJob(job: Job<EscalationJob>) {
  if (!job.data?.appId) {
    console.error("Escalation job missing appId, discarding", {
      jobId: job.id,
      phase: job.data?.phase,
    })
    return
  }

  if (job.data.phase === "notify") {
    await processNotify(job)
  } else if (job.data.phase === "waiting") {
    await processResume(job)
  } else {
    console.error("Escalation job unknown phase, discarding", {
      jobId: job.id,
      phase: job.data?.phase,
    })
  }
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (escalationQueueInitialised) {
    return Promise.resolve()
  }
  try {
    escalationQueueInitialised = true
    return getQueue().process(concurrency, processEscalationJob)
  } catch (error) {
    console.error("Error initialising escalation queue", error)
    escalationQueueInitialised = false
    return Promise.resolve()
  }
}

export async function addEscalationJob(
  job: EscalationJob,
  delayMs: number,
  jobId?: string
): Promise<string> {
  init()
  const added = await getQueue().add(job, {
    delay: delayMs,
    ...(jobId && { jobId }),
  })
  return String(added.id)
}

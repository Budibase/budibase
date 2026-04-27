import zlib from "zlib"
import { context, utils } from "@budibase/backend-core"
import { isDocumentConflictError } from "@budibase/backend-core/src/db/errors"
import { getProdWorkspaceID } from "@budibase/backend-core/src/docIds/conversions"
import { checkTestFlag } from "../../utilities/redis"
import {
  DocumentType,
  EscalationContextDoc,
  EscalationResponse,
  SEPARATOR,
} from "@budibase/types"
import { addEscalationJob, EscalationJob, getQueue } from "../queue"
import sdk from "../../sdk"
import {
  CreateEscalationInput,
  CreateEscalationResult,
  EscalationSummary,
  IEscalationProcessor,
} from "."

const getDocId = (escalationId: string) =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

const getNotifyJobId = (escalationId: string) => `esc_${escalationId}_notify`
const getResumeJobId = (escalationId: string) => `esc_${escalationId}_resume`

const buildEscalationId = () => `esc_${utils.newid()}`

export class BullEscalationProcessor implements IEscalationProcessor {
  async create(input: CreateEscalationInput): Promise<CreateEscalationResult> {
    const db = context.getWorkspaceDB()
    const escalationId = input.escalationId ?? buildEscalationId()
    const docId = getDocId(escalationId)
    const now = new Date().toISOString()
    const isTest = await checkTestFlag(input.automationId)

    const contextCompressed = zlib
      .deflateSync(JSON.stringify(input.context))
      .toString("base64")

    const doc: EscalationContextDoc = {
      _id: docId,
      automationId: input.automationId,
      stepId: input.stepId,
      appId: input.appId,
      tenantId: input.tenantId,
      contextCompressed,
      delay: input.delay,
      resolution: "pending",
      createdAt: now,
      updatedAt: now,
      isTest,
      ...(input.recipients?.length && { recipients: input.recipients }),
      ...(input.resolutionStrategy && {
        resolutionStrategy: input.resolutionStrategy,
      }),
    }

    await db.put(doc)

    const job: EscalationJob = {
      phase: "notify",
      escalationId,
      appId: input.appId,
      tenantId: input.tenantId,
      message: input.message,
      isTest,
    }

    await addEscalationJob(job, 0, getNotifyJobId(escalationId))

    const expiresAt = new Date(
      new Date(now).getTime() + input.delay
    ).toISOString()
    return { escalationId, expiresAt }
  }

  async resolve(
    escalationId: string,
    response?: EscalationResponse
  ): Promise<void> {
    await this.resolveWithRetry(escalationId, response)
  }

  private async resolveWithRetry(
    escalationId: string,
    response?: EscalationResponse,
    maxRetries = 3
  ): Promise<void> {
    const db = context.getWorkspaceDB()
    const docId = getDocId(escalationId)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const doc = await db.tryGet<EscalationContextDoc>(docId)

      if (!doc) {
        throw new Error(`Escalation ${escalationId} not found`)
      }

      if (doc.resolution !== "pending") {
        // Another writer already resolved it - nothing to do
        return
      }

      const now = new Date().toISOString()
      try {
        await db.put({
          ...doc,
          resolution: "resolved",
          resolvedAt: now,
          updatedAt: now,
          ...(response && { response }),
        })
      } catch (err) {
        if (isDocumentConflictError(err) && attempt < maxRetries - 1) {
          continue
        }
        throw err
      }

      const bullQueue = getQueue().getBullQueue()
      const resumeJob = await bullQueue.getJob(getResumeJobId(escalationId))
      if (resumeJob) {
        await resumeJob.promote()
      } else {
        console.log("Escalation resolved before resume job was enqueued", {
          escalationId,
        })
      }
      return
    }
  }

  async cancel(escalationId: string): Promise<void> {
    const db = context.getWorkspaceDB()
    const docId = getDocId(escalationId)
    const doc = await db.tryGet<EscalationContextDoc>(docId)

    if (!doc) {
      return
    }

    const bullQueue = getQueue().getBullQueue()
    for (const jobId of [
      getNotifyJobId(escalationId),
      getResumeJobId(escalationId),
    ]) {
      const job = await bullQueue.getJob(jobId)
      if (job) {
        await job.remove()
      }
    }

    await db.put({ ...doc, _deleted: true })
  }

  async list(appId: string): Promise<EscalationSummary[]> {
    const prodAppId = getProdWorkspaceID(appId)
    const bullQueue = getQueue().getBullQueue()
    const delayedJobs = await bullQueue.getDelayed()

    return delayedJobs
      .filter(
        job =>
          job.data?.appId && getProdWorkspaceID(job.data.appId) === prodAppId
      )
      .map(job => ({ ...job.data }))
  }

  // Bull specific - it does touch the DB though, so it might be better
  // to have a sync function on the SDK to return any that need synced?
  // This could be potentially dangerous
  async resync(): Promise<{ resynced: number }> {
    const docs = await sdk.escalations.listContextDocs()
    // Completely ignore test runs. Entirely ephemeral.
    const pending = docs.filter(
      doc => doc.resolution === "pending" && !doc.isTest
    )
    const bullQueue = getQueue().getBullQueue()
    let resynced = 0

    const allJobs = await bullQueue.getJobs([
      "active",
      "waiting",
      "delayed",
      "paused",
    ])
    const activeJobIds = new Set(allJobs.map(j => String(j.id)))

    for (const doc of pending) {
      const prefix = `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}`
      const escalationId = doc._id!.slice(prefix.length)
      const notifyJobId = getNotifyJobId(escalationId)
      const resumeJobId = getResumeJobId(escalationId)

      // Not sure about this. Its should have both
      // The delayed job should only exist IF all notifications have been sent
      if (activeJobIds.has(notifyJobId) || activeJobIds.has(resumeJobId)) {
        continue
      }

      // Im thinking for huge queues, there would possibly need to be batching to avoid
      // a deluge of resync jobs.

      // Neither job exists - re-enqueue the waiting job with remaining delay
      const createdAt = (doc as any).createdAt
        ? new Date((doc as any).createdAt).getTime()
        : Date.now()
      const expiresAt = createdAt + doc.delay
      const remainingDelay = Math.max(0, expiresAt - Date.now())

      await addEscalationJob(
        {
          phase: "waiting",
          escalationId,
          appId: doc.appId,
          tenantId: doc.tenantId,
          expiresAt: new Date(expiresAt).toISOString(),
          isTest: doc.isTest,
        },
        remainingDelay,
        resumeJobId
      )

      console.log("Escalation resync: re-enqueued resume job", {
        escalationId,
        remainingDelay,
      })
      resynced++
    }

    console.log("Escalation resync: complete", {
      total: pending.length,
      resynced,
    })
    return { resynced }
  }
}

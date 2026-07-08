import zlib from "zlib"
import type { Job } from "bull"
import { context, db as dbCore, utils } from "@budibase/backend-core"
import { checkTestFlag } from "../../utilities/redis"
import {
  DocumentType,
  EscalationContextDoc,
  EscalationResponse,
  EscalationSource,
  SEPARATOR,
} from "@budibase/types"
import { addEscalationJob, EscalationJob, getQueue } from "../queue"
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

    if (
      input.source === EscalationSource.OPERATION &&
      !input.recipients?.length
    ) {
      throw new Error(
        "Cannot create an operation escalation with no recipients"
      )
    }

    const escalationId = input.escalationId ?? buildEscalationId()
    const docId = getDocId(escalationId)
    const now = new Date().toISOString()
    const isTest =
      input.source === EscalationSource.AUTOMATION
        ? await checkTestFlag(input.automationId)
        : false

    const contextCompressed = zlib
      .deflateSync(JSON.stringify(input.context))
      .toString("base64")

    const sourceFields =
      input.source === EscalationSource.AUTOMATION
        ? {
            automationId: input.automationId,
            stepId: input.stepId,
            ...(input.agentId && { agentId: input.agentId }),
          }
        : {
            agentId: input.agentId,
            operationId: input.operationId,
            sessionId: input.context.sessionId,
            ...(input.requestId && { requestId: input.requestId }),
          }

    const existing = await db.tryGet<EscalationContextDoc>(docId)
    const doc: EscalationContextDoc = {
      _id: docId,
      ...(existing?._rev && { _rev: existing._rev }),
      source: input.source,
      appId: input.appId,
      tenantId: input.tenantId,
      contextCompressed,
      delay: input.delay,
      resolution: "pending",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      isTest,
      ...(input.title && { title: input.title }),
      ...(input.summary && { summary: input.summary }),
      ...(input.recipients?.length && { recipients: input.recipients }),
      ...(input.resolutionStrategy && {
        resolutionStrategy: input.resolutionStrategy,
      }),
      ...sourceFields,
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
        if (dbCore.isDocumentConflictError(err) && attempt < maxRetries - 1) {
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

    if (!doc || doc.resolution !== "pending") {
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

    // Cancel is a terminal state transition, not a delete - keep the doc so the
    // record/audit trail survives, consistent with resolve/expire.
    const now = new Date().toISOString()
    await db.put({
      ...doc,
      resolution: "cancelled",
      resolvedAt: now,
      updatedAt: now,
    })
  }

  async list(appId: string): Promise<EscalationSummary[]> {
    const prodAppId = dbCore.getProdWorkspaceID(appId)
    const bullQueue = getQueue().getBullQueue()
    const delayedJobs = await bullQueue.getDelayed()

    return delayedJobs
      .filter(
        (job: Job<EscalationJob>) =>
          job.data?.appId &&
          dbCore.getProdWorkspaceID(job.data.appId) === prodAppId
      )
      .map((job: Job<EscalationJob>) => ({ ...job.data }))
  }
}

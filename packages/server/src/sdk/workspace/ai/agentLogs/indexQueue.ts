import { context, HTTPError, queue } from "@budibase/backend-core"
import type {
  CreateSessionLogIndexerInput,
  IndexAgentLogOperationInput,
  SessionLogIndexer,
} from "@budibase/types"
import { fetchLiteLLMRequestSummaryById } from "./liteLLM"
import { upsertSessionIndexDoc } from "./sessionIndex"
import {
  determineTrigger,
  isPreviewSession,
  maxDate,
  minDate,
  parseDateOrThrow,
  truncateText,
  validateLiteLLMRequestOwnership,
} from "./shared"

interface AgentLogIndexJob extends IndexAgentLogOperationInput {
  workspaceId: string
}

const DEFAULT_INDEX_QUEUE_CONCURRENCY = 2
const DEFAULT_INDEX_QUEUE_BACKOFF_MS = 5000
const DEFAULT_INDEX_QUEUE_TIMEOUT_MS = 30000

let agentLogIndexQueue: queue.BudibaseQueue<AgentLogIndexJob> | undefined
let agentLogIndexQueueInitialised = false

function getIndexQueue() {
  if (!agentLogIndexQueue) {
    agentLogIndexQueue = new queue.BudibaseQueue<AgentLogIndexJob>(
      queue.JobQueue.AGENT_LOG_INDEXING,
      {
        maxStalledCount: 3,
        jobOptions: {
          attempts: 6,
          backoff: {
            type: "exponential",
            delay: DEFAULT_INDEX_QUEUE_BACKOFF_MS,
          },
          timeout: DEFAULT_INDEX_QUEUE_TIMEOUT_MS,
          removeOnComplete: true,
          removeOnFail: 1000,
        },
        jobTags: data => ({
          workspaceId: data.workspaceId,
          agentId: data.agentId,
          sessionId: data.sessionId,
        }),
      }
    )
  }

  return agentLogIndexQueue
}

export function initLogIndexQueue(
  concurrency = DEFAULT_INDEX_QUEUE_CONCURRENCY
) {
  if (agentLogIndexQueueInitialised) {
    return Promise.resolve()
  }

  try {
    agentLogIndexQueueInitialised = true
    return getIndexQueue().process(concurrency, async job => {
      const { workspaceId, ...indexInput } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        await addSessionLog(indexInput)
      })
    })
  } catch (error) {
    agentLogIndexQueueInitialised = false
    throw error
  }
}

async function enqueueSessionLogIndex(job: AgentLogIndexJob) {
  initLogIndexQueue()
  return await getIndexQueue().add(job)
}

export async function addSessionLog(
  input: IndexAgentLogOperationInput
): Promise<void> {
  const uniqueRequestIds = [...new Set(input.requestIds)].filter(Boolean)
  if (!input.agentId || !input.sessionId || !uniqueRequestIds.length) {
    return
  }

  const db = context.getWorkspaceDB()
  const trigger = determineTrigger(input.sessionId)
  const isPreview = isPreviewSession(input.sessionId)
  const firstInput = truncateText(input.firstInput || "")
  const fallbackStartTime = parseDateOrThrow(input.startedAt, "startedAt")
  const fallbackEndTime = parseDateOrThrow(input.completedAt, "completedAt")

  const summaryResults = await Promise.all(
    uniqueRequestIds.map(async requestId => {
      try {
        const requestDetail = await fetchLiteLLMRequestSummaryById(
          requestId,
          fallbackStartTime,
          fallbackEndTime
        )
        if (!requestDetail) {
          return null
        }
        validateLiteLLMRequestOwnership(input.agentId, requestDetail)
        return {
          requestId,
          detail: requestDetail,
        }
      } catch {
        return null
      }
    })
  )
  const summaries = summaryResults.filter(
    (
      result
    ): result is {
      requestId: string
      detail: NonNullable<
        Awaited<ReturnType<typeof fetchLiteLLMRequestSummaryById>>
      >
    } => result != null
  )

  const foundRequestIds = new Set(summaries.map(summary => summary.requestId))
  const missingRequestIds = uniqueRequestIds.filter(
    requestId => !foundRequestIds.has(requestId)
  )

  if (!summaries.length) {
    const error: any = new HTTPError("Agent log details not ready", 404)
    error.missingRequestIds = uniqueRequestIds
    throw error
  }

  await upsertSessionIndexDoc(db, {
    agentId: input.agentId,
    sessionId: input.sessionId,
    requestIds: summaries.map(summary => summary.requestId),
    trigger,
    isPreview,
    firstInput,
    startTime: summaries.reduce(
      (earliest, summary) => minDate(earliest, summary.detail.startTime),
      fallbackStartTime
    ),
    endTime: summaries.reduce(
      (latest, summary) => maxDate(latest, summary.detail.endTime),
      fallbackEndTime
    ),
    status: summaries.some(summary => summary.detail.status === "failure")
      ? "error"
      : "success",
  })

  if (missingRequestIds.length) {
    const error: any = new HTTPError("Agent log details not ready", 404)
    error.missingRequestIds = missingRequestIds
    throw error
  }
}

export function createSessionLogIndexer({
  agentId,
  sessionId,
  firstInput,
  errorLabel,
  startedAt = new Date().toISOString(),
}: CreateSessionLogIndexerInput): SessionLogIndexer {
  const requestIds = new Set<string>()

  return {
    addRequestId(requestId) {
      if (requestId) {
        requestIds.add(requestId)
      }
    },
    async index() {
      if (!requestIds.size) {
        return
      }

      const workspaceId = context.getWorkspaceId()
      if (!workspaceId) {
        console.error(`Failed to queue ${errorLabel} logs`, {
          agentId,
          sessionId,
          error: new Error("workspaceId is required"),
        })
        return
      }

      try {
        await enqueueSessionLogIndex({
          workspaceId,
          agentId,
          sessionId,
          requestIds: [...requestIds],
          firstInput,
          startedAt,
          completedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error(`Failed to queue ${errorLabel} logs`, {
          agentId,
          sessionId,
          error,
        })
      }
    },
  }
}

import { context, features, queue } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import {
  createOrUpdateRequestForPrompt,
  generateAndSaveRequestTitle,
} from "./crud"
import { determineTrigger } from "../agentLogs/shared"

type AgentRequestTrackingJob =
  | {
      workspaceId: string
      type: "start"
      agentId: string
      sessionId: string
      latestPrompt: string
      operationName: string
      source: string
      userId: string
    }
  | {
      workspaceId: string
      type: "title"
      agentId: string
      sessionId: string
      requestId: string
    }

const DEFAULT_CONCURRENCY = 1
const DEFAULT_BACKOFF_MS = 5000
const DEFAULT_TIMEOUT_MS = 30000

let agentRequestTrackingQueue:
  | queue.BudibaseQueue<AgentRequestTrackingJob>
  | undefined
let agentRequestTrackingInitialised = false

export function getQueue() {
  if (!agentRequestTrackingQueue) {
    agentRequestTrackingQueue =
      new queue.BudibaseQueue<AgentRequestTrackingJob>(
        queue.JobQueue.AGENT_REQUEST_TRACKING,
        {
          maxStalledCount: 3,
          jobOptions: {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: DEFAULT_BACKOFF_MS,
            },
            timeout: DEFAULT_TIMEOUT_MS,
            removeOnComplete: true,
            removeOnFail: 1000,
          },
          jobTags: data => ({
            workspaceId: data.workspaceId,
            agentId: data.agentId,
            sessionId: data.sessionId,
            type: data.type,
          }),
        }
      )
  }

  return agentRequestTrackingQueue
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (agentRequestTrackingInitialised) {
    return Promise.resolve()
  }

  try {
    agentRequestTrackingInitialised = true
    return getQueue().process(concurrency, async job => {
      const { workspaceId, ...data } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        if (!(await features.isEnabled(FeatureFlag.AI_AGENT_ACTIVITY))) {
          return
        }
        if (data.type === "start") {
          const result = await createOrUpdateRequestForPrompt(data)
          if (result?.created) {
            await enqueue({
              workspaceId,
              type: "title",
              agentId: data.agentId,
              sessionId: data.sessionId,
              requestId: result.request.requestId,
            })
          }
          return
        }

        if (data.type === "title") {
          await generateAndSaveRequestTitle(data)
          return
        }
      })
    })
  } catch (error) {
    agentRequestTrackingInitialised = false
    throw error
  }
}

async function enqueue(job: AgentRequestTrackingJob) {
  init()
  return await getQueue().add(job)
}

export async function enqueueRequestTrackingStart({
  agentId,
  sessionId,
  latestPrompt,
  operationName,
  userId,
}: {
  agentId: string
  sessionId: string
  latestPrompt: string
  operationName: string
  userId: string
}) {
  if (!(await features.isEnabled(FeatureFlag.AI_AGENT_ACTIVITY))) {
    return
  }
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("workspaceId is required")
  }

  await enqueue({
    workspaceId,
    type: "start",
    agentId,
    sessionId,
    latestPrompt,
    operationName,
    source: determineTrigger(sessionId),
    userId,
  })
}

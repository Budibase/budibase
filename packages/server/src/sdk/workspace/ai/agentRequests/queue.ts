import { context, features, queue } from "@budibase/backend-core"
import { FeatureFlag } from "@budibase/types"
import { createOrUpdateRequestForPrompt } from "./crud"
import { determineTrigger } from "../agentLogs/shared"

type AgentRequestTrackingJob = {
  workspaceId: string
  agentId: string
  sessionId: string
  latestUserPrompt: string
  recentChatContext?: Array<{
    role: "user" | "assistant"
    content: string
  }>
  operation?: {
    name: string
    prompt: string
  }
  source: string
  userId: string
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
            type: "track",
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
        await createOrUpdateRequestForPrompt(data)
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

export async function enqueueRequestTracking({
  agentId,
  sessionId,
  latestUserPrompt,
  recentChatContext,
  operation,
  userId,
}: {
  agentId: string
  sessionId: string
  latestUserPrompt: string
  recentChatContext?: Array<{
    role: "user" | "assistant"
    content: string
  }>
  operation?: {
    name: string
    prompt: string
  }
  userId: string
}) {
  if (!(await features.isEnabled(FeatureFlag.AI_AGENT_ACTIVITY))) {
    return
  }
  if (!context.isProdWorkspace()) {
    return
  }
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("workspaceId is required")
  }

  await enqueue({
    workspaceId,
    agentId,
    sessionId,
    latestUserPrompt,
    recentChatContext,
    operation,
    source: determineTrigger(sessionId),
    userId,
  })
}

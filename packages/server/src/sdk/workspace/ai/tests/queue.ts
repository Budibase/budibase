import type { Job } from "bull"
import { context, getErrorMessage, queue, utils } from "@budibase/backend-core"
import type { ContextUser } from "@budibase/types"
import { completeRun, createRun, failRun } from "./crud"
import { runSuite } from "./run"
import { v4 } from "uuid"

const DEFAULT_CONCURRENCY = 2
const DEFAULT_BACKOFF_MS = utils.Duration.fromSeconds(10).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(20).toMs()

interface AgentTestRunJob {
  workspaceId: string
  agentId: string
  runId: string
  startedAt: string
  user: ContextUser
  caseId?: string
  groupId?: string
  aiConfigIds?: string[]
}

let agentTestRunQueue: queue.BudibaseQueue<AgentTestRunJob> | undefined
let agentTestRunQueueInitialised = false

export function getQueue() {
  if (!agentTestRunQueue) {
    agentTestRunQueue = new queue.BudibaseQueue<AgentTestRunJob>(
      queue.JobQueue.AGENT_TEST_RUN,
      {
        maxStalledCount: 1,
        jobOptions: {
          attempts: 1,
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
          runId: data.runId,
        }),
      }
    )
  }

  return agentTestRunQueue
}

const markRunFailed = async ({
  agentId,
  runId,
  error,
}: {
  agentId: string
  runId: string
  error: unknown
}) => {
  const message = getErrorMessage(error)
  try {
    await failRun({ agentId, runId, error: message })
  } catch (updateError) {
    console.error("Failed to mark agent test run as failed", {
      agentId,
      runId,
      error: updateError,
    })
  }
}

const processJob = async (job: Job<AgentTestRunJob>) => {
  const {
    workspaceId,
    agentId,
    runId,
    startedAt,
    user,
    caseId,
    groupId,
    aiConfigIds,
  } = job.data

  await context.doInWorkspaceContext(workspaceId, async () => {
    try {
      const completedRun = await runSuite({
        agentId,
        user,
        caseId,
        groupId,
        aiConfigIds,
        runId,
        startedAt,
      })
      await completeRun({ agentId, runId, run: completedRun })
    } catch (error) {
      await markRunFailed({ agentId, runId, error })
      throw error
    }
  })
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (agentTestRunQueueInitialised) {
    return Promise.resolve()
  }

  try {
    agentTestRunQueueInitialised = true
    return getQueue().process(concurrency, processJob)
  } catch (error) {
    agentTestRunQueueInitialised = false
    throw error
  }
}

export async function startRunSuite({
  agentId,
  user,
  caseId,
  groupId,
  aiConfigIds,
}: {
  agentId: string
  user: ContextUser
  caseId?: string
  groupId?: string
  aiConfigIds?: string[]
}) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("workspaceId is required")
  }

  const runId = v4()
  const startedAt = new Date().toISOString()
  const run = await createRun({ agentId, runId, startedAt })
  init()
  await getQueue().add(
    {
      workspaceId,
      agentId,
      runId,
      startedAt,
      user,
      caseId,
      groupId,
      aiConfigIds,
    },
    { jobId: runId }
  )

  return run
}

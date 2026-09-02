import type { PlatformActionSessionIndexJob } from "@budibase/types"
import * as context from "../../../context"
import { BudibaseQueue, JobQueue } from "../../../queue"
import { upsertPlatformActionSession } from "./sessionIndex"

const DEFAULT_INDEX_QUEUE_CONCURRENCY = 2
const DEFAULT_INDEX_QUEUE_BACKOFF_MS = 5000
const DEFAULT_INDEX_QUEUE_ATTEMPTS = 6

let platformActionSessionIndexQueue:
  | BudibaseQueue<PlatformActionSessionIndexJob>
  | undefined
let platformActionSessionIndexQueueInitialised = false

function getIndexQueue() {
  if (!platformActionSessionIndexQueue) {
    platformActionSessionIndexQueue =
      new BudibaseQueue<PlatformActionSessionIndexJob>(
        JobQueue.PLATFORM_ACTION_SESSION_INDEXING,
        {
          jobOptions: {
            attempts: DEFAULT_INDEX_QUEUE_ATTEMPTS,
            backoff: {
              type: "exponential",
              delay: DEFAULT_INDEX_QUEUE_BACKOFF_MS,
            },
            removeOnComplete: true,
            removeOnFail: 1000,
          },
          jobTags: data => ({
            workspaceId: data.workspaceId,
            sourceType: data.sourceType,
            sourceId: data.sourceId,
          }),
        }
      )
  }

  return platformActionSessionIndexQueue
}

export async function initPlatformActionSessionIndexQueue(
  concurrency = DEFAULT_INDEX_QUEUE_CONCURRENCY
): Promise<void> {
  if (platformActionSessionIndexQueueInitialised) {
    return
  }

  platformActionSessionIndexQueueInitialised = true

  let processPromise: Promise<void>
  try {
    processPromise = getIndexQueue().process(concurrency, async job => {
      const { workspaceId, ...indexInput } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        await upsertPlatformActionSession(indexInput)
      })
    })
  } catch (error) {
    platformActionSessionIndexQueueInitialised = false
    throw error
  }

  // Reset the guard if consumer setup fails asynchronously
  return processPromise.catch(err => {
    console.error(
      "Platform action session index queue processor failed to start",
      err
    )
    platformActionSessionIndexQueueInitialised = false
  })
}

export async function enqueuePlatformActionSessionIndex(
  job: PlatformActionSessionIndexJob
): Promise<void> {
  initPlatformActionSessionIndexQueue()
  await getIndexQueue().add(job, { jobId: job.platformActionId })
}

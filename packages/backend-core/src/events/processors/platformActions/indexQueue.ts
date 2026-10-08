import { v4 as uuidv4 } from "uuid"
import type {
  ActionSourceContext,
  PlatformActionContainerStatus,
  PlatformActionSessionChange,
  PlatformActionSessionIndexJob,
  PlatformActionSessionIndexedFn,
} from "@budibase/types"
import * as context from "../../../context"
import { BudibaseQueue, JobQueue } from "../../../queue"
import { upsertPlatformActionSession } from "./sessionIndex"

const DEFAULT_INDEX_QUEUE_CONCURRENCY = 4
const DEFAULT_INDEX_QUEUE_BACKOFF_MS = 5000
const DEFAULT_INDEX_QUEUE_ATTEMPTS = 6

export interface PlatformActionSessionLifecycleInput
  extends ActionSourceContext {
  signal: PlatformActionContainerStatus
  timestamp?: string
  lifecycleId?: string
}

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
            environment: data.environment,
            sourceType: data.sourceType,
            sourceId: data.sourceId,
          }),
        }
      )
  }

  return platformActionSessionIndexQueue
}

export interface InitPlatformActionSessionIndexQueueOpts {
  concurrency?: number
  onSessionIndexed?: PlatformActionSessionIndexedFn
}

function notifySessionIndexed(
  onSessionIndexed: PlatformActionSessionIndexedFn | undefined,
  change: PlatformActionSessionChange
) {
  // The session is already committed - a failure here must not fail the job,
  // as a Bull retry would count the action twice
  try {
    onSessionIndexed?.(change)
  } catch (err) {
    console.error("Failed to notify platform action session change", {
      change,
      err,
    })
  }
}

// Only processes that call this consume the queue - enqueuing alone never
// starts a consumer, so jobs are not picked up by processes (e.g. automation
// threads) that can't notify session changes
export async function initPlatformActionSessionIndexQueue({
  concurrency = DEFAULT_INDEX_QUEUE_CONCURRENCY,
  onSessionIndexed,
}: InitPlatformActionSessionIndexQueueOpts = {}): Promise<void> {
  if (platformActionSessionIndexQueueInitialised) {
    return
  }

  platformActionSessionIndexQueueInitialised = true

  let processPromise: Promise<void>
  try {
    processPromise = getIndexQueue().process(concurrency, async job => {
      const { workspaceId, ...indexInput } = job.data
      const indexed = await context.doInWorkspaceContext(workspaceId, () =>
        upsertPlatformActionSession(indexInput)
      )
      if (indexed) {
        notifySessionIndexed(onSessionIndexed, {
          workspaceId,
          environment: indexInput.environment,
          sourceType: indexInput.sourceType,
          sourceId: indexInput.sourceId,
        })
      }
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
  await getIndexQueue().add(job, { jobId: job.indexId })
}

export async function enqueuePlatformActionSessionLifecycle({
  sourceType,
  sourceId,
  signal,
  timestamp = new Date().toISOString(),
  lifecycleId = `platform_action_lifecycle_${uuidv4()}`,
}: PlatformActionSessionLifecycleInput): Promise<void> {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Cannot index platform action session without a workspace")
  }

  await enqueuePlatformActionSessionIndex({
    workspaceId,
    environment: context.getPlatformActionEnvironment(),
    indexId: lifecycleId,
    sourceType,
    sourceId,
    incrementsActionCount: false,
    signal,
    timestamp,
    metadata: context.getPlatformActionSessionMetadata({
      sourceType,
      sourceId,
    }),
  })
}

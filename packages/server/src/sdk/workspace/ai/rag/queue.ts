import type { Job } from "bull"
import { context, objectStore, queue, utils } from "@budibase/backend-core"
import { Agent, AgentFile, AgentFileStatus } from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { ingestAgentFile } from "./files"
import { agents } from ".."

const DEFAULT_CONCURRENCY = 2
const DEFAULT_BACKOFF_MS = utils.Duration.fromSeconds(30).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(10).toMs()

export interface RagIngestionJob {
  workspaceId: string
  agentId: string
  fileId: string
  objectStoreKey?: string
}

let ragQueue: queue.BudibaseQueue<RagIngestionJob> | undefined
let ragQueueInitialised = false

export function getQueue() {
  if (!ragQueue) {
    ragQueue = new queue.BudibaseQueue<RagIngestionJob>(
      queue.JobQueue.RAG_INGESTION,
      {
        maxStalledCount: 3,
        jobOptions: {
          attempts: 5,
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
          fileId: data.fileId,
        }),
      }
    )
  }

  return ragQueue
}

export function init(concurrency = DEFAULT_CONCURRENCY) {
  if (ragQueueInitialised) {
    return Promise.resolve()
  }
  try {
    ragQueueInitialised = true

    return getQueue().process(concurrency, async job => {
      const { workspaceId, agentId, fileId, objectStoreKey } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        let agent: Agent
        let agentFile: AgentFile

        try {
          agent = await agents.getOrThrow(agentId)
        } catch (error: any) {
          if (error?.status === 404) {
            await job.discard()
            return
          }
          throw error
        }

        try {
          agentFile = await agents.getAgentFileOrThrow(fileId)
        } catch (error: any) {
          if (error?.status === 404) {
            await job.discard()
            return
          }
          throw error
        }

        if (!agentFile.objectStoreKey && objectStoreKey) {
          agentFile.objectStoreKey = objectStoreKey
        }

        if (!agentFile.objectStoreKey) {
          throw new Error("Agent file does not have an object store key")
        }

        try {
          const buffer = await loadFileBuffer(agentFile.objectStoreKey)
          const result = await ingestAgentFile(agent, agentFile, buffer)
          agentFile.status = AgentFileStatus.READY
          agentFile.chunkCount = result.total
          agentFile.processedAt = new Date().toISOString()
          agentFile.errorMessage = undefined
          await agents.updateAgentFile(agentFile)
        } catch (error: any) {
          await handleProcessingError(agentFile, job, error)
          throw error
        }
      })
    })
  } catch (e: any) {
    console.error("Error initialising the RAG ingestion queue")
    ragQueueInitialised = false
  }
}

export async function enqueueAgentFileIngestion(job: RagIngestionJob) {
  init()
  return await getQueue().add(job, { jobId: job.fileId })
}

const loadFileBuffer = async (objectKey: string): Promise<Buffer> => {
  const { stream } = await objectStore.getReadStream(
    ObjectStoreBuckets.APPS,
    objectKey
  )

  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

const handleProcessingError = async (
  agentFile: AgentFile,
  job: Job<RagIngestionJob>,
  error: any
) => {
  const attempts = job.opts.attempts || 1
  const isFinalAttempt = job.attemptsMade + 1 >= attempts

  if (!isFinalAttempt) {
    return
  }

  agentFile.status = AgentFileStatus.FAILED
  agentFile.errorMessage = error?.message || "Failed to process uploaded file"
  agentFile.chunkCount = 0
  await agents.updateAgentFile(agentFile)
}

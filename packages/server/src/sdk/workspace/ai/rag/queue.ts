import type { Job } from "bull"
import { context, objectStore, queue, utils } from "@budibase/backend-core"
import {
  KnowledgeBase,
  KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
} from "@budibase/types"
import { ObjectStoreBuckets } from "../../../../constants"
import { ingestKnowledgeBaseFile } from "./files"
import { knowledgeBase } from ".."

const DEFAULT_CONCURRENCY = 2
const DEFAULT_BACKOFF_MS = utils.Duration.fromSeconds(10).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(10).toMs()

export interface RagIngestionJob {
  workspaceId: string
  knowledgeBaseId: string
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
          knowledgeBaseId: data.knowledgeBaseId,
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
      const { workspaceId, knowledgeBaseId, fileId, objectStoreKey } = job.data
      await context.doInWorkspaceContext(workspaceId, async () => {
        let knowledgeBaseConfig: KnowledgeBase | undefined
        let knowledgeBaseFile: KnowledgeBaseFile | undefined

        knowledgeBaseConfig = await knowledgeBase.find(knowledgeBaseId)
        if (!knowledgeBaseConfig) {
          await job.discard()
          return
        }

        try {
          knowledgeBaseFile =
            await knowledgeBase.getKnowledgeBaseFileOrThrow(fileId)
        } catch (error: any) {
          if (error?.status === 404) {
            await job.discard()
            return
          }
          throw error
        }

        if (!knowledgeBaseFile) {
          await job.discard()
          return
        }

        if (!knowledgeBaseFile.objectStoreKey && objectStoreKey) {
          knowledgeBaseFile.objectStoreKey = objectStoreKey
        }

        if (!knowledgeBaseFile.objectStoreKey) {
          throw new Error("RAG file does not have an object store key")
        }

        try {
          const buffer = await loadFileBuffer(knowledgeBaseFile.objectStoreKey)
          const result = await ingestKnowledgeBaseFile(
            knowledgeBaseConfig,
            knowledgeBaseFile,
            buffer
          )

          knowledgeBaseFile.status = KnowledgeBaseFileStatus.READY
          knowledgeBaseFile.chunkCount = result.total
          knowledgeBaseFile.processedAt = new Date().toISOString()
          knowledgeBaseFile.errorMessage = undefined
          await knowledgeBase.updateKnowledgeBaseFile(knowledgeBaseFile)
        } catch (error: any) {
          await handleProcessingError(knowledgeBaseFile, job, error)
          throw error
        }
      })
    })
  } catch (e: any) {
    console.error("Error initialising the RAG ingestion queue")
    ragQueueInitialised = false
  }
}

export async function enqueueRagFileIngestion(job: RagIngestionJob) {
  init()
  return await getQueue().add(job, { jobId: job.fileId })
}

const loadFileBuffer = async (objectKey: string): Promise<Buffer> => {
  const { stream } = await objectStore.getReadStream(
    ObjectStoreBuckets.APPS,
    objectKey
  )

  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(new Uint8Array(chunk))
  }
  return Buffer.concat(chunks)
}

const handleProcessingError = async (
  file: KnowledgeBaseFile,
  job: Job<RagIngestionJob>,
  error: any
) => {
  const attempts = job.opts.attempts || 1
  const isFinalAttempt = job.attemptsMade + 1 >= attempts

  if (!isFinalAttempt) {
    return
  }

  file.status = KnowledgeBaseFileStatus.FAILED
  file.errorMessage = error?.message || "Failed to process uploaded file"
  file.chunkCount = 0
  await knowledgeBase.updateKnowledgeBaseFile(file)
}

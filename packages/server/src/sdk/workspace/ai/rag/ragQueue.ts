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
import {
  extendGeminiIngestionCooldown,
  GeminiRateLimitError,
  throwIfGeminiIngestionCoolingDown,
} from "./geminiRateLimit"

const DEFAULT_CONCURRENCY = 2
const DEFAULT_ATTEMPTS = 5
const STACK_TRACE_LIMIT = 10
const DEFAULT_BACKOFF_MS = utils.Duration.fromSeconds(10).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(10).toMs()

export interface RagIngestionJob {
  workspaceId: string
  knowledgeBaseId: string
  fileId: string
  objectStoreKey?: string
  rateLimitDeferrals?: number
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
          attempts: DEFAULT_ATTEMPTS,
          stackTraceLimit: STACK_TRACE_LIMIT,
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
      const rateLimitDeferrals = job.data.rateLimitDeferrals || 0
      const failedAttempts = Math.max(0, job.attemptsMade - rateLimitDeferrals)
      // Bull counts every deferral as an attempt; only ordinary failures use the budget.
      job.opts.attempts = DEFAULT_ATTEMPTS + rateLimitDeferrals
      job.opts.stackTraceLimit = STACK_TRACE_LIMIT
      job.opts.backoff = {
        type: "fixed",
        delay: (2 ** (failedAttempts + 1) - 1) * DEFAULT_BACKOFF_MS,
      }
      const { workspaceId, knowledgeBaseId, fileId, objectStoreKey } = job.data
      const startedAtMs = Date.now()
      console.log("Starting RAG ingestion queue job", {
        workspaceId,
        knowledgeBaseId,
        fileId,
        objectStoreKey,
        jobId: job.id,
        attemptsMade: job.attemptsMade,
        attempts: job.opts.attempts,
      })
      await context.doInWorkspaceContext(workspaceId, async () => {
        let knowledgeBaseConfig: KnowledgeBase | undefined
        let knowledgeBaseFile: KnowledgeBaseFile | undefined

        knowledgeBaseConfig = await knowledgeBase.find(knowledgeBaseId)
        if (!knowledgeBaseConfig) {
          console.log(
            "Discarding RAG ingestion queue job: knowledge base missing",
            {
              workspaceId,
              knowledgeBaseId,
              fileId,
              jobId: job.id,
            }
          )
          await job.discard()
          return
        }

        try {
          knowledgeBaseFile =
            await knowledgeBase.getKnowledgeBaseFileOrThrow(fileId)
        } catch (error: any) {
          if (error?.status === 404) {
            console.log("Discarding RAG ingestion queue job: file missing", {
              workspaceId,
              knowledgeBaseId,
              fileId,
              jobId: job.id,
            })
            await job.discard()
            return
          }
          throw error
        }

        if (!knowledgeBaseFile) {
          console.log("Discarding RAG ingestion queue job: file not found", {
            workspaceId,
            knowledgeBaseId,
            fileId,
            jobId: job.id,
          })
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
          await throwIfGeminiIngestionCoolingDown()
          const buffer = await loadFileBuffer(knowledgeBaseFile.objectStoreKey)
          await throwIfGeminiIngestionCoolingDown()
          await ingestKnowledgeBaseFile(
            knowledgeBaseConfig,
            knowledgeBaseFile,
            buffer
          )
          console.log("Completed RAG ingestion queue job", {
            workspaceId,
            knowledgeBaseId,
            fileId,
            jobId: job.id,
            durationMs: Date.now() - startedAtMs,
          })
        } catch (error) {
          if (error instanceof GeminiRateLimitError) {
            const retryAt = await extendGeminiIngestionCooldown({
              retryAt: error.retryAt,
            })
            await job.update({
              ...job.data,
              rateLimitDeferrals: rateLimitDeferrals + 1,
            })
            job.opts.attempts = DEFAULT_ATTEMPTS + rateLimitDeferrals + 1
            job.opts.backoff = {
              type: "fixed",
              delay:
                Math.max(1000, retryAt - Date.now()) +
                Math.floor(Math.random() * 1000),
            }
            console.log(
              "Deferring RAG ingestion until Gemini capacity is available",
              {
                workspaceId,
                knowledgeBaseId,
                fileId,
                jobId: job.id,
                retryAt,
              }
            )
            throw error
          }
          await handleProcessingError({ file: knowledgeBaseFile, job, error })
          console.error("RAG ingestion queue job failed", {
            workspaceId,
            knowledgeBaseId,
            fileId,
            jobId: job.id,
            durationMs: Date.now() - startedAtMs,
            attemptsMade: job.attemptsMade,
            attempts: job.opts.attempts,
            error,
          })
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
  console.log("Enqueueing RAG ingestion job", {
    workspaceId: job.workspaceId,
    knowledgeBaseId: job.knowledgeBaseId,
    fileId: job.fileId,
    objectStoreKey: job.objectStoreKey,
  })
  return await getQueue().add(job, { jobId: job.fileId })
}

export async function removeRagFileIngestionJob(fileId: string): Promise<void> {
  const existing = await getQueue().getBullQueue().getJob(fileId)
  if (existing) {
    await existing.remove().catch(() => {
      // Job may have moved to active state between getJob and remove - safe to ignore
    })
  }
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

const handleProcessingError = async ({
  file,
  job,
  error,
}: {
  file: KnowledgeBaseFile
  job: Job<RagIngestionJob>
  error: unknown
}) => {
  const attempts = job.opts.attempts || 1
  const isFinalAttempt = job.attemptsMade + 1 >= attempts
  const errorMessage =
    error instanceof Error ? error.message : "Failed to process uploaded file"

  if (!isFinalAttempt) {
    console.log("RAG ingestion job attempt failed, will retry", {
      fileId: file._id,
      attemptsMade: job.attemptsMade,
      attempts,
      errorMessage,
    })
    return
  }

  file.status = KnowledgeBaseFileStatus.FAILED
  file.errorMessage = errorMessage
  console.error("RAG ingestion job exhausted retries, marking file failed", {
    fileId: file._id,
    attemptsMade: job.attemptsMade,
    attempts,
    errorMessage: file.errorMessage,
  })
  await knowledgeBase.updateKnowledgeBaseFile(file)
}

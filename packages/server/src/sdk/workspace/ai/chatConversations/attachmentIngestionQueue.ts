import { context, db, queue } from "@budibase/backend-core"
import {
  type ChatConversation,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
  DocumentType,
} from "@budibase/types"
import env from "../../../../environment"

export interface ConversationAttachmentIngestionJob {
  workspaceId: string
  conversationId: string
  turnId: string
}

const DEFAULT_CONCURRENCY = 2
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000

let ingestionQueue:
  | queue.BudibaseQueue<ConversationAttachmentIngestionJob>
  | undefined
let ingestionQueueInitialised = false

export const getQueue = () => {
  if (!ingestionQueue) {
    ingestionQueue =
      new queue.BudibaseQueue<ConversationAttachmentIngestionJob>(
        queue.JobQueue.CONVERSATION_ATTACHMENT_INGESTION,
        {
          maxStalledCount: 3,
          jobOptions: {
            attempts: 5,
            backoff: { type: "exponential", delay: 5000 },
            timeout: DEFAULT_TIMEOUT_MS,
            removeOnComplete: true,
            removeOnFail: 1000,
          },
          jobTags: data => data,
        }
      )
  }
  return ingestionQueue
}

export const scheduleConversationAttachmentIngestion = async (
  job: ConversationAttachmentIngestionJob
) =>
  await getQueue().add(job, {
    jobId: `conversation_attachment_ingestion_${job.workspaceId}_${job.conversationId}_${job.turnId}`,
  })

export const init = (
  processor: (
    job: ConversationAttachmentIngestionJob,
    finalAttempt: boolean
  ) => Promise<void>,
  concurrency = DEFAULT_CONCURRENCY
) => {
  if (ingestionQueueInitialised) {
    return Promise.resolve()
  }
  try {
    ingestionQueueInitialised = true
    return getQueue().process(concurrency, async job => {
      await context.doInWorkspaceContext(job.data.workspaceId, async () => {
        const attempts = job.opts.attempts || 1
        await processor(job.data, job.attemptsMade + 1 >= attempts)
      })
    })
  } catch (error) {
    ingestionQueueInitialised = false
    throw error
  }
}

export const rehydrateScheduledJobs = async () => {
  if (env.isInThread() || !env.SELF_HOSTED || env.MULTI_TENANCY) {
    return
  }
  const workspaceIds = await db.getAllWorkspaces({ idsOnly: true })
  for (const workspaceId of workspaceIds) {
    await context.doInWorkspaceContext(workspaceId, async () => {
      const result = await context.getWorkspaceDB().allDocs<ChatConversation>(
        db.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
          include_docs: true,
        })
      )
      for (const conversation of result.rows
        .map(row => row.doc)
        .filter((doc): doc is ChatConversation => !!doc?._id)) {
        const hasPendingAttachments = conversation.attachments?.some(
          attachment =>
            attachment.status === ConversationAttachmentStatus.QUEUED ||
            attachment.status === ConversationAttachmentStatus.PROCESSING
        )
        const turn = conversation.pendingAttachmentTurns?.find(
          pendingTurn =>
            pendingTurn.status === ConversationAttachmentTurnStatus.QUEUED ||
            pendingTurn.status === ConversationAttachmentTurnStatus.PROCESSING
        )
        if (!turn && !hasPendingAttachments) {
          continue
        }
        await scheduleConversationAttachmentIngestion({
          workspaceId,
          conversationId: conversation._id!,
          turnId: turn?.id || "rehydrated",
        })
      }
    })
  }
}

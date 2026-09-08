import { context, db, locks, queue, utils } from "@budibase/backend-core"
import {
  type ChatConversation,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
  DocumentType,
  type EscalationContextDoc,
  LockName,
  LockType,
} from "@budibase/types"
import env from "../../../../environment"
import { deleteConversationAttachmentObjects } from "./attachments"
import { deleteGeminiVectorStore } from "../knowledgeBase/geminiFileStore"

interface ConversationAttachmentCleanupJob {
  workspaceId: string
  conversationId: string
}

const DEFAULT_CONCURRENCY = 2
const RETRY_DELAY_MS = utils.Duration.fromMinutes(1).toMs()
const DEFAULT_TIMEOUT_MS = utils.Duration.fromMinutes(2).toMs()

let cleanupQueue:
  | queue.BudibaseQueue<ConversationAttachmentCleanupJob>
  | undefined
let cleanupQueueInitialised = false

const getJobId = ({
  workspaceId,
  conversationId,
  expiresAt,
}: ConversationAttachmentCleanupJob & { expiresAt: string }) =>
  `conversation_attachment_cleanup_${workspaceId}_${conversationId}_${new Date(
    expiresAt
  ).getTime()}`

export const getQueue = () => {
  if (!cleanupQueue) {
    cleanupQueue = new queue.BudibaseQueue<ConversationAttachmentCleanupJob>(
      queue.JobQueue.CONVERSATION_ATTACHMENT_CLEANUP,
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
  return cleanupQueue
}

const hasActiveEscalation = async (conversationId: string) => {
  const result = await context.getWorkspaceDB().allDocs<EscalationContextDoc>(
    db.getDocParams(DocumentType.ESCALATION_CONTEXT, undefined, {
      include_docs: true,
    })
  )
  return result.rows.some(
    row =>
      row.doc?.conversationId === conversationId &&
      row.doc.resolution !== "cancelled" &&
      (row.doc.resolution === "pending" || !row.doc.resumeResultCompressed)
  )
}

export const scheduleConversationAttachmentCleanup = async ({
  workspaceId,
  conversationId,
  expiresAt,
}: ConversationAttachmentCleanupJob & { expiresAt: string }) => {
  const job = { workspaceId, conversationId }
  const jobId = getJobId({ ...job, expiresAt })
  return await getQueue().add(job, {
    jobId,
    delay: Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  })
}

export const cleanupConversationAttachments = async (
  conversationId: string,
  { force = false }: { force?: boolean } = {}
) =>
  await locks.doWithLock(
    {
      name: LockName.CONVERSATION_ATTACHMENT,
      type: LockType.AUTO_EXTEND,
      resource: conversationId,
    },
    async () => {
      const workspaceDb = context.getWorkspaceDB()
      let conversation =
        await workspaceDb.tryGet<ChatConversation>(conversationId)
      if (
        !conversation ||
        (!conversation.attachments?.length &&
          !conversation.attachmentVectorStoreId)
      ) {
        return
      }

      if (!force && conversation.attachmentContextExpiresAt) {
        const expiresAt = new Date(
          conversation.attachmentContextExpiresAt
        ).getTime()
        if (expiresAt > Date.now()) {
          await scheduleConversationAttachmentCleanup({
            workspaceId: context.getOrThrowWorkspaceId(),
            conversationId,
            expiresAt: conversation.attachmentContextExpiresAt,
          })
          return
        }
      }

      if (!force && (await hasActiveEscalation(conversationId))) {
        await scheduleConversationAttachmentCleanup({
          workspaceId: context.getOrThrowWorkspaceId(),
          conversationId,
          expiresAt: new Date(Date.now() + RETRY_DELAY_MS).toISOString(),
        })
        return
      }

      const deletingAt =
        conversation.attachmentDeletingAt || new Date().toISOString()
      const deletingConversation = {
        ...conversation,
        attachmentDeletingAt: deletingAt,
        attachments: conversation.attachments?.map(attachment => ({
          ...attachment,
          status: ConversationAttachmentStatus.DELETING,
        })),
        pendingAttachmentTurns: conversation.pendingAttachmentTurns?.map(
          turn => ({
            ...turn,
            status: ConversationAttachmentTurnStatus.CANCELLED,
            updatedAt: deletingAt,
          })
        ),
        updatedAt: deletingAt,
      }
      const deletingResult = await workspaceDb.put(deletingConversation)
      conversation = { ...deletingConversation, _rev: deletingResult.rev }

      if (conversation.attachmentVectorStoreId) {
        await deleteGeminiVectorStore(conversation.attachmentVectorStoreId)
      }
      if (conversation.attachments?.length) {
        await deleteConversationAttachmentObjects({
          conversationId,
          attachments: conversation.attachments,
        })
      }

      const updated = { ...conversation }
      delete updated.attachments
      delete updated.attachmentContextExpiresAt
      delete updated.attachmentVectorStoreId
      delete updated.attachmentDeletingAt
      delete updated.pendingAttachmentTurns
      await workspaceDb.put(updated)
    }
  )

export const init = (concurrency = DEFAULT_CONCURRENCY) => {
  if (cleanupQueueInitialised) {
    return Promise.resolve()
  }
  try {
    cleanupQueueInitialised = true
    return getQueue().process(concurrency, async job => {
      await context.doInWorkspaceContext(job.data.workspaceId, async () => {
        await cleanupConversationAttachments(job.data.conversationId)
      })
    })
  } catch (error) {
    cleanupQueueInitialised = false
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
        .filter(
          (doc): doc is ChatConversation =>
            !!doc?.attachments?.length && !!doc.attachmentContextExpiresAt
        )) {
        await scheduleConversationAttachmentCleanup({
          workspaceId,
          conversationId: conversation._id!,
          expiresAt: conversation.attachmentContextExpiresAt!,
        })
      }
    })
  }
}

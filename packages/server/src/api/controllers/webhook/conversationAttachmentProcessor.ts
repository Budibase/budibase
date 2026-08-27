import {
  ErrorCode,
  WebClient,
  type WebAPIPlatformError,
} from "@slack/web-api"
import { context, HTTPError, locks, roles } from "@budibase/backend-core"
import {
  type ChatConversation,
  type ChatConversationAttachment,
  type ContextUser,
  ConversationAttachmentErrorCode,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
  LockName,
  LockType,
} from "@budibase/types"
import sdk from "../../../sdk"
import { getGlobalUser } from "../../../utilities/global"
import { webhookChat } from "../ai/chatConversations"
import { replyToConversation } from "../../../escalation/notifications/slack"
import { formatSlackAssistantReply } from "./slack"
import type { ConversationAttachmentIngestionJob } from "../../../sdk/workspace/ai/chatConversations/attachmentIngestionQueue"

const MAX_UPDATE_ATTEMPTS = 5

const isConflict = (error: Error) => "status" in error && error.status === 409

const isPermanentError = (error: unknown) =>
  error instanceof HTTPError &&
  error.status >= 400 &&
  error.status < 500 &&
  error.status !== 408 &&
  error.status !== 429

class SlackMissingFilesReadScopeError extends HTTPError {
  constructor() {
    super("Slack app is missing the files:read permission", 403)
  }
}

const isSlackMissingScopeError = (
  error: unknown
): error is WebAPIPlatformError =>
  error instanceof Error &&
  "code" in error &&
  error.code === ErrorCode.PlatformError &&
  "data" in error &&
  typeof error.data === "object" &&
  error.data !== null &&
  "error" in error.data &&
  error.data.error === "missing_scope"

const updateConversation = async (
  conversationId: string,
  update: (conversation: ChatConversation) => ChatConversation
) => {
  const workspaceDb = context.getWorkspaceDB()
  for (let attempt = 0; attempt < MAX_UPDATE_ATTEMPTS; attempt++) {
    const conversation =
      await workspaceDb.tryGet<ChatConversation>(conversationId)
    if (!conversation) {
      throw new HTTPError("Conversation not found", 404)
    }
    const updated = update(conversation)
    try {
      const { rev } = await workspaceDb.put(updated)
      return { ...updated, _rev: rev }
    } catch (error) {
      if (error instanceof Error && isConflict(error)) {
        continue
      }
      throw error
    }
  }
  throw new HTTPError("Conversation update conflict", 409)
}

const updateAttachment = async ({
  conversationId,
  attachmentId,
  update,
}: {
  conversationId: string
  attachmentId: string
  update: (attachment: ChatConversationAttachment) => ChatConversationAttachment
}) =>
  await updateConversation(conversationId, conversation => ({
    ...conversation,
    attachments: conversation.attachments?.map(attachment =>
      attachment.id === attachmentId ? update(attachment) : attachment
    ),
    updatedAt: new Date().toISOString(),
  }))

const createTransientPublicUser = ({
  userId,
  displayName,
}: {
  userId: string
  displayName?: string
}): ContextUser => {
  const publicRoleId = roles.BUILTIN_ROLE_IDS.PUBLIC
  const workspaceId = context.getWorkspaceId()
  return {
    _id: userId,
    globalId: userId,
    userId,
    tenantId: context.getTenantId(),
    email: `${encodeURIComponent(userId)}@chat.budibase.local`,
    firstName: displayName,
    roleId: publicRoleId,
    roles: {
      ...(workspaceId && { [workspaceId]: publicRoleId }),
    },
  }
}

const getSlackFileData = async ({
  conversation,
  attachment,
}: {
  conversation: ChatConversation
  attachment: ChatConversationAttachment
}) => {
  const agent = await sdk.ai.agents.getOrThrow(conversation.agentId)
  const integration = sdk.ai.deployments.slack.validateSlackIntegration(agent)
  const client = new WebClient(integration.botToken, {
    retryConfig: { retries: 0 },
    timeout: 30_000,
  })
  const response = await (async () => {
    try {
      return await client.files.info({ file: attachment.providerFileId })
    } catch (error) {
      if (isSlackMissingScopeError(error)) {
        throw new SlackMissingFilesReadScopeError()
      }
      throw error
    }
  })()
  const file = response.file
  if (!file) {
    throw new HTTPError(`${attachment.filename} is no longer available`, 400)
  }
  if (
    file.name !== attachment.filename ||
    file.mimetype !== attachment.mimetype ||
    file.size !== attachment.size
  ) {
    throw new HTTPError(
      `${attachment.filename} metadata changed after it was uploaded`,
      400
    )
  }
  const downloadUrl = file.url_private_download || file.url_private
  if (!downloadUrl) {
    throw new HTTPError(`${attachment.filename} cannot be downloaded`, 400)
  }
  const download = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${integration.botToken}` },
  })
  if (!download.ok) {
    throw new HTTPError(
      `Failed to download ${attachment.filename} from Slack`,
      download.status
    )
  }
  const data = Buffer.from(await download.arrayBuffer())
  return data
}

const ensureConversationVectorStore = async (
  conversationId: string
): Promise<string> => {
  const current = await context
    .getWorkspaceDB()
    .tryGet<ChatConversation>(conversationId)
  if (!current) {
    throw new HTTPError("Conversation not found", 404)
  }
  if (current.attachmentVectorStoreId) {
    return current.attachmentVectorStoreId
  }
  const vectorStoreId = await sdk.ai.knowledgeBase.createGeminiFileStore(
    `Conversation ${conversationId}`
  )
  try {
    await updateConversation(conversationId, conversation => ({
      ...conversation,
      attachmentVectorStoreId:
        conversation.attachmentVectorStoreId || vectorStoreId,
      updatedAt: new Date().toISOString(),
    }))
  } catch (error) {
    await sdk.ai.knowledgeBase
      .deleteGeminiVectorStore(vectorStoreId)
      .catch(cleanupError => {
        console.error(
          "Failed to roll back conversation vector store",
          cleanupError
        )
      })
    throw error
  }
  const saved = await context
    .getWorkspaceDB()
    .tryGet<ChatConversation>(conversationId)
  return saved?.attachmentVectorStoreId || vectorStoreId
}

const processAttachment = async ({
  conversationId,
  attachmentId,
  finalAttempt,
}: {
  conversationId: string
  attachmentId: string
  finalAttempt: boolean
}) => {
  let conversation = await context
    .getWorkspaceDB()
    .tryGet<ChatConversation>(conversationId)
  const attachment = conversation?.attachments?.find(
    candidate => candidate.id === attachmentId
  )
  if (
    !conversation ||
    !attachment ||
    attachment.status === ConversationAttachmentStatus.READY ||
    attachment.status === ConversationAttachmentStatus.FAILED
  ) {
    return
  }
  if (conversation.attachmentDeletingAt) {
    return
  }

  await updateAttachment({
    conversationId,
    attachmentId,
    update: current => ({
      ...current,
      status: ConversationAttachmentStatus.PROCESSING,
      errorCode: undefined,
      errorMessage: undefined,
    }),
  })

  try {
    conversation =
      (await context
        .getWorkspaceDB()
        .tryGet<ChatConversation>(conversationId)) || conversation
    const data = await getSlackFileData({ conversation, attachment })
    const metadata =
      await sdk.ai.chatConversations.persistConversationAttachment({
        conversationId,
        attachment,
        data,
      })
    const vectorStoreId = await ensureConversationVectorStore(conversationId)
    const ingested = await sdk.ai.knowledgeBase.ingestGeminiFile({
      vectorStoreId,
      filename: attachment.filename,
      mimetype: attachment.mimetype,
      buffer: data,
    })
    const latest = await context
      .getWorkspaceDB()
      .tryGet<ChatConversation>(conversationId)
    if (latest?.attachmentDeletingAt) {
      await sdk.ai.knowledgeBase.deleteGeminiVectorStore(vectorStoreId)
      return
    }
    await updateAttachment({
      conversationId,
      attachmentId,
      update: current => ({
        ...current,
        ...metadata,
        status: ConversationAttachmentStatus.READY,
        ragSourceId: ingested.fileId,
        processedAt: new Date().toISOString(),
        errorCode: undefined,
        errorMessage: undefined,
      }),
    })
  } catch (error) {
    if (!finalAttempt && !isPermanentError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : String(error)
    const errorCode =
      error instanceof SlackMissingFilesReadScopeError
        ? ConversationAttachmentErrorCode.SLACK_MISSING_FILES_READ_SCOPE
        : undefined
    console.error("Conversation attachment processing failed", {
      conversationId,
      attachmentId,
      providerFileId: attachment.providerFileId,
      errorCode,
      error: message,
    })
    await updateAttachment({
      conversationId,
      attachmentId,
      update: current => ({
        ...current,
        status: ConversationAttachmentStatus.FAILED,
        processedAt: new Date().toISOString(),
        errorCode,
        errorMessage: message,
      }),
    })
  }
}

const getRequester = async (
  turn: NonNullable<ChatConversation["pendingAttachmentTurns"]>[number]
) =>
  turn.requester.linked
    ? await getGlobalUser(turn.requester.userId)
    : createTransientPublicUser({
        userId: turn.requester.userId,
        displayName: turn.requester.displayName,
      })

const getAttachmentFailureText = (
  attachments: ChatConversationAttachment[]
) => {
  const missingFilesReadScope = attachments.filter(
    attachment =>
      attachment.errorCode ===
      ConversationAttachmentErrorCode.SLACK_MISSING_FILES_READ_SCOPE
  )
  const otherFailures = attachments.filter(
    attachment =>
      attachment.errorCode !==
      ConversationAttachmentErrorCode.SLACK_MISSING_FILES_READ_SCOPE
  )
  const messages: string[] = []
  if (missingFilesReadScope.length) {
    messages.push(
      `I couldn't access ${missingFilesReadScope
        .map(file => file.filename)
        .join(", ")} because this Slack app is missing the \`files:read\` permission. Ask a Slack workspace admin to reinstall the app, then upload the file again.`
    )
  }
  if (otherFailures.length) {
    messages.push(
      `I couldn't process ${otherFailures
        .map(file => file.filename)
        .join(", ")}.`
    )
  }
  return messages.join("\n\n")
}

const processTurn = async ({
  workspaceId,
  conversation,
  turnId,
  finalAttempt,
}: {
  workspaceId: string
  conversation: ChatConversation
  turnId: string
  finalAttempt: boolean
}) => {
  const turn = conversation.pendingAttachmentTurns?.find(
    candidate => candidate.id === turnId
  )
  if (!turn) {
    return
  }
  if (turn.status === ConversationAttachmentTurnStatus.COMPLETED) {
    return
  }
  if (turn.responseText) {
    await replyToConversation({
      appId: workspaceId,
      agentId: conversation.agentId,
      channel: conversation.channel!,
      text: turn.responseText,
    })
    await updateConversation(conversation._id!, current => ({
      ...current,
      pendingAttachmentTurns: current.pendingAttachmentTurns?.map(candidate =>
        candidate.id === turn.id
          ? {
              ...candidate,
              status: ConversationAttachmentTurnStatus.COMPLETED,
              updatedAt: new Date().toISOString(),
            }
          : candidate
      ),
    }))
    return
  }

  for (const attachmentId of turn.attachmentIds) {
    await processAttachment({
      conversationId: conversation._id!,
      attachmentId,
      finalAttempt,
    })
  }

  const current = await context
    .getWorkspaceDB()
    .tryGet<ChatConversation>(conversation._id!)
  if (!current || current.attachmentDeletingAt) {
    return
  }
  const selectedAttachments = (current.attachments || []).filter(attachment =>
    turn.attachmentIds.includes(attachment.id)
  )
  const ready = selectedAttachments.filter(
    attachment => attachment.status === ConversationAttachmentStatus.READY
  )
  const failed = selectedAttachments.filter(
    attachment => attachment.status === ConversationAttachmentStatus.FAILED
  )
  const question = turn.message.parts
    .filter(part => part.type === "text")
    .map(part => part.text)
    .join("\n")
    .replace(/\n\n\[Attached files:.*\]$/, "")
    .trim()

  let responseText: string
  let messages = current.messages
  if (!question) {
    messages = [...messages, turn.message]
    const readyText = ready.length
      ? `Ready: ${ready.map(file => file.filename).join(", ")}.`
      : ""
    const failedText = getAttachmentFailureText(failed)
    responseText = [readyText, failedText].filter(Boolean).join("\n\n")
  } else if (!ready.length) {
    messages = [...messages, turn.message]
    responseText = getAttachmentFailureText(failed)
  } else {
    const requester = await getRequester(turn)
    const result = await webhookChat({
      chat: {
        ...current,
        messages: [...current.messages, turn.message],
      },
      user: requester,
    })
    messages = result.messages
    responseText = await formatSlackAssistantReply({
      agentId: current.agentId,
      result,
      isDirectMessage: current.channel?.conversationType === "im",
    })
    if (failed.length) {
      responseText += `\n\n${getAttachmentFailureText(failed)}`
    }
  }

  const saved = await updateConversation(current._id!, latest => ({
    ...latest,
    messages,
    pendingAttachmentTurns: latest.pendingAttachmentTurns?.map(candidate =>
      candidate.id === turn.id
        ? {
            ...candidate,
            status: ConversationAttachmentTurnStatus.PROCESSING,
            responseText,
            updatedAt: new Date().toISOString(),
          }
        : candidate
    ),
    updatedAt: new Date().toISOString(),
  }))
  await replyToConversation({
    appId: workspaceId,
    agentId: saved.agentId,
    channel: saved.channel!,
    text: responseText,
  })
  await updateConversation(saved._id!, latest => ({
    ...latest,
    pendingAttachmentTurns: latest.pendingAttachmentTurns?.map(candidate =>
      candidate.id === turn.id
        ? {
            ...candidate,
            status: ConversationAttachmentTurnStatus.COMPLETED,
            updatedAt: new Date().toISOString(),
          }
        : candidate
    ),
  }))
}

const drainConversationTurns = async ({
  workspaceId,
  conversationId,
  finalAttempt,
}: ConversationAttachmentIngestionJob & { finalAttempt: boolean }) => {
  while (true) {
    const conversation = await context
      .getWorkspaceDB()
      .tryGet<ChatConversation>(conversationId)
    const turn = conversation?.pendingAttachmentTurns
      ?.filter(
        candidate =>
          candidate.status === ConversationAttachmentTurnStatus.QUEUED ||
          candidate.status === ConversationAttachmentTurnStatus.PROCESSING
      )
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))[0]
    if (!conversation || !turn || conversation.attachmentDeletingAt) {
      return
    }
    try {
      await processTurn({
        workspaceId,
        conversation,
        turnId: turn.id,
        finalAttempt,
      })
    } catch (error) {
      if (!finalAttempt && !isPermanentError(error)) {
        throw error
      }
      const responseText =
        "I couldn't finish processing those files. Please try uploading them again."
      await updateConversation(conversationId, current => ({
        ...current,
        pendingAttachmentTurns: current.pendingAttachmentTurns?.map(
          candidate =>
            candidate.id === turn.id
              ? {
                  ...candidate,
                  status: ConversationAttachmentTurnStatus.FAILED,
                  responseText,
                  errorMessage:
                    error instanceof Error ? error.message : String(error),
                  updatedAt: new Date().toISOString(),
                }
              : candidate
        ),
      }))
      await replyToConversation({
        appId: workspaceId,
        agentId: conversation.agentId,
        channel: conversation.channel!,
        text: responseText,
      })
    }
  }
}

export const processConversationAttachmentJob = async (
  job: ConversationAttachmentIngestionJob,
  finalAttempt = true
) => {
  await locks.doWithLock(
    {
      name: LockName.CONVERSATION_ATTACHMENT,
      type: LockType.AUTO_EXTEND,
      resource: job.conversationId,
    },
    async () => {
      await drainConversationTurns({ ...job, finalAttempt })
    }
  )
}

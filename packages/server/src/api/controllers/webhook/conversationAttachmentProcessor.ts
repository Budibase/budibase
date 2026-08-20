import { WebClient } from "@slack/web-api"
import {
  blacklist,
  context,
  encryption,
  HTTPError,
  locks,
  roles,
} from "@budibase/backend-core"
import {
  AgentChannelProvider,
  type ChatApp,
  type ChatConversation,
  type ChatConversationAttachment,
  type ContextUser,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
  LockName,
  LockType,
} from "@budibase/types"
import sdk from "../../../sdk"
import { getGlobalUser } from "../../../utilities/global"
import { canAccessChatAppAgentForUser } from "../ai/chatApps"
import { webhookChat } from "../ai/chatConversations"
import * as slackNotifications from "../../../escalation/notifications/slack"
import * as teamsNotifications from "../../../escalation/notifications/ms-teams"
import { formatSlackAssistantReply } from "./slack"
import { formatTeamsQueuedAssistantReply } from "./ms-teams"
import type { ConversationAttachmentIngestionJob } from "../../../sdk/workspace/ai/chatConversations/attachmentIngestionQueue"
import { MAX_CONVERSATION_ATTACHMENT_BYTES } from "../../../sdk/workspace/ai/chatConversations/attachments"

const MAX_UPDATE_ATTEMPTS = 5
const MAX_DOWNLOAD_REDIRECTS = 3
const DOWNLOAD_TIMEOUT_MS = 30_000

const isConflict = (error: Error) => "status" in error && error.status === 409

const isPermanentError = (error: unknown) =>
  error instanceof HTTPError &&
  error.status >= 400 &&
  error.status < 500 &&
  error.status !== 408 &&
  error.status !== 429

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
  const response = await client.files.info({ file: attachment.providerFileId })
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

const getBoundedResponseData = async ({
  response,
  filename,
}: {
  response: Response
  filename: string
}) => {
  const contentLength = Number(response.headers.get("content-length"))
  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_CONVERSATION_ATTACHMENT_BYTES
  ) {
    throw new HTTPError(`${filename} exceeds the 20 MB file limit`, 400)
  }
  if (!response.body) {
    return Buffer.alloc(0)
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      size += value.byteLength
      if (size > MAX_CONVERSATION_ATTACHMENT_BYTES) {
        await reader.cancel()
        throw new HTTPError(`${filename} exceeds the 20 MB file limit`, 400)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks, size)
}

const getTeamsFileData = async (attachment: ChatConversationAttachment) => {
  if (!attachment.encryptedDownloadUrl) {
    throw new HTTPError(`${attachment.filename} cannot be downloaded`, 400)
  }

  let url = encryption.decrypt(attachment.encryptedDownloadUrl)
  for (let redirect = 0; redirect <= MAX_DOWNLOAD_REDIRECTS; redirect++) {
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      throw new HTTPError(
        `${attachment.filename} has an invalid download URL`,
        400
      )
    }
    if (
      parsed.protocol !== "https:" ||
      (await blacklist.isBlacklisted(parsed.hostname))
    ) {
      throw new HTTPError(
        `${attachment.filename} has an unsafe download URL`,
        400
      )
    }

    const response = await fetch(parsed, {
      redirect: "manual",
      signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    })
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location || redirect === MAX_DOWNLOAD_REDIRECTS) {
        throw new HTTPError(
          `Failed to download ${attachment.filename} from Teams`,
          400
        )
      }
      url = new URL(location, parsed).toString()
      continue
    }
    if (!response.ok) {
      throw new HTTPError(
        `Failed to download ${attachment.filename} from Teams`,
        response.status
      )
    }
    return await getBoundedResponseData({
      response,
      filename: attachment.filename,
    })
  }
  throw new HTTPError(
    `Failed to download ${attachment.filename} from Teams`,
    400
  )
}

const getFileData = async ({
  conversation,
  attachment,
}: {
  conversation: ChatConversation
  attachment: ChatConversationAttachment
}) => {
  if (attachment.provider === AgentChannelProvider.SLACK) {
    return await getSlackFileData({ conversation, attachment })
  }
  return await getTeamsFileData(attachment)
}

const replyToConversation = async ({
  appId,
  agentId,
  channel,
  text,
}: {
  appId: string
  agentId: string
  channel: NonNullable<ChatConversation["channel"]>
  text: string
}) => {
  if (channel.provider === AgentChannelProvider.SLACK) {
    return await slackNotifications.replyToConversation({
      appId,
      agentId,
      channel,
      text,
    })
  }
  if (channel.provider === AgentChannelProvider.MSTEAMS) {
    return await teamsNotifications.replyToConversation({
      appId,
      agentId,
      channel,
      text,
    })
  }
  throw new HTTPError("Conversation attachment provider is not supported", 400)
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
      errorMessage: undefined,
    }),
  })

  try {
    conversation =
      (await context
        .getWorkspaceDB()
        .tryGet<ChatConversation>(conversationId)) || conversation
    const data = await getFileData({ conversation, attachment })
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
      update: current => {
        const { encryptedDownloadUrl: _encryptedDownloadUrl, ...attachment } =
          current
        return {
          ...attachment,
          ...metadata,
          size: data.byteLength,
          status: ConversationAttachmentStatus.READY,
          ragSourceId: ingested.fileId,
          processedAt: new Date().toISOString(),
          errorMessage: undefined,
        }
      },
    })
  } catch (error) {
    if (!finalAttempt && !isPermanentError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : String(error)
    await updateAttachment({
      conversationId,
      attachmentId,
      update: current => {
        const { encryptedDownloadUrl: _encryptedDownloadUrl, ...attachment } =
          current
        return {
          ...attachment,
          status: ConversationAttachmentStatus.FAILED,
          processedAt: new Date().toISOString(),
          errorMessage: message,
        }
      },
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
    const failedText = failed.length
      ? ` Failed: ${failed.map(file => file.filename).join(", ")}.`
      : ""
    responseText = `${readyText}${failedText}`.trim()
  } else if (!ready.length) {
    messages = [...messages, turn.message]
    responseText = `I couldn't process ${failed
      .map(file => file.filename)
      .join(", ")}.`
  } else {
    const requester = await getRequester(turn)
    const chatApp = await context
      .getWorkspaceDB()
      .tryGet<ChatApp>(current.chatAppId)
    const chatAgentConfig = chatApp?.agents?.find(
      config => config.agentId === current.agentId
    )
    if (
      !chatAgentConfig ||
      !(await canAccessChatAppAgentForUser(
        { user: requester, roleId: requester.roleId ?? undefined },
        chatAgentConfig
      ))
    ) {
      throw new HTTPError("The agent is no longer available to this user", 403)
    }
    const result = await webhookChat({
      chat: {
        ...current,
        messages: [...current.messages, turn.message],
      },
      user: requester,
    })
    messages = result.messages
    responseText =
      current.channel?.provider === AgentChannelProvider.MSTEAMS
        ? await formatTeamsQueuedAssistantReply({
            agentId: current.agentId,
            result,
          })
        : await formatSlackAssistantReply({
            agentId: current.agentId,
            result,
            isDirectMessage: current.channel?.conversationType === "im",
          })
    if (failed.length) {
      responseText += `\n\nI couldn't process: ${failed
        .map(file => file.filename)
        .join(", ")}.`
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

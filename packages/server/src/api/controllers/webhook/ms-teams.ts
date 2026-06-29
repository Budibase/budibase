import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands, type SupportedChatCommand } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  type Ctx,
  type MSTeamsActivity,
  type MSTeamsConversationScope,
  type WebhookChatCompleteResult,
} from "@budibase/types"
import {
  Actions,
  Card,
  Chat,
  LinkButton,
  type Thread,
  type Message,
  type SentMessage,
} from "chat"
import { createTeamsAdapter } from "@chat-adapter/teams"
import sdk from "../../../sdk"
import { handleChatMessage, NO_ASSISTANT_RESPONSE_MESSAGE } from "./chatHandler"
import { getTeamsState } from "./chatState"
import { postLinkPromptPrivately } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"
import { toAbsoluteUrl } from "./utils"

const TEAMS_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."
const TEAMS_PROCESSING_MESSAGE = "Thinking..."
const TEAMS_STREAMING_UPDATE_INTERVAL_MS = 750

const formatTeamsLinkLabel = (value: string) =>
  value
    .replace(/\[|]|<|>|@|\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const getTeamsKnowledgeSourceLinks = async ({
  agentId,
  result,
  isPersonalConversation,
}: {
  agentId: string
  result: WebhookChatCompleteResult
  isPersonalConversation?: boolean
}) => {
  if (
    result.allowKnowledgeSourceDownload === false ||
    !isPersonalConversation
  ) {
    return []
  }

  const links: { label: string; url: string }[] = []
  for (const source of result.ragSources || []) {
    if (!source.fileId) {
      continue
    }

    try {
      const signedUrl = await sdk.ai.rag.getFileUrlForAgent(
        agentId,
        source.fileId
      )
      const absoluteUrl = await toAbsoluteUrl(signedUrl)
      links.push({
        label:
          formatTeamsLinkLabel(source.filename || "") || "Knowledge source",
        url: absoluteUrl,
      })
    } catch (error) {
      console.error("Failed to generate Teams RAG source link", error)
    }
  }
  return links
}

export const formatTeamsAssistantReply = async ({
  result,
}: {
  result: WebhookChatCompleteResult
}) => {
  return result.assistantText || ""
}

const postTeamsKnowledgeSourceLinks = async ({
  thread,
  agentId,
  result,
  isPersonalConversation,
}: {
  thread: Thread
  agentId: string
  result: WebhookChatCompleteResult
  isPersonalConversation?: boolean
}) => {
  const sourceLinks = await getTeamsKnowledgeSourceLinks({
    agentId,
    result,
    isPersonalConversation,
  })
  if (!sourceLinks.length) {
    return
  }

  try {
    await thread.post(
      Card({
        title: "Sources",
        children: [
          Actions(
            sourceLinks.map(source =>
              LinkButton({
                label: source.label,
                url: source.url,
              })
            )
          ),
        ],
      })
    )
  } catch (error) {
    console.error("Failed to post Teams RAG source links", error)
  }
}

export const stripTeamsMentions = (
  text: string,
  entities: MSTeamsActivity["entities"] = []
) => {
  let withoutMentionEntities = text
  for (const entity of entities) {
    if (entity.type?.toLowerCase() !== "mention") {
      continue
    }
    const mentionText = entity.text?.trim()
    if (!mentionText) {
      continue
    }
    withoutMentionEntities = withoutMentionEntities.split(mentionText).join(" ")
  }
  return withoutMentionEntities.replace(/\s+/g, " ").trim()
}

export const parseTeamsCommand = (
  text?: string,
  entities?: MSTeamsActivity["entities"]
): {
  command: SupportedChatCommand
  content: string
} => {
  const normalized = stripTeamsMentions(text || "", entities)
  if (!normalized) {
    return { command: ChatCommands.UNSUPPORTED, content: "" }
  }
  const lower = normalized.toLowerCase()

  if (
    lower === ChatCommands.NEW ||
    lower === `/${ChatCommands.NEW}` ||
    lower.startsWith(`/${ChatCommands.NEW} `)
  ) {
    return {
      command: ChatCommands.NEW,
      content: normalized.replace(
        new RegExp(`^/?${ChatCommands.NEW}\\s*`, "i"),
        ""
      ),
    }
  }
  if (
    lower === ChatCommands.LINK ||
    lower === `/${ChatCommands.LINK}` ||
    lower.startsWith(`/${ChatCommands.LINK} `)
  ) {
    return {
      command: ChatCommands.LINK,
      content: normalized.replace(
        new RegExp(`^/?${ChatCommands.LINK}\\s*`, "i"),
        ""
      ),
    }
  }

  return { command: ChatCommands.ASK, content: normalized }
}

export const splitTeamsMessage = (
  content: string,
  maxLength = 3500
): string[] => {
  const normalized = content || NO_ASSISTANT_RESPONSE_MESSAGE
  if (normalized.length <= maxLength) {
    return [normalized]
  }
  const chunks: string[] = []
  for (let i = 0; i < normalized.length; i += maxLength) {
    chunks.push(normalized.slice(i, i + maxLength))
  }
  return chunks
}

const isTeamsBotAddedToConversation = (activity: MSTeamsActivity) => {
  if (activity.type !== "conversationUpdate") {
    return false
  }
  const recipientId = activity.recipient?.id?.trim()
  if (!recipientId) {
    return false
  }
  return (activity.membersAdded || []).some(
    member => member.id?.trim() === recipientId
  )
}

const isTeamsInstallAddedActivity = (activity: MSTeamsActivity) =>
  activity.type === "installationUpdate" &&
  activity.action?.toLowerCase() === "add"

export const isTeamsLifecycleActivity = (activity: MSTeamsActivity) =>
  isTeamsInstallAddedActivity(activity) ||
  isTeamsBotAddedToConversation(activity)

export const isTeamsMentionActivity = (activity?: MSTeamsActivity) => {
  const recipientId = activity?.recipient?.id?.trim()
  if (!recipientId) {
    return false
  }

  return (activity?.entities || []).some(
    entity =>
      entity.type?.toLowerCase() === "mention" &&
      entity.mentioned?.id?.trim() === recipientId
  )
}

const isTeamsPersonalConversation = (conversationType?: string) =>
  conversationType?.trim().toLowerCase() === "personal"

const createTeamsMessageHandler = ({
  workspaceId,
  chatAppId,
  agentId,
  channelEnabled,
  idleTimeoutMinutes,
  requireUserLink,
}: {
  workspaceId: string
  chatAppId: string
  agentId: string
  channelEnabled: boolean
  idleTimeoutMinutes?: number
  requireUserLink?: boolean
}) => {
  return async (thread: Thread, message: Message) => {
    const raw = message.raw as MSTeamsActivity | undefined
    const messageText = message.text || ""

    const { command, content } = parseTeamsCommand(messageText, raw?.entities)
    if (command === ChatCommands.UNSUPPORTED) {
      await thread.post(
        `Send a message to chat, or "${ChatCommands.NEW}" to start a new conversation.`
      )
      return
    }

    const conversationId = raw?.conversation?.id?.trim() || ""
    const threadId = thread.id
    const externalUserId =
      raw?.from?.id?.trim() ||
      raw?.from?.aadObjectId?.trim() ||
      message.author.userId
    const displayName = raw?.from?.name?.trim() || message.author.fullName
    const channelId = raw?.channelData?.channel?.id?.trim()
    const teamId = raw?.channelData?.team?.id?.trim()
    const tenantId =
      raw?.channelData?.tenant?.id?.trim() || raw?.from?.tenantId?.trim()
    const conversationType = raw?.conversation?.conversationType?.trim()

    if (!conversationId) {
      await thread.post("Missing Teams conversation information.")
      return
    }
    if (!externalUserId) {
      await thread.post("Missing Teams user information.")
      return
    }
    if (!threadId) {
      await thread.post("Missing Teams thread information.")
      return
    }

    const channel: ChatConversationChannel = {
      provider: AgentChannelProvider.MSTEAMS,
      conversationId,
      conversationType,
      channelId,
      threadId,
      teamId,
      tenantId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: MSTeamsConversationScope = {
      chatAppId,
      agentId,
      conversationId,
      threadId,
      channelId,
      externalUserId,
    }

    const shouldShowProgress =
      command === ChatCommands.ASK ||
      (command === ChatCommands.NEW && !!content)

    const shouldPostChannelWorkingIndicator =
      shouldShowProgress && !isTeamsPersonalConversation(conversationType)
    const isPersonalConversation = isTeamsPersonalConversation(conversationType)

    let progressMessage: SentMessage | undefined
    let hasUsedProgressMessage = false

    const editProgressMessage = async (text: string) => {
      if (!progressMessage || hasUsedProgressMessage) {
        return false
      }

      hasUsedProgressMessage = true

      try {
        progressMessage = await progressMessage.edit(text)
        return true
      } catch (error) {
        console.error("Teams progress final update failed", error)
        return false
      }
    }

    const editOrPostTextReply = async (text: string) => {
      const chunks = splitTeamsMessage(text)
      const firstChunk = chunks[0] || NO_ASSISTANT_RESPONSE_MESSAGE
      const remainingChunks = chunks.slice(1)
      if (!(await editProgressMessage(firstChunk))) {
        await thread.post(firstChunk)
      }
      for (const chunk of remainingChunks) {
        await thread.post(chunk)
      }
    }

    try {
      await thread.subscribe()

      if (shouldShowProgress) {
        const typingThread = thread as Thread & {
          startTyping?: () => Promise<void>
        }
        try {
          await typingThread.startTyping?.()
        } catch (error) {
          console.error("Teams typing indicator failed", error)
        }
      }

      await handleChatMessage({
        reply: editOrPostTextReply,
        replyWithAssistantStream: shouldPostChannelWorkingIndicator
          ? undefined
          : async stream => {
              return await thread.post(stream)
            },
        beforeAssistantWebhook: shouldPostChannelWorkingIndicator
          ? async () => {
              progressMessage = await thread.post(TEAMS_PROCESSING_MESSAGE)
            }
          : undefined,
        replyLinkPrompt: async prompt => {
          const delivery = await postLinkPromptPrivately({
            target: thread,
            user: message.author,
            text: prompt.text,
            linkUrl: prompt.linkUrl,
          })
          if (delivery.usedDirectMessageFallback) {
            await editOrPostTextReply(
              "I sent you a DM with your Budibase link."
            )
            return
          }
          if (!delivery.delivered) {
            await editOrPostTextReply(
              "I couldn't send a private Budibase link. Please try again in a direct message."
            )
            return
          }
          await editOrPostTextReply("I sent you a private Budibase link.")
        },
        formatAssistantReply: async result =>
          await formatTeamsAssistantReply({
            result,
          }),
        afterAssistantReply: async result =>
          await postTeamsKnowledgeSourceLinks({
            thread,
            agentId,
            result,
            isPersonalConversation,
          }),
        workspaceId,
        chatAppId,
        agentId,
        provider: AgentChannelProvider.MSTEAMS,
        channelEnabled,
        command,
        content,
        user: {
          externalUserId,
          displayName,
        },
        channel,
        scope,
        idleTimeoutMinutes,
        requireUserLink,
      })
    } catch (error) {
      console.error("Teams webhook processing failed", error)
      const msg =
        error instanceof HTTPError
          ? error.message
          : TEAMS_FALLBACK_ERROR_MESSAGE
      await editOrPostTextReply(msg)
    }
  }
}

export async function MSTeamsWebhook(
  ctx: Ctx<
    unknown,
    unknown,
    { instance: string; chatAppId: string; agentId: string }
  >
) {
  await runChatWebhook({
    ctx,
    providerName: "Teams",
    createWebhookHandler: async ({ workspaceId, chatAppId, agentId }) => {
      const {
        integration,
        idleTimeoutMinutes,
        channelEnabled,
        requireUserLink,
      } = await context.doInWorkspaceContext(workspaceId, async () => {
        const agent = await sdk.ai.agents.getOrThrow(agentId)
        return {
          integration:
            sdk.ai.deployments.MSTeams.validateMSTeamsIntegration(agent),
          idleTimeoutMinutes: agent.MSTeamsIntegration?.idleTimeoutMinutes,
          requireUserLink: agent.MSTeamsIntegration?.requireUserLink,
          channelEnabled:
            !!agent.MSTeamsIntegration?.messagingEndpointUrl?.trim(),
        }
      })

      const chat = new Chat({
        userName: "Budibase",
        adapters: {
          teams: createTeamsAdapter({
            appId: integration.appId,
            appPassword: integration.appPassword,
            appTenantId: integration.tenantId,
            appType: "SingleTenant",
          }),
        },
        state: await getTeamsState(),
        logger: "silent",
        fallbackStreamingPlaceholderText: TEAMS_PROCESSING_MESSAGE,
        streamingUpdateIntervalMs: TEAMS_STREAMING_UPDATE_INTERVAL_MS,
      })

      const handler = createTeamsMessageHandler({
        workspaceId,
        chatAppId,
        agentId,
        channelEnabled,
        idleTimeoutMinutes,
        requireUserLink,
      })
      chat.onDirectMessage(async (thread, message) => {
        await handler(thread, message)
      })
      chat.onNewMention(handler)
      chat.onNewMessage(/./, async (thread, message) => {
        if (
          message.isMention ||
          !isTeamsMentionActivity(message.raw as MSTeamsActivity | undefined)
        ) {
          return
        }
        await handler(thread, message)
      })
      chat.onSubscribedMessage(handler)

      return request => chat.webhooks.teams(request)
    },
  })
}

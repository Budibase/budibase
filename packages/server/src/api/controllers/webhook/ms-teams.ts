import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands, SupportedChatCommand } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type ChatConversationChannel,
  type Ctx,
  type MSTeamsActivity,
  type MSTeamsConversationScope,
} from "@budibase/types"
import { Chat, type Thread, type Message } from "chat"
import { createTeamsAdapter } from "@chat-adapter/teams"
import sdk from "../../../sdk"
import { handleChatMessage } from "./chatHandler"
import { getTeamsState } from "./chatState"
import { postLinkPromptPrivately } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"

const TEAMS_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

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
  const normalized = content || "No response generated."
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

const createTeamsMessageHandler = ({
  workspaceId,
  chatAppId,
  agentId,
  channelEnabled,
  idleTimeoutMinutes,
}: {
  workspaceId: string
  chatAppId: string
  agentId: string
  channelEnabled: boolean
  idleTimeoutMinutes?: number
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
      raw?.from?.aadObjectId?.trim() ||
      raw?.from?.id?.trim() ||
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

    try {
      await thread.subscribe()

      await handleChatMessage({
        reply: async (text: string) => {
          const chunks = splitTeamsMessage(text)
          for (const chunk of chunks) {
            await thread.post(chunk)
          }
        },
        replyLinkPrompt: async prompt => {
          const delivery = await postLinkPromptPrivately({
            target: thread,
            user: message.author,
            text: prompt.text,
            linkUrl: prompt.linkUrl,
          })
          if (delivery.usedDirectMessageFallback) {
            await thread.post("I sent you a DM with your Budibase link.")
            return
          }
          if (!delivery.delivered) {
            await thread.post(
              "I couldn't send a private Budibase link. Please try again in a direct message."
            )
          }
        },
        workspaceId,
        chatAppId,
        agentId,
        provider: AgentChannelProvider.MSTEAMS,
        channelEnabled,
        command,
        content,
        user: { externalUserId, displayName },
        channel,
        scope,
        idleTimeoutMinutes,
      })
    } catch (error) {
      console.error("Teams webhook processing failed", error)
      const msg =
        error instanceof HTTPError
          ? error.message
          : TEAMS_FALLBACK_ERROR_MESSAGE
      await thread.post(msg)
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
      const { integration, idleTimeoutMinutes, channelEnabled } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
          return {
            integration:
              sdk.ai.deployments.MSTeams.validateMSTeamsIntegration(agent),
            idleTimeoutMinutes: agent.MSTeamsIntegration?.idleTimeoutMinutes,
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
      })

      const handler = createTeamsMessageHandler({
        workspaceId,
        chatAppId,
        agentId,
        channelEnabled,
        idleTimeoutMinutes,
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

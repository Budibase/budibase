import { context, HTTPError } from "@budibase/backend-core"
import type {
  ChatConversationChannel,
  Ctx,
  MSTeamsActivity,
  MSTeamsCommand,
  MSTeamsConversationScope,
} from "@budibase/types"
import { Chat, type Thread, type Message } from "chat"
import { createTeamsAdapter } from "@chat-adapter/teams"
import sdk from "../../../sdk"
import { handleChatMessage } from "./chatHandler"
import { getTeamsState } from "./chatState"
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
  command: MSTeamsCommand
  content: string
} => {
  const normalized = stripTeamsMentions(text || "", entities)
  if (!normalized) {
    return { command: "unsupported" as const, content: "" }
  }
  const match = normalized.match(/^\/?(ask|new)\b(?:\s+(.*))?$/i)
  if (!match) {
    return { command: "ask" as const, content: normalized }
  }
  const commandName = match[1]?.toLowerCase()
  const content = (match[2] || "").trim()
  if (commandName === "new") {
    return { command: "new" as const, content }
  }
  if (commandName === "ask") {
    return { command: "ask" as const, content }
  }
  return { command: "ask" as const, content: normalized }
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

// --- Message handler shared between onNewMention and onSubscribedMessage ---

const createTeamsMessageHandler = ({
  workspaceId,
  chatAppId,
  agentId,
  idleTimeoutMinutes,
}: {
  workspaceId: string
  chatAppId: string
  agentId: string
  idleTimeoutMinutes?: number
}) => {
  return async (thread: Thread, message: Message) => {
    const raw = message.raw as MSTeamsActivity | undefined
    const messageText = message.text || ""

    // Parse command from the Chat SDK's normalized text (mentions already stripped)
    const { command, content } = parseTeamsCommand(messageText, raw?.entities)
    if (command === "unsupported") {
      await thread.post(
        'Send a message to chat, or "new" to start a new conversation.'
      )
      return
    }

    const conversationId = raw?.conversation?.id?.trim() || ""
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

    const channel: ChatConversationChannel = {
      provider: "msteams",
      conversationId,
      conversationType,
      channelId,
      teamId,
      tenantId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: MSTeamsConversationScope = {
      chatAppId,
      agentId,
      conversationId,
      channelId,
      externalUserId,
    }

    try {
      await handleChatMessage({
        reply: async (text: string) => {
          const chunks = splitTeamsMessage(text)
          for (const chunk of chunks) {
            await thread.post(chunk)
          }
        },
        workspaceId,
        chatAppId,
        agentId,
        provider: "msteams",
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

// --- Main webhook handler ---

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
      const { integration, idleTimeoutMinutes } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
          return {
            integration:
              sdk.ai.deployments.MSTeams.validateMSTeamsIntegration(agent),
            idleTimeoutMinutes: agent.MSTeamsIntegration?.idleTimeoutMinutes,
          }
        })
      const teamsState = await getTeamsState()
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
        state: teamsState,
        logger: "silent",
      })

      const handler = createTeamsMessageHandler({
        workspaceId,
        chatAppId,
        agentId,
        idleTimeoutMinutes,
      })
      chat.onNewMention(handler)
      chat.onSubscribedMessage(handler)
      chat.onNewMessage(/./, handler)

      return request => chat.webhooks.teams(request)
    },
  })
}

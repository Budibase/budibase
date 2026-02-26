import { context, HTTPError } from "@budibase/backend-core"
import type {
  ChatConversation,
  ChatConversationChannel,
  Ctx,
  MSTeamsActivity,
  MSTeamsCommand,
  MSTeamsConversationScope,
} from "@budibase/types"
import { Chat, type Thread, type Message } from "chat"
import { createTeamsAdapter } from "@chat-adapter/teams"
import sdk from "../../../sdk"
import {
  ensureProdWorkspaceWebhookRoute,
  isConversationExpired,
  pickLatestConversation,
} from "./utils"
import {
  rawBodyToRequest,
  readRawBody,
  responseToKoa,
} from "./koaToRequest"
import { handleChatMessage } from "./chatHandler"
import { teamsState } from "./chatState"

const TEAMS_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

// --- Exported helpers (used by tests) ---

export const isTeamsConversationExpired = ({
  chat,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chat: ChatConversation
  idleTimeoutMs: number
  nowMs?: number
}) => isConversationExpired({ chat, idleTimeoutMs, nowMs })

export const matchesTeamsConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: MSTeamsConversationScope
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== "msteams" ||
    ch?.conversationId !== scope.conversationId ||
    (ch?.channelId || undefined) !== scope.channelId ||
    ch.externalUserId !== scope.externalUserId
  ) {
    return false
  }
  return true
}

export const pickTeamsConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: MSTeamsConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesTeamsConversationScope,
    nowMs,
  })

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
    withoutMentionEntities = withoutMentionEntities
      .split(mentionText)
      .join(" ")
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
    const displayName =
      raw?.from?.name?.trim() || message.author.fullName
    const channelId = raw?.channelData?.channel?.id?.trim()
    const teamId = raw?.channelData?.team?.id?.trim()
    const tenantId =
      raw?.channelData?.tenant?.id?.trim() ||
      raw?.from?.tenantId?.trim()
    const conversationType =
      raw?.conversation?.conversationType?.trim()

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
  const { instance, chatAppId, agentId } = ctx.params
  const prodAppId = ensureProdWorkspaceWebhookRoute({
    ctx,
    instance,
    providerName: "Teams",
  })
  if (!prodAppId) {
    return
  }

  let integration: ReturnType<
    typeof sdk.ai.deployments.MSTeams.validateMSTeamsIntegration
  >
  let idleTimeoutMinutes: number | undefined
  try {
    const result = await context.doInWorkspaceContext(prodAppId, async () => {
      const agent = await sdk.ai.agents.getOrThrow(agentId)
      return {
        integration: sdk.ai.deployments.MSTeams.validateMSTeamsIntegration(
          agent
        ),
        idleTimeoutMinutes: agent.MSTeamsIntegration?.idleTimeoutMinutes,
      }
    })
    integration = result.integration
    idleTimeoutMinutes = result.idleTimeoutMinutes
  } catch (error) {
    if (error instanceof HTTPError) {
      ctx.status = error.status
      ctx.body = { error: error.message }
      return
    }
    throw error
  }

  // Chat SDK handles JWT auth, Bot Framework routing, and message delivery
  const chat = new Chat({
    userName: "Budibase",
    adapters: {
      teams: createTeamsAdapter({
        appId: integration.appId,
        appPassword: integration.appPassword,
        appTenantId: integration.tenantId,
        appType: integration.tenantId ? "SingleTenant" : "MultiTenant",
      }),
    },
    state: teamsState,
    logger: "silent",
  })

  const handler = createTeamsMessageHandler({
    workspaceId: prodAppId,
    chatAppId,
    agentId,
    idleTimeoutMinutes,
  })
  chat.onNewMention(handler)
  chat.onSubscribedMessage(handler)
  chat.onNewMessage(/./, handler)

  const rawBody = await readRawBody(ctx.req)
  const request = rawBodyToRequest(ctx, rawBody)
  const response = await chat.webhooks.teams(request)
  await responseToKoa(ctx, response)
}

import { context, HTTPError } from "@budibase/backend-core"
import { DiscordCommands } from "@budibase/shared-core"
import type {
  ChatConversation,
  ChatConversationChannel,
  Ctx,
  DiscordConversationScope,
  DiscordInteraction,
} from "@budibase/types"
import { Chat, type SlashCommandEvent } from "chat"
import { createDiscordAdapter } from "@chat-adapter/discord"
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
import { discordState } from "./chatState"

const DISCORD_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

// --- Exported helpers (used by tests) ---

export const isDiscordConversationExpired = ({
  chat,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chat: ChatConversation
  idleTimeoutMs: number
  nowMs?: number
}) => isConversationExpired({ chat, idleTimeoutMs, nowMs })

export const getDiscordIdleTimeoutMs = () => {
  const configured = Number(
    process.env.DISCORD_CONVERSATION_IDLE_TIMEOUT_MINUTES
  )
  const minutes =
    Number.isFinite(configured) && configured > 0 ? configured : 45
  return minutes * 60 * 1000
}

export const matchesDiscordConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: DiscordConversationScope
}) => {
  const ch = chat.channel
  if (
    chat.chatAppId !== scope.chatAppId ||
    chat.agentId !== scope.agentId ||
    ch?.provider !== "discord" ||
    ch?.channelId !== scope.channelId ||
    (ch?.threadId || undefined) !== scope.threadId
  ) {
    return false
  }
  if (ch?.externalUserId) {
    return ch.externalUserId === scope.externalUserId
  }
  return chat.userId === `discord:${scope.externalUserId}`
}

export const pickDiscordConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: DiscordConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesDiscordConversationScope,
    nowMs,
  })

const getDiscordErrorMessage = (error: unknown) =>
  error instanceof HTTPError ? error.message : DISCORD_FALLBACK_ERROR_MESSAGE

const toDiscordInteraction = (
  value: unknown
): DiscordInteraction | undefined => {
  if (!value || typeof value !== "object") {
    return undefined
  }
  return value as DiscordInteraction
}

// --- Slash command processing ---

const handleDiscordSlashCommand = async ({
  event,
  command,
  workspaceId,
  chatAppId,
  agentId,
  idleTimeoutMinutes,
}: {
  event: SlashCommandEvent
  command: "ask" | "new"
  workspaceId: string
  chatAppId: string
  agentId: string
  idleTimeoutMinutes?: number
}) => {
  const interaction = toDiscordInteraction(event.raw)
  const channelId = interaction?.channel_id
  if (!channelId) {
    await event.channel.post("Missing Discord channel information.")
    return
  }

  const userId = event.user.userId?.trim()
  if (!userId) {
    await event.channel.post("Missing Discord user information.")
    return
  }
  const displayName = event.user.fullName || event.user.userName
  const content = event.text?.trim() || ""
  const threadId = interaction?.thread_id

  const channel: ChatConversationChannel = {
    provider: "discord",
    channelId,
    threadId,
    guildId: interaction?.guild_id,
    externalUserId: userId,
    externalUserName: displayName,
  }

  const scope: DiscordConversationScope = {
    chatAppId,
    agentId,
    channelId,
    threadId,
    externalUserId: userId,
  }

  await handleChatMessage({
    reply: async (text: string) => {
      await event.channel.post(text)
    },
    workspaceId,
    chatAppId,
    agentId,
    provider: "discord",
    command,
    content,
    user: { externalUserId: userId, displayName },
    channel,
    scope,
    idleTimeoutMinutes,
  })
}

// --- Main webhook handler ---

export async function discordWebhook(
  ctx: Ctx<unknown, unknown, { instance: string; chatAppId: string; agentId: string }>
) {
  const prodAppId = ensureProdWorkspaceWebhookRoute({
    ctx,
    instance: ctx.params.instance,
    providerName: "Discord",
  })
  if (!prodAppId) {
    return
  }

  let publicKey: string
  let botToken: string
  let applicationId: string
  let idleTimeoutMinutes: number | undefined
  try {
    const result = await context.doInWorkspaceContext(prodAppId, async () => {
      const agent = await sdk.ai.agents.getOrThrow(ctx.params.agentId)
      const integration =
        sdk.ai.deployments.discord.validateDiscordIntegration(agent)
      const pk = agent.discordIntegration?.publicKey?.trim()
      if (!pk) {
        throw new HTTPError(
          "Discord public key is not configured for this agent",
          400
        )
      }
      return {
        ...integration,
        publicKey: pk,
        idleTimeoutMinutes: agent.discordIntegration?.idleTimeoutMinutes,
      }
    })
    publicKey = result.publicKey
    botToken = result.botToken
    applicationId = result.applicationId
    idleTimeoutMinutes = result.idleTimeoutMinutes
  } catch (error) {
    if (error instanceof HTTPError) {
      ctx.status = error.status
      ctx.body = { error: error.message }
      return
    }
    throw error
  }

  // Read raw body before any parsing — Chat SDK needs it for signature verification
  const rawBody = await readRawBody(ctx.req)

  const chat = new Chat({
    userName: "Budibase",
    adapters: {
      discord: createDiscordAdapter({ applicationId, publicKey, botToken }),
    },
    state: discordState,
    logger: "silent",
  })

  const runSlashCommand = async (
    command: "ask" | "new",
    event: SlashCommandEvent
  ) => {
    try {
      await handleDiscordSlashCommand({
        event,
        command,
        workspaceId: prodAppId,
        chatAppId: ctx.params.chatAppId,
        agentId: ctx.params.agentId,
        idleTimeoutMinutes,
      })
    } catch (error) {
      console.error("Discord webhook processing failed", error)
      try {
        await event.channel.post(getDiscordErrorMessage(error))
      } catch (responseError) {
        console.error("Failed to send Discord fallback response", responseError)
      }
    }
  }

  chat.onSlashCommand(`/${DiscordCommands.ASK}`, async event => {
    await runSlashCommand("ask", event)
  })
  chat.onSlashCommand(`/${DiscordCommands.NEW}`, async event => {
    await runSlashCommand("new", event)
  })

  const request = rawBodyToRequest(ctx, rawBody)
  const response = await chat.webhooks.discord(request)
  await responseToKoa(ctx, response)
}

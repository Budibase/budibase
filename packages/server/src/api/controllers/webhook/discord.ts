import fetch from "node-fetch"
import { context, HTTPError } from "@budibase/backend-core"
import { DiscordCommands } from "@budibase/shared-core"
import type {
  ChatConversation,
  ChatConversationChannel,
  Ctx,
  DiscordCommand,
  DiscordConversationScope,
  DiscordInteraction,
  DiscordInteractionComponent,
} from "@budibase/types"
import { Chat } from "chat"
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
  tryParseJson,
} from "./koaToRequest"
import { handleChatMessage } from "./chatHandler"
import { discordState } from "./chatState"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const DISCORD_INTERACTION_APPLICATION_COMMAND = 2
const DISCORD_INTERACTION_MODAL_SUBMIT = 5
const DISCORD_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

// --- Exported helpers (used by tests) ---

const extractModalComponentValues = (
  components: DiscordInteractionComponent[] = []
): string[] =>
  components.flatMap(c => [
    ...(typeof c.value === "string" && c.value.trim() ? [c.value.trim()] : []),
    ...extractModalComponentValues(c.components || []),
  ])

export const extractDiscordContent = (interaction: DiscordInteraction) => {
  const optionValues = (interaction.data?.options || [])
    .map(o => (o.value != null ? String(o.value) : ""))
    .filter(Boolean)
  const modalValues = extractModalComponentValues(interaction.data?.components)
  return [...optionValues, ...modalValues].join(" ").trim()
}

export const getDiscordInteractionCommand = (
  interaction: DiscordInteraction
): DiscordCommand => {
  const rawName = interaction.data?.name?.trim().toLowerCase() || ""
  if (rawName === DiscordCommands.NEW) return DiscordCommands.NEW
  if (rawName === DiscordCommands.ASK) return DiscordCommands.ASK
  if (interaction.type === DISCORD_INTERACTION_MODAL_SUBMIT || !rawName) {
    return DiscordCommands.ASK
  }
  return DiscordCommands.UNSUPPORTED
}

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

// --- Discord response helpers ---

const sendDiscordRequest = async ({
  method,
  url,
  content,
}: {
  method: "PATCH" | "POST"
  url: string
  content: string
}) => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, allowed_mentions: { parse: [] } }),
  })
  if (!response.ok) {
    throw new Error(
      `Discord followup failed (${response.status}): ${response.statusText}`
    )
  }
}

const sendDiscordResponse = async (
  applicationId: string,
  token: string,
  content: string
) => {
  const maxLength = 2000
  const text = content || "No response generated."
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength))
  }

  await sendDiscordRequest({
    method: "PATCH",
    url: `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}/messages/@original`,
    content: chunks[0] || "No response generated.",
  })
  for (const chunk of chunks.slice(1)) {
    await sendDiscordRequest({
      method: "POST",
      url: `${DISCORD_API_BASE_URL}/webhooks/${applicationId}/${token}`,
      content: chunk,
    })
  }
}

const getDiscordErrorMessage = (error: unknown) =>
  error instanceof HTTPError ? error.message : DISCORD_FALLBACK_ERROR_MESSAGE

const toDiscordInteraction = (
  value: unknown
): DiscordInteraction | undefined => {
  if (!value || typeof value !== "object") {
    return undefined
  }
  const interaction = value as {
    type?: unknown
    application_id?: unknown
    token?: unknown
  }
  if (
    typeof interaction.type !== "number" ||
    typeof interaction.application_id !== "string" ||
    typeof interaction.token !== "string"
  ) {
    return undefined
  }
  return value as DiscordInteraction
}

// --- Interaction processing ---

const handleDiscordInteraction = async ({
  interaction,
  workspaceId,
  chatAppId,
  agentId,
  idleTimeoutMinutes,
}: {
  interaction: DiscordInteraction
  workspaceId: string
  chatAppId: string
  agentId: string
  idleTimeoutMinutes?: number
}) => {
  const { application_id, token } = interaction
  const reply = (text: string) =>
    sendDiscordResponse(application_id, token, text)

  const command = getDiscordInteractionCommand(interaction)
  if (command === DiscordCommands.UNSUPPORTED) {
    await reply(
      `Use /ask with a message to chat, or /new to start a new conversation.`
    )
    return
  }

  const user = interaction.member?.user || interaction.user
  const userId = user?.id || "unknown"
  const displayName = user?.global_name || user?.username
  const channelId = interaction.channel_id
  if (!channelId) {
    await reply("Missing Discord channel information.")
    return
  }

  const content = extractDiscordContent(interaction)
  const threadId = interaction.thread_id

  const channel: ChatConversationChannel = {
    provider: "discord",
    channelId,
    threadId,
    guildId: interaction.guild_id,
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
      await reply(text)
    },
    workspaceId,
    chatAppId,
    agentId,
    provider: "discord",
    command: command === DiscordCommands.NEW ? "new" : "ask",
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

  const request = rawBodyToRequest(ctx, rawBody)
  const response = await chat.webhooks.discord(request)
  await responseToKoa(ctx, response)
  if (!response.ok) {
    return
  }

  // Chat SDK returns deferred response for ApplicationCommand/ModalSubmit.
  // We process the interaction in the background.
  const interaction = toDiscordInteraction(tryParseJson(rawBody))
  if (!interaction) {
    return
  }
  if (
    interaction?.type === DISCORD_INTERACTION_APPLICATION_COMMAND ||
    interaction?.type === DISCORD_INTERACTION_MODAL_SUBMIT
  ) {
    setImmediate(async () => {
      try {
        await handleDiscordInteraction({
          interaction,
          workspaceId: prodAppId,
          chatAppId: ctx.params.chatAppId,
          agentId: ctx.params.agentId,
          idleTimeoutMinutes,
        })
      } catch (error) {
        console.error("Discord webhook processing failed", error)
        try {
          await sendDiscordResponse(
            interaction.application_id,
            interaction.token,
            getDiscordErrorMessage(error)
          )
        } catch (responseError) {
          console.error(
            "Failed to send Discord fallback response",
            responseError
          )
        }
      }
    })
  }
}

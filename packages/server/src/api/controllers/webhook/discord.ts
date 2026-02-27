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
import { pickLatestConversation } from "./utils"
import { handleChatMessage } from "./chatHandler"
import { discordState } from "./chatState"
import { runChatWebhook } from "./runChatWebhook"

const DISCORD_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

// --- Exported helpers (used by tests) ---

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
  ctx: Ctx<
    unknown,
    unknown,
    { instance: string; chatAppId: string; agentId: string }
  >
) {
  await runChatWebhook({
    ctx,
    providerName: "Discord",
    createWebhookHandler: async ({ workspaceId, chatAppId, agentId }) => {
      const { publicKey, botToken, applicationId, idleTimeoutMinutes } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
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
            workspaceId,
            chatAppId,
            agentId,
            idleTimeoutMinutes,
          })
        } catch (error) {
          console.error("Discord webhook processing failed", error)
          try {
            await event.channel.post(getDiscordErrorMessage(error))
          } catch (responseError) {
            console.error(
              "Failed to send Discord fallback response",
              responseError
            )
          }
        }
      }

      chat.onSlashCommand(`/${DiscordCommands.ASK}`, async event => {
        await runSlashCommand("ask", event)
      })
      chat.onSlashCommand(`/${DiscordCommands.NEW}`, async event => {
        await runSlashCommand("new", event)
      })

      return request => chat.webhooks.discord(request)
    },
  })
}

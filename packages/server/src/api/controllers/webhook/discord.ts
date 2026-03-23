import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands, SupportedChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationChannel,
  type Ctx,
  type DiscordConversationScope,
  type DiscordInteraction,
} from "@budibase/types"
import { Chat } from "chat"
import { createDiscordAdapter } from "@chat-adapter/discord"
import sdk from "../../../sdk"
import { pickLatestConversation } from "./utils"
import { handleChatMessage } from "./chatHandler"
import { getDiscordState } from "./chatState"
import { postLinkPromptPrivately } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"

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
    ch?.provider !== AgentChannelProvider.DISCORD ||
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
        state: await getDiscordState(),
        logger: "silent",
      })

      chat.onSlashCommand(
        SupportedChatCommands.map(command => `/${command}`),
        async event => {
          const interaction = event.raw as DiscordInteraction
          const normalizedCommand = event.command
            ?.replace(/^\//, "")
            .toLowerCase()
          const command =
            normalizedCommand === ChatCommands.NEW
              ? ChatCommands.NEW
              : normalizedCommand === ChatCommands.LINK
                ? ChatCommands.LINK
                : ChatCommands.ASK
          const channelId = interaction.channel_id
          if (!channelId) return

          const userId = event.user.userId
          const displayName =
            event.user.fullName || event.user.userName || userId || ""

          const channel: ChatConversationChannel = {
            provider: AgentChannelProvider.DISCORD,
            channelId,
            threadId: interaction.thread_id,
            guildId: interaction.guild_id,
            externalUserId: userId,
            externalUserName: displayName,
          }

          const scope: DiscordConversationScope = {
            chatAppId,
            agentId,
            channelId,
            threadId: interaction.thread_id,
            externalUserId: userId || "",
          }

          try {
            await handleChatMessage({
              reply: async (text: string) => {
                await event.channel.post(text)
              },
              replyLinkPrompt: async message => {
                const delivery = await postLinkPromptPrivately({
                  target: event.channel,
                  user: event.user,
                  text: message.text,
                  linkUrl: message.linkUrl,
                })
                if (delivery.usedDirectMessageFallback) {
                  try {
                    await event.channel.post(
                      "I sent you a DM with your Budibase link."
                    )
                  } catch (error) {
                    console.error(
                      "Failed to post Discord link acknowledgement",
                      error
                    )
                  }
                  return
                }
                if (!delivery.delivered) {
                  await event.channel.post(
                    "I couldn't send a private Budibase link. Please try again in a direct message."
                  )
                }
              },
              workspaceId,
              chatAppId,
              agentId,
              provider: AgentChannelProvider.DISCORD,
              command,
              content: event.text || "",
              user: { externalUserId: userId || "", displayName },
              channel,
              scope,
              idleTimeoutMinutes,
            })
          } catch (error) {
            console.error("Discord webhook processing failed", error)
            const msg =
              error instanceof HTTPError
                ? error.message
                : "Sorry, something went wrong while processing your request."
            try {
              await event.channel.post(msg)
            } catch {
              throw new Error("Failed to send error to discord")
            }
          }
        }
      )

      return request => chat.webhooks.discord(request)
    },
  })
}

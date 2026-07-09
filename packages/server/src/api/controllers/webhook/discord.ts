import { context, features, HTTPError } from "@budibase/backend-core"
import { ChatCommands, SupportedChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationChannel,
  type Ctx,
  type DiscordConversationScope,
  type DiscordInteraction,
  type EscalationNotificationDoc,
  FeatureFlag,
} from "@budibase/types"
import { Chat, type ActionEvent } from "chat"
import { createDiscordAdapter } from "@chat-adapter/discord"
import sdk from "../../../sdk"
import { escalationProcessor } from "../../../escalation/processor"
import { pickLatestConversation, resolveEscalationWorkspaceId } from "./utils"
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
      const {
        publicKey,
        botToken,
        applicationId,
        idleTimeoutMinutes,
        channelEnabled,
        requireUserLink,
      } = await context.doInWorkspaceContext(workspaceId, async () => {
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
          requireUserLink: agent.discordIntegration?.requireUserLink,
          channelEnabled:
            !!agent.discordIntegration?.interactionsEndpointUrl?.trim(),
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
        SupportedChatCommands.map((command: string) => `/${command}`),
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
              channelEnabled,
              command,
              content: event.text || "",
              user: { externalUserId: userId || "", displayName },
              channel,
              scope,
              idleTimeoutMinutes,
              requireUserLink,
            })
          } catch (error) {
            console.error("Discord webhook processing failed", error)
            const msg =
              error instanceof Error
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

      chat.onAction(async (event: ActionEvent) => {
        const customId = event.actionId
        const isApprove = customId.startsWith("esc_a:")
        const isReject = customId.startsWith("esc_r:")
        if (!isApprove && !isReject) {
          return
        }

        // custom_id format: esc_a:<shortNotifId>:<appId>
        // shortNotifId is the notifDocId without the escalation_notification_
        // prefix. The trailing appId is ignored - the workspace comes from the
        // trusted handler context, never the user-controlled interaction payload.
        const parts = customId.split(":")
        const shortNotifId = parts[1]
        if (!shortNotifId) {
          console.error(
            "Discord escalation action: invalid custom_id",
            customId
          )
          return
        }
        const notificationDocId = `escalation_notification_${shortNotifId}`

        const discordResponse = {
          actionId: isApprove ? "escalation_approve" : "escalation_reject",
          user: event.user,
          messageId: event.messageId,
          threadId: event.threadId,
        }

        const appId = await resolveEscalationWorkspaceId(
          workspaceId,
          notificationDocId
        )
        if (!appId) {
          console.warn("Discord escalation action: notification not found", {
            workspaceId,
            notificationDocId,
          })
          return
        }

        try {
          const result = await context.doInContext(appId, async () => {
            if (!(await features.isEnabled(FeatureFlag.ESCALATION))) {
              return { status: "closed" as const }
            }
            const db = context.getWorkspaceDB()
            const notifDoc =
              await db.tryGet<EscalationNotificationDoc>(notificationDocId)
            if (!notifDoc) {
              throw new Error(`Notification doc ${notificationDocId} not found`)
            }
            return sdk.escalations.respond(
              notifDoc.escalationId,
              notificationDocId,
              discordResponse,
              (id, response) => escalationProcessor.resolve(id, response)
            )
          })
          if (event.thread) {
            const msg =
              result.status === "closed"
                ? "Escalation already closed."
                : "Response recorded."
            await event.thread.post(msg)
          }
        } catch (error) {
          console.error(
            "Discord escalation action: failed to record response",
            {
              notificationDocId,
              workspaceId,
              message: error instanceof Error ? error.message : String(error),
            }
          )
          if (event.thread) {
            await event.thread.post("Failed to record response.")
          }
        }
      })

      return request => chat.webhooks.discord(request)
    },
  })
}

import { context, HTTPError } from "@budibase/backend-core"
import { DiscordCommands } from "@budibase/shared-core"
import type {
  ChatConversation,
  ChatConversationChannel,
  Ctx,
  DiscordConversationScope,
  DiscordInteraction,
  DiscordInteractionOption,
} from "@budibase/types"
import { Chat } from "chat"
import { createDiscordAdapter } from "@chat-adapter/discord"
import sdk from "../../../sdk"
import { pickLatestConversation } from "./utils"
import { handleChatMessage } from "./chatHandler"
import { getDiscordState } from "./chatState"
import { runChatWebhook } from "./runChatWebhook"

const DISCORD_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."
const DISCORD_APPLICATION_COMMAND_TYPE = 2
const DISCORD_API_BASE = "https://discord.com/api/v10"
const DISCORD_MAX_CONTENT_LENGTH = 2000

interface RecursiveDiscordInteractionOption extends DiscordInteractionOption {
  options?: RecursiveDiscordInteractionOption[]
}

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

export const extractDiscordOptionText = (
  options?: RecursiveDiscordInteractionOption[]
) => {
  const queue: unknown[] = [...(options || [])]
  const values: string[] = []

  while (queue.length) {
    const current = queue.shift()
    if (!current || typeof current !== "object") {
      continue
    }

    const option = current as RecursiveDiscordInteractionOption

    if (Array.isArray(option.options)) {
      queue.push(...option.options)
    }
    if (option.value != null) {
      values.push(`${option.value}`)
    }
  }

  return values.join(" ").trim()
}

export const getDiscordApplicationCommand = (
  interaction?: DiscordInteraction
): "ask" | "new" | undefined => {
  if (!interaction || interaction.type !== DISCORD_APPLICATION_COMMAND_TYPE) {
    return
  }

  const commandName = interaction.data?.name?.toLowerCase()
  if (
    commandName === DiscordCommands.ASK ||
    commandName === DiscordCommands.NEW
  ) {
    return commandName
  }
}

const truncateDiscordContent = (text: string) => {
  if (text.length <= DISCORD_MAX_CONTENT_LENGTH) {
    return text
  }
  return `${text.slice(0, DISCORD_MAX_CONTENT_LENGTH - 3)}...`
}

const callDiscordInteractionWebhook = async ({
  path,
  method,
  content,
}: {
  path: string
  method: "PATCH" | "POST"
  content: string
}) => {
  const response = await fetch(`${DISCORD_API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: truncateDiscordContent(content),
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Discord interaction webhook failed (${response.status}): ${body}`
    )
  }
}

const createDiscordReply = ({
  applicationId,
  interactionToken,
  fallbackReply,
}: {
  applicationId: string
  interactionToken: string
  fallbackReply: (text: string) => Promise<void>
}) => {
  let hasResponded = false

  return async (text: string) => {
    const content = truncateDiscordContent(text)
    try {
      if (!hasResponded) {
        hasResponded = true
        await callDiscordInteractionWebhook({
          method: "PATCH",
          path: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
          content,
        })
        return
      }

      await callDiscordInteractionWebhook({
        method: "POST",
        path: `/webhooks/${applicationId}/${interactionToken}`,
        content,
      })
    } catch (error) {
      console.error("Failed to reply via Discord interaction webhook", error)
      await fallbackReply(content)
    }
  }
}

const parseDiscordInteractionRequest = async (request: Request) => {
  try {
    return toDiscordInteraction(await request.clone().json())
  } catch {
    return undefined
  }
}

const handleDiscordCommand = async ({
  interaction,
  command,
  content,
  userId,
  displayName,
  reply,
  workspaceId,
  chatAppId,
  agentId,
  idleTimeoutMinutes,
}: {
  interaction: DiscordInteraction
  command: "ask" | "new"
  content: string
  userId: string
  displayName: string
  reply: (text: string) => Promise<void>
  workspaceId: string
  chatAppId: string
  agentId: string
  idleTimeoutMinutes?: number
}) => {
  const channelId = interaction.channel_id
  if (!channelId) {
    await reply("Missing Discord channel information.")
    return
  }
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
    reply,
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
        state: await getDiscordState(),
        logger: "silent",
      })
      const adapter = chat.getAdapter("discord")

      return async request => {
        const interaction = await parseDiscordInteractionRequest(request)
        const response = await chat.webhooks.discord(request)

        const command = getDiscordApplicationCommand(interaction)
        const channelId = interaction?.channel_id?.trim()
        const user = interaction?.member?.user || interaction?.user
        const userId = user?.id?.trim()

        if (
          !command ||
          !interaction ||
          response.status >= 400 ||
          !channelId ||
          !userId
        ) {
          return response
        }

        const content = extractDiscordOptionText(
          interaction.data?.options as RecursiveDiscordInteractionOption[]
        )
        const displayName = user?.global_name || user?.username || userId
        const guildId = interaction.guild_id || "@me"
        const replyThreadId = adapter.encodeThreadId({
          guildId,
          channelId,
        })

        const processDiscordCommand = async () => {
          const fallbackReply = async (text: string) => {
            await adapter.postMessage(replyThreadId, text)
          }
          const reply = createDiscordReply({
            applicationId,
            interactionToken: interaction.token,
            fallbackReply,
          })

          try {
            await handleDiscordCommand({
              interaction,
              command,
              content,
              userId,
              displayName,
              reply,
              workspaceId,
              chatAppId,
              agentId,
              idleTimeoutMinutes,
            })
          } catch (error) {
            console.error("Discord webhook processing failed", error)
            try {
              await reply(getDiscordErrorMessage(error))
            } catch (responseError) {
              console.error(
                "Failed to send Discord fallback response",
                responseError
              )
            }
          }
        }

        processDiscordCommand().catch(error => {
          console.error("Unexpected Discord command task failure", error)
        })

        return response
      }
    },
  })
}

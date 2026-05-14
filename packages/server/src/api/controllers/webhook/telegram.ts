import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands, type SupportedChatCommand } from "@budibase/shared-core"
import type { TelegramMessage } from "@chat-adapter/telegram"
import { createTelegramAdapter } from "@chat-adapter/telegram"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationChannel,
  type Ctx,
  type TelegramConversationScope,
} from "@budibase/types"
import { Chat, type Message, type Thread } from "chat"
import sdk from "../../../sdk"
import { handleChatMessage } from "./chatHandler"
import { getTelegramState } from "./chatState"
import { postLinkPromptPrivately, PrivatePostTarget } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"
import { pickLatestConversation } from "./utils"

const TELEGRAM_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

export const extractTelegramCommand = (
  text: string
): { command: SupportedChatCommand; content: string } => {
  const trimmed = text.trim()
  const match = trimmed.match(/^\/(\w+)(?:@[\w]+)?(?:\s(.*))?$/s)
  if (!match) {
    return { command: ChatCommands.ASK, content: trimmed }
  }

  const name = match[1].toLowerCase()
  const rest = (match[2] ?? "").trim()

  if (name === ChatCommands.LINK) {
    return { command: ChatCommands.LINK, content: rest }
  }
  if (name === ChatCommands.NEW) {
    return { command: ChatCommands.NEW, content: rest }
  }
  if (name === ChatCommands.ASK) {
    return { command: ChatCommands.ASK, content: rest }
  }

  return { command: ChatCommands.ASK, content: trimmed }
}

export const matchesTelegramConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: TelegramConversationScope
}) => {
  const ch = chat.channel
  return !!(
    chat.chatAppId === scope.chatAppId &&
    chat.agentId === scope.agentId &&
    ch?.provider === AgentChannelProvider.TELEGRAM &&
    ch?.channelId === scope.channelId &&
    (ch?.threadId || undefined) === scope.threadId &&
    ch?.externalUserId === scope.externalUserId
  )
}

export const pickTelegramConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: TelegramConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesTelegramConversationScope,
    nowMs,
  })

type TelegramReplyTarget = PrivatePostTarget

type TelegramInput = {
  target: TelegramReplyTarget
  privateTarget: TelegramReplyTarget
  author: Message["author"]
  command: SupportedChatCommand
  content: string
  channelId: string
  externalUserId: string
  threadId?: string
}

const createTelegramInputHandler = ({
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
  return async ({
    target,
    privateTarget,
    author,
    command,
    content,
    channelId,
    externalUserId,
    threadId,
  }: TelegramInput) => {
    const displayName = author.fullName || author.userName || externalUserId

    const channel: ChatConversationChannel = {
      provider: AgentChannelProvider.TELEGRAM,
      channelId,
      threadId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: TelegramConversationScope = {
      chatAppId,
      agentId,
      channelId,
      threadId,
      externalUserId,
    }

    try {
      await handleChatMessage({
        reply: async text => {
          await target.post(text)
        },
        replyLinkPrompt: async prompt => {
          const delivery = await postLinkPromptPrivately({
            target: privateTarget,
            user: author,
            text: prompt.text,
            linkUrl: prompt.linkUrl,
            renderMode: "plainText",
          })
          if (delivery.usedDirectMessageFallback) {
            await target.post(
              "I sent you a private message with your Budibase link."
            )
            return
          }
          if (!delivery.delivered) {
            await target.post(
              "I couldn't send a private Budibase link. Please try again in a direct message."
            )
          }
        },
        workspaceId,
        chatAppId,
        agentId,
        provider: AgentChannelProvider.TELEGRAM,
        channelEnabled,
        command,
        content,
        user: { externalUserId, displayName },
        channel,
        scope,
        idleTimeoutMinutes,
      })
    } catch (error) {
      console.error("Telegram webhook processing failed", error)
      const msg =
        error instanceof HTTPError
          ? error.message
          : TELEGRAM_FALLBACK_ERROR_MESSAGE
      await target.post(msg)
    }
  }
}

const createTelegramMessageHandler = (
  handleTelegramInput: ReturnType<typeof createTelegramInputHandler>
) => {
  return async (thread: Thread, message: Message) => {
    const raw = message.raw as TelegramMessage | undefined
    const text = message.text?.trim() || ""
    if (!text) {
      await thread.post("Send a message to continue.")
      return
    }

    const externalUserId =
      message.author.userId ||
      (raw?.from?.id != null ? String(raw.from.id) : "")

    if (!externalUserId) {
      await thread.post("Missing Telegram user metadata.")
      return
    }

    const { command, content } = extractTelegramCommand(text)

    const channelId =
      raw?.chat?.id != null ? String(raw.chat.id) : thread.channelId || ""
    const threadId =
      raw?.message_thread_id != null ? String(raw.message_thread_id) : undefined

    await handleTelegramInput({
      target: thread as TelegramReplyTarget,
      privateTarget: (thread.channel || thread) as TelegramReplyTarget,
      author: message.author,
      command,
      content,
      channelId,
      threadId,
      externalUserId,
    })
  }
}

export async function telegramWebhook(
  ctx: Ctx<
    unknown,
    unknown,
    { instance: string; chatAppId: string; agentId: string }
  >
) {
  await runChatWebhook({
    ctx,
    providerName: "Telegram",
    createWebhookHandler: async ({ workspaceId, chatAppId, agentId }) => {
      const { integration, idleTimeoutMinutes, channelEnabled } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
          return {
            integration:
              sdk.ai.deployments.telegram.validateTelegramIntegration(agent),
            idleTimeoutMinutes: agent.telegramIntegration?.idleTimeoutMinutes,
            channelEnabled:
              !!agent.telegramIntegration?.messagingEndpointUrl?.trim(),
          }
        })

      const state = await getTelegramState()
      if (!state) {
        throw new Error("Telegram state adapter is required")
      }

      const chat = new Chat({
        userName: integration.botUserName || "Budibase",
        adapters: {
          telegram: createTelegramAdapter({
            botToken: integration.botToken,
            secretToken: integration.webhookSecretToken,
            userName: integration.botUserName,
            mode: "webhook",
          }),
        },
        state,
        logger: "silent",
      })

      const handleTelegramInput = createTelegramInputHandler({
        workspaceId,
        chatAppId,
        agentId,
        channelEnabled,
        idleTimeoutMinutes,
      })
      const handler = createTelegramMessageHandler(handleTelegramInput)

      chat.onNewMention(handler)
      chat.onSubscribedMessage(handler)
      chat.onNewMessage(/./, async (thread, message) => {
        const raw = message.raw as TelegramMessage | undefined
        if (message.isMention && raw?.chat?.type !== "private") {
          return
        }
        if (raw?.chat?.type === "private" && !message.isMention) {
          await handler(thread, message)
        }
      })
      chat.onNewMessage(/^\//, async (thread, message) => {
        const raw = message.raw as TelegramMessage | undefined
        if (raw?.chat?.type === "private") {
          return
        }
        await handler(thread, message)
      })

      return request => chat.webhooks.telegram(request)
    },
  })
}

import { context, HTTPError } from "@budibase/backend-core"
import type { SlackEvent } from "@chat-adapter/slack"
import { createSlackAdapter } from "@chat-adapter/slack"
import type {
  ChatConversation,
  ChatConversationChannel,
  Ctx,
  SlackConversationScope,
} from "@budibase/types"
import { Chat, type Message, type Thread } from "chat"
import sdk from "../../../sdk"
import { handleChatMessage } from "./chatHandler"
import { getSlackState } from "./chatState"
import { runChatWebhook } from "./runChatWebhook"
import { pickLatestConversation } from "./utils"

const SLACK_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

export const isSlackDirectMessage = (event?: SlackEvent) =>
  event?.channel_type === "im" || !!event?.channel?.startsWith("D")

export const stripSlackMentions = (text: string) =>
  text
    .replace(/<@[A-Z0-9]+(?:\|[^>]+)?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

export const extractSlackMessageContent = (text?: string) =>
  stripSlackMentions(text || "")

export const matchesSlackConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: SlackConversationScope
}) => {
  const ch = chat.channel
  return !!(
    chat.chatAppId === scope.chatAppId &&
    chat.agentId === scope.agentId &&
    ch?.provider === "slack" &&
    ch?.channelId === scope.channelId &&
    (ch?.threadId || undefined) === scope.threadId &&
    ch?.externalUserId === scope.externalUserId
  )
}

export const pickSlackConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: SlackConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesSlackConversationScope,
    nowMs,
  })

const createSlackMessageHandler = ({
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
    const raw = message.raw as SlackEvent | undefined
    const content = extractSlackMessageContent(message.text || "")
    if (!content) {
      await thread.post("Send a message to continue.")
      return
    }

    const channelId = raw?.channel?.trim() || thread.channelId?.trim() || ""
    const threadId = thread.id?.trim()
    const externalUserId = raw?.user?.trim() || message.author.userId
    const displayName =
      message.author.fullName || message.author.userName || externalUserId
    const teamId = raw?.team_id?.trim() || raw?.team?.trim()

    if (!channelId) {
      await thread.post("Missing Slack channel information.")
      return
    }
    if (!externalUserId) {
      await thread.post("Missing Slack user information.")
      return
    }

    const channel: ChatConversationChannel = {
      provider: "slack",
      channelId,
      threadId: threadId || undefined,
      teamId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: SlackConversationScope = {
      chatAppId,
      agentId,
      channelId,
      threadId: threadId || undefined,
      externalUserId,
    }

    try {
      await handleChatMessage({
        reply: async (text: string) => {
          await thread.post(text)
        },
        workspaceId,
        chatAppId,
        agentId,
        provider: "slack",
        command: "ask",
        content,
        user: { externalUserId, displayName },
        channel,
        scope,
        idleTimeoutMinutes,
      })
    } catch (error) {
      console.error("Slack webhook processing failed", error)
      const msg =
        error instanceof HTTPError
          ? error.message
          : SLACK_FALLBACK_ERROR_MESSAGE
      await thread.post(msg)
    }
  }
}

export async function slackWebhook(
  ctx: Ctx<
    unknown,
    unknown,
    { instance: string; chatAppId: string; agentId: string }
  >
) {
  await runChatWebhook({
    ctx,
    providerName: "Slack",
    createWebhookHandler: async ({ workspaceId, chatAppId, agentId }) => {
      const { integration, idleTimeoutMinutes } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
          return {
            integration:
              sdk.ai.deployments.slack.validateSlackIntegration(agent),
            idleTimeoutMinutes: agent.slackIntegration?.idleTimeoutMinutes,
          }
        })

      const chat = new Chat({
        userName: "Budibase",
        adapters: {
          slack: createSlackAdapter({
            botToken: integration.botToken,
            signingSecret: integration.signingSecret,
          }),
        },
        state: await getSlackState(),
        logger: "silent",
      })

      const handler = createSlackMessageHandler({
        workspaceId,
        chatAppId,
        agentId,
        idleTimeoutMinutes,
      })
      chat.onNewMention(handler)
      chat.onSubscribedMessage(handler)
      chat.onNewMessage(/./, async (thread, message) => {
        const raw = message.raw as SlackEvent | undefined
        if (!isSlackDirectMessage(raw) || message.isMention) {
          return
        }
        await handler(thread, message)
      })

      return request => chat.webhooks.slack(request)
    },
  })
}

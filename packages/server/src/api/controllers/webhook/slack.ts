import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
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
import { postLinkPromptPrivately } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"
import { pickLatestConversation } from "./utils"

const SLACK_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

export const isSlackDirectMessage = (event?: SlackEvent) =>
  event?.channel_type === "im" || !!event?.channel?.startsWith("D")

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

type SlackReplyTarget = {
  post: (message: string) => Promise<unknown>
  postEphemeral: (
    user: string | Message["author"],
    message: unknown,
    options: { fallbackToDM: boolean }
  ) => Promise<unknown>
}

type SlackCommandRaw = SlackEvent & Record<string, string | undefined>

const handleSlackInput = async ({
  target,
  author,
  raw,
  command,
  content,
  workspaceId,
  chatAppId,
  agentId,
  idleTimeoutMinutes,
  channelId,
  threadId,
}: {
  target: SlackReplyTarget
  author: Message["author"]
  raw?: SlackCommandRaw
  command: typeof ChatCommands.ASK | typeof ChatCommands.LINK
  content: string
  workspaceId: string
  chatAppId: string
  agentId: string
  idleTimeoutMinutes?: number
  channelId?: string
  threadId?: string
}) => {
  const resolvedChannelId = raw?.channel?.trim() || channelId?.trim() || ""
  const externalUserId = raw?.user?.trim() || author.userId
  const displayName = author.fullName || author.userName || externalUserId
  const teamId = raw?.team_id?.trim() || raw?.team?.trim()

  if (!resolvedChannelId) {
    await target.post("Missing Slack channel information.")
    return
  }
  if (!externalUserId) {
    await target.post("Missing Slack user information.")
    return
  }

  const channel: ChatConversationChannel = {
    provider: "slack",
    channelId: resolvedChannelId,
    threadId,
    teamId,
    externalUserId,
    externalUserName: displayName,
  }

  const scope: SlackConversationScope = {
    chatAppId,
    agentId,
    channelId: resolvedChannelId,
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
          target,
          user: author,
          text: prompt.text,
          linkUrl: prompt.linkUrl,
        })
        if (!delivery.delivered) {
          await target.post(
            "I couldn't send a private Budibase link. Please try again in a direct message."
          )
        }
      },
      workspaceId,
      chatAppId,
      agentId,
      provider: "slack",
      command,
      content,
      user: { externalUserId, displayName },
      channel,
      scope,
      idleTimeoutMinutes,
    })
  } catch (error) {
    console.error("Slack webhook processing failed", error)
    const msg =
      error instanceof HTTPError ? error.message : SLACK_FALLBACK_ERROR_MESSAGE
    await target.post(msg)
  }
}

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
    const raw = message.raw as SlackCommandRaw | undefined
    if (!message.text) {
      await thread.post("Send a message to continue.")
      return
    }

    const threadId = thread.id
    await handleSlackInput({
      target: thread as SlackReplyTarget,
      author: message.author,
      raw,
      command: ChatCommands.ASK,
      content: message.text,
      workspaceId,
      chatAppId,
      agentId,
      idleTimeoutMinutes,
      channelId: thread.channelId,
      threadId: threadId || undefined,
    })
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

      chat.onSlashCommand(`/${ChatCommands.LINK}`, async event => {
        const raw = (event.raw || {}) as SlackCommandRaw
        await handleSlackInput({
          target: event.channel as SlackReplyTarget,
          author: {
            userId: event.user.userId || "",
            userName: event.user.userName,
            fullName: event.user.fullName,
          },
          raw: {
            ...raw,
            channel: raw.channel || raw.channel_id,
            user: raw.user || raw.user_id,
          },
          command: ChatCommands.LINK,
          content: event.text || "",
          workspaceId,
          chatAppId,
          agentId,
          idleTimeoutMinutes,
        })
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

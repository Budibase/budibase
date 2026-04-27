import { context, HTTPError } from "@budibase/backend-core"
import { ChatCommands } from "@budibase/shared-core"
import type { SlackEvent } from "@chat-adapter/slack"
import { createSlackAdapter } from "@chat-adapter/slack"
import {
  AgentChannelProvider,
  type ChatConversation,
  type ChatConversationChannel,
  type Ctx,
  type SlackConversationScope,
} from "@budibase/types"
import { Chat, type Message, type SlashCommandEvent, type Thread } from "chat"
import sdk from "../../../sdk"
import { handleChatMessage } from "./chatHandler"
import { getSlackState } from "./chatState"
import { postLinkPromptPrivately, PrivatePostTarget } from "./linkPrompt"
import { runChatWebhook } from "./runChatWebhook"
import { pickLatestConversation } from "./utils"

const SLACK_FALLBACK_ERROR_MESSAGE =
  "Sorry, something went wrong while processing your request."

export const isSlackDirectMessage = (event?: SlackEvent) =>
  event?.channel_type === "im" || !!event?.channel?.startsWith("D")

export const extractSlackMessageContent = (text?: string) =>
  (text || "")
    .replace(/<@[A-Z0-9]+(?:\|[^>]+)?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

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
    ch?.provider === AgentChannelProvider.SLACK &&
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

type SlackReplyTarget = PrivatePostTarget

type SlackCommand = typeof ChatCommands.ASK | typeof ChatCommands.LINK

type SlackInput = {
  target: SlackReplyTarget
  privateTarget: SlackReplyTarget
  author: Message["author"]
  command: SlackCommand
  content: string
  channelId: string
  externalUserId: string
  teamId?: string
  threadId?: string
}

const createSlackInputHandler = ({
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
    teamId,
    threadId,
  }: SlackInput) => {
    const displayName = author.fullName || author.userName || externalUserId

    const channel: ChatConversationChannel = {
      provider: AgentChannelProvider.SLACK,
      channelId,
      threadId,
      teamId,
      externalUserId,
      externalUserName: displayName,
    }

    const scope: SlackConversationScope = {
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
          })
          if (delivery.usedDirectMessageFallback) {
            await target.post("I sent you a DM with your Budibase link.")
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
        provider: AgentChannelProvider.SLACK,
        channelEnabled,
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
        error instanceof HTTPError
          ? error.message
          : SLACK_FALLBACK_ERROR_MESSAGE
      await target.post(msg)
    }
  }
}

const createSlackMessageHandler = (
  handleSlackInput: ReturnType<typeof createSlackInputHandler>
) => {
  return async (thread: Thread, message: Message) => {
    const raw = message.raw as SlackEvent | undefined
    const content = extractSlackMessageContent(raw?.text || message.text)
    if (!content) {
      await thread.post("Send a message to continue.")
      return
    }
    if (!message.author.userId) {
      await thread.post("Missing Slack message metadata.")
      return
    }

    await handleSlackInput({
      target: thread as SlackReplyTarget,
      privateTarget: thread.channel as SlackReplyTarget,
      author: message.author,
      command: ChatCommands.ASK,
      content,
      channelId: thread.channelId,
      threadId: thread.id || undefined,
      externalUserId: message.author.userId,
      teamId: raw?.team_id || raw?.team,
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
      const { integration, idleTimeoutMinutes, channelEnabled } =
        await context.doInWorkspaceContext(workspaceId, async () => {
          const agent = await sdk.ai.agents.getOrThrow(agentId)
          return {
            integration:
              sdk.ai.deployments.slack.validateSlackIntegration(agent),
            idleTimeoutMinutes: agent.slackIntegration?.idleTimeoutMinutes,
            channelEnabled:
              !!agent.slackIntegration?.messagingEndpointUrl?.trim(),
          }
        })

      const state = await getSlackState()
      if (!state) {
        throw new Error("Slack state adapter is required")
      }

      const chat = new Chat({
        userName: "Budibase",
        adapters: {
          slack: createSlackAdapter({
            botToken: integration.botToken,
            signingSecret: integration.signingSecret,
          }),
        },
        state,
        logger: "silent",
      })

      const handleSlackInput = createSlackInputHandler({
        workspaceId,
        chatAppId,
        agentId,
        channelEnabled,
        idleTimeoutMinutes,
      })
      const handler = createSlackMessageHandler(handleSlackInput)

      chat.onSlashCommand(
        `/${ChatCommands.LINK}`,
        async (event: SlashCommandEvent) => {
          const raw = event.raw as Record<string, string | undefined>
          if (!raw.channel_id || !event.user.userId) {
            await event.channel.post("Missing Slack command metadata.")
            return
          }
          await handleSlackInput({
            target: event.channel as SlackReplyTarget,
            privateTarget: event.channel as SlackReplyTarget,
            author: event.user,
            command: ChatCommands.LINK,
            content: event.text,
            channelId: raw.channel_id,
            externalUserId: event.user.userId,
            teamId: raw.team_id,
          })
        }
      )

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

import { configs, context, HTTPError } from "@budibase/backend-core"
import { WebClient } from "@slack/web-api"
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
import {
  Chat,
  type ActionEvent,
  type Message,
  type SlashCommandEvent,
  type Thread,
} from "chat"
import sdk from "../../../sdk"
import { escalationProcessor } from "../../../escalation/processor"
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
          const channelId = raw.channel_id
          if (!channelId || !event.user.userId) {
            await event.channel.post("Missing Slack command metadata.")
            return
          }
          await handleSlackInput({
            target: event.channel as SlackReplyTarget,
            privateTarget: event.channel as SlackReplyTarget,
            author: event.user,
            command: ChatCommands.LINK,
            content: event.text,
            channelId,
            externalUserId: event.user.userId,
            teamId: raw.team_id,
          })
        }
      )
      // Make these a set? "escalation_approve", "escalation_reject"
      // Could these be collated and fetched?
      // Can this be wrapped or seed from a global action list
      chat.onAction(
        ["escalation_approve", "escalation_reject"],
        async (event: ActionEvent) => {
          console.log("DEAN - ACTION RESP", {
            actionId: event.actionId,
            value: event.value,
            user: event.user,
            messageId: event.messageId,
            threadId: event.threadId,
            channel: (event.raw as any)?.channel,
          })
          let parsed: {
            escalationId: string
            notificationDocId: string
            appId: string
          }
          try {
            parsed = JSON.parse(event.value ?? "")
          } catch {
            console.error(
              "Escalation action: invalid button value",
              event.value
            )
            return
          }
          const { escalationId, notificationDocId, appId } = parsed

          const slackResponse = {
            actionId: event.actionId,
            user: event.user,
            messageId: event.messageId,
            threadId: event.threadId,
            channel: (event.raw as any)?.channel,
          }

          try {
            const result = await context.doInContext(appId, async () => {
              // We can respond with closed or
              return sdk.escalations.respond(
                escalationId,
                notificationDocId,
                slackResponse,
                (id, response) => escalationProcessor.resolve(id, response)
              )
            })
            // DEAN!
            // Can this response be wayyyyyy more complex right?
            // Could say (4/5) people confirmed, please respond by Wednesday
            // ALLLLSO, do we send a follow-up when its resolved??

            if (event.thread) {
              const msg =
                result.status === "closed"
                  ? "Escalation already closed."
                  : "Response recorded."
              await event.thread.post(msg)
            }
          } catch (error) {
            console.error("Escalation action: failed to record response", {
              escalationId,
              notificationDocId,
              appId,
              message: error instanceof Error ? error.message : String(error),
            })
            if (event.thread) {
              await event.thread.post("Failed to record response.")
            }
          }
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

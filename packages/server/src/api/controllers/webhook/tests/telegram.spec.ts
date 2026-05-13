import { ChatCommands } from "@budibase/shared-core"
import {
  AgentChannelProvider,
  type ChatConversation,
  type TelegramConversationScope,
} from "@budibase/types"
import {
  extractTelegramCommand,
  matchesTelegramConversationScope,
  pickTelegramConversation,
} from "../telegram"

const makeChat = (
  overrides: Partial<ChatConversation> = {}
): ChatConversation => ({
  _id: "chat-default",
  chatAppId: "chat-app-1",
  agentId: "agent-1",
  userId: "user-1",
  title: "Conversation",
  messages: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  channel: {
    provider: AgentChannelProvider.TELEGRAM,
    channelId: "999",
    threadId: "12",
    externalUserId: "42",
  },
  ...overrides,
})

describe("telegram webhook helpers", () => {
  it.each([
    ["/link", ChatCommands.LINK, ""],
    ["/link@mybot", ChatCommands.LINK, ""],
    ["/ask tell me more", ChatCommands.ASK, "tell me more"],
    ["/new", ChatCommands.NEW, ""],
    ["plain text", ChatCommands.ASK, "plain text"],
  ] as const)("parses telegram commands %s", (text, command, content) => {
    const parsed = extractTelegramCommand(text)
    expect(parsed.command).toEqual(command)
    expect(parsed.content).toEqual(content)
  })

  it("scopes conversations by chat app, agent, channel, optional thread, and user", () => {
    const scope: TelegramConversationScope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "999",
      threadId: "12",
      externalUserId: "42",
    }

    const channel = (overrides = {}) => ({
      provider: AgentChannelProvider.TELEGRAM,
      channelId: "999",
      threadId: "12",
      externalUserId: "42",
      ...overrides,
    })

    expect(
      matchesTelegramConversationScope({
        chat: makeChat({ channel: channel() }),
        scope,
      })
    ).toBe(true)

    expect(
      matchesTelegramConversationScope({
        chat: makeChat({ channel: channel({ channelId: "111" }) }),
        scope,
      })
    ).toBe(false)
  })

  it("picks the latest matching telegram conversation", () => {
    const scope: TelegramConversationScope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "999",
      externalUserId: "42",
    }

    const older = makeChat({
      _id: "older",
      updatedAt: "2026-01-01T00:00:00.000Z",
      channel: {
        provider: AgentChannelProvider.TELEGRAM,
        channelId: "999",
        externalUserId: "42",
        threadId: undefined,
      },
    })
    const newer = makeChat({
      _id: "newer",
      updatedAt: "2026-01-02T00:00:00.000Z",
      channel: {
        provider: AgentChannelProvider.TELEGRAM,
        channelId: "999",
        externalUserId: "42",
        threadId: undefined,
      },
    })

    const picked = pickTelegramConversation({
      chats: [older, newer],
      scope,
      idleTimeoutMs: 365 * 24 * 60 * 60 * 1000,
      nowMs: new Date("2026-01-15T12:00:00.000Z").getTime(),
    })

    expect(picked?._id).toEqual("newer")
  })
})

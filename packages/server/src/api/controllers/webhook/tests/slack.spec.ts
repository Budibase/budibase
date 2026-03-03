import type { ChatConversation, SlackConversationScope } from "@budibase/types"
import {
  extractSlackMessageContent,
  isSlackDirectMessage,
  matchesSlackConversationScope,
  pickSlackConversation,
  stripSlackMentions,
} from "../slack"

const makeChat = (
  overrides: Partial<ChatConversation> = {}
): ChatConversation => ({
  _id: "chat-default",
  chatAppId: "chat-app-1",
  agentId: "agent-1",
  userId: "slack:user-1",
  title: "Conversation",
  messages: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  channel: {
    provider: "slack",
    channelId: "C123",
    threadId: "slack:C123:1700000000.100",
    externalUserId: "user-1",
  },
  ...overrides,
})

describe("slack webhook helpers", () => {
  it("strips Slack mentions from message text", () => {
    expect(stripSlackMentions("<@U123> ask hello")).toEqual("ask hello")
  })

  it.each([
    ["hello there", "hello there"],
    ["ask hello there", "ask hello there"],
    ["/new start fresh", "/new start fresh"],
    ["<@U123> follow up", "follow up"],
    ["<@U123|budibase> follow up", "follow up"],
    ["contact me at alice@example.com", "contact me at alice@example.com"],
    ["compare foo@bar and @alice", "compare foo@bar and @alice"],
    ["<@U123>   ", ""],
  ] as const)("extracts message content %s", (text, expected) => {
    expect(extractSlackMessageContent(text)).toEqual(expected)
  })

  it("detects direct-message slack events", () => {
    expect(isSlackDirectMessage({ type: "message", channel_type: "im" })).toBe(
      true
    )
    expect(isSlackDirectMessage({ type: "message", channel: "D123" })).toBe(
      true
    )
    expect(
      isSlackDirectMessage({
        type: "message",
        channel: "C123",
        channel_type: "channel",
      })
    ).toBe(false)
  })

  it("scopes conversations by chat app, agent, channel, thread, and user", () => {
    const scope: SlackConversationScope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "C123",
      threadId: "slack:C123:1700000000.100",
      externalUserId: "user-1",
    }

    const channel = (overrides = {}) => ({
      provider: "slack" as const,
      channelId: "C123",
      threadId: "slack:C123:1700000000.100",
      externalUserId: "user-1",
      ...overrides,
    })

    const matching = makeChat({ _id: "matching", channel: channel() })
    const wrongThread = makeChat({
      _id: "wrong-thread",
      channel: channel({ threadId: "slack:C123:1700000000.200" }),
    })
    const wrongAgent = makeChat({
      _id: "wrong-agent",
      agentId: "agent-2",
      channel: channel(),
    })
    const wrongUser = makeChat({
      _id: "wrong-user",
      channel: channel({ externalUserId: "user-2" }),
    })

    expect(matchesSlackConversationScope({ chat: matching, scope })).toBe(true)
    expect(matchesSlackConversationScope({ chat: wrongThread, scope })).toBe(
      false
    )
    expect(matchesSlackConversationScope({ chat: wrongAgent, scope })).toBe(
      false
    )
    expect(matchesSlackConversationScope({ chat: wrongUser, scope })).toBe(
      false
    )
  })

  it("selects latest non-expired conversation", () => {
    const nowMs = new Date("2026-01-01T01:00:00.000Z").getTime()
    const idleTimeoutMs = 45 * 60 * 1000
    const scope: SlackConversationScope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "C123",
      threadId: "slack:C123:1700000000.100",
      externalUserId: "user-1",
    }

    const expired = makeChat({
      _id: "expired",
      updatedAt: "2025-12-31T23:00:00.000Z",
    })
    const latest = makeChat({
      _id: "latest",
      updatedAt: "2026-01-01T00:50:00.000Z",
    })
    const otherUser = makeChat({
      _id: "other-user",
      updatedAt: "2026-01-01T00:59:00.000Z",
      channel: {
        provider: "slack",
        channelId: "C123",
        threadId: "slack:C123:1700000000.100",
        externalUserId: "user-2",
      },
    })

    const picked = pickSlackConversation({
      chats: [expired, latest, otherUser],
      scope,
      idleTimeoutMs,
      nowMs,
    })

    expect(picked?._id).toEqual("latest")
  })
})

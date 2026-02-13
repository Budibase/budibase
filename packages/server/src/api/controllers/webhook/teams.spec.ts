import type { ChatConversation } from "@budibase/types"
import {
  isTeamsLifecycleActivity,
  matchesTeamsConversationScope,
  parseTeamsCommand,
  pickTeamsConversation,
  splitTeamsMessage,
  stripTeamsMentions,
} from "./teams"

const makeChat = (
  overrides: Partial<ChatConversation> = {}
): ChatConversation => ({
  _id: "chat-default",
  chatAppId: "chat-app-1",
  agentId: "agent-1",
  userId: "msteams:user-1",
  title: "Conversation",
  messages: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  channel: {
    provider: "msteams",
    conversationId: "conversation-1",
    channelId: "channel-1",
    externalUserId: "user-1",
  },
  ...overrides,
})

describe("teams webhook helpers", () => {
  it("strips teams mention tags", () => {
    expect(stripTeamsMentions("<at>Budibase Bot</at> ask hello")).toEqual(
      "ask hello"
    )
  })

  it.each([
    ["ask hello there", { command: "ask", content: "hello there" }],
    ["/ask hello there", { command: "ask", content: "hello there" }],
    ["new", { command: "new", content: "" }],
    ["/new start fresh", { command: "new", content: "start fresh" }],
    ["<at>Budibase Bot</at> ask follow up", { command: "ask", content: "follow up" }],
    ["status", { command: "ask", content: "status" }],
  ] as const)("parses command text %s", (text, expected) => {
    expect(parseTeamsCommand(text)).toEqual(expected)
  })

  it("returns unsupported for empty text", () => {
    expect(parseTeamsCommand("   ")).toEqual({
      command: "unsupported",
      content: "",
    })
  })

  it("splits long Teams responses into multiple messages", () => {
    const chunks = splitTeamsMessage("x".repeat(7001), 3500)
    expect(chunks).toHaveLength(3)
    expect(chunks.map(chunk => chunk.length)).toEqual([3500, 3500, 1])
  })

  it("detects Teams lifecycle activities", () => {
    expect(isTeamsLifecycleActivity({ type: "conversationUpdate" })).toBe(true)
    expect(isTeamsLifecycleActivity({ type: "installationUpdate" })).toBe(true)
    expect(isTeamsLifecycleActivity({ type: "message" })).toBe(false)
  })

  it("scopes conversations by chat app, agent, conversation, channel, and user", () => {
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
      externalUserId: "user-1",
    }

    const channel = (overrides = {}) => ({
      provider: "msteams" as const,
      conversationId: "conversation-1",
      channelId: "channel-1",
      externalUserId: "user-1",
      ...overrides,
    })

    const matching = makeChat({ _id: "matching", channel: channel() })
    const wrongConversation = makeChat({
      _id: "wrong-conversation",
      channel: channel({ conversationId: "conversation-2" }),
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

    expect(matchesTeamsConversationScope({ chat: matching, scope })).toBe(true)
    expect(
      matchesTeamsConversationScope({ chat: wrongConversation, scope })
    ).toBe(false)
    expect(matchesTeamsConversationScope({ chat: wrongAgent, scope })).toBe(
      false
    )
    expect(matchesTeamsConversationScope({ chat: wrongUser, scope })).toBe(
      false
    )
  })

  it("falls back to legacy userId matching when channel external user is missing", () => {
    const chat = makeChat({
      userId: "msteams:user-legacy",
      channel: {
        provider: "msteams",
        conversationId: "conversation-1",
        channelId: "channel-1",
      },
    })

    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
      externalUserId: "user-legacy",
    }

    expect(matchesTeamsConversationScope({ chat, scope })).toBe(true)
  })

  it("selects latest non-expired conversation", () => {
    const nowMs = new Date("2026-01-01T01:00:00.000Z").getTime()
    const idleTimeoutMs = 45 * 60 * 1000
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
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
        provider: "msteams",
        conversationId: "conversation-1",
        channelId: "channel-1",
        externalUserId: "user-2",
      },
    })

    const picked = pickTeamsConversation({
      chats: [expired, latest, otherUser],
      scope,
      idleTimeoutMs,
      nowMs,
    })

    expect(picked?._id).toEqual("latest")
  })
})

import {
  AgentChannelProvider,
  type ChatConversation,
  type MSTeamsConversationScope,
} from "@budibase/types"
import { ChatCommands } from "@budibase/shared-core"
import {
  isTeamsLifecycleActivity,
  isTeamsMentionActivity,
  parseTeamsCommand,
  splitTeamsMessage,
  stripTeamsMentions,
} from "../ms-teams"
import { pickLatestConversation } from "../utils"

const matchesTeamsConversationScope = ({
  chat,
  scope,
}: {
  chat: ChatConversation
  scope: MSTeamsConversationScope
}) => {
  const ch = chat.channel
  return !!(
    chat.chatAppId === scope.chatAppId &&
    chat.agentId === scope.agentId &&
    ch?.provider === AgentChannelProvider.MSTEAMS &&
    ch?.conversationId === scope.conversationId &&
    ch?.threadId === scope.threadId &&
    (ch?.channelId || undefined) === scope.channelId &&
    ch.externalUserId === scope.externalUserId
  )
}

const pickTeamsConversation = ({
  chats,
  scope,
  idleTimeoutMs,
  nowMs = Date.now(),
}: {
  chats: ChatConversation[]
  scope: MSTeamsConversationScope
  idleTimeoutMs: number
  nowMs?: number
}) =>
  pickLatestConversation({
    chats,
    scope,
    idleTimeoutMs,
    matchesConversationScope: matchesTeamsConversationScope,
    nowMs,
  })

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
    provider: AgentChannelProvider.MSTEAMS,
    conversationId: "conversation-1",
    channelId: "channel-1",
    threadId: "teams:conversation-1:service-1",
    externalUserId: "user-1",
  },
  ...overrides,
})

describe("teams webhook helpers", () => {
  it("strips teams mention entities", () => {
    expect(
      stripTeamsMentions(`<at>Budibase Bot</at> hello`, [
        {
          type: "mention",
          text: "<at>Budibase Bot</at>",
        },
      ])
    ).toEqual("hello")
  })

  it.each([
    [ChatCommands.NEW, { command: ChatCommands.NEW, content: "" }],
    [
      `/${ChatCommands.NEW} start fresh`,
      { command: ChatCommands.NEW, content: "start fresh" },
    ],
    [ChatCommands.LINK, { command: ChatCommands.LINK, content: "" }],
    [`/${ChatCommands.LINK}`, { command: ChatCommands.LINK, content: "" }],
    ["status", { command: ChatCommands.ASK, content: "status" }],
  ] as const)("parses command text %s", (text, expected) => {
    expect(parseTeamsCommand(text)).toEqual(expected)
  })

  it("parses command text containing mention entities", () => {
    expect(
      parseTeamsCommand(`<at>Budibase Bot</at> follow up`, [
        {
          type: "mention",
          text: "<at>Budibase Bot</at>",
        },
      ])
    ).toEqual({
      command: ChatCommands.ASK,
      content: "follow up",
    })
  })

  it("returns unsupported for empty text", () => {
    expect(parseTeamsCommand("   ")).toEqual({
      command: ChatCommands.UNSUPPORTED,
      content: "",
    })
  })

  it("splits long Teams responses into multiple messages", () => {
    const chunks = splitTeamsMessage("x".repeat(7001), 3500)
    expect(chunks).toHaveLength(3)
    expect(chunks.map(chunk => chunk.length)).toEqual([3500, 3500, 1])
  })

  it("detects Teams lifecycle activities", () => {
    expect(
      isTeamsLifecycleActivity({ type: "installationUpdate", action: "add" })
    ).toBe(true)
    expect(
      isTeamsLifecycleActivity({
        type: "conversationUpdate",
        recipient: { id: "bot-1" },
        membersAdded: [{ id: "bot-1" }],
      })
    ).toBe(true)
    expect(
      isTeamsLifecycleActivity({ type: "installationUpdate", action: "remove" })
    ).toBe(false)
    expect(isTeamsLifecycleActivity({ type: "conversationUpdate" })).toBe(false)
    expect(isTeamsLifecycleActivity({ type: "message" })).toBe(false)
  })

  it("detects Teams mention activities using mention entities", () => {
    expect(
      isTeamsMentionActivity({
        recipient: { id: "bot-1" },
        entities: [
          {
            type: "mention",
            mentioned: { id: "bot-1" },
          },
        ],
      })
    ).toBe(true)

    expect(
      isTeamsMentionActivity({
        recipient: { id: "bot-1" },
        entities: [
          {
            type: "mention",
            mentioned: { id: "bot-2" },
          },
        ],
      })
    ).toBe(false)
  })

  it("scopes conversations by chat app, agent, conversation, channel, and user", () => {
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
      threadId: "teams:conversation-1:service-1",
      externalUserId: "user-1",
    }

    const channel = (overrides = {}) => ({
      provider: AgentChannelProvider.MSTEAMS,
      conversationId: "conversation-1",
      channelId: "channel-1",
      threadId: "teams:conversation-1:service-1",
      externalUserId: "user-1",
      ...overrides,
    })

    const matching = makeChat({ _id: "matching", channel: channel() })
    const wrongThread = makeChat({
      _id: "wrong-thread",
      channel: channel({ threadId: "teams:conversation-1:service-2" }),
    })
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
    expect(matchesTeamsConversationScope({ chat: wrongThread, scope })).toBe(
      false
    )
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

  it("requires channel external user id to match conversation scope", () => {
    const chat = makeChat({
      userId: "msteams:user-legacy",
      channel: {
        provider: AgentChannelProvider.MSTEAMS,
        conversationId: "conversation-1",
        channelId: "channel-1",
        threadId: "teams:conversation-1:service-1",
      },
    })

    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
      threadId: "teams:conversation-1:service-1",
      externalUserId: "user-legacy",
    }

    expect(matchesTeamsConversationScope({ chat, scope })).toBe(false)
  })

  it("selects latest non-expired conversation", () => {
    const nowMs = new Date("2026-01-01T01:00:00.000Z").getTime()
    const idleTimeoutMs = 45 * 60 * 1000
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      conversationId: "conversation-1",
      channelId: "channel-1",
      threadId: "teams:conversation-1:service-1",
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
        provider: AgentChannelProvider.MSTEAMS,
        conversationId: "conversation-1",
        channelId: "channel-1",
        threadId: "teams:conversation-1:service-1",
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

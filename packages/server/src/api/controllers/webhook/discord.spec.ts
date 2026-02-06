import type { ChatConversation } from "@budibase/types"
import {
  type DiscordInteraction,
  extractDiscordContent,
  getDiscordInteractionCommand,
  isDiscordConversationExpired,
  matchesDiscordConversationScope,
  pickDiscordConversation,
} from "./discord"

const makeChat = (
  overrides: Partial<ChatConversation> = {}
): ChatConversation => ({
  _id: "chat-default",
  chatAppId: "chat-app-1",
  agentId: "agent-1",
  userId: "discord:user-1",
  title: "Conversation",
  messages: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  channel: {
    provider: "discord",
    channelId: "channel-1",
    externalUserId: "user-1",
  },
  ...overrides,
})

const makeInteraction = (
  overrides: Partial<DiscordInteraction> = {}
): DiscordInteraction => ({
  id: "interaction-default",
  type: 2,
  token: "token",
  application_id: "app",
  ...overrides,
})

describe("discord webhook helpers", () => {
  it("extracts slash-command and modal text content", () => {
    const content = extractDiscordContent(
      makeInteraction({
        data: {
          options: [{ name: "message", value: "hello" }, { value: 123 }],
          components: [
            {
              components: [{ value: "from modal" }],
            },
          ],
        },
      })
    )

    expect(content).toEqual("hello 123 from modal")
  })

  it.each([
    [{ type: 2, data: { name: "ask" } }, "ask"],
    [{ type: 2, data: { name: "new" } }, "new"],
    [{ type: 5, data: {} }, "ask"],
    [{ type: 2, data: { name: "status" } }, "unsupported"],
  ] as [Partial<DiscordInteraction>, string][])(
    "maps interaction %j to command %s",
    (overrides, expected) => {
      expect(getDiscordInteractionCommand(makeInteraction(overrides))).toEqual(
        expected
      )
    }
  )

  it("supports custom command names", () => {
    const commandNames = {
      askCommandName: "support",
      newCommandName: "fresh",
    }

    expect(
      getDiscordInteractionCommand(
        makeInteraction({ data: { name: "support" } }),
        commandNames
      )
    ).toEqual("ask")

    expect(
      getDiscordInteractionCommand(
        makeInteraction({ data: { name: "fresh" } }),
        commandNames
      )
    ).toEqual("new")
  })

  it("scopes conversations by chat app, agent, channel, thread, and user", () => {
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "channel-1",
      threadId: "thread-1",
      externalUserId: "user-1",
    }

    const channel = (overrides = {}) => ({
      provider: "discord" as const,
      channelId: "channel-1",
      threadId: "thread-1",
      externalUserId: "user-1",
      ...overrides,
    })

    const matching = makeChat({ _id: "matching", channel: channel() })
    const wrongThread = makeChat({
      _id: "wrong-thread",
      channel: channel({ threadId: "thread-2" }),
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

    expect(matchesDiscordConversationScope({ chat: matching, scope })).toBe(
      true
    )
    expect(matchesDiscordConversationScope({ chat: wrongThread, scope })).toBe(
      false
    )
    expect(matchesDiscordConversationScope({ chat: wrongAgent, scope })).toBe(
      false
    )
    expect(matchesDiscordConversationScope({ chat: wrongUser, scope })).toBe(
      false
    )
  })

  it("falls back to legacy userId matching when channel external user is missing", () => {
    const chat = makeChat({
      userId: "discord:user-legacy",
      channel: {
        provider: "discord",
        channelId: "channel-1",
      },
    })

    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "channel-1",
      threadId: undefined,
      externalUserId: "user-legacy",
    }

    expect(matchesDiscordConversationScope({ chat, scope })).toBe(true)
  })

  it("selects latest non-expired conversation", () => {
    const nowMs = new Date("2026-01-01T01:00:00.000Z").getTime()
    const idleTimeoutMs = 45 * 60 * 1000
    const scope = {
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      channelId: "channel-1",
      threadId: undefined,
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
        provider: "discord",
        channelId: "channel-1",
        externalUserId: "user-2",
      },
    })

    const picked = pickDiscordConversation({
      chats: [expired, latest, otherUser],
      scope,
      idleTimeoutMs,
      nowMs,
    })

    expect(picked?._id).toEqual("latest")
  })
})

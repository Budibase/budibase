import { HTTPError } from "@budibase/backend-core"
import { isToolUIPart, type ModelMessage } from "ai"
import { AgentChannelProvider, type ChatConversation } from "@budibase/types"
import {
  addRetrievedContextToMessages,
  extractUserText,
  findLatestUserQuestion,
  prepareChatConversationForSave,
  prepareModelMessages,
  truncateTitle,
} from "./helpers"

const stringOutputFromFirstToolPart = (
  messages: ChatConversation["messages"]
) => {
  const rawPart = messages[0]?.parts[0]
  if (!isToolUIPart(rawPart) || rawPart.state !== "output-available") {
    return undefined
  }
  return typeof rawPart.output === "string" ? rawPart.output : undefined
}

describe("prepareChatConversationForSave", () => {
  const userMessage = {
    id: "m1",
    role: "user" as const,
    parts: [{ type: "text" as const, text: "hello" }],
  }

  it("builds a ChatConversation with agent and persisted messages", () => {
    const messages = [userMessage] as ChatConversation["messages"]

    const result = prepareChatConversationForSave({
      chatId: "chat_1",
      chatAppId: "app_1",
      userId: "user_1",
      title: "My title",
      messages,
      chat: { agentId: "agent_1" },
    })

    expect(result._id).toBe("chat_1")
    expect(result.chatAppId).toBe("app_1")
    expect(result.userId).toBe("user_1")
    expect(result.agentId).toBe("agent_1")
    expect(result.title).toBe("My title")
    expect(result.messages).toEqual(messages)
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()
  })

  it("truncates oversized tool output when persisting", () => {
    const longOutput = "x".repeat(9000)
    const messages = [
      {
        id: "m1",
        role: "assistant" as const,
        parts: [
          {
            type: "dynamic-tool" as const,
            toolName: "lookup",
            toolCallId: "call-1",
            state: "output-available" as const,
            input: {},
            output: longOutput,
          },
        ],
      },
    ] as ChatConversation["messages"]

    const result = prepareChatConversationForSave({
      chatId: "chat_1",
      chatAppId: "app_1",
      userId: "user_1",
      messages,
      chat: { agentId: "agent_1" },
    })

    const output = stringOutputFromFirstToolPart(result.messages)
    expect(output?.length).toBeLessThan(longOutput.length)
    expect(output).toContain("[truncated]")
  })

  it("prefers existingChat timestamps, rev, agentId and channel when present", () => {
    const messages = [userMessage] as ChatConversation["messages"]

    const result = prepareChatConversationForSave({
      chatId: "chat_1",
      chatAppId: "app_1",
      userId: "user_1",
      messages,
      chat: {
        agentId: "from_chat",
        createdAt: "2020-01-01T00:00:00.000Z",
        channel: { provider: AgentChannelProvider.SLACK },
      },
      existingChat: {
        _id: "chat_1",
        chatAppId: "app_1",
        userId: "user_1",
        agentId: "from_existing",
        messages,
        createdAt: "2019-01-01T00:00:00.000Z",
        updatedAt: "2019-06-01T00:00:00.000Z",
        _rev: "1-abc",
        channel: { provider: AgentChannelProvider.DISCORD },
      },
    })

    expect(result._rev).toBe("1-abc")
    expect(result.agentId).toBe("from_existing")
    expect(result.createdAt).toBe("2019-01-01T00:00:00.000Z")
    expect(result.channel).toEqual({ provider: "slack" })
  })

  it("uses chat.title when title argument is omitted", () => {
    const messages = [userMessage] as ChatConversation["messages"]

    const result = prepareChatConversationForSave({
      chatId: "chat_1",
      chatAppId: "app_1",
      userId: "user_1",
      messages,
      chat: { agentId: "agent_1", title: "Chat title" },
    })

    expect(result.title).toBe("Chat title")
  })

  it("throws when agentId cannot be resolved", () => {
    const messages = [userMessage] as ChatConversation["messages"]

    expect(() =>
      prepareChatConversationForSave({
        chatId: "chat_1",
        chatAppId: "app_1",
        userId: "user_1",
        messages,
        chat: {},
      })
    ).toThrow(HTTPError)
  })
})

describe("extractUserText", () => {
  it("returns empty string for missing message or parts", () => {
    expect(extractUserText(undefined)).toBe("")
    expect(
      extractUserText({
        id: "1",
        role: "user",
        parts:
          undefined as unknown as ChatConversation["messages"][number]["parts"],
      })
    ).toBe("")
  })

  it("joins text UI parts and trims", () => {
    const text = extractUserText({
      id: "1",
      role: "user",
      parts: [
        { type: "text", text: "  hello " },
        { type: "text", text: "world" },
      ],
    })
    expect(text).toBe("hello world")
  })
})

describe("findLatestUserQuestion", () => {
  it("returns empty string when there are no user messages with text", () => {
    expect(findLatestUserQuestion({ messages: [] })).toBe("")
    expect(
      findLatestUserQuestion({
        messages: [
          {
            id: "a",
            role: "assistant",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      })
    ).toBe("")
  })

  it("returns the latest non-empty user text", () => {
    const result = findLatestUserQuestion({
      messages: [
        {
          id: "1",
          role: "user",
          parts: [{ type: "text", text: "first" }],
        },
        {
          id: "2",
          role: "assistant",
          parts: [{ type: "text", text: "ok" }],
        },
        {
          id: "3",
          role: "user",
          parts: [{ type: "text", text: "last question" }],
        },
      ],
    })
    expect(result).toBe("last question")
  })

  it("skips user messages that only contain empty text parts", () => {
    const result = findLatestUserQuestion({
      messages: [
        {
          id: "1",
          role: "user",
          parts: [{ type: "text", text: "   " }],
        },
        {
          id: "2",
          role: "user",
          parts: [{ type: "text", text: "real" }],
        },
      ],
    })
    expect(result).toBe("real")
  })
})

describe("truncateTitle", () => {
  it("returns trimmed value when within limit", () => {
    expect(truncateTitle("  short  ")).toBe("short")
  })

  it("truncates with ellipsis when over maxLength", () => {
    const long = "a".repeat(130)
    const out = truncateTitle(long, 10)
    expect(out.endsWith("...")).toBe(true)
    expect(out.length).toBe(10)
  })
})

describe("prepareModelMessages", () => {
  it("returns model messages with prune options applied via the ai package", async () => {
    const uiMessages = [
      {
        id: "1",
        role: "user" as const,
        parts: [{ type: "text" as const, text: "hi" }],
      },
    ] as ChatConversation["messages"]

    const result = await prepareModelMessages(uiMessages)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    const userMessage = result.find(m => m.role === "user")
    expect(userMessage).toBeDefined()
  })
})

describe("addRetrievedContextToMessages", () => {
  it("returns the same array when context is empty", () => {
    const messages = [{ role: "user", content: "x" }] as ModelMessage[]
    expect(addRetrievedContextToMessages(messages, "")).toBe(messages)
  })

  it("prepends a system message with retrieved knowledge", () => {
    const messages = [{ role: "user", content: "x" }] as ModelMessage[]
    const ctx = "fact about widgets"

    const result = addRetrievedContextToMessages(messages, ctx)

    expect(result).toEqual([
      {
        role: "system",
        content: `Relevant knowledge:\n${ctx}\n\nUse this content when answering the user.`,
      },
      ...messages,
    ])
  })
})

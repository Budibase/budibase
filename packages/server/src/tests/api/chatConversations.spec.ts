import { context, docIds, features, roles } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  DocumentType,
  FeatureFlag,
} from "@budibase/types"
import type {
  Agent,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  User,
} from "@budibase/types"
import type { ModelMessage, ToolSet } from "ai"
import { convertToModelMessages, pruneMessages, streamText } from "ai"
import { quotas } from "@budibase/pro"
import TestConfiguration from "../utilities/TestConfiguration"
import sdk from "../../sdk"
import * as agentLogs from "../../sdk/workspace/ai/agentLogs"
import { retrieveContextForAgent } from "../../sdk/workspace/ai/rag"
import type { LanguageModelV3 } from "@ai-sdk/provider"
import { webhookChat } from "../../api/controllers/ai/chatConversations"
import { MockLanguageModelV3 } from "ai/test"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      addAction: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
      throwIfBudibaseAICreditsExceeded: jest.fn(),
    },
    ai: {
      ...actual.ai,
      agentSystemPrompt: jest.fn(() => "system"),
    },
  }
})

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  const mockStreamText = jest.fn()

  class MockToolLoopAgent {
    private settings: Record<string, any>

    constructor(settings: Record<string, any>) {
      this.settings = settings
    }

    async stream(options: Record<string, any>) {
      const { instructions, ...settings } = this.settings
      return mockStreamText({
        ...settings,
        ...options,
        system: instructions,
      })
    }
  }

  return {
    ...actual,
    convertToModelMessages: jest.fn(),
    pruneMessages: jest.fn(),
    streamText: mockStreamText,
    ToolLoopAgent: MockToolLoopAgent,
  }
})

jest.mock("../../sdk/workspace/ai/agents", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/agents")
  return {
    ...actual,
    getOrThrow: jest.fn(),
    buildPromptAndTools: jest.fn(),
  }
})

jest.mock("../../sdk/workspace/ai/llm", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/llm")
  return {
    ...actual,
    createLLM: jest.fn(),
  }
})

jest.mock("../../sdk/workspace/ai/agentLogs", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/agentLogs")
  return {
    ...actual,
    createSessionLogIndexer: jest.fn(),
  }
})

jest.mock("../../sdk/workspace/ai/rag", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/rag")
  return {
    ...actual,
    retrieveContextForAgent: jest.fn(),
  }
})

const createMockSessionLogIndexer = () => ({
  addRequestId: jest.fn(),
  index: jest.fn().mockResolvedValue(undefined),
})

const aiActual = jest.requireActual<typeof import("ai")>("ai")

const mockLanguageModelStreamUsage = {
  inputTokens: {
    total: 1,
    noCache: 1,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: {
    total: 2,
    text: 2,
    reasoning: undefined,
  },
} as const

const createChatTestLanguageModel = () =>
  new MockLanguageModelV3({
    doStream: async () => ({
      stream: aiActual.simulateReadableStream({
        chunks: [
          { type: "text-start", id: "text-1" },
          { type: "text-delta", id: "text-1", delta: "hello" },
          { type: "text-end", id: "text-1" },
          {
            type: "finish",
            finishReason: { unified: "stop" as const, raw: undefined },
            logprobs: undefined,
            usage: mockLanguageModelStreamUsage,
          },
        ],
      }),
    }),
  })

describe("chat conversations authorization", () => {
  const config = new TestConfiguration()
  let userA: User
  let userB: User
  let chatApp: ChatApp
  let otherChatApp: ChatApp
  let convoA: ChatConversation
  let convoAAgent2: ChatConversation
  let convoB: ChatConversation
  let externalChannelConvo: ChatConversation
  let otherAppConvo: ChatConversation

  beforeAll(async () => {
    await config.init("chat-conversation-scope")
    userA = config.getUser()
    userB = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: { global: true },
      admin: { global: false },
    })

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        chatApp = {
          _id: docIds.generateChatAppID(),
          agents: [
            { agentId: "agent-1", isEnabled: true, isDefault: false },
            { agentId: "agent-2", isEnabled: true, isDefault: false },
            { agentId: "agent-3", isEnabled: false, isDefault: false },
          ],
          live: true,
          createdAt: now,
        }
        convoA = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          agentId: "agent-1",
          userId: userA._id!,
          messages: [],
          title: "user A conversation",
          createdAt: now,
        }
        convoB = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          agentId: "agent-1",
          userId: userB._id!,
          messages: [],
          title: "user B conversation",
          createdAt: now,
        }
        convoAAgent2 = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          agentId: "agent-2",
          userId: userA._id!,
          messages: [],
          title: "user A conversation on agent 2",
          createdAt: now,
        }
        externalChannelConvo = {
          _id: docIds.generateChatConversationID(),
          chatAppId: chatApp._id!,
          agentId: "agent-1",
          userId: userA._id!,
          messages: [],
          title: "slack conversation",
          createdAt: now,
          channel: {
            provider: "slack" as AgentChannelProvider,
            channelId: "C123",
            externalUserId: "external-user-1",
          },
        }
        otherChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-2", isEnabled: true, isDefault: false }],
          live: true,
          createdAt: now,
        }
        otherAppConvo = {
          _id: docIds.generateChatConversationID(),
          chatAppId: otherChatApp._id!,
          agentId: "agent-2",
          userId: userA._id!,
          messages: [],
          title: "other app conversation",
          createdAt: now,
        }
        await db.put(chatApp)
        await db.put(convoA)
        await db.put(convoAAgent2)
        await db.put(convoB)
        await db.put(externalChannelConvo)
        await db.put(otherChatApp)
        await db.put(otherAppConvo)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  const headersForUser = async (user: User) =>
    await config.withUser(user, async () => config.defaultHeaders({}, true))

  it("filters history results to the requesting user", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body.map((chat: ChatConversation) => chat._id)).toEqual(
      expect.arrayContaining([convoA._id, convoAAgent2._id])
    )
  })

  it("hides channel conversations from web chat history", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body.map((chat: ChatConversation) => chat._id)).not.toContain(
      externalChannelConvo._id
    )
  })

  it("filters history to the requested enabled agent", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations?agentId=agent-2`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body.map((chat: ChatConversation) => chat._id)).toEqual([
      convoAAgent2._id,
    ])
  })

  it("rejects history filtering by non-enabled agents", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations?agentId=agent-3`)
      .set(headers)

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("agentId is not enabled for this chat app")
  })

  it("hides conversations from other agents when filtered", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(
        `/api/chatapps/${chatApp._id}/conversations/${convoA._id}?agentId=agent-2`
      )
      .set(headers)

    expect(res.status).toBe(404)
  })

  it("blocks deleting a conversation when filtered to a different agent", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .delete(
        `/api/chatapps/${chatApp._id}/conversations/${convoA._id}?agentId=agent-2`
      )
      .set(headers)

    expect(res.status).toBe(404)
  })

  it("blocks access to another user's conversation", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations/${convoB._id}`)
      .set(headers)

    expect(res.status).toBe(403)
  })

  it("allows a user to fetch their own conversation", async () => {
    const headers = await headersForUser(userB)

    const res = await config
      .getRequest()!
      .get(`/api/chatapps/${chatApp._id}/conversations/${convoB._id}`)
      .set(headers)

    expect(res.status).toBe(200)
    expect(res.body._id).toBe(convoB._id)
  })

  it("blocks access to channel conversations from web chat routes", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .get(
        `/api/chatapps/${chatApp._id}/conversations/${externalChannelConvo._id}`
      )
      .set(headers)

    expect(res.status).toBe(404)
  })

  it("blocks deleting a conversation from a different chat app", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .delete(`/api/chatapps/${chatApp._id}/conversations/${otherAppConvo._id}`)
      .set(headers)

    expect(res.status).toBe(404)
  })

  it("blocks deleting channel conversations from web chat routes", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .delete(
        `/api/chatapps/${chatApp._id}/conversations/${externalChannelConvo._id}`
      )
      .set(headers)

    expect(res.status).toBe(404)
  })
})

describe("prepareChatConversationForSave", () => {
  const now = new Date("2024-01-01T00:00:00.000Z")

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it("preserves existing createdAt and updates updatedAt", () => {
    const existingChat: ChatConversation = {
      _id: "chat-1",
      _rev: "1",
      chatAppId: "chat-app-1",
      agentId: "agent-1",
      userId: "user-1",
      title: "old title",
      messages: [],
      createdAt: "2023-12-31T12:00:00.000Z",
      updatedAt: "2023-12-31T12:00:00.000Z",
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: existingChat._id!,
      chatAppId: existingChat.chatAppId,
      userId: existingChat.userId!,
      title: "new title",
      messages: [],
      chat: existingChat,
      existingChat,
    })

    expect(result.createdAt).toEqual(existingChat.createdAt)
    expect(result.updatedAt).toEqual(now.toISOString())
    expect(result._rev).toEqual(existingChat._rev)
  })

  it("sets createdAt when saving a new conversation", () => {
    const chat: ChatConversation = {
      _id: "chat-2",
      chatAppId: "chat-app-2",
      agentId: "agent-2",
      userId: "user-2",
      title: "new chat",
      messages: [],
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: chat._id!,
      chatAppId: chat.chatAppId,
      userId: chat.userId!,
      title: chat.title,
      messages: [],
      chat,
    })

    expect(result.createdAt).toEqual(now.toISOString())
    expect(result.updatedAt).toEqual(now.toISOString())
  })

  it("truncates large tool outputs for all persisted messages", () => {
    const largeOutput = "a".repeat(9000)
    const chat: ChatConversation = {
      _id: "chat-3",
      chatAppId: "chat-app-3",
      agentId: "agent-3",
      userId: "user-3",
      title: "tool output chat",
      messages: [
        {
          id: "message-1",
          role: "assistant",
          parts: [
            {
              type: "tool-search",
              toolCallId: "call-1",
              state: "output-available",
              input: { query: "test" },
              output: largeOutput,
            },
          ],
        },
        {
          id: "message-2",
          role: "user",
          parts: [{ type: "text", text: "follow up" }],
        },
        {
          id: "message-3",
          role: "assistant",
          parts: [
            {
              type: "tool-search",
              toolCallId: "call-2",
              state: "output-available",
              input: { query: "latest" },
              output: largeOutput,
            },
          ],
        },
      ],
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: chat._id!,
      chatAppId: chat.chatAppId,
      userId: chat.userId!,
      title: chat.title,
      messages: chat.messages,
      chat,
    })

    const firstToolPart = result.messages[0].parts[0]
    expect(firstToolPart).toMatchObject({
      type: "tool-search",
      state: "output-available",
    })
    expect("output" in firstToolPart && typeof firstToolPart.output).toBe(
      "string"
    )
    if ("output" in firstToolPart && typeof firstToolPart.output === "string") {
      expect(firstToolPart.output.length).toBeLessThan(8100)
      expect(firstToolPart.output).toContain("...[truncated]")
    }

    const latestToolPart = result.messages[2].parts[0]
    expect(latestToolPart).toMatchObject({
      type: "tool-search",
      state: "output-available",
    })
    expect("output" in latestToolPart && typeof latestToolPart.output).toBe(
      "string"
    )
    if (
      "output" in latestToolPart &&
      typeof latestToolPart.output === "string"
    ) {
      expect(latestToolPart.output.length).toBeLessThan(8100)
      expect(latestToolPart.output).toContain("...[truncated]")
    }
  })

  it("replaces oversized structured tool outputs with a compact preview for all persisted messages", () => {
    const largeObjectOutput = {
      rows: Array.from({ length: 100 }, (_, index) => ({
        id: index,
        value: "b".repeat(200),
      })),
    }
    const chat: ChatConversation = {
      _id: "chat-4",
      chatAppId: "chat-app-4",
      agentId: "agent-4",
      userId: "user-4",
      title: "structured tool output chat",
      messages: [
        {
          id: "message-1",
          role: "assistant",
          parts: [
            {
              type: "tool-search",
              toolCallId: "call-1",
              state: "output-available",
              input: { query: "test" },
              output: largeObjectOutput,
            },
          ],
        },
        {
          id: "message-2",
          role: "user",
          parts: [{ type: "text", text: "follow up" }],
        },
        {
          id: "message-3",
          role: "assistant",
          parts: [
            {
              type: "tool-search",
              toolCallId: "call-2",
              state: "output-available",
              input: { query: "latest" },
              output: largeObjectOutput,
            },
          ],
        },
      ],
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: chat._id!,
      chatAppId: chat.chatAppId,
      userId: chat.userId!,
      title: chat.title,
      messages: chat.messages,
      chat,
    })

    const firstToolPart = result.messages[0].parts[0]
    expect(firstToolPart).toMatchObject({
      type: "tool-search",
      state: "output-available",
    })
    if (
      "output" in firstToolPart &&
      firstToolPart.output &&
      typeof firstToolPart.output === "object"
    ) {
      expect(firstToolPart.output).toMatchObject({
        truncated: true,
        originalType: "object",
      })
    } else {
      throw new Error("Expected structured tool output to be compacted")
    }

    const latestToolPart = result.messages[2].parts[0]
    expect(latestToolPart).toMatchObject({
      type: "tool-search",
      state: "output-available",
    })
    if (
      "output" in latestToolPart &&
      latestToolPart.output &&
      typeof latestToolPart.output === "object"
    ) {
      expect(latestToolPart.output).toMatchObject({
        truncated: true,
        originalType: "object",
      })
    } else {
      throw new Error("Expected latest structured tool output to be compacted")
    }
  })
})

describe("chat conversation transient behavior", () => {
  const config = new TestConfiguration()
  const agentId = "agent-1"
  let chatApp: ChatApp
  let sessionLogIndexer: ReturnType<typeof createMockSessionLogIndexer>

  beforeAll(async () => {
    await config.init("chat-conversation-transient")
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        chatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId, isEnabled: true, isDefault: false }],
          live: true,
          createdAt: now,
        }
        await db.put(chatApp)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    sessionLogIndexer = createMockSessionLogIndexer()
    jest
      .mocked(agentLogs.createSessionLogIndexer)
      .mockReturnValue(sessionLogIndexer)
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const docs = await db.allDocs<ChatConversation>(
          docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
            include_docs: true,
          })
        )
        const deletes = docs.rows
          .map(row => row.doc)
          .filter(Boolean)
          .map(doc => db.remove(doc!))
        await Promise.all(deletes)
      }
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const setupMocks = () => {
    const mockAgent: Agent = {
      _id: agentId,
      name: "Mock Agent",
      aiconfig: "config-1",
    }
    const tools: ToolSet = {}

    ;(
      sdk.ai.agents.getOrThrow as jest.MockedFunction<
        typeof sdk.ai.agents.getOrThrow
      >
    ).mockResolvedValue(mockAgent)
    ;(
      sdk.ai.agents.buildPromptAndTools as jest.MockedFunction<
        typeof sdk.ai.agents.buildPromptAndTools
      >
    ).mockResolvedValue({ systemPrompt: "system", tools, toolDisplayNames: {} })
    ;(
      sdk.ai.llm.createLLM as jest.MockedFunction<typeof sdk.ai.llm.createLLM>
    ).mockResolvedValue({
      chat: createChatTestLanguageModel() as LanguageModelV3,
      providerOptions: jest.fn(),
      uploadFile: jest.fn(),
    })
    ;(
      convertToModelMessages as jest.MockedFunction<
        typeof convertToModelMessages
      >
    ).mockImplementation(aiActual.convertToModelMessages)
    ;(
      pruneMessages as jest.MockedFunction<typeof pruneMessages>
    ).mockImplementation(aiActual.pruneMessages)
    ;(streamText as jest.MockedFunction<typeof streamText>).mockImplementation(
      aiActual.streamText
    )
  }

  it("does not persist transient conversations", async () => {
    setupMocks()
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        agentId,
        messages: [
          {
            id: "message-0",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
        transient: true,
      })

    expect(res.status).toBe(200)

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const docs = await db.allDocs<ChatConversation>(
          docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
            include_docs: true,
          })
        )
        expect(docs.rows.length).toBe(0)
      }
    )
  })

  it("persists conversations by default", async () => {
    setupMocks()
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        agentId,
        messages: [
          {
            id: "message-0",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      })

    expect(res.status).toBe(200)

    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const docs = await db.allDocs<ChatConversation>(
          docIds.getDocParams(DocumentType.CHAT_CONVERSATION, undefined, {
            include_docs: true,
          })
        )
        expect(docs.rows.length).toBe(1)
        expect(docs.rows[0].doc?.chatAppId).toBe(chatApp._id)
        const persisted = docs.rows[0].doc?.messages ?? []
        expect(persisted).toHaveLength(2)
        expect(persisted[0]).toMatchObject({
          id: "message-0",
          role: "user",
          parts: [{ type: "text", text: "hi" }],
        })
        expect(persisted[1]).toMatchObject({
          role: "assistant",
          parts: expect.arrayContaining([
            expect.objectContaining({
              type: "text",
              text: "hello",
            }),
          ]),
        })
      }
    )
  })

  it("disables tool calling when no tools are enabled", async () => {
    setupMocks()
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        agentId,
        messages: [
          {
            id: "message-0",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      })

    expect(res.status).toBe(200)
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: undefined,
        toolChoice: "none",
      })
    )
  })

  it("prunes old reasoning and tool calls before sending messages to the model", async () => {
    setupMocks()
    const modelMessages: ModelMessage[] = [
      { role: "user", content: "hello" },
      { role: "assistant", content: "response" },
    ]
    const prunedMessages: ModelMessage[] = [{ role: "user", content: "hello" }]

    jest.mocked(convertToModelMessages).mockResolvedValue(modelMessages)
    jest.mocked(pruneMessages).mockReturnValue(prunedMessages)

    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        agentId,
        messages: [
          {
            id: "message-0",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      })

    expect(res.status).toBe(200)
    expect(pruneMessages).toHaveBeenCalledWith({
      messages: modelMessages,
      reasoning: "all",
      toolCalls: "before-last-2-messages",
      emptyMessages: "remove",
    })
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: prunedMessages,
      })
    )
  })
})

describe("chat conversation title helpers", () => {
  const baseChat: ChatConversationRequest = {
    _id: "chat-1",
    chatAppId: "chat-app-1",
    agentId: "agent-1",
    messages: [],
  }

  it("finds the latest user message", () => {
    const chat: ChatConversationRequest = {
      ...baseChat,
      messages: [
        {
          id: "message-1",
          role: "user",
          parts: [{ type: "text", text: "first question" }],
        },
        {
          id: "message-2",
          role: "assistant",
          parts: [{ type: "text", text: "assistant reply" }],
        },
        {
          id: "message-3",
          role: "user",
          parts: [{ type: "text", text: "latest question" }],
        },
      ],
    }

    expect(sdk.ai.chatConversations.findLatestUserQuestion(chat)).toBe(
      "latest question"
    )
  })

  it("truncates titles with an ellipsis", () => {
    const longMessage = "a".repeat(130)

    expect(sdk.ai.chatConversations.truncateTitle(longMessage)).toBe(
      `${"a".repeat(117)}...`
    )
  })
})

describe("chat conversation path validation", () => {
  const config = new TestConfiguration()
  let basicUser: User
  let bodyChatApp: ChatApp
  let pathChatApp: ChatApp
  let pathConversation: ChatConversation

  beforeAll(async () => {
    await config.init("chat-conversation-validation")
    basicUser = await config.createUser({
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
      builder: { global: false },
      admin: { global: false },
    })
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        bodyChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
          live: true,
          createdAt: now,
        }
        pathChatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-1", isEnabled: true, isDefault: true }],
          live: true,
          createdAt: now,
        }
        pathConversation = {
          _id: docIds.generateChatConversationID(),
          chatAppId: pathChatApp._id!,
          agentId: "agent-1",
          userId: config.getUser()._id!,
          messages: [],
          title: "body conversation",
          createdAt: now,
        }

        await db.put(bodyChatApp)
        await db.put(pathChatApp)
        await db.put(pathConversation)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  it("rejects mismatched chatAppId between path and body", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(`/api/chatapps/${pathChatApp._id}/conversations/new/stream`)
      .set(headers)
      .send({
        chatAppId: bodyChatApp._id,
        agentId: "agent-1",
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })

  it("rejects mismatched chatConversationId between path and body", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(
        `/api/chatapps/${pathChatApp._id}/conversations/${pathConversation._id}/stream`
      )
      .set(headers)
      .send({
        chatAppId: pathChatApp._id,
        agentId: "agent-1",
        _id: docIds.generateChatConversationID(),
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })

  it("rejects preview mode for non-builder users before input validation", async () => {
    const headers = await config.withUser(basicUser, async () =>
      config.defaultHeaders({}, true)
    )

    const res = await config
      .getRequest()!
      .post("/api/chatapps/chatapp-path/conversations/new/stream")
      .set(headers)
      .send({
        agentId: "agent-1",
        isPreview: true,
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(403)
  })
})

describe("Agent chat tool call tracking", () => {
  const config = new TestConfiguration()
  let chatApp: ChatApp
  let sessionLogIndexer: ReturnType<typeof createMockSessionLogIndexer>
  const addActionMock = jest.mocked(quotas.addAction)

  const withRagEnabled = async <T>(f: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      f
    )

  function makeStreamTextMock(toolResults: { toolCallId: string }[]) {
    return (options: any) => ({
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      usage: Promise.resolve({
        inputTokens: 0,
        outputTokens: 0,
      }),
      pipeUIMessageStreamToResponse: jest
        .fn()
        .mockImplementation(async (res: any, pipeOptions: any) => {
          if (options.onStepFinish) {
            await options.onStepFinish({
              content: [],
              toolCalls: toolResults.map(r => ({ toolCallId: r.toolCallId })),
              toolResults,
            })
          }
          if (pipeOptions?.onFinish) {
            await pipeOptions.onFinish({ messages: [] })
          }
          res.end()
        }),
    })
  }

  function makeStreamTextMockWithMetadata({
    toolCalls,
    toolResults,
    onMetadata,
  }: {
    toolCalls: { toolCallId: string; toolName?: string }[]
    toolResults: {
      toolCallId: string
      toolName?: string
      preliminary?: boolean
    }[]
    onMetadata: (metadata: {
      startMetadata: Record<string, any> | undefined
      finishMetadata: Record<string, any> | undefined
    }) => void
  }) {
    return (options: any) => ({
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      usage: Promise.resolve({
        inputTokens: 0,
        outputTokens: 0,
      }),
      pipeUIMessageStreamToResponse: jest
        .fn()
        .mockImplementation(async (res: any, pipeOptions: any) => {
          if (options.onStepFinish) {
            await options.onStepFinish({
              content: [],
              toolCalls,
              toolResults,
            })
          }

          onMetadata({
            startMetadata: pipeOptions?.messageMetadata?.({
              part: { type: "start" },
            }),
            finishMetadata: pipeOptions?.messageMetadata?.({
              part: { type: "finish", finishReason: "stop" },
            }),
          })

          if (pipeOptions?.onFinish) {
            await pipeOptions.onFinish({ messages: [] })
          }
          res.end()
        }),
    })
  }

  function makeWebhookStreamTextMock(toolResults: { toolCallId: string }[]) {
    return (options: any) => ({
      text: (async () => {
        if (options.onStepFinish) {
          await options.onStepFinish({
            content: [],
            toolCalls: toolResults.map(r => ({ toolCallId: r.toolCallId })),
            toolResults,
          })
        }
        return "response"
      })(),
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      usage: Promise.resolve({
        inputTokens: 0,
        outputTokens: 0,
      }),
    })
  }

  beforeAll(async () => {
    await config.init("chat-conversation-quota")
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        chatApp = {
          _id: docIds.generateChatAppID(),
          agents: [{ agentId: "agent-1", isEnabled: true, isDefault: false }],
          live: true,
          createdAt: now,
        }
        await db.put(chatApp)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    addActionMock.mockClear()
    jest.mocked(streamText).mockClear()
    sessionLogIndexer = createMockSessionLogIndexer()
    jest
      .mocked(agentLogs.createSessionLogIndexer)
      .mockReturnValue(sessionLogIndexer)
    ;(
      sdk.ai.agents.getOrThrow as jest.MockedFunction<
        typeof sdk.ai.agents.getOrThrow
      >
    ).mockResolvedValue({
      _id: "agent-1",
      name: "Test Agent",
      aiconfig: "config-1",
    } as any)
    ;(
      sdk.ai.agents.buildPromptAndTools as jest.MockedFunction<
        typeof sdk.ai.agents.buildPromptAndTools
      >
    ).mockResolvedValue({
      systemPrompt: "system",
      tools: { tool1: {} as any },
      toolDisplayNames: {},
    })
    ;(
      sdk.ai.llm.createLLM as jest.MockedFunction<typeof sdk.ai.llm.createLLM>
    ).mockResolvedValue({
      chat: {} as any,
      providerOptions: jest.fn().mockReturnValue({}),
      uploadFile: jest.fn(),
    })
    ;(
      convertToModelMessages as jest.MockedFunction<
        typeof convertToModelMessages
      >
    ).mockResolvedValue([])
    ;(
      retrieveContextForAgent as jest.MockedFunction<
        typeof retrieveContextForAgent
      >
    ).mockResolvedValue({ text: "", chunks: [], sources: [] })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("agentChatStream", () => {
    it("counts each completed tool call as one action", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(
          makeStreamTextMock([
            { toolCallId: "c1" },
            { toolCallId: "c2" },
          ]) as any
        )

      const headers = await config.defaultHeaders({}, true)
      const res = await config
        .getRequest()!
        .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
        .set(headers)
        .send({
          agentId: "agent-1",
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
          transient: true,
        })

      expect(res.status).toBe(200)
      expect(addActionMock).toHaveBeenCalledTimes(2)
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest.mocked(streamText).mockImplementation(makeStreamTextMock([]) as any)

      const headers = await config.defaultHeaders({}, true)
      const res = await config
        .getRequest()!
        .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
        .set(headers)
        .send({
          agentId: "agent-1",
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
          transient: true,
        })

      expect(res.status).toBe(200)
      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("does not include ragSources when list_knowledge_files returns successfully", async () => {
      let finishMetadata: Record<string, any> | undefined
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue({
        _id: "agent-1",
        name: "Test Agent",
        aiconfig: "config-1",
        knowledgeBases: ["kb-1"],
      } as any)
      ;(
        retrieveContextForAgent as jest.MockedFunction<
          typeof retrieveContextForAgent
        >
      ).mockResolvedValue({
        text: "Retrieved context",
        chunks: [],
        sources: [
          {
            sourceId: "pricing-source",
            filename: "Budibase Enterprise Pricing V8.pdf",
          },
        ],
      })
      jest.mocked(streamText).mockImplementation(
        makeStreamTextMockWithMetadata({
          toolCalls: [
            { toolCallId: "call-1", toolName: "list_knowledge_files" },
          ],
          toolResults: [
            { toolCallId: "call-1", toolName: "list_knowledge_files" },
          ],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders({}, true)
      const res = await withRagEnabled(async () =>
        config
          .getRequest()!
          .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
          .set(headers)
          .send({
            agentId: "agent-1",
            messages: [
              {
                id: "msg-1",
                role: "user",
                parts: [{ type: "text", text: "how many files do I have" }],
              },
            ],
            transient: true,
          })
      )

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toBeUndefined()
    })

    it("keeps ragSources when list_knowledge_files call fails", async () => {
      let finishMetadata: Record<string, any> | undefined
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue({
        _id: "agent-1",
        name: "Test Agent",
        aiconfig: "config-1",
        knowledgeBases: ["kb-1"],
      } as any)
      ;(
        retrieveContextForAgent as jest.MockedFunction<
          typeof retrieveContextForAgent
        >
      ).mockResolvedValue({
        text: "Retrieved context",
        chunks: [],
        sources: [
          {
            sourceId: "pricing-source",
            filename: "Budibase Enterprise Pricing V8.pdf",
          },
        ],
      })
      jest.mocked(streamText).mockImplementation(
        makeStreamTextMockWithMetadata({
          toolCalls: [
            { toolCallId: "call-1", toolName: "list_knowledge_files" },
          ],
          toolResults: [],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders({}, true)
      const res = await withRagEnabled(async () =>
        config
          .getRequest()!
          .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
          .set(headers)
          .send({
            agentId: "agent-1",
            messages: [
              {
                id: "msg-1",
                role: "user",
                parts: [{ type: "text", text: "how many files do I have" }],
              },
            ],
            transient: true,
          })
      )

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toEqual([
        {
          sourceId: "pricing-source",
          filename: "Budibase Enterprise Pricing V8.pdf",
        },
      ])
    })

    it("includes ragSources when no knowledge file listing tool is called", async () => {
      let finishMetadata: Record<string, any> | undefined
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue({
        _id: "agent-1",
        name: "Test Agent",
        aiconfig: "config-1",
        knowledgeBases: ["kb-1"],
      } as any)
      ;(
        retrieveContextForAgent as jest.MockedFunction<
          typeof retrieveContextForAgent
        >
      ).mockResolvedValue({
        text: "Retrieved context",
        chunks: [],
        sources: [
          {
            sourceId: "pricing-source",
            filename: "Budibase Enterprise Pricing V8.pdf",
          },
        ],
      })
      jest.mocked(streamText).mockImplementation(
        makeStreamTextMockWithMetadata({
          toolCalls: [],
          toolResults: [],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders({}, true)
      const res = await withRagEnabled(async () =>
        config
          .getRequest()!
          .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
          .set(headers)
          .send({
            agentId: "agent-1",
            messages: [
              {
                id: "msg-1",
                role: "user",
                parts: [{ type: "text", text: "summarize the pricing file" }],
              },
            ],
            transient: true,
          })
      )

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toEqual([
        {
          sourceId: "pricing-source",
          filename: "Budibase Enterprise Pricing V8.pdf",
        },
      ])
    })

    it("does not include ragSources when retrieved context text is empty", async () => {
      let finishMetadata: Record<string, any> | undefined
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue({
        _id: "agent-1",
        name: "Test Agent",
        aiconfig: "config-1",
        knowledgeBases: ["kb-1"],
      } as any)
      ;(
        retrieveContextForAgent as jest.MockedFunction<
          typeof retrieveContextForAgent
        >
      ).mockResolvedValue({
        text: "   ",
        chunks: [],
        sources: [
          {
            sourceId: "pricing-source",
            filename: "Budibase Enterprise Pricing V8.pdf",
          },
        ],
      })
      jest.mocked(streamText).mockImplementation(
        makeStreamTextMockWithMetadata({
          toolCalls: [],
          toolResults: [],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders({}, true)
      const res = await withRagEnabled(async () =>
        config
          .getRequest()!
          .post(`/api/chatapps/${chatApp._id}/conversations/new/stream`)
          .set(headers)
          .send({
            agentId: "agent-1",
            messages: [
              {
                id: "msg-1",
                role: "user",
                parts: [{ type: "text", text: "summarize the pricing file" }],
              },
            ],
            transient: true,
          })
      )

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toBeUndefined()
    })
  })

  describe("webhookChat", () => {
    it("allows configured channel deployments when internal agent chat is disabled", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(makeWebhookStreamTextMock([]) as any)

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          const db = context.getWorkspaceDB()
          const disabledChatApp: ChatApp = {
            ...chatApp,
            _id: docIds.generateChatAppID(),
            agents: [
              { agentId: "agent-1", isEnabled: false, isDefault: false },
            ],
          }
          await db.put(disabledChatApp)

          const result = await webhookChat({
            chat: {
              chatAppId: disabledChatApp._id!,
              agentId: "agent-1",
              channel: {
                provider: AgentChannelProvider.MSTEAMS,
                externalUserId: "teams-user-1",
              },
              messages: [
                {
                  id: "msg-1",
                  role: "user",
                  parts: [{ type: "text", text: "hello" }],
                },
              ],
            },
            user: { _id: "user-1" } as any,
          })

          expect(result.assistantText).toBe("response")
        }
      )
    })

    it("counts each completed tool call as one action", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(
          makeWebhookStreamTextMock([
            { toolCallId: "c1" },
            { toolCallId: "c2" },
            { toolCallId: "c3" },
          ]) as any
        )

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          await webhookChat({
            chat: {
              chatAppId: chatApp._id!,
              agentId: "agent-1",
              messages: [
                {
                  id: "msg-1",
                  role: "user",
                  parts: [{ type: "text", text: "hello" }],
                },
              ],
            },
            user: { _id: "user-1" } as any,
          })
        }
      )

      expect(addActionMock).toHaveBeenCalledTimes(3)
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(makeWebhookStreamTextMock([]) as any)

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          await webhookChat({
            chat: {
              chatAppId: chatApp._id!,
              agentId: "agent-1",
              messages: [
                {
                  id: "msg-1",
                  role: "user",
                  parts: [{ type: "text", text: "hello" }],
                },
              ],
            },
            user: { _id: "user-1" } as any,
          })
        }
      )

      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("indexes session logs when response metadata rejects", async () => {
      const responseError = new Error("response metadata failed")
      jest.mocked(streamText).mockImplementation(
        ((options: any) =>
          ({
            text: (async () => {
              if (options.onStepFinish) {
                await options.onStepFinish({
                  content: [],
                  toolCalls: [],
                  toolResults: [],
                  response: { id: "gen-test" },
                })
              }
              return "response"
            })(),
            response: Promise.reject(responseError),
            usage: Promise.resolve({
              inputTokens: 0,
              outputTokens: 0,
            }),
          }) as unknown as ReturnType<typeof streamText>) as any
      )

      await expect(
        context.doInWorkspaceContext(config.getProdWorkspaceId(), async () => {
          await webhookChat({
            chat: {
              chatAppId: chatApp._id!,
              agentId: "agent-1",
              messages: [
                {
                  id: "msg-1",
                  role: "user",
                  parts: [{ type: "text", text: "hello" }],
                },
              ],
            },
            user: { _id: "user-1" } as any,
          })
        })
      ).rejects.toThrow("response metadata failed")

      expect(sessionLogIndexer.addRequestId).toHaveBeenCalledWith("gen-test")
      expect(sessionLogIndexer.index).toHaveBeenCalledTimes(1)
    })
  })
})

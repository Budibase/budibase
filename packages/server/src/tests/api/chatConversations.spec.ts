import { context, docIds, roles } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import { DocumentType } from "@budibase/types"
import type {
  Agent,
  ChatApp,
  ChatConversation,
  ChatConversationRequest,
  User,
} from "@budibase/types"
import type { ToolSet } from "ai"
import type { ServerResponse } from "http"
import {
  convertToModelMessages,
  extractReasoningMiddleware,
  streamText,
  wrapLanguageModel,
} from "ai"
import TestConfiguration from "../utilities/TestConfiguration"
import {
  findLatestUserQuestion,
  prepareChatConversationForSave,
  truncateTitle,
} from "../../api/controllers/ai/chatConversations"
import sdk from "../../sdk"

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    ai: {
      ...actual.ai,
      agentSystemPrompt: jest.fn(() => "system"),
      createLiteLLMOpenAI: jest.fn(),
    },
  }
})

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    convertToModelMessages: jest.fn(),
    extractReasoningMiddleware: jest.fn(),
    streamText: jest.fn(),
    wrapLanguageModel: jest.fn(),
  }
})

jest.mock("../../sdk/aiConfig", () => {
  const actual = jest.requireActual("../../sdk/aiConfig")
  return {
    ...actual,
    getLiteLLMModelConfigOrThrow: jest.fn(),
  }
})

jest.mock("../../sdk/workspace/ai/agents", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/agents")
  return {
    ...actual,
    getOrThrow: jest.fn(),
    listAgentFiles: jest.fn(),
    buildPromptAndTools: jest.fn(),
  }
})

describe("chat conversations authorization", () => {
  const config = new TestConfiguration()
  let userA: User
  let userB: User
  let chatApp: ChatApp
  let otherChatApp: ChatApp
  let convoA: ChatConversation
  let convoB: ChatConversation
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
          enabledAgents: [{ agentId: "agent-1" }],
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
        otherChatApp = {
          _id: docIds.generateChatAppID(),
          enabledAgents: [{ agentId: "agent-2" }],
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
        await db.put(convoB)
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
    expect(res.body.map((chat: ChatConversation) => chat._id)).toEqual([
      convoA._id,
    ])
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

  it("blocks deleting a conversation from a different chat app", async () => {
    const headers = await headersForUser(userA)

    const res = await config
      .getRequest()!
      .delete(`/api/chatapps/${chatApp._id}/conversations/${otherAppConvo._id}`)
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

    const result = prepareChatConversationForSave({
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

    const result = prepareChatConversationForSave({
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
})

describe("chat conversation transient behavior", () => {
  const config = new TestConfiguration()
  const agentId = "agent-1"
  let chatApp: ChatApp

  const mockMessages: ChatConversationRequest["messages"] = [
    {
      id: "message-1",
      role: "assistant",
      parts: [{ type: "text", text: "hello" }],
    },
  ]

  beforeAll(async () => {
    await config.init("chat-conversation-transient")
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const db = context.getWorkspaceDB()
        const now = new Date().toISOString()
        chatApp = {
          _id: docIds.generateChatAppID(),
          enabledAgents: [{ agentId }],
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
    type ChatModel = ReturnType<
      ReturnType<typeof ai.createLiteLLMOpenAI>["chat"]
    >

    const mockAgent: Agent = {
      _id: agentId,
      name: "Mock Agent",
      aiconfig: "config-1",
    }
    const mockModel = {} as ChatModel
    const mockMiddleware = {} as unknown as ReturnType<
      typeof extractReasoningMiddleware
    >
    const tools: ToolSet = {}

    ;(
      sdk.ai.agents.getOrThrow as jest.MockedFunction<
        typeof sdk.ai.agents.getOrThrow
      >
    ).mockResolvedValue(mockAgent)
    ;(
      sdk.ai.agents.listAgentFiles as jest.MockedFunction<
        typeof sdk.ai.agents.listAgentFiles
      >
    ).mockResolvedValue([])
    ;(
      sdk.ai.agents.buildPromptAndTools as jest.MockedFunction<
        typeof sdk.ai.agents.buildPromptAndTools
      >
    ).mockResolvedValue({ systemPrompt: "system", tools })
    ;(
      sdk.aiConfigs.getLiteLLMModelConfigOrThrow as jest.MockedFunction<
        typeof sdk.aiConfigs.getLiteLLMModelConfigOrThrow
      >
    ).mockResolvedValue({
      modelName: "model-1",
      modelId: "model-1",
      apiKey: "api-key",
      baseUrl: "http://localhost",
    })

    const openAiMock = {
      chat: () => mockModel,
    } as unknown as ReturnType<typeof ai.createLiteLLMOpenAI>

    ;(
      ai.createLiteLLMOpenAI as jest.MockedFunction<
        typeof ai.createLiteLLMOpenAI
      >
    ).mockReturnValue(openAiMock)
    ;(
      convertToModelMessages as jest.MockedFunction<
        typeof convertToModelMessages
      >
    ).mockResolvedValue([])
    ;(streamText as jest.MockedFunction<typeof streamText>).mockImplementation(
      () =>
        ({
          pipeUIMessageStreamToResponse: async (
            res: ServerResponse,
            options?: unknown
          ) => {
            const finish = (
              options as {
                onFinish?: ({
                  messages,
                }: {
                  messages: ChatConversationRequest["messages"]
                }) => Promise<void> | void
              }
            )?.onFinish
            if (finish) {
              await finish({ messages: mockMessages })
            }
            res.end()
          },
        }) as unknown as ReturnType<typeof streamText>
    )
    ;(
      extractReasoningMiddleware as jest.MockedFunction<
        typeof extractReasoningMiddleware
      >
    ).mockReturnValue(mockMiddleware)
    ;(
      wrapLanguageModel as jest.MockedFunction<typeof wrapLanguageModel>
    ).mockImplementation(({ model }) => model)
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

  it("persists conversations when transient is false", async () => {
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
        expect(docs.rows[0].doc?.messages).toEqual(mockMessages)
      }
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

    expect(findLatestUserQuestion(chat)).toBe("latest question")
  })

  it("truncates titles with an ellipsis", () => {
    const longMessage = "a".repeat(130)

    expect(truncateTitle(longMessage)).toBe(`${"a".repeat(117)}...`)
  })
})

describe("chat conversation path validation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("chat-conversation-validation")
  })

  afterAll(() => {
    config.end()
  })

  it("rejects mismatched chatAppId between path and body", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post("/api/chatapps/chatapp-path/conversations/new/stream")
      .set(headers)
      .send({
        chatAppId: "chatapp-body",
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
      .post("/api/chatapps/chatapp-path/conversations/convo-path/stream")
      .set(headers)
      .send({
        chatAppId: "chatapp-path",
        agentId: "agent-1",
        _id: "convo-body",
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })
})

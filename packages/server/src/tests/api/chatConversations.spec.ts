import { context, docIds, features, roles } from "@budibase/backend-core"
import {
  ActionType,
  AgentChannelProvider,
  DocumentType,
  FeatureFlag,
} from "@budibase/types"
import type {
  Agent,
  AgentOperation,
  ChatConversation,
  ChatConversationRequest,
  User,
} from "@budibase/types"
import type { LanguageModelUsage, ModelMessage, ToolSet } from "ai"
import { convertToModelMessages, pruneMessages, streamText } from "ai"
import { quotas } from "@budibase/pro"
import TestConfiguration from "../utilities/TestConfiguration"
import sdk from "../../sdk"
import * as agentLogs from "../../sdk/workspace/ai/agentLogs"
import { requesterTools } from "../../sdk/workspace/ai/tests/utils"
import type { LanguageModelV4 } from "@ai-sdk/provider"
import { webhookChat } from "../../api/controllers/ai"
import { MockLanguageModelV4 } from "ai/test"

const mockAiConfigsFind = jest.fn()

jest.mock("../../sdk/workspace/ai/configs", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/configs")
  return {
    ...actual,
    find: (...args: any[]) => mockAiConfigsFind(...args),
  }
})

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      addAction: jest
        .fn()
        .mockImplementation((_type: ActionType, fn: () => Promise<unknown>) =>
          fn()
        ),
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
      if (
        this.settings.headers?.["x-litellm-tags"] === "bb-operation-routing"
      ) {
        return {
          output: Promise.resolve({
            action: "select_operation",
            operationId: "op-1",
            intent: "execute",
            reason: "Test operation",
          }),
        }
      }

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

const createMockSessionLogIndexer = () => ({
  addRequestId: jest.fn(),
  index: jest.fn().mockResolvedValue(undefined),
  getRequestIds: jest.fn().mockReturnValue([]),
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
  new MockLanguageModelV4({
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

const agentPreviewStreamPath = (agentId: string, chatConversationId = "new") =>
  `/api/agents/${agentId}/conversations/${chatConversationId}/stream`

const buildChatConversation = (
  overrides: Partial<ChatConversation> & { agentId: string }
): ChatConversation => ({
  _id: docIds.generateChatConversationID(),
  userId: "user-1",
  messages: [],
  title: "conversation",
  createdAt: new Date().toISOString(),
  ...overrides,
})

type StreamTextMock = (
  ...args: Parameters<typeof streamText>
) => ReturnType<typeof streamText>

const buildWebhookTestAgent = (
  operationOverrides: Partial<AgentOperation> = {}
): Agent =>
  ({
    _id: "agent-1",
    name: "Test Agent",
    aiconfig: "config-1",
    operations: [
      {
        id: "op-1",
        name: "Support",
        live: true,
        promptInstructions: "Help the user.",
        enabledTools: requesterTools(),
        ...operationOverrides,
      },
    ],
  }) as Agent

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
      agentId: "agent-1",
      userId: "user-1",
      title: "old title",
      messages: [],
      createdAt: "2023-12-31T12:00:00.000Z",
      updatedAt: "2023-12-31T12:00:00.000Z",
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: existingChat._id!,
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
      agentId: "agent-2",
      userId: "user-2",
      title: "new chat",
      messages: [],
    }

    const result = sdk.ai.chatConversations.prepareChatConversationForSave({
      chatId: chat._id!,
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

describe("chat conversation preview stream", () => {
  const config = new TestConfiguration()
  const agentId = "agent-1"
  let sessionLogIndexer: ReturnType<typeof createMockSessionLogIndexer>

  beforeAll(async () => {
    await config.init("chat-conversation-preview")
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
    ).mockResolvedValue({
      systemPrompt: "system",
      tools,
      toolDisplayNames: {},
      toolSources: {},
    })
    ;(
      sdk.ai.llm.createLLM as jest.MockedFunction<typeof sdk.ai.llm.createLLM>
    ).mockResolvedValue({
      chat: createChatTestLanguageModel() as LanguageModelV4,
      providerOptions: jest.fn(),
      uploadFile: jest.fn(),
    })
    mockAiConfigsFind.mockResolvedValue({ _id: "config-1" } as any)
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

  it("does not persist preview conversations", async () => {
    setupMocks()
    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
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
        expect(docs.rows.length).toBe(0)
      }
    )
  })

  it("rejects stream without preview mode", async () => {
    setupMocks()
    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
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

    expect(res.status).toBe(400)
    expect(res.body.message).toBe("Preview mode is required")
  })

  it("disables tool calling when no tools are enabled", async () => {
    setupMocks()
    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
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
      })
    )
    expect(jest.mocked(streamText).mock.calls[0]?.[0]).not.toHaveProperty(
      "toolChoice"
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

    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
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
  const agentId = "agent-1"
  let basicUser: User
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
        pathConversation = buildChatConversation({
          agentId,
          userId: config.getUser()._id!,
          title: "body conversation",
        })
        await db.put(pathConversation)
      }
    )
  })

  afterAll(() => {
    config.end()
  })

  it("rejects mismatched agentId between path and body", async () => {
    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId: "agent-2",
        isPreview: true,
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })

  it("rejects mismatched chatConversationId between path and body", async () => {
    const headers = await config.defaultHeaders()

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId, pathConversation._id))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
        _id: docIds.generateChatConversationID(),
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })

  it("rejects preview mode for non-builder users in development", async () => {
    const headers = await config.withUser(basicUser, async () =>
      config.defaultHeaders()
    )

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(403)
  })

  it("rejects preview mode in production workspaces", async () => {
    const headers = await config.defaultHeaders({}, true)

    const res = await config
      .getRequest()!
      .post(agentPreviewStreamPath(agentId))
      .set(headers)
      .send({
        agentId,
        isPreview: true,
        messages: [],
        title: "hello",
      })

    expect(res.status).toBe(400)
  })
})

describe("Agent chat tool call tracking", () => {
  const config = new TestConfiguration()
  const agentId = "agent-1"
  let sessionLogIndexer: ReturnType<typeof createMockSessionLogIndexer>
  const addActionMock = jest.mocked(quotas.addAction)

  const lmTestUsage = (
    inputTokens: number,
    outputTokens: number
  ): LanguageModelUsage => ({
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    inputTokenDetails: {
      noCacheTokens: inputTokens,
      cacheReadTokens: undefined,
      cacheWriteTokens: undefined,
    },
    outputTokenDetails: {
      textTokens: outputTokens,
      reasoningTokens: undefined,
    },
  })

  function mockPipeStreamText({
    content = [],
    toolCalls,
    toolResults = [],
    onMetadata,
    stepLmUsages,
    finishTotalLmUsage,
  }: {
    content?: {
      type: string
      toolCallId?: string
      toolName?: string
      input?: unknown
      error?: unknown
    }[]
    toolCalls?: { toolCallId: string; toolName?: string }[]
    toolResults?: {
      toolCallId: string
      toolName?: string
      preliminary?: boolean
    }[]
    onMetadata?: (metadata: {
      startMetadata: Record<string, any> | undefined
      finishMetadata: Record<string, any> | undefined
    }) => void
    stepLmUsages?: LanguageModelUsage[]
    finishTotalLmUsage?: LanguageModelUsage
  } = {}) {
    const resolvedToolCalls =
      toolCalls ??
      toolResults.map(r => ({ toolCallId: r.toolCallId, toolName: r.toolName }))

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
            const usages = stepLmUsages?.length ? stepLmUsages : [undefined]
            for (const usage of usages) {
              await options.onStepFinish({
                content,
                toolCalls: resolvedToolCalls,
                toolResults,
                response: { id: "step-resp" } as any,
                usage,
              })
            }
          }

          onMetadata?.({
            startMetadata: pipeOptions?.messageMetadata?.({
              part: { type: "start" },
            }),
            finishMetadata: pipeOptions?.messageMetadata?.({
              part: {
                type: "finish",
                finishReason: "stop",
                totalUsage: finishTotalLmUsage,
              },
            }),
          })

          if (pipeOptions?.onFinish) {
            await pipeOptions.onFinish({ messages: [] })
          }
          res.end()
        }),
    })
  }

  const makeAssistantTextChunks = (text = "response") => [
    { type: "start" },
    { type: "text-start", id: "text-1" },
    { type: "text-delta", id: "text-1", delta: text },
    { type: "text-end", id: "text-1" },
    { type: "finish", finishReason: "stop" },
  ]

  function makeWebhookStreamTextMock({
    content = [],
    toolCalls = [],
    toolResults = [],
    text = "response",
    chunks = makeAssistantTextChunks(text),
  }: {
    content?: {
      type: string
      toolCallId?: string
      toolName?: string
      input?: unknown
      error?: unknown
    }[]
    toolCalls?: { toolCallId: string; toolName?: string }[]
    toolResults?: {
      toolCallId: string
      toolName?: string
      output?: unknown
      preliminary?: boolean
    }[]
    text?: string
    chunks?: Record<string, unknown>[]
  }): StreamTextMock {
    const impl = async (options: any) => {
      const stepToolCalls = toolCalls.length
        ? toolCalls
        : toolResults.map(result => ({
            toolCallId: result.toolCallId,
            toolName: result.toolName,
          }))
      if (options.onStepFinish) {
        await options.onStepFinish({
          content,
          toolCalls: stepToolCalls,
          toolResults,
        })
      }

      return {
        toUIMessageStream: jest
          .fn()
          .mockImplementation(
            (streamOptions: { generateMessageId?: () => string } = {}) => {
              const streamChunks = chunks.map(chunk =>
                chunk.type === "start" &&
                !("messageId" in chunk) &&
                streamOptions.generateMessageId
                  ? {
                      ...chunk,
                      messageId: streamOptions.generateMessageId(),
                    }
                  : chunk
              )

              return aiActual.simulateReadableStream({ chunks: streamChunks })
            }
          ),
        text: Promise.resolve(text),
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
      }
    }

    return impl as unknown as StreamTextMock
  }

  beforeAll(async () => {
    await config.init("chat-conversation-quota")
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
      toolSources: {},
    })
    ;(
      sdk.ai.llm.createLLM as jest.MockedFunction<typeof sdk.ai.llm.createLLM>
    ).mockResolvedValue({
      chat: {} as any,
      providerOptions: jest.fn().mockReturnValue({}),
      uploadFile: jest.fn(),
    })
    mockAiConfigsFind.mockResolvedValue({ _id: "config-1" } as any)
    ;(
      convertToModelMessages as jest.MockedFunction<
        typeof convertToModelMessages
      >
    ).mockResolvedValue([])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("agentChatStream", () => {
    it("counts each completed tool call as one action", async () => {
      jest.mocked(streamText).mockImplementation(
        mockPipeStreamText({
          toolResults: [{ toolCallId: "c1" }, { toolCallId: "c2" }],
        }) as any
      )

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(addActionMock).toHaveBeenCalledTimes(2)
    })

    it("classifies preview streams as Chat Preview even without a sessionId", async () => {
      jest.mocked(streamText).mockImplementation(mockPipeStreamText() as any)

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId, "chatconvo_preview"))
        .set(headers)
        .send({
          agentId: "agent-1",
          _id: "chatconvo_preview",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(sdk.ai.llm.createLLM).toHaveBeenCalledWith(
        "config-1",
        "chat-preview:chatconvo_preview",
        undefined,
        "agent-1"
      )
    })

    it("prefixes a supplied preview sessionId that is missing the chat-preview marker", async () => {
      jest.mocked(streamText).mockImplementation(mockPipeStreamText() as any)

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          sessionId: "builder-tab-1",
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(sdk.ai.llm.createLLM).toHaveBeenCalledWith(
        "config-1",
        "chat-preview:builder-tab-1",
        undefined,
        "agent-1"
      )
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest.mocked(streamText).mockImplementation(mockPipeStreamText() as any)

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("exposes context usage from the first model step in metadata", async () => {
      let finishMetadata: Record<string, any> | undefined
      jest.mocked(streamText).mockImplementation(
        mockPipeStreamText({
          toolCalls: [],
          toolResults: [],
          stepLmUsages: [lmTestUsage(1700, 20), lmTestUsage(3500, 120)],
          finishTotalLmUsage: lmTestUsage(5200, 140),
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "hello" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(finishMetadata?.usage?.segments).toEqual([
        { type: "system", tokens: 2 },
        { type: "input", tokens: 1698 },
        { type: "output", tokens: 120 },
      ])
    })

    it("includes ragSources when search_knowledge returns sources", async () => {
      let finishMetadata: Record<string, any> | undefined
      jest.mocked(streamText).mockImplementation(
        mockPipeStreamText({
          toolCalls: [{ toolCallId: "call-1", toolName: "search_knowledge" }],
          toolResults: [
            {
              toolCallId: "call-1",
              toolName: "search_knowledge",
              output: {
                sources: [
                  {
                    sourceId: "pricing-source",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                ],
              },
            } as any,
          ],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "summarize the pricing file" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toBeUndefined()
    })

    it("includes ragSources only when report_used_sources is called with known ids", async () => {
      let finishMetadata: Record<string, any> | undefined
      jest.mocked(streamText).mockImplementation(
        mockPipeStreamText({
          toolCalls: [
            { toolCallId: "call-1", toolName: "search_knowledge" },
            { toolCallId: "call-2", toolName: "report_used_sources" },
          ],
          toolResults: [
            {
              toolCallId: "call-1",
              toolName: "search_knowledge",
              output: {
                sources: [
                  {
                    sourceId: "pricing-source",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                  {
                    sourceId: "faq-source",
                    filename: "FAQ.md",
                  },
                ],
              },
            } as any,
            {
              toolCallId: "call-2",
              toolName: "report_used_sources",
              output: {
                accepted: [
                  {
                    sourceId: "pricing-source",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                ],
              },
            } as any,
          ],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "summarize the pricing file" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toEqual([
        {
          sourceId: "pricing-source",
          filename: "Budibase Enterprise Pricing V8.pdf",
        },
      ])
    })

    it("ignores report_used_sources ids that were not returned by search_knowledge", async () => {
      let finishMetadata: Record<string, any> | undefined
      jest.mocked(streamText).mockImplementation(
        mockPipeStreamText({
          toolCalls: [
            { toolCallId: "call-1", toolName: "search_knowledge" },
            { toolCallId: "call-2", toolName: "report_used_sources" },
          ],
          toolResults: [
            {
              toolCallId: "call-1",
              toolName: "search_knowledge",
              output: {
                sources: [
                  {
                    sourceId: "pricing-source",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                ],
              },
            } as any,
            {
              toolCallId: "call-2",
              toolName: "report_used_sources",
              output: {
                accepted: [],
                ignored: ["unknown-source"],
              },
            } as any,
          ],
          onMetadata: metadata => {
            finishMetadata = metadata.finishMetadata
          },
        }) as any
      )

      const headers = await config.defaultHeaders()
      const res = await config
        .getRequest()!
        .post(agentPreviewStreamPath(agentId))
        .set(headers)
        .send({
          agentId: "agent-1",
          isPreview: true,
          messages: [
            {
              id: "msg-1",
              role: "user",
              parts: [{ type: "text", text: "summarize the pricing file" }],
            },
          ],
        })

      expect(res.status).toBe(200)
      expect(finishMetadata?.ragSources).toBeUndefined()
    })
  })

  describe("webhookChat", () => {
    it("allows configured channel deployments", async () => {
      jest.mocked(streamText).mockImplementation(makeWebhookStreamTextMock({}))

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          const result = await webhookChat({
            chat: {
              agentId,
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
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolResults: [
            { toolCallId: "c1" },
            { toolCallId: "c2" },
            { toolCallId: "c3" },
          ],
        })
      )

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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
        }
      )

      expect(addActionMock).toHaveBeenCalledTimes(3)
    })

    it("creates and finalizes an agent request for webhook channels (e.g. Slack)", async () => {
      jest.mocked(streamText).mockImplementation(makeWebhookStreamTextMock({}))
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue(buildWebhookTestAgent())

      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
        async () => {
          await context.doInWorkspaceContext(
            config.getProdWorkspaceId(),
            async () => {
              await webhookChat({
                chat: {
                  agentId,
                  channel: {
                    provider: AgentChannelProvider.SLACK,
                    channelId: "C123",
                    externalUserId: "slack-user-1",
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

              const requests =
                await sdk.ai.agentRequests.fetchRequestsByAgent("agent-1")
              const request = requests.find(r => r.userId === "user-1")
              expect(request?.status).toEqual("completed")
            }
          )
        }
      )
    })

    it("marks the request as failed, not needs_input, when the escalate tool call itself fails", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          content: [
            {
              type: "tool-error",
              toolCallId: "call-1",
              toolName: "escalate",
              input: {},
              error: new Error("failed to create escalation"),
            },
          ],
          toolCalls: [{ toolCallId: "call-1", toolName: "escalate" }],
          text: "Trying to escalate...",
        })
      )
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue(
        buildWebhookTestAgent({ enabledTools: requesterTools("escalate") })
      )

      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
        async () => {
          await context.doInWorkspaceContext(
            config.getProdWorkspaceId(),
            async () => {
              await webhookChat({
                chat: {
                  agentId,
                  channel: {
                    provider: AgentChannelProvider.SLACK,
                    channelId: "C999",
                    externalUserId: "slack-user-2",
                  },
                  messages: [
                    {
                      id: "msg-1",
                      role: "user",
                      parts: [{ type: "text", text: "please escalate this" }],
                    },
                  ],
                },
                user: { _id: "user-2" } as any,
              })

              const requests =
                await sdk.ai.agentRequests.fetchRequestsByAgent("agent-1")
              const request = requests.find(r => r.userId === "user-2")
              expect(request?.status).toEqual("failed")
              expect(request?.error).toEqual("Tool call(s) failed: escalate")
              expect(
                (request?.actions ?? []).filter(
                  action => action.type === "tool_call"
                )
              ).toEqual([
                expect.objectContaining({
                  toolName: "escalate",
                  status: "error",
                }),
              ])
            }
          )
        }
      )
    })

    it("marks the request as failed, not needs_input, when escalate cannot actually raise an escalation (e.g. no reviewers configured)", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolCalls: [{ toolCallId: "call-1", toolName: "escalate" }],
          toolResults: [
            {
              toolCallId: "call-1",
              toolName: "escalate",
              output: {
                status: "unavailable",
                note: "Escalation is referenced but no reviewers are configured for this operation.",
              },
            },
          ],
          text: "I can't escalate this right now.",
        })
      )
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue(
        buildWebhookTestAgent({ enabledTools: requesterTools("escalate") })
      )

      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
        async () => {
          await context.doInWorkspaceContext(
            config.getProdWorkspaceId(),
            async () => {
              await webhookChat({
                chat: {
                  agentId,
                  channel: {
                    provider: AgentChannelProvider.SLACK,
                    channelId: "C888",
                    externalUserId: "slack-user-3",
                  },
                  messages: [
                    {
                      id: "msg-1",
                      role: "user",
                      parts: [{ type: "text", text: "please escalate this" }],
                    },
                  ],
                },
                user: { _id: "user-3" } as any,
              })

              const requests =
                await sdk.ai.agentRequests.fetchRequestsByAgent("agent-1")
              const request = requests.find(r => r.userId === "user-3")
              expect(request?.status).toEqual("failed")
              expect(request?.error).toEqual("Tool call(s) failed: escalate")
              expect(
                (request?.actions ?? []).filter(
                  action => action.type === "tool_call"
                )
              ).toEqual([
                expect.objectContaining({
                  toolName: "escalate",
                  status: "error",
                }),
              ])
            }
          )
        }
      )
    })

    it("counts each completed tool call as one tool_call action", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolResults: [
            { toolCallId: "c1", toolName: "list_calendars" },
            { toolCallId: "c2", toolName: "book_meeting" },
          ],
        })
      )
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue(buildWebhookTestAgent())

      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
        async () => {
          await context.doInWorkspaceContext(
            config.getProdWorkspaceId(),
            async () => {
              await webhookChat({
                chat: {
                  agentId,
                  channel: {
                    provider: AgentChannelProvider.SLACK,
                    channelId: "C777",
                    externalUserId: "slack-user-4",
                  },
                  messages: [
                    {
                      id: "msg-1",
                      role: "user",
                      parts: [{ type: "text", text: "book a meeting" }],
                    },
                  ],
                },
                user: { _id: "user-4" } as any,
              })

              const requests =
                await sdk.ai.agentRequests.fetchRequestsByAgent("agent-1")
              const request = requests.find(r => r.userId === "user-4")
              expect(
                (request?.actions ?? []).filter(
                  action => action.type === "tool_call"
                )
              ).toEqual([
                expect.objectContaining({
                  toolName: "list_calendars",
                  status: "success",
                }),
                expect.objectContaining({
                  toolName: "book_meeting",
                  status: "success",
                }),
              ])
            }
          )
        }
      )
    })

    it("does not record a tool_call action for list_session_escalations", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolResults: [
            { toolCallId: "c1", toolName: "list_session_escalations" },
            { toolCallId: "c2", toolName: "book_meeting" },
          ],
        })
      )
      ;(
        sdk.ai.agents.getOrThrow as jest.MockedFunction<
          typeof sdk.ai.agents.getOrThrow
        >
      ).mockResolvedValue(buildWebhookTestAgent())

      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.AI_AGENT_ACTIVITY]: true },
        async () => {
          await context.doInWorkspaceContext(
            config.getProdWorkspaceId(),
            async () => {
              await webhookChat({
                chat: {
                  agentId,
                  channel: {
                    provider: AgentChannelProvider.SLACK,
                    channelId: "C666",
                    externalUserId: "slack-user-5",
                  },
                  messages: [
                    {
                      id: "msg-1",
                      role: "user",
                      parts: [{ type: "text", text: "book a meeting" }],
                    },
                  ],
                },
                user: { _id: "user-5" } as any,
              })

              const requests =
                await sdk.ai.agentRequests.fetchRequestsByAgent("agent-1")
              const request = requests.find(r => r.userId === "user-5")
              expect(
                (request?.actions ?? []).filter(
                  action => action.type === "tool_call"
                )
              ).toEqual([
                expect.objectContaining({
                  toolName: "book_meeting",
                  status: "success",
                }),
              ])
            }
          )
        }
      )
    })

    it("returns RAG sources reported by the agent", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolResults: [
            {
              toolCallId: "call-1",
              toolName: "search_knowledge",
              output: {
                sources: [
                  {
                    sourceId: "pricing-source",
                    fileId: "file-1",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                  {
                    sourceId: "faq-source",
                    fileId: "file-2",
                    filename: "FAQ.md",
                  },
                ],
              },
            },
            {
              toolCallId: "call-2",
              toolName: "report_used_sources",
              output: {
                accepted: [
                  {
                    sourceId: "pricing-source",
                    fileId: "file-1",
                    filename: "Budibase Enterprise Pricing V8.pdf",
                  },
                ],
              },
            },
          ],
        })
      )

      const result = await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () =>
          await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
              },
              messages: [
                {
                  id: "msg-1",
                  role: "user",
                  parts: [{ type: "text", text: "summarize pricing" }],
                },
              ],
            },
            user: { _id: "user-1" } as any,
          })
      )

      expect(result.ragSources).toEqual([
        {
          sourceId: "pricing-source",
          fileId: "file-1",
          filename: "Budibase Enterprise Pricing V8.pdf",
        },
      ])
    })

    it("streams assistant text deltas for webhook delivery", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          text: "Mock response",
          chunks: [
            { type: "start" },
            { type: "text-start", id: "text-1" },
            { type: "text-delta", id: "text-1", delta: "Mock " },
            { type: "text-delta", id: "text-1", delta: "response" },
            { type: "text-end", id: "text-1" },
            { type: "finish", finishReason: "stop" },
          ],
        })
      )

      let streamedText = ""
      const result = await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () =>
          await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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
            onAssistantStream: async stream => {
              for await (const chunk of stream) {
                streamedText += chunk
              }
            },
          })
      )

      expect(streamedText).toBe("Mock response")
      expect(result.assistantText).toBe("Mock response")
    })

    it("generates an assistant message id for webhook responses", async () => {
      jest.mocked(streamText).mockImplementation(makeWebhookStreamTextMock({}))

      const result = await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () =>
          await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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
      )

      expect(result.messages[1].id).toEqual(expect.any(String))
      expect(result.messages[1].id).not.toBe("")
    })

    it("keeps assistant tool context in the returned webhook conversation", async () => {
      jest.mocked(streamText).mockImplementation(
        makeWebhookStreamTextMock({
          toolCalls: [{ toolCallId: "c1", toolName: "search_knowledge" }],
          toolResults: [{ toolCallId: "c1", toolName: "search_knowledge" }],
          chunks: [
            { type: "start" },
            { type: "text-start", id: "text-1" },
            { type: "text-delta", id: "text-1", delta: "response" },
            { type: "text-end", id: "text-1" },
            {
              type: "tool-input-available",
              toolCallId: "c1",
              toolName: "search_knowledge",
              input: { query: "hello" },
            },
            {
              type: "tool-output-available",
              toolCallId: "c1",
              output: {
                sources: [{ sourceId: "source-1", filename: "Source 1" }],
              },
            },
            { type: "finish", finishReason: "stop" },
          ],
        })
      )

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          const result = await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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

          expect(result.messages[1]).toMatchObject({
            role: "assistant",
          })
          expect(result.messages[1].parts).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: "text",
                text: "response",
              }),
              expect.objectContaining({
                state: "output-available",
                output: {
                  sources: [{ sourceId: "source-1", filename: "Source 1" }],
                },
              }),
            ])
          )
        }
      )
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest.mocked(streamText).mockImplementation(makeWebhookStreamTextMock({}))

      await context.doInWorkspaceContext(
        config.getProdWorkspaceId(),
        async () => {
          await webhookChat({
            chat: {
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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
        }
      )

      expect(addActionMock).not.toHaveBeenCalled()
    })

    it("indexes session logs when response metadata rejects", async () => {
      const responseError = new Error("response metadata failed")
      jest.mocked(streamText).mockImplementation(
        ((options: any) =>
          ({
            toUIMessageStream: jest.fn().mockReturnValue(
              aiActual.simulateReadableStream({
                chunks: makeAssistantTextChunks(),
              })
            ),
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
              agentId,
              channel: {
                provider: AgentChannelProvider.SLACK,
                channelId: "C123",
                externalUserId: "slack-user-1",
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
        })
      ).rejects.toThrow("response metadata failed")

      expect(sessionLogIndexer.addRequestId).toHaveBeenCalledWith("gen-test")
      expect(sessionLogIndexer.index).toHaveBeenCalledTimes(1)
    })
  })
})

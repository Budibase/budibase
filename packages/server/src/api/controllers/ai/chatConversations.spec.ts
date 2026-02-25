import { quotas } from "@budibase/pro"
import { agentChatStream, webhookChat } from "./chatConversations"

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

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: jest.fn().mockReturnValue({
        tryGet: jest.fn().mockImplementation((id: string) => {
          if (id === "chatapp-1") {
            return Promise.resolve({
              _id: "chatapp-1",
              agents: [{ agentId: "agent-1", isEnabled: true }],
            })
          }
          return Promise.resolve(null)
        }),
        put: jest.fn(),
      }),
    },
    features: { isEnabled: jest.fn().mockResolvedValue(false) },
    docIds: { ...actual.docIds, generateChatConversationID: jest.fn().mockReturnValue("chat-id") },
    getErrorMessage: jest.fn().mockReturnValue("error"),
  }
})

jest.mock("@budibase/shared-core", () => {
  const actual = jest.requireActual("@budibase/shared-core")
  return {
    ...actual,
    sdk: {
      ...actual.sdk,
      users: { ...actual.sdk?.users, isAdminOrBuilder: jest.fn().mockReturnValue(true) },
    },
  }
})

jest.mock("../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: {
        getOrThrow: jest.fn().mockResolvedValue({
          _id: "agent-1",
          name: "Test Agent",
          aiconfig: "config-1",
        }),
        buildPromptAndTools: jest.fn().mockResolvedValue({
          systemPrompt: "system",
          tools: { tool1: {}, tool2: {} },
        }),
      },
      llm: {
        createLLM: jest.fn().mockResolvedValue({
          chat: {},
          providerOptions: jest.fn().mockReturnValue({}),
        }),
      },
    },
  },
}))

jest.mock("../../../sdk/workspace/ai/agents", () => ({
  updatePendingToolCalls: jest.fn(),
  formatIncompleteToolCallError: jest.fn().mockReturnValue("error"),
}))

jest.mock("../../../sdk/workspace/ai/rag", () => ({
  retrieveContextForAgent: jest.fn().mockResolvedValue({ text: "", sources: [] }),
}))

jest.mock("./chatApps", () => ({
  assertChatAppIsLiveForUser: jest.fn(),
}))

jest.mock("ai", () => ({
  streamText: jest.fn(),
  convertToModelMessages: jest.fn().mockResolvedValue([]),
  extractReasoningMiddleware: jest.fn().mockReturnValue({}),
  wrapLanguageModel: jest.fn().mockReturnValue({}),
  stepCountIs: jest.fn().mockReturnValue(() => false),
  isTextUIPart: jest.fn().mockReturnValue(true),
}))

function makeStreamTextMock(toolResults: { toolCallId: string }[]) {
  return (options: any) => ({
    pipeUIMessageStreamToResponse: jest.fn().mockImplementation(
      async (res: any, pipeOptions: any) => {
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
      }
    ),
  })
}

function makeWebhookStreamTextMock(toolResults: { toolCallId: string }[]) {
  return async (options: any) => {
    if (options.onStepFinish) {
      await options.onStepFinish({
        content: [],
        toolCalls: toolResults.map(r => ({ toolCallId: r.toolCallId })),
        toolResults,
      })
    }
    return { text: Promise.resolve("response") }
  }
}

function makeCtx() {
  return {
    params: { chatAppId: "chatapp-1", chatConversationId: "new" },
    request: {
      body: {
        agentId: "agent-1",
        isPreview: true,
        messages: [
          {
            id: "msg-1",
            role: "user",
            parts: [{ type: "text", text: "hello" }],
          },
        ],
      },
    },
    user: { _id: "user-1", builder: { global: true }, admin: { global: true } },
    status: 200,
    set: jest.fn(),
    res: { setHeader: jest.fn(), write: jest.fn(), end: jest.fn() },
    respond: undefined as any,
  }
}

describe("Agent chat tool call tracking", () => {
  const { streamText } = require("ai")
  const addActionMock = quotas.addAction as jest.MockedFunction<
    typeof quotas.addAction
  >

  beforeEach(() => {
    addActionMock.mockClear()
    jest.mocked(streamText).mockClear()
  })

  describe("agentChatStream", () => {
    it("counts each completed tool call as one action", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(
          makeStreamTextMock([{ toolCallId: "c1" }, { toolCallId: "c2" }]) as any
        )

      await agentChatStream(makeCtx() as any)

      expect(addActionMock).toHaveBeenCalledTimes(2)
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(makeStreamTextMock([]) as any)

      await agentChatStream(makeCtx() as any)

      expect(addActionMock).not.toHaveBeenCalled()
    })
  })

  describe("webhookChat", () => {
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

      await webhookChat({
        chat: {
          chatAppId: "chatapp-1",
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

      expect(addActionMock).toHaveBeenCalledTimes(3)
    })

    it("counts zero actions when the agent makes no tool calls", async () => {
      jest
        .mocked(streamText)
        .mockImplementation(makeWebhookStreamTextMock([]) as any)

      await webhookChat({
        chat: {
          chatAppId: "chatapp-1",
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

      expect(addActionMock).not.toHaveBeenCalled()
    })
  })
})
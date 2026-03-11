import { quotas } from "@budibase/pro"
import { run } from "../../automations/steps/ai/agent"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    objectStore: {
      ...actual.objectStore,
      processAutomationAttachment: jest.fn(),
    },
  }
})

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return {
    ...actual,
    quotas: {
      ...actual.quotas,
      addAction: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
    },
  }
})

jest.mock("../../sdk/workspace/ai/agentLogs", () => ({
  createSessionLogIndexer: jest.fn(() => ({
    addRequestId: jest.fn(),
    index: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: {
        getOrThrow: jest.fn().mockResolvedValue({
          _id: "agent-id",
          name: "Test Agent",
          aiconfig: { provider: "openai", model: "gpt-4" },
          live: true,
        }),
        buildPromptAndTools: jest.fn().mockResolvedValue({
          systemPrompt: "You are a helpful assistant",
          tools: { queryTable: {}, callApi: {} },
        }),
      },
      llm: {
        createLLM: jest.fn().mockResolvedValue({
          chat: {},
          providerOptions: undefined,
          uploadFile: jest.fn(),
        }),
      },
      agentLogs: {
        addSessionLog: jest.fn().mockResolvedValue(undefined),
      },
    },
  },
}))

jest.mock("ai", () => ({
  ToolLoopAgent: jest.fn(),
  stepCountIs: jest.fn().mockReturnValue(() => false),
  convertToModelMessages: jest.fn().mockImplementation(async messages =>
    messages.map((message: any) => ({
      role: message.role,
      content:
        message.parts?.map((part: any) =>
          part.type === "text" ? { type: "text", text: part.text } : part
        ) || message.content,
    }))
  ),
  isFileUIPart: jest.fn().mockImplementation((part: any) => part.type === "file"),
  isTextUIPart: jest.fn().mockImplementation((part: any) => part.type === "text"),
  readUIMessageStream: jest.fn().mockReturnValue({
    [Symbol.asyncIterator]: () => {
      let done = false
      return {
        next: async () => {
          if (!done) {
            done = true
            return { done: false, value: { role: "assistant", parts: [] } }
          }
          return { done: true, value: undefined }
        },
      }
    },
  }),
  wrapLanguageModel: jest.fn().mockReturnValue({}),
  extractReasoningMiddleware: jest.fn().mockReturnValue({}),
  Output: { object: jest.fn() },
  jsonSchema: jest.fn(),
  tool: jest.fn().mockImplementation((t: any) => t),
}))

function makeToolLoopAgentMock(toolResults: { toolCallId: string }[]) {
  return ({ onStepFinish }: any) => ({
    stream: jest.fn().mockImplementation(async () => {
      onStepFinish({
        content: [],
        toolCalls: toolResults.map(r => ({ toolCallId: r.toolCallId })),
        toolResults,
      })
      return {
        toUIMessageStream: jest.fn().mockReturnValue({}),
        response: Promise.resolve({
          id: "gen-test",
          headers: {
            "x-litellm-response-cost": "0.0001",
          },
        }),
        text: Promise.resolve("Agent response"),
        usage: Promise.resolve({ totalTokens: 50 }),
        output: Promise.resolve(undefined),
      }
    }),
  })
}

describe("Agent step tool call tracking", () => {
  const addActionMock = quotas.addAction as jest.MockedFunction<
    typeof quotas.addAction
  >
  const processAutomationAttachmentMock = jest.mocked(
    require("@budibase/backend-core").objectStore.processAutomationAttachment
  )

  beforeEach(() => {
    addActionMock.mockClear()
    jest.mocked(require("ai").ToolLoopAgent).mockClear()
    processAutomationAttachmentMock.mockReset()
  })

  it("counts each completed tool call as one action", async () => {
    jest
      .mocked(require("ai").ToolLoopAgent)
      .mockImplementationOnce(
        makeToolLoopAgentMock([
          { toolCallId: "c1" },
          { toolCallId: "c2" },
          { toolCallId: "c3" },
        ])
      )

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Do things with tools" },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(addActionMock).toHaveBeenCalledTimes(3)
    expect(result.sessionId).toEqual(expect.any(String))
  })

  it("counts zero extra actions when the agent makes no tool calls", async () => {
    jest
      .mocked(require("ai").ToolLoopAgent)
      .mockImplementationOnce(makeToolLoopAgentMock([]))

    await run({
      inputs: { agentId: "agent-id", prompt: "Direct answer, no tools" },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(addActionMock).not.toHaveBeenCalled()
  })

  it("passes message inputs through to the agent stream", async () => {
    const streamMock = jest.fn().mockResolvedValue({
      toUIMessageStream: jest.fn().mockReturnValue({}),
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      text: Promise.resolve("Agent response"),
      usage: Promise.resolve({ totalTokens: 50 }),
      output: Promise.resolve(undefined),
    })

    jest.mocked(require("ai").ToolLoopAgent).mockImplementationOnce(
      () =>
        ({
          stream: streamMock,
        }) as any
    )

    await run({
      inputs: {
        agentId: "agent-id",
        prompt: "",
        message: {
          id: "msg-1",
          role: "user",
          parts: [
            {
              type: "file",
              mediaType: "text/plain",
              filename: "note.txt",
              url: "data:text/plain;base64,SGVsbG8=",
            },
          ],
        } as any,
      },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(streamMock).toHaveBeenCalledWith({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached file (note.txt):\nHello",
            },
          ],
        },
      ],
    })
  })

  it("builds a multimodal message from prompt and files", async () => {
    processAutomationAttachmentMock.mockResolvedValue({
      filename: "note.txt",
      content: require("stream").Readable.from(Buffer.from("Hello")),
    })

    const streamMock = jest.fn().mockResolvedValue({
      toUIMessageStream: jest.fn().mockReturnValue({}),
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      text: Promise.resolve("Agent response"),
      usage: Promise.resolve({ totalTokens: 50 }),
      output: Promise.resolve(undefined),
    })

    jest.mocked(require("ai").ToolLoopAgent).mockImplementationOnce(
      () =>
        ({
          stream: streamMock,
        }) as any
    )

    await run({
      inputs: {
        agentId: "agent-id",
        prompt: "summarize this",
        files: [{ url: "/tmp/file.txt", filename: "note.txt" }],
      },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(streamMock).toHaveBeenCalledWith({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached file (note.txt):\nHello",
            },
            {
              type: "text",
              text: "summarize this",
            },
          ],
        },
      ],
    })
  })

  it("builds a multimodal message from files without a prompt", async () => {
    processAutomationAttachmentMock.mockResolvedValue({
      filename: "note.txt",
      content: require("stream").Readable.from(Buffer.from("Hello")),
    })

    const streamMock = jest.fn().mockResolvedValue({
      toUIMessageStream: jest.fn().mockReturnValue({}),
      response: Promise.resolve({
        id: "gen-test",
        headers: {
          "x-litellm-response-cost": "0.0001",
        },
      }),
      text: Promise.resolve("Agent response"),
      usage: Promise.resolve({ totalTokens: 50 }),
      output: Promise.resolve(undefined),
    })

    jest.mocked(require("ai").ToolLoopAgent).mockImplementationOnce(
      () =>
        ({
          stream: streamMock,
        }) as any
    )

    await run({
      inputs: {
        agentId: "agent-id",
        files: [{ url: "/tmp/file.txt", filename: "note.txt" }],
      },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(streamMock).toHaveBeenCalledWith({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Attached file (note.txt):\nHello",
            },
          ],
        },
      ],
    })
  })
})

import { quotas } from "@budibase/pro"
import { ActionType } from "@budibase/types"
import { run } from "../../automations/steps/ai/agent"

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
    },
  }
})

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
        }),
      },
    },
  },
}))

jest.mock("ai", () => ({
  ToolLoopAgent: jest.fn(),
  stepCountIs: jest.fn().mockReturnValue(() => false),
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

function makeNoOutputError() {
  const error = new Error("No output generated. Check the stream for errors.")
  error.name = "AI_NoOutputGeneratedError"
  return error
}

function makeToolLoopAgentMock(
  toolResults: { toolCallId: string }[],
  overrides: {
    response?: Promise<{ id: string; headers: Record<string, string> }>
    text?: Promise<string>
    usage?: Promise<{ totalTokens: number }>
    output?: Promise<Record<string, unknown> | undefined>
  } = {}
) {
  return ({ onStepFinish }: any) => ({
    stream: jest.fn().mockImplementation(async () => {
      onStepFinish({
        content: [],
        toolCalls: toolResults.map(r => ({ toolCallId: r.toolCallId })),
        toolResults,
      })
      return {
        toUIMessageStream: jest.fn().mockReturnValue({}),
        response: overrides.response ?? Promise.resolve({
          id: "gen-test",
          headers: {
            "x-litellm-response-cost": "0.0001",
          },
        }),
        text: overrides.text ?? Promise.resolve("Agent response"),
        usage: overrides.usage ?? Promise.resolve({ totalTokens: 50 }),
        output: overrides.output ?? Promise.resolve(undefined),
      }
    }),
  })
}

describe("Agent step tool call tracking", () => {
  const addActionMock = quotas.addAction as jest.MockedFunction<
    typeof quotas.addAction
  >

  beforeEach(() => {
    addActionMock.mockClear()
    jest.mocked(require("ai").ToolLoopAgent).mockClear()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

  it("returns a controlled failure when response metadata has no generated output", async () => {
    jest.mocked(require("ai").ToolLoopAgent).mockImplementationOnce(
      makeToolLoopAgentMock([], {
        response: Promise.reject(makeNoOutputError()),
        text: Promise.resolve(""),
      })
    )

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Evaluate data" },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(result).toMatchObject({
      success: false,
      response: "No output generated. Check the stream for errors.",
      sessionId: expect.any(String),
    })
  })

  it("returns a controlled failure when text extraction has no generated output", async () => {
    jest.mocked(require("ai").ToolLoopAgent).mockImplementationOnce(
      makeToolLoopAgentMock([], {
        text: Promise.reject(makeNoOutputError()),
      })
    )

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Evaluate data" },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(result).toMatchObject({
      success: false,
      response: "No output generated. Check the stream for errors.",
      sessionId: expect.any(String),
    })
  })
})

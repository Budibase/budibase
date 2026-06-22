import { quotas } from "@budibase/pro"
import { ActionType } from "@budibase/types"
import { run } from "../../automations/steps/ai/agent"

jest.mock("../../sdk/workspace/ai/agents", () => {
  const actual = jest.requireActual("../../sdk/workspace/ai/agents")
  return {
    ...actual,
    prepareAgentRunContext: jest.fn(),
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
  const { prepareAgentRunContext } = jest.requireMock(
    "../../sdk/workspace/ai/agents"
  )
  const liveOperation = {
    id: "operation_1",
    name: "Main operation",
    live: true,
    enabledTools: [],
    knowledgeBases: ["kb_1"],
    allowKnowledgeSourceDownload: true,
  }

  beforeEach(() => {
    addActionMock.mockClear()
    prepareAgentRunContext.mockResolvedValue({
      llm: { chat: {}, providerOptions: undefined },
      selectedOperation: liveOperation,
      systemPrompt: "You are a helpful assistant",
      tools: { queryTable: {}, callApi: {} },
      toolDisplayNames: {},
    })
    jest.mocked(require("ai").ToolLoopAgent).mockClear()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("prepares agent run context before executing the automation agent", async () => {
    jest
      .mocked(require("ai").ToolLoopAgent)
      .mockImplementationOnce(makeToolLoopAgentMock([]))

    await run({
      inputs: { agentId: "agent-id", prompt: "Find the answer in knowledge" },
      appId: "test",
      context: {},
      emitter: {} as any,
    })

    expect(prepareAgentRunContext).toHaveBeenCalledWith({
      agent: expect.objectContaining({ _id: "agent-id" }),
      agentId: "agent-id",
      sessionId: expect.any(String),
      latestQuestion: "Find the answer in knowledge",
      span: expect.any(Object),
    })
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
})

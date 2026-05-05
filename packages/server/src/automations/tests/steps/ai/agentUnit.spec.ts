import { run } from "../../../steps/ai/agent"
import sdk from "../../../../sdk"
import {
  findIncompleteToolCalls,
  formatIncompleteToolCallError,
} from "../../../../sdk/workspace/ai/agents"

const mockTrace = jest.fn((_opts, fn) =>
  fn({
    id: "span",
  })
)
const mockAnnotate = jest.fn()
const mockIndex = jest.fn()
const mockAddRequestId = jest.fn()

let mockStreamResult: any
let mockMessages: any[] = []
let mockAgentOptions: any

jest.mock("dd-trace", () => ({
  __esModule: true,
  default: {
    llmobs: {
      trace: (...args: unknown[]) => mockTrace(...args),
      annotate: (...args: unknown[]) => mockAnnotate(...args),
    },
  },
}))

jest.mock("uuid", () => ({
  v4: () => "session-id",
}))

jest.mock("ai", () => ({
  ToolLoopAgent: jest.fn().mockImplementation(options => {
    mockAgentOptions = options
    return {
      stream: jest.fn().mockResolvedValue(mockStreamResult),
    }
  }),
  stepCountIs: jest.fn(count => ({ count })),
  readUIMessageStream: jest.fn(async function* () {
    for (const message of mockMessages) {
      yield message
    }
  }),
  Output: {
    object: jest.fn(config => ({ outputConfig: config })),
  },
  jsonSchema: jest.fn(schema => ({ jsonSchema: schema })),
  wrapLanguageModel: jest.fn(config => config),
  extractReasoningMiddleware: jest.fn(config => config),
}))

jest.mock("../../../../sdk", () => ({
  __esModule: true,
  default: {
    ai: {
      agents: {
        getOrThrow: jest.fn(),
        buildPromptAndTools: jest.fn(),
      },
      llm: {
        createLLM: jest.fn(),
      },
    },
  },
}))

jest.mock("../../../../sdk/workspace/ai/agents", () => ({
  findIncompleteToolCalls: jest.fn(),
  formatIncompleteToolCallError: jest.fn(),
  updatePendingToolCalls: jest.fn(),
}))

jest.mock("../../../../sdk/workspace/ai/agentLogs", () => ({
  createSessionLogIndexer: jest.fn(() => ({
    addRequestId: mockAddRequestId,
    index: mockIndex,
  })),
}))

jest.mock("../../../../db/utils", () => ({
  isProdWorkspaceID: jest.fn((appId: string) => appId.startsWith("app_")),
}))

jest.mock("../../../../environment", () => ({
  __esModule: true,
  default: {
    isInThread: jest.fn(() => false),
    LITELLM_URL: "http://litellm",
  },
}))

jest.mock("@budibase/backend-core", () => ({
  events: {
    action: {
      aiAgentExecuted: jest.fn(),
    },
  },
  getErrorMessage: (err: unknown) =>
    err instanceof Error ? err.message : String(err),
}))

jest.mock("@budibase/pro", () => ({
  quotas: {
    addAction: jest.fn(async (fn: () => Promise<void> | void) => fn()),
  },
}))

const mockGetOrThrow = sdk.ai.agents.getOrThrow as jest.Mock
const mockBuildPromptAndTools = sdk.ai.agents.buildPromptAndTools as jest.Mock
const mockCreateLLM = sdk.ai.llm.createLLM as jest.Mock
const mockFindIncompleteToolCalls = findIncompleteToolCalls as jest.Mock
const mockFormatIncompleteToolCallError = formatIncompleteToolCallError as jest.Mock

const buildStreamResult = (overrides: Record<string, unknown> = {}) => ({
  toUIMessageStream: jest.fn(() => "stream"),
  response: Promise.resolve({ id: "request-id" }),
  text: Promise.resolve("Agent response"),
  usage: Promise.resolve({ totalTokens: 10 }),
  output: Promise.resolve({ value: "structured" }),
  ...overrides,
})

describe("agent step unit", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMessages = [
      {
        id: "message-id",
        parts: [{ type: "text", text: "Agent response" }],
      },
    ]
    mockStreamResult = buildStreamResult()
    mockGetOrThrow.mockResolvedValue({
      _id: "agent_1",
      name: "Agent",
      live: true,
      aiconfig: {},
    })
    mockBuildPromptAndTools.mockResolvedValue({
      systemPrompt: "System prompt",
      tools: {},
    })
    mockCreateLLM.mockResolvedValue({
      chat: "chat-model",
      providerOptions: jest.fn(() => ({ provider: "options" })),
    })
    mockFindIncompleteToolCalls.mockReturnValue([])
    mockFormatIncompleteToolCallError.mockReturnValue("Incomplete tool call")
  })

  it("requires an agent id", async () => {
    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "",
        prompt: "Hello",
      },
    })

    expect(result).toEqual({
      success: false,
      response: "Agent step failed: No agent selected",
    })
    expect(mockGetOrThrow).not.toHaveBeenCalled()
  })

  it("requires a prompt", async () => {
    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "",
      },
    })

    expect(result).toEqual({
      success: false,
      response: "Agent step failed: No prompt provided",
    })
    expect(mockGetOrThrow).not.toHaveBeenCalled()
  })

  it("rejects paused agents in published apps", async () => {
    mockGetOrThrow.mockResolvedValue({
      _id: "agent_1",
      name: "Agent",
      live: false,
    })

    const result = await run({
      appId: "app_prod",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
      },
    })

    expect(result).toEqual({
      success: false,
      response:
        "Agent is paused. Set it live to use it in published automations.",
    })
    expect(mockBuildPromptAndTools).not.toHaveBeenCalled()
  })

  it("streams an agent response", async () => {
    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
      },
    })

    expect(result).toEqual({
      success: true,
      response: "Agent response",
      usage: { totalTokens: 10 },
      message: mockMessages[0],
      sessionId: "session-id",
      output: undefined,
    })
    expect(mockAgentOptions.toolChoice).toEqual("none")
    expect(mockIndex).toHaveBeenCalled()
    expect(mockAddRequestId).toHaveBeenCalledWith("request-id")
  })

  it("supports tools and structured output", async () => {
    mockBuildPromptAndTools.mockResolvedValue({
      systemPrompt: "",
      tools: {
        lookup: {},
      },
    })

    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
        useStructuredOutput: true,
        outputSchema: {
          value: {
            type: "string",
          },
        },
      },
    })

    expect(result.output).toEqual({ value: "structured" })
    expect(mockAgentOptions.tools).toEqual({ lookup: {} })
    expect(mockAgentOptions.toolChoice).toEqual("auto")
    expect(mockAgentOptions.output).toBeDefined()
  })

  it("returns incomplete tool call errors", async () => {
    mockFindIncompleteToolCalls.mockReturnValue([{ toolCallId: "tool_1" }])

    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
      },
    })

    expect(result).toEqual({
      success: false,
      response: "Incomplete tool call",
      message: mockMessages[0],
      sessionId: "session-id",
    })
    expect(mockIndex).toHaveBeenCalled()
  })

  it("returns streaming errors when no text is available", async () => {
    mockMessages = []
    mockStreamResult = buildStreamResult({
      text: Promise.reject(new Error("stream failed")),
    })

    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
      },
    })

    expect(result).toEqual({
      success: false,
      response: "stream failed",
      message: undefined,
      sessionId: "session-id",
    })
    expect(mockIndex).toHaveBeenCalled()
  })

  it("returns setup errors", async () => {
    mockGetOrThrow.mockRejectedValue(new Error("agent missing"))
    const consoleError = jest.spyOn(console, "error").mockImplementation()

    const result = await run({
      appId: "app_dev",
      inputs: {
        agentId: "agent_1",
        prompt: "Hello",
      },
    })

    consoleError.mockRestore()
    expect(result).toEqual({
      success: false,
      response: "Error: agent missing",
      sessionId: "session-id",
    })
    expect(mockIndex).toHaveBeenCalled()
  })
})

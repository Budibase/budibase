import { run } from "../../automations/steps/ai/agent"
import sdk from "../../sdk"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getTenantId: jest.fn().mockReturnValue("tenant-id"),
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
          live: true,
        }),
        prepareAgentChatRun: jest.fn(),
      },
    },
  },
}))

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    readUIMessageStream: jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: () => {
        let done = false
        return {
          next: async () => {
            if (!done) {
              done = true
              return {
                done: false,
                value: { role: "assistant", parts: [] },
              }
            }
            return { done: true, value: undefined }
          },
        }
      },
    }),
  }
})

const prepareAgentChatRunMock = sdk.ai.agents.prepareAgentChatRun as jest.Mock
const emitter = {
  emitRow: jest.fn(),
  emitTable: jest.fn(),
}

const makeNoOutputError = () => {
  const error = new Error("No output generated. Check the stream for errors.")
  error.name = "AI_NoOutputGeneratedError"
  return error
}

const mockAgentRun = ({
  suspended = false,
  text = "Agent response",
  textError,
  usage = { totalTokens: 50 },
  usageError,
  output,
  outputError,
}: {
  suspended?: boolean
  text?: string
  textError?: Error
  usage?: { totalTokens: number }
  usageError?: Error
  output?: Record<string, unknown>
  outputError?: Error
} = {}) => {
  const index = jest.fn().mockResolvedValue(undefined)
  prepareAgentChatRunMock.mockResolvedValue({
    isSuspended: () => suspended,
    sessionLogIndexer: { index },
    stream: jest.fn().mockResolvedValue({
      toUIMessageStream: jest.fn().mockReturnValue({}),
      get text() {
        return textError ? Promise.reject(textError) : Promise.resolve(text)
      },
      usage: usageError ? Promise.reject(usageError) : Promise.resolve(usage),
      output: outputError
        ? Promise.reject(outputError)
        : Promise.resolve(output),
    }),
  })
  return { index }
}

describe("automation agent step", () => {
  beforeEach(() => {
    prepareAgentChatRunMock.mockReset()
    mockAgentRun()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("invokes the shared agent runner with an admin identity", async () => {
    await run({
      inputs: { agentId: "agent-id", prompt: "Create the row" },
      appId: "test",
      automationId: "automation-id",
      stepId: "agent-step",
      context: { _stepResults: [], state: { retained: true } },
      emitter,
    })

    expect(prepareAgentChatRunMock).toHaveBeenCalledWith(
      expect.objectContaining({
        agent: expect.objectContaining({ _id: "agent-id" }),
        agentId: "agent-id",
        latestQuestion: "Create the row",
        requester: { executorRole: "ADMIN" },
        user: expect.objectContaining({ roleId: "ADMIN" }),
      })
    )
  })

  it("returns the agent result without suspending the automation", async () => {
    mockAgentRun({ suspended: true })

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Create the row" },
      appId: "test",
      automationId: "automation-id",
      stepId: "agent-step",
      context: { _stepResults: [], state: {} },
      emitter,
    })

    expect(result).toEqual(
      expect.objectContaining({ success: true, response: "Agent response" })
    )
  })

  it("passes structured output configuration through the shared runner", async () => {
    mockAgentRun({ output: { sentiment: "positive" } })

    const result = await run({
      inputs: {
        agentId: "agent-id",
        prompt: "Evaluate data",
        useStructuredOutput: true,
        outputSchema: { sentiment: "string" },
      },
      appId: "test",
      context: {},
      emitter,
    })

    expect(prepareAgentChatRunMock).toHaveBeenCalledWith(
      expect.objectContaining({ outputSchema: { sentiment: "string" } })
    )
    expect(result.output).toEqual({ sentiment: "positive" })
  })

  it("returns a controlled failure when the shared run has no output", async () => {
    mockAgentRun({ textError: makeNoOutputError() })

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Evaluate data" },
      appId: "test",
      context: {},
      emitter,
    })

    expect(result).toMatchObject({
      success: false,
      response: "No output generated. Check the stream for errors.",
      sessionId: expect.any(String),
    })
  })

  it("returns a completed response when usage metadata fails", async () => {
    mockAgentRun({ usageError: new Error("Usage metadata unavailable") })

    const result = await run({
      inputs: { agentId: "agent-id", prompt: "Evaluate data" },
      appId: "test",
      context: {},
      emitter,
    })

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        response: "Agent response",
        usage: undefined,
      })
    )
  })

  it("indexes the session log when structured output parsing fails", async () => {
    const { index } = mockAgentRun({
      outputError: new Error("Invalid structured output"),
    })

    const result = await run({
      inputs: {
        agentId: "agent-id",
        prompt: "Evaluate data",
        useStructuredOutput: true,
        outputSchema: { sentiment: "string" },
      },
      appId: "test",
      context: {},
      emitter,
    })

    expect(result).toEqual(
      expect.objectContaining({
        success: false,
        response: "Error: Invalid structured output",
      })
    )
    expect(index).toHaveBeenCalledTimes(1)
  })
})

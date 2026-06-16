import type { Agent, LLMResponse } from "@budibase/types"
import { FeatureFlag } from "@budibase/types"

const mockRouterStream = jest.fn()

jest.mock("./utils", () => ({
  getLiveOperations: (agent: Agent) =>
    (agent.operations || []).filter(operation => operation.live === true),
  buildPromptAndTools: jest.fn(),
  updatePendingToolCalls: jest.fn(),
}))

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    ToolLoopAgent: jest.fn().mockImplementation(() => ({
      stream: mockRouterStream,
    })),
  }
})

jest.mock("@budibase/pro", () => ({
  ai: {
    agentSystemPrompt: jest.fn(),
    composeAutomationAgentSystemPrompt: jest.fn(),
  },
  quotas: {
    addAction: jest.fn().mockImplementation((fn: () => Promise<void>) => fn()),
  },
}))

jest.mock("../../..", () => ({
  __esModule: true,
  default: {
    ai: {
      llm: {
        createLLM: jest.fn(),
      },
    },
  },
}))

jest.mock("../chatConversations", () => ({
  findLatestUserQuestion: jest.fn(),
  prepareModelMessages: jest.fn(),
}))

jest.mock("../agentLogs", () => ({
  createSessionLogIndexer: jest.fn(),
}))

jest.mock("../../../../ai/tools/budibase/knowledge/reportUsedSources", () => ({
  createReportUsedSourcesTool: jest.fn(),
}))

jest.mock("dd-trace", () => ({
  __esModule: true,
  default: {
    trace: jest.fn((_name: string, fn: () => unknown) => fn()),
    llmobs: {
      annotate: jest.fn(),
    },
  },
}))

const mockIsEnabled = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    features: {
      ...actual.features,
      isEnabled: (...args: unknown[]) => mockIsEnabled(...args),
    },
  }
})

import { ToolLoopAgent } from "ai"
import { chooseOperationForQuestion } from "./agentRuntime"

describe("chooseOperationForQuestion", () => {
  const operation1 = {
    id: "operation_1",
    name: "IT support",
    live: true,
    allowKnowledgeSourceDownload: true,
  }
  const operation2 = {
    id: "operation_2",
    name: "HR support",
    live: true,
    allowKnowledgeSourceDownload: true,
  }
  const draftOperation = {
    id: "operation_draft",
    name: "Draft",
    live: false,
    allowKnowledgeSourceDownload: true,
  }

  const agent = {
    _id: "agent_1",
    name: "Support Agent",
    aiconfig: "config-1",
    operations: [operation1, operation2, draftOperation],
  } satisfies Agent

  const llm = {
    chat: {} as any,
    providerOptions: jest.fn().mockReturnValue(undefined),
    uploadFile: jest.fn(),
  } satisfies LLMResponse

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsEnabled.mockResolvedValue(false)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        operationId: "operation_2",
        reason: "HR question",
      }),
    })
  })

  it("returns undefined when the agent has no live operations", async () => {
    const result = await chooseOperationForQuestion({
      agent: {
        ...agent,
        operations: [draftOperation],
      },
      latestQuestion: "Reset my password",
      llm,
    })

    expect(result).toBeUndefined()
    expect(mockIsEnabled).not.toHaveBeenCalled()
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns the first live operation when multiple operations are disabled", async () => {
    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Book time off",
      llm,
    })

    expect(result).toEqual(operation1)
    expect(mockIsEnabled).toHaveBeenCalledWith(FeatureFlag.MULTIPLE_OPERATIONS)
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns undefined for blank questions when routing is enabled", async () => {
    mockIsEnabled.mockResolvedValue(true)

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "   ",
      llm,
    })

    expect(result).toBeUndefined()
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns the routed operation when routing is enabled", async () => {
    mockIsEnabled.mockResolvedValue(true)

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Book time off",
      llm,
    })

    expect(result).toEqual(operation2)
    expect(ToolLoopAgent).toHaveBeenCalledTimes(1)
    expect(mockRouterStream).toHaveBeenCalledWith({
      prompt: "Book time off",
    })
  })

  it("returns undefined when the router selects no operation", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        operationId: null,
        reason: "Too broad",
      }),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toBeUndefined()
  })

  it("returns undefined when the router selects an unknown operation id", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        operationId: "operation_missing",
        reason: "Hallucinated id",
      }),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toBeUndefined()
  })
})

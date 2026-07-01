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
import {
  chooseOperationForQuestion,
  prepareAgentRunContext,
} from "./agentRuntime"
import sdk from "../../.."
import { buildPromptAndTools } from "./utils"

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
        action: "select_operation",
        operationId: "operation_2",
        reason: "HR question",
      }),
    })
  })

  it("returns no_operation when the agent has no live operations", async () => {
    const result = await chooseOperationForQuestion({
      agent: {
        ...agent,
        operations: [draftOperation],
      },
      latestQuestion: "Reset my password",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
    expect(mockIsEnabled).not.toHaveBeenCalled()
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns the first live operation when multiple operations are disabled", async () => {
    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Book time off",
      llm,
    })

    expect(result).toEqual({
      action: "select_operation",
      operation: operation1,
    })
    expect(mockIsEnabled).toHaveBeenCalledWith(FeatureFlag.MULTIPLE_OPERATIONS)
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns no_operation for blank questions when routing is enabled", async () => {
    mockIsEnabled.mockResolvedValue(true)

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "   ",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("returns the routed operation when routing is enabled", async () => {
    mockIsEnabled.mockResolvedValue(true)

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Book time off",
      llm,
    })

    expect(result).toEqual({
      action: "select_operation",
      operation: operation2,
    })
    expect(ToolLoopAgent).toHaveBeenCalledTimes(1)
    expect(ToolLoopAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {
          "x-litellm-tags": "bb-operation-routing",
        },
      })
    )
    expect(mockRouterStream).toHaveBeenCalledWith({
      prompt: "Book time off",
    })
  })

  it("returns summarize_operations when the router decides to summarize capabilities", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "summarize_operations",
        operationId: null,
        reason: "Capabilities overview",
      }),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "What can you help me with?",
      llm,
    })

    expect(result).toEqual({
      action: "summarize_operations",
    })
  })

  it("returns no_operation when the router selects no operation", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "no_operation",
        operationId: null,
        reason: "Too broad",
      }),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
  })

  it("returns no_operation when the router selects an unknown operation id", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "select_operation",
        operationId: "operation_missing",
        reason: "Hallucinated id",
      }),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
  })

  it("returns no_operation when operation routing fails", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockRejectedValue(new Error("Router unavailable"))

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
  })

  it("returns no_operation when operation routing output fails", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.reject(new Error("Invalid routing output")),
    })

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "Hello",
      llm,
    })

    expect(result).toEqual({
      action: "no_operation",
    })
  })
})

describe("prepareAgentRunContext", () => {
  const agent = {
    _id: "agent_1",
    name: "Support Agent",
    aiconfig: "config-1",
    operations: [
      {
        id: "operation_1",
        name: "IT support",
        live: true,
        promptInstructions: "Handle IT issues",
        enabledTools: [],
        knowledgeBases: [],
        allowKnowledgeSourceDownload: true,
      },
      {
        id: "operation_2",
        name: "HR support",
        live: true,
        promptInstructions: "Help with leave and policy questions",
        enabledTools: [],
        knowledgeBases: [],
        allowKnowledgeSourceDownload: true,
      },
    ],
  } satisfies Agent

  const llm = {
    chat: {} as any,
    providerOptions: jest.fn().mockReturnValue(undefined),
    uploadFile: jest.fn(),
  } satisfies LLMResponse

  beforeEach(() => {
    jest.mocked(sdk.ai.llm.createLLM).mockResolvedValue(llm)
    jest.mocked(buildPromptAndTools).mockResolvedValue({
      systemPrompt: "system prompt",
      tools: {},
      toolDisplayNames: {},
    })
  })

  it("passes a capabilities-summary prompt when the router chooses summarize_operations", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "summarize_operations",
        operationId: null,
        reason: "Capabilities overview",
      }),
    })

    const result = await prepareAgentRunContext({
      agent,
      agentId: "agent_1",
      sessionId: "session_1",
      latestQuestion: "What can you help me with?",
    })

    expect(result.selectedOperation).toBeUndefined()
    expect(result.routingAction).toBe("summarize_operations")
    expect(buildPromptAndTools).toHaveBeenCalledWith(
      agent,
      undefined,
      expect.objectContaining({
        fallbackPromptInstructions: expect.stringContaining(
          "The router decided this is a capabilities-overview request."
        ),
      })
    )
    expect(buildPromptAndTools).toHaveBeenCalledWith(
      agent,
      undefined,
      expect.objectContaining({
        fallbackPromptInstructions: expect.stringContaining("- IT support"),
      })
    )
  })
})

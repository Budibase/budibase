import type { Agent, LLMResponse } from "@budibase/types"
import { EscalationNotificationChannel, FeatureFlag } from "@budibase/types"

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

const mockCreateEscalateTool = jest.fn()
jest.mock("../../../../ai/tools/budibase/escalate", () => ({
  createEscalateTool: (...args: unknown[]) => mockCreateEscalateTool(...args),
}))

const mockCreateListSessionEscalationsTool = jest.fn()
jest.mock("../../../../ai/tools/budibase/listSessionEscalations", () => ({
  createListSessionEscalationsTool: (...args: unknown[]) =>
    mockCreateListSessionEscalationsTool(...args),
  LIST_SESSION_ESCALATIONS_TOOL_NAME: "list_session_escalations",
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
    cache: {
      ...actual.cache,
      get: jest.fn().mockResolvedValue(undefined),
      store: jest.fn().mockResolvedValue(undefined),
    },
  }
})

import type { ContextUser } from "@budibase/types"
import { cache } from "@budibase/backend-core"
import { tool, ToolLoopAgent } from "ai"
import { z } from "zod"
import {
  chooseOperationForQuestion,
  prepareAgentChatRun,
  prepareAgentRunContext,
} from "./agentRuntime"
import sdk from "../../.."
import { buildPromptAndTools } from "./utils"
import { createSessionLogIndexer } from "../agentLogs"

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

  it.each([
    ["query", "query"],
    [null, "execute"],
  ])(
    "returns the first live operation when multiple operations are disabled, classifying intent %s as %s",
    async (classifierIntent, expectedIntent) => {
      mockRouterStream.mockResolvedValue({
        output: Promise.resolve({
          intent: classifierIntent,
          reason: "reason",
        }),
      })

      const result = await chooseOperationForQuestion({
        agent,
        latestQuestion: "How many days off do I have left?",
        llm,
      })

      expect(result).toEqual({
        action: "select_operation",
        operation: operation1,
        intent: expectedIntent,
      })
      expect(mockIsEnabled).toHaveBeenCalledWith(
        FeatureFlag.MULTIPLE_OPERATIONS
      )
      expect(ToolLoopAgent).toHaveBeenCalledTimes(1)
    }
  )

  it("defaults to execute without calling the classifier for a blank question when multiple operations are disabled", async () => {
    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "   ",
      llm,
    })

    expect(result).toEqual({
      action: "select_operation",
      operation: operation1,
      intent: "execute",
    })
    expect(ToolLoopAgent).not.toHaveBeenCalled()
  })

  it("defaults to execute when intent classification fails for a single pinned operation", async () => {
    mockRouterStream.mockRejectedValue(new Error("Classifier unavailable"))

    const result = await chooseOperationForQuestion({
      agent,
      latestQuestion: "How many days off do I have left?",
      llm,
    })

    expect(result).toEqual({
      action: "select_operation",
      operation: operation1,
      intent: "execute",
    })
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
      intent: "execute",
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

  it.each([
    ["query", "query"],
    [null, "execute"],
  ])(
    "resolves a router intent of %s to %s",
    async (routerIntent, expectedIntent) => {
      mockIsEnabled.mockResolvedValue(true)
      mockRouterStream.mockResolvedValue({
        output: Promise.resolve({
          action: "select_operation",
          operationId: "operation_2",
          intent: routerIntent,
          reason: "HR question",
        }),
      })

      const result = await chooseOperationForQuestion({
        agent,
        latestQuestion: "Book time off",
        llm,
      })

      expect(result).toEqual({
        action: "select_operation",
        operation: operation2,
        intent: expectedIntent,
      })
    }
  )

  it("includes the execute/query intent criterion in the routing instructions", async () => {
    mockIsEnabled.mockResolvedValue(true)

    await chooseOperationForQuestion({
      agent,
      latestQuestion: "Book time off",
      llm,
    })

    const instructions = jest.mocked(ToolLoopAgent).mock.calls[0][0]
      .instructions as string
    expect(instructions).toContain('"execute"')
    expect(instructions).toContain('"query"')
    expect(instructions).toContain("not the grammatical form")
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

  it("exposes the router's intent as operationIntent when an operation is selected", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "select_operation",
        operationId: "operation_2",
        intent: "query",
        reason: "Asking about existing HR requests",
      }),
    })

    const result = await prepareAgentRunContext({
      agent,
      agentId: "agent_1",
      sessionId: "session_1",
      latestQuestion: "How many HR requests do I have open?",
    })

    expect(result.selectedOperation).toEqual(agent.operations[1])
    expect(result.operationIntent).toBe("query")
  })

  it("defaults operationIntent to execute for a sticky follow-up", async () => {
    mockIsEnabled.mockResolvedValue(true)
    mockRouterStream.mockResolvedValue({
      output: Promise.resolve({
        action: "no_operation",
        operationId: null,
        intent: null,
        reason: "Too ambiguous to classify",
      }),
    })
    jest.mocked(cache.get).mockResolvedValueOnce("operation_2")

    const result = await prepareAgentRunContext({
      agent,
      agentId: "agent_1",
      sessionId: "session_1",
      latestQuestion: "yes",
    })

    expect(result.selectedOperation).toEqual(agent.operations[1])
    expect(result.operationIntent).toBe("execute")
  })
})

describe("prepareAgentChatRun - escalate tool selection", () => {
  const recipients = [
    { type: EscalationNotificationChannel.SLACK, config: { channel: "C1" } },
  ]

  const operationWithRecipients = {
    id: "operation_1",
    name: "Procurement",
    live: true,
    allowKnowledgeSourceDownload: true,
    escalation: { recipients, delay: 120 },
  }

  const operationWithoutRecipients = {
    id: "operation_2",
    name: "IT support",
    live: true,
    allowKnowledgeSourceDownload: true,
  }

  const agent = {
    _id: "agent_1",
    name: "Support Agent",
    aiconfig: "config-1",
    operations: [operationWithRecipients, operationWithoutRecipients],
  } satisfies Agent

  const llm = {
    chat: {} as any,
    providerOptions: jest.fn().mockReturnValue(undefined),
    uploadFile: jest.fn(),
  } satisfies LLMResponse

  const user = {} as ContextUser
  const realTool = { name: "escalate-real-tool" }
  const escalatePlaceholder = tool({
    description: "placeholder",
    inputSchema: z.object({}),
    execute: async () => ({}),
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsEnabled.mockImplementation(
      async (flag: FeatureFlag) => flag === FeatureFlag.ESCALATION
    )
    jest.mocked(sdk.ai.llm.createLLM).mockResolvedValue(llm)
    jest.mocked(createSessionLogIndexer).mockReturnValue({
      addRequestId: jest.fn(),
      getRequestIds: jest.fn().mockReturnValue([]),
      index: jest.fn().mockResolvedValue(undefined),
    })
    mockCreateEscalateTool.mockReturnValue(realTool)
    mockCreateListSessionEscalationsTool.mockReturnValue({})
  })

  const runFor = async (
    operation: (typeof agent.operations)[number],
    overrides: Partial<Parameters<typeof prepareAgentChatRun>[0]> = {}
  ) => {
    jest.mocked(buildPromptAndTools).mockResolvedValue({
      systemPrompt: "system prompt",
      tools: { escalate: escalatePlaceholder },
      toolDisplayNames: {},
    })

    return prepareAgentChatRun({
      agent,
      agentId: "agent_1",
      modelMessages: [],
      errorLabel: "test",
      sessionId: "session_1",
      user,
      operationId: operation.id,
      ...overrides,
    })
  }

  it("swaps escalate for the real tool when the selected operation has recipients configured", async () => {
    await runFor(operationWithRecipients)

    expect(mockCreateEscalateTool).toHaveBeenCalledWith(
      expect.objectContaining({
        agentId: "agent_1",
        operationId: operationWithRecipients.id,
        sessionId: "session_1",
        recipients,
        delayMs: 120000,
      })
    )
    expect(ToolLoopAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: expect.objectContaining({ escalate: realTool }),
      })
    )
  })

  it("resolves getRequestId lazily via the provided callback", async () => {
    const getRequestId = jest.fn().mockReturnValue("request_1")

    await runFor(operationWithRecipients, { getRequestId })

    const call = mockCreateEscalateTool.mock.calls[0][0]
    expect(getRequestId).not.toHaveBeenCalled()
    expect(call.getRequestId()).toEqual("request_1")
    expect(getRequestId).toHaveBeenCalledTimes(1)
  })

  it("leaves the placeholder tool untouched when the operation has no recipients configured", async () => {
    await runFor(operationWithoutRecipients)

    expect(mockCreateEscalateTool).not.toHaveBeenCalled()
    expect(ToolLoopAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: expect.objectContaining({ escalate: escalatePlaceholder }),
      })
    )
  })

  it("strips the escalate tool entirely when the ESCALATION feature flag is disabled", async () => {
    mockIsEnabled.mockResolvedValue(false)

    await runFor(operationWithRecipients)

    expect(mockCreateEscalateTool).not.toHaveBeenCalled()
    expect(mockCreateListSessionEscalationsTool).not.toHaveBeenCalled()
    expect(ToolLoopAgent).toHaveBeenCalledWith(
      expect.objectContaining({ tools: undefined })
    )
  })

  it("carries operationIntent through to the returned AgentChatRun", async () => {
    const run = await runFor(operationWithRecipients)

    expect(run.selectedOperation).toEqual(operationWithRecipients)
    expect(run.operationIntent).toBe("execute")
  })
})

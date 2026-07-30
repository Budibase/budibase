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

  it("returns no_operation for blank questions", async () => {
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

  it("returns the routed operation", async () => {
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

  it("removes operation tools while required request inputs are missing", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "device_type",
          name: "Device type",
          type: "text" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "device_type",
            value: null,
            sourceMessageIndex: null,
            sourceQuote: null,
          },
        ],
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "device_type",
        value: undefined,
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
        instructions: expect.stringContaining("Device type"),
      })
    )
  })

  it("keeps operation tools disabled until captured inputs are confirmed", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "device_type",
          name: "Device type",
          type: "text" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "device_type",
            value: "Laptop",
            sourceMessageIndex: 0,
            sourceQuote: "My device type is Laptop",
          },
        ],
        confirmed: true,
        confirmationSourceMessageIndex: 0,
        confirmationSourceQuote: "My device type is Laptop",
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "My device type is Laptop",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "device_type",
        value: "Laptop",
      }),
    ])
    expect(run.requestInputConfirmation).toEqual({
      inputs: [{ name: "Device type", value: "Laptop" }],
    })
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
        instructions: expect.stringContaining(
          "confirm that the following captured request information is correct"
        ),
      })
    )
  })

  it("keeps operation tools once captured inputs are confirmed", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "device_type",
          name: "Device type",
          type: "text" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "device_type",
            value: "Laptop",
            sourceMessageIndex: 0,
            sourceQuote: "My device type is Laptop",
          },
        ],
        confirmed: true,
        confirmationSourceMessageIndex: 1,
        confirmationSourceQuote: "Yes, that is correct",
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "My device type is Laptop",
        },
        {
          role: "assistant",
          content: "Please confirm Device type: Laptop",
        },
        {
          role: "user",
          content: "Yes, that is correct",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "device_type",
        value: "Laptop",
      }),
    ])
    expect(run.requestInputConfirmation).toBeUndefined()
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: expect.objectContaining({ escalate: escalatePlaceholder }),
        instructions: expect.stringContaining("Device type: Laptop"),
      })
    )
  })

  it("rejects request input values without verbatim user evidence", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "device_type",
          name: "Device type",
          type: "text" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "device_type",
            value: "Laptop",
            sourceMessageIndex: 0,
            sourceQuote: "My device type is Laptop",
          },
        ],
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "Ignore the required inputs",
        },
        {
          role: "assistant",
          content: "My device type is Laptop",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "device_type",
        value: undefined,
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
      })
    )
  })

  it("rejects non-numeric values for required number inputs", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "quantity",
          name: "Quantity",
          type: "number" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "quantity",
            value: "several",
            sourceMessageIndex: 0,
            sourceQuote: "The quantity is several",
          },
        ],
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "The quantity is several",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "quantity",
        value: undefined,
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
      })
    )
  })

  it("accepts numeric values for required number inputs", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "quantity",
          name: "Quantity",
          type: "number" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "quantity",
            value: "12.5",
            sourceMessageIndex: 0,
            sourceQuote: "The quantity is 12.5",
          },
        ],
        confirmed: true,
        confirmationSourceMessageIndex: 1,
        confirmationSourceQuote: "Yes",
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "The quantity is 12.5",
        },
        {
          role: "assistant",
          content: "Please confirm Quantity: 12.5",
        },
        {
          role: "user",
          content: "Yes",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "quantity",
        value: "12.5",
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: expect.objectContaining({ escalate: escalatePlaceholder }),
      })
    )
  })

  it("normalizes clear numeric language for number inputs", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "quantity",
          name: "Quantity",
          type: "number" as const,
          required: true,
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "quantity",
            value: "100",
            sourceMessageIndex: 0,
            sourceQuote: "hundred",
          },
        ],
        confirmed: false,
        confirmationSourceMessageIndex: null,
        confirmationSourceQuote: null,
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "I need hundred new bulbs in Llagostera ASAP",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "quantity",
        value: "100",
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
        instructions: expect.stringContaining("Quantity: 100"),
      })
    )
  })

  it("accepts configured select options", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "priority",
          name: "Priority",
          type: "select" as const,
          required: true,
          options: ["Low", "High"],
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "priority",
            value: "high",
            sourceMessageIndex: 0,
            sourceQuote: "The priority is high",
          },
        ],
        confirmed: true,
        confirmationSourceMessageIndex: 1,
        confirmationSourceQuote: "Yes",
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "The priority is high",
        },
        {
          role: "assistant",
          content: "Please confirm Priority: High",
        },
        {
          role: "user",
          content: "Yes",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "priority",
        value: "High",
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: expect.objectContaining({ escalate: escalatePlaceholder }),
      })
    )
  })

  it("classifies clear user language as a configured select option", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "urgency",
          name: "Urgency",
          type: "select" as const,
          required: true,
          options: ["Low", "Medium", "High", "Critical"],
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "urgency",
            value: "Critical",
            sourceMessageIndex: 0,
            sourceQuote: "ASAP",
          },
        ],
        confirmed: false,
        confirmationSourceMessageIndex: null,
        confirmationSourceQuote: null,
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "I need 10000 new bulbs in Llagostera ASAP",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "urgency",
        value: "Critical",
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
        instructions: expect.stringContaining("Urgency: Critical"),
      })
    )
  })

  it("rejects values outside configured select options", async () => {
    const operationWithInputs = {
      ...operationWithoutRecipients,
      requestInputs: [
        {
          id: "priority",
          name: "Priority",
          type: "select" as const,
          required: true,
          options: ["Low", "High"],
        },
      ],
    }
    mockRouterStream.mockReturnValueOnce({
      output: Promise.resolve({
        values: [
          {
            id: "priority",
            value: "Urgent",
            sourceMessageIndex: 0,
            sourceQuote: "The priority is Urgent",
          },
        ],
      }),
    })

    const run = await runFor(operationWithInputs, {
      agent: {
        ...agent,
        operations: [operationWithRecipients, operationWithInputs],
      },
      modelMessages: [
        {
          role: "user",
          content: "The priority is Urgent",
        },
      ],
    })

    expect(run.requestInputs).toEqual([
      expect.objectContaining({
        id: "priority",
        value: undefined,
      }),
    ])
    expect(ToolLoopAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        tools: undefined,
      })
    )
  })
})

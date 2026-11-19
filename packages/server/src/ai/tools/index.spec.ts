jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    events: {
      ...actual.events,
      action: {
        ...actual.events.action,
        aiAgentToolExecuted: jest.fn(),
        aiAgentToolFailed: jest.fn(),
      },
    },
  }
})

jest.mock("@budibase/pro", () => {
  const actual = jest.requireActual("@budibase/pro")
  return { ...actual, quotas: { ...actual.quotas } }
})

import { events } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { licensing, quotas } from "@budibase/pro"
import {
  ActionFailureReason,
  ActionType,
  ApprovalToolResultStatus,
  AutomationStatus,
  MonthlyQuotaName,
  PermissionLevel,
  PermissionType,
  QuotaUsageType,
  ToolAction,
  ToolExecutionPrincipal,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import cloneDeep from "lodash/cloneDeep"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import {
  resolveToolExecutionPrincipal,
  toToolSet,
  type AiToolDefinition,
  type EscalationGateRuntime,
} from "."
import { filterAgentToolCollectionResult } from "./authorization"

const definition = (execute: jest.Mock): AiToolDefinition => ({
  name: "secured_tool",
  description: "A secured tool",
  sourceType: ToolType.INTERNAL_TABLE,
  executionPolicy: {
    mode: "configurable",
    defaultPrincipal: ToolExecutionPrincipal.REQUESTER,
  },
  authorization: {
    permissionType: PermissionType.TABLE,
    permissionLevel: PermissionLevel.READ,
    resourceId: "ta_1",
  },
  tool: tool({
    description: "A secured tool",
    inputSchema: z.object({ value: z.string() }),
    execute,
  }),
})

const executionContext = {
  tenantId: "tenant_1",
  workspaceId: "app_1",
  agentId: "agent_1",
  operationId: "operation_1",
  conversationId: "conversation_1",
  requester: {
    executorRole: "BASIC",
  },
}

describe("tool action accounting with real quotas", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => config.end())

  beforeEach(() => {
    mocks.licenses.useUnlimited()
    jest.clearAllMocks()
    jest.spyOn(events.action, "aiAgentToolExecuted").mockImplementation()
    jest.spyOn(events.action, "aiAgentToolFailed").mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    mocks.licenses.useUnlimited()
  })

  it("counts the approved tool execution once, excluding pending and repeated calls", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await quotas.setAllUsage({
        name: MonthlyQuotaName.ACTIONS,
        type: QuotaUsageType.MONTHLY,
        values: { total: 0, app: 0, breakdown: 0 },
        opts: { id: ActionType.AI_AGENT },
      })
      const execute = jest.fn().mockResolvedValue({ success: true })
      const toolDefinition = definition(execute)
      const runtime = {
        executionContext: {
          ...executionContext,
          tenantId: config.getTenantId(),
          workspaceId: config.getProdWorkspaceId(),
        },
        principal: ToolExecutionPrincipal.ADMIN,
        authorize: jest.fn().mockResolvedValue(undefined),
      }
      const runtimes = new Map([[toolDefinition.name, runtime]])
      const call = async (gate?: EscalationGateRuntime) => {
        const tools = toToolSet(
          [toolDefinition],
          runtimes,
          gate ? new Map([[toolDefinition.name, gate]]) : undefined
        )
        return await tools[toolDefinition.name].execute?.(
          { value: "approved value" },
          { toolCallId: "call_approval", messages: [], context: undefined }
        )
      }

      const pending = await call({
        intercept: jest.fn().mockResolvedValue({
          status: ApprovalToolResultStatus.PENDING_APPROVAL,
        }),
      })
      const pendingUsage = await quotas.getCurrentUsageValues(
        QuotaUsageType.MONTHLY,
        MonthlyQuotaName.ACTIONS,
        ActionType.AI_AGENT
      )
      // The resume worker rebuilds tools without a gate for the frozen approved call.
      const approved = await call()
      const repeated = await call({
        intercept: jest.fn().mockResolvedValue({
          status: ApprovalToolResultStatus.ALREADY_APPROVED,
        }),
      })
      const usage = await quotas.getCurrentUsageValues(
        QuotaUsageType.MONTHLY,
        MonthlyQuotaName.ACTIONS,
        ActionType.AI_AGENT
      )

      expect(pending).toEqual({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
      })
      expect(pendingUsage.total).toBe(0)
      expect(pendingUsage.breakdown).toBe(0)
      expect(approved).toEqual({ success: true })
      expect(repeated).toEqual({
        status: ApprovalToolResultStatus.ALREADY_APPROVED,
      })
      expect(execute).toHaveBeenCalledTimes(1)
      expect(usage.total).toBe(1)
      expect(usage.breakdown).toBe(1)
      expect(events.action.aiAgentToolExecuted).toHaveBeenCalledTimes(1)
      expect(events.action.aiAgentToolExecuted).toHaveBeenCalledWith({
        agentId: executionContext.agentId,
        sessionId: executionContext.conversationId,
        operationId: executionContext.operationId,
        toolName: toolDefinition.name,
        sourceType: toolDefinition.sourceType,
      })
      expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
    })
  })

  it.each([
    { scenario: "counts every tool", limit: -1, failFirst: false, expected: 8 },
    {
      scenario: "continues after a tool fails",
      limit: -1,
      failFirst: true,
      expected: 7,
    },
    {
      scenario: "does not execute beyond the remaining quota",
      limit: 1,
      failFirst: false,
      expected: 1,
    },
  ])(
    "$scenario in a concurrent batch",
    async ({ limit, failFirst, expected }) => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await quotas.setAllUsage({
          name: MonthlyQuotaName.ACTIONS,
          type: QuotaUsageType.MONTHLY,
          values: { total: 0, app: 0, breakdown: 0 },
          opts: { id: ActionType.AI_AGENT },
        })
        const license = cloneDeep(await licensing.cache.getCachedLicense())
        license.quotas.usage.monthly.actions.value = limit
        mocks.licenses.useLicense(license)
        const execute = jest.fn().mockResolvedValue({ success: true })
        if (failFirst) {
          execute.mockRejectedValueOnce(new Error("Tool failed"))
        }
        const definition: AiToolDefinition = {
          name: "accounted_tool",
          description: "Test action accounting",
          sourceType: ToolType.INTERNAL_TABLE,
          executionPolicy: { mode: "admin" },
          authorization: {
            permissionType: PermissionType.TABLE,
            permissionLevel: PermissionLevel.READ,
          },
          tool: tool({
            inputSchema: z.object({}),
            execute,
          }),
        }
        const definitions = [
          definition,
          { ...definition, name: "another_tool" },
        ]
        const tools = toToolSet(
          definitions,
          new Map(
            definitions.map(definition => [
              definition.name,
              {
                executionContext: {
                  tenantId: config.getTenantId(),
                  workspaceId: config.getProdWorkspaceId(),
                  agentId: "agent_test",
                  operationId: "operation_test",
                  conversationId: "conversation_test",
                  requester: { executorRole: "ADMIN" },
                },
                principal: ToolExecutionPrincipal.ADMIN,
                authorize: jest.fn().mockResolvedValue(undefined),
              },
            ])
          )
        )
        const batchSize = 8
        const results = await Promise.allSettled(
          Array.from({ length: batchSize }, (_, index) =>
            tools[definitions[index % definitions.length].name].execute?.(
              {},
              {
                toolCallId: `call_${index}`,
                messages: [],
                context: undefined,
              }
            )
          )
        )
        const usage = await quotas.getCurrentUsageValues(
          QuotaUsageType.MONTHLY,
          MonthlyQuotaName.ACTIONS,
          ActionType.AI_AGENT
        )

        expect(
          results.filter(result => result.status === "fulfilled")
        ).toHaveLength(expected)
        expect(execute).toHaveBeenCalledTimes(expected + (failFirst ? 1 : 0))
        expect(usage.total).toBe(expected)
        expect(usage.breakdown).toBe(expected)
        expect(events.action.aiAgentToolExecuted).toHaveBeenCalledTimes(
          expected
        )
        expect(events.action.aiAgentToolFailed).toHaveBeenCalledTimes(
          failFirst ? 1 : 0
        )
      })
    }
  )
})

describe("resolveToolExecutionPrincipal", () => {
  it("uses the configured principal for configurable tools", () => {
    const toolDefinition = definition(jest.fn())

    expect(
      resolveToolExecutionPrincipal(toolDefinition, {
        toolName: toolDefinition.name,
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      })
    ).toBe(ToolExecutionPrincipal.ADMIN)
  })

  it("uses admin for non-configurable tools", () => {
    const toolDefinition = definition(jest.fn())
    toolDefinition.executionPolicy = {
      mode: "admin",
    }

    expect(
      resolveToolExecutionPrincipal(toolDefinition, {
        toolName: toolDefinition.name,
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      })
    ).toBe(ToolExecutionPrincipal.ADMIN)
  })
})

describe("secured AI tool execution", () => {
  beforeEach(() => {
    jest
      .spyOn(quotas, "addAction")
      .mockImplementation(async (_type, fn) => await fn())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("authorizes immediately before executing the tool", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const log = jest.spyOn(console, "log").mockImplementation()
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await tools.secured_tool.execute?.(
      { value: "hello" },
      { toolCallId: "call_1", messages: [], context: undefined }
    )

    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { value: "hello" },
        executionContext,
        principal: ToolExecutionPrincipal.REQUESTER,
      })
    )
    expect(execute).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(
      "Agent tool execution",
      expect.objectContaining({ requesterRole: "BASIC" })
    )
    expect(log.mock.calls[0][1]).not.toHaveProperty("requesterId")
  })

  it("does not execute after an authorization denial", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockRejectedValue(new Error("denied"))
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow("denied")
    expect(execute).not.toHaveBeenCalled()
  })

  it("authorizes before validating a mutating tool", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockRejectedValue(new Error("denied"))
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.permissionLevel = PermissionLevel.WRITE
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        {},
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow("denied")
    expect(authorize).toHaveBeenCalledTimes(1)
    expect(execute).not.toHaveBeenCalled()
  })

  it("does not apply authoritative mutating validation to read tools", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const intercept = jest.fn().mockResolvedValue(undefined)
    const toolDefinition = definition(execute)
    toolDefinition.authoritativeInputSchema = z.object({
      requiredOnlyForWrites: z.string(),
    })
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ]),
      new Map([["secured_tool", { intercept }]])
    )
    const input = { value: "hello" }

    await expect(
      tools.secured_tool.execute?.(input, {
        toolCallId: "call_1",
        messages: [],
        context: undefined,
      })
    ).resolves.toEqual({ success: true })
    expect(authorize).toHaveBeenCalledTimes(1)
    expect(intercept).toHaveBeenCalledWith(
      input,
      expect.objectContaining({ toolCallId: "call_1" })
    )
    expect(execute).toHaveBeenCalledWith(
      input,
      expect.objectContaining({ toolCallId: "call_1" })
    )
  })

  it("rejects invalid mutating input before escalation", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockResolvedValue(undefined)
    const intercept = jest.fn()
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.permissionLevel = PermissionLevel.WRITE
    toolDefinition.authoritativeInputSchema = z.object({
      value: z.string(),
      category: z.string(),
    })
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ]),
      new Map([["secured_tool", { intercept }]])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow()
    expect(authorize).toHaveBeenCalledTimes(1)
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("sanitizes authoritative validation errors for redacted tools", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockResolvedValue(undefined)
    const intercept = jest.fn()
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.permissionLevel = PermissionLevel.WRITE
    toolDefinition.authoritativeInputSchema = z.object({
      hiddenField: z.enum(["hidden-option"]),
    })
    const redactedTool = tool({
      description: "A redacted tool",
      inputSchema: z.record(z.string(), z.unknown()),
      execute,
    })
    toolDefinition.tool = redactedTool
    toolDefinition.requesterRedactedTool = redactedTool
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ]),
      new Map([["secured_tool", { intercept }]])
    )

    await expect(
      tools.secured_tool.execute?.(
        {},
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toEqual(new Error("Tool input is invalid"))
    expect(authorize).toHaveBeenCalledTimes(1)
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("passes canonical mutating input to escalation and execution", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const intercept = jest.fn().mockResolvedValue(undefined)
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.permissionLevel = PermissionLevel.EXECUTE
    toolDefinition.authoritativeInputSchema = z.object({
      value: z.string(),
      category: z.string().default("Other"),
    })
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ]),
      new Map([["secured_tool", { intercept }]])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).resolves.toEqual({ success: true })
    const canonicalInput = { value: "hello", category: "Other" }
    expect(intercept).toHaveBeenCalledWith(
      canonicalInput,
      expect.objectContaining({ toolCallId: "call_1" })
    )
    expect(execute).toHaveBeenCalledWith(
      canonicalInput,
      expect.objectContaining({ toolCallId: "call_1" })
    )
  })

  it("logs the error message when tool execution fails", async () => {
    const execute = jest
      .fn()
      .mockRejectedValue(new Error("row creation failed"))
    const authorize = jest.fn().mockResolvedValue(undefined)
    const log = jest.spyOn(console, "log").mockImplementation()
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow("row creation failed")
    expect(log).toHaveBeenCalledWith(
      "Agent tool execution",
      expect.objectContaining({
        outcome: "error",
        error: "row creation failed",
      })
    )
  })

  it("preserves object-shaped tool failure details", async () => {
    const execute = jest.fn().mockResolvedValue({
      error: {
        code: "VALIDATION_ERROR",
        field: "supplier",
      },
    })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const log = jest.spyOn(console, "log").mockImplementation()
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow('{"code":"VALIDATION_ERROR","field":"supplier"}')
    expect(log).toHaveBeenCalledWith(
      "Agent tool execution",
      expect.objectContaining({
        outcome: "error",
        error: '{"code":"VALIDATION_ERROR","field":"supplier"}',
      })
    )
  })

  it("does not execute a tool without authorization metadata", async () => {
    const execute = jest.fn()
    const authorize = jest.fn()
    const toolDefinition = definition(execute)
    toolDefinition.authorization = undefined
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow("Tool is not available in this security context")
    expect(authorize).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("filters collection results using resource permissions", async () => {
    const execute = jest.fn().mockResolvedValue({
      tables: [
        { id: "ta_allowed", name: "Allowed" },
        { id: "ta_denied", name: "Denied" },
      ],
    })
    const authorize = jest.fn().mockImplementation(({ authorization }) => {
      if (authorization.resourceId === "ta_denied") {
        throw new Error("denied")
      }
    })
    const toolDefinition = definition(execute)
    toolDefinition.filterResult = (result, runtime) =>
      filterAgentToolCollectionResult({
        result,
        collectionKey: "tables",
        permissionType: PermissionType.TABLE,
        permissionLevel: PermissionLevel.READ,
        resolveResourceId: item =>
          typeof item === "object" && item && "id" in item
            ? String(item.id)
            : undefined,
        runtime,
      })
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).resolves.toEqual({
      tables: [{ id: "ta_allowed", name: "Allowed" }],
    })
    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: expect.objectContaining({ resourceId: "ta_denied" }),
      })
    )
  })
})

describe("AI tool action accounting", () => {
  let addAction: jest.SpiedFunction<typeof quotas.addAction>

  const runtimesFor = (toolName: string) =>
    new Map([
      [
        toolName,
        {
          executionContext,
          principal: ToolExecutionPrincipal.REQUESTER,
          authorize: jest.fn().mockResolvedValue(undefined),
        },
      ],
    ])

  const callTool = async (
    toolDefinition: AiToolDefinition,
    gate?: EscalationGateRuntime
  ) => {
    const tools = toToolSet(
      [toolDefinition],
      runtimesFor(toolDefinition.name),
      gate ? new Map([[toolDefinition.name, gate]]) : undefined
    )
    return await tools[toolDefinition.name].execute?.(
      { value: "hello" },
      { toolCallId: "call_1", messages: [], context: undefined }
    )
  }

  const expectedEventContext = {
    agentId: "agent_1",
    sessionId: "conversation_1",
    operationId: "operation_1",
    toolName: "secured_tool",
    sourceType: ToolType.INTERNAL_TABLE,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "log").mockImplementation()
    addAction = jest
      .spyOn(quotas, "addAction")
      .mockImplementation(async (_type, fn) => await fn())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("counts a successful execution as one AI agent action", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })

    await callTool(definition(execute))

    expect(addAction).toHaveBeenCalledTimes(1)
    expect(addAction).toHaveBeenCalledWith(
      ActionType.AI_AGENT,
      expect.any(Function)
    )
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it("does not execute the tool when the actions quota is exhausted", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    addAction.mockRejectedValue(new Error("Usage limit exceeded"))

    await expect(callTool(definition(execute))).rejects.toThrow(
      "Usage limit exceeded"
    )
    expect(execute).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolExecuted).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
  })

  it("emits an executed event linked to the agent session", async () => {
    const toolDefinition = definition(
      jest.fn().mockResolvedValue({ success: true })
    )
    toolDefinition.action = ToolAction.GET_ROW

    await callTool(toolDefinition)

    expect(events.action.aiAgentToolExecuted).toHaveBeenCalledWith({
      ...expectedEventContext,
      action: ToolAction.GET_ROW,
    })
    expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
  })

  it.each([
    [ToolAction.LIST_ROWS, "Customers", "List rows - Customers"],
    [ToolAction.CREATE_ROW, "Orders", "Create row - Orders"],
    [
      ToolAction.TRIGGER,
      "Send notification",
      "Run workflow - Send notification",
    ],
  ])(
    "captures a readable label for %s",
    async (action, resourceName, toolLabel) => {
      const toolDefinition = {
        ...definition(jest.fn().mockResolvedValue({ success: true })),
        action,
        resourceName,
      }

      await callTool(toolDefinition)

      expect(events.action.aiAgentToolExecuted).toHaveBeenCalledWith({
        ...expectedEventContext,
        action,
        toolLabel,
      })
    }
  )

  it("includes the resource label in failed tool events", async () => {
    const toolDefinition = {
      ...definition(jest.fn().mockRejectedValue(new Error("missing"))),
      action: ToolAction.UPDATE_ROW,
      resourceName: "Customers",
    }

    await expect(callTool(toolDefinition)).rejects.toThrow("missing")

    expect(events.action.aiAgentToolFailed).toHaveBeenCalledWith({
      ...expectedEventContext,
      action: ToolAction.UPDATE_ROW,
      toolLabel: "Update row - Customers",
      reason: ActionFailureReason.ERROR,
      errorMessage: "missing",
    })
  })

  it("uses the readable name of tools without a resource action", async () => {
    await callTool({
      ...definition(jest.fn().mockResolvedValue({ success: true })),
      readableName: "Find invoices",
    })

    expect(events.action.aiAgentToolExecuted).toHaveBeenCalledWith({
      ...expectedEventContext,
      toolLabel: "Find invoices",
    })
  })

  it("does not count a thrown tool error and emits a failed event", async () => {
    const execute = jest.fn().mockRejectedValue(new Error("save failed"))

    await expect(callTool(definition(execute))).rejects.toThrow("save failed")

    await expect(addAction.mock.results[0].value).rejects.toThrow("save failed")
    expect(events.action.aiAgentToolFailed).toHaveBeenCalledWith({
      ...expectedEventContext,
      reason: ActionFailureReason.ERROR,
      errorMessage: "save failed",
    })
    expect(events.action.aiAgentToolExecuted).not.toHaveBeenCalled()
  })

  it("does not count an error result and emits a failed event", async () => {
    const execute = jest.fn().mockResolvedValue({ error: "invalid row" })

    await expect(callTool(definition(execute))).rejects.toThrow("invalid row")

    await expect(addAction.mock.results[0].value).rejects.toThrow("invalid row")
    expect(events.action.aiAgentToolFailed).toHaveBeenCalledWith({
      ...expectedEventContext,
      reason: ActionFailureReason.ERROR,
      errorMessage: "invalid row",
    })
  })

  it.each([
    ApprovalToolResultStatus.PENDING_APPROVAL,
    ApprovalToolResultStatus.ALREADY_APPROVED,
    ApprovalToolResultStatus.UNAVAILABLE,
  ])("does not count or emit when the gate returns %s", async status => {
    const execute = jest.fn()
    const intercept = jest.fn().mockResolvedValue({
      status,
      escalationId: "escalation_1",
    })

    await callTool(definition(execute), { intercept })

    expect(execute).not.toHaveBeenCalled()
    expect(addAction).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolExecuted).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
  })

  it("does not count or emit when authorization is denied", async () => {
    const execute = jest.fn()
    const toolDefinition = definition(execute)
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          toolDefinition.name,
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize: jest.fn().mockRejectedValue(new Error("denied")),
          },
        ],
      ])
    )

    await expect(
      tools[toolDefinition.name].execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [], context: undefined }
      )
    ).rejects.toThrow("denied")
    expect(addAction).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolExecuted).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
  })

  it("does not count automation triggers, which are metered as automation steps", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const toolDefinition: AiToolDefinition = {
      ...definition(execute),
      name: "au_1_trigger",
      sourceType: ToolType.AUTOMATION,
      action: ToolAction.TRIGGER,
      authorization: {
        permissionType: PermissionType.AUTOMATION,
        permissionLevel: PermissionLevel.EXECUTE,
        resourceId: "au_1",
      },
    }

    await callTool(toolDefinition)

    expect(execute).toHaveBeenCalledTimes(1)
    expect(addAction).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolExecuted).toHaveBeenCalledWith({
      ...expectedEventContext,
      toolName: "au_1_trigger",
      sourceType: ToolType.AUTOMATION,
      action: ToolAction.TRIGGER,
    })
  })

  it("emits a failed event when an automation returns an unsuccessful result", async () => {
    const execute = jest.fn().mockResolvedValue({
      success: false,
      status: AutomationStatus.ERROR,
      steps: [],
    })
    const toolDefinition: AiToolDefinition = {
      ...definition(execute),
      name: "au_1_trigger",
      sourceType: ToolType.AUTOMATION,
      action: ToolAction.TRIGGER,
    }

    await expect(callTool(toolDefinition)).rejects.toThrow(
      "Automation execution failed"
    )

    expect(addAction).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolExecuted).not.toHaveBeenCalled()
    expect(events.action.aiAgentToolFailed).toHaveBeenCalledWith({
      ...expectedEventContext,
      toolName: "au_1_trigger",
      sourceType: ToolType.AUTOMATION,
      action: ToolAction.TRIGGER,
      reason: ActionFailureReason.ERROR,
      errorMessage: "Automation execution failed",
    })
  })

  it("does not interpret a CRUD result's success field as a tool failure", async () => {
    const result = { success: false }
    const toolDefinition = definition(jest.fn().mockResolvedValue(result))
    toolDefinition.action = ToolAction.GET_ROW

    await expect(callTool(toolDefinition)).resolves.toEqual(result)

    expect(events.action.aiAgentToolExecuted).toHaveBeenCalledTimes(1)
    expect(events.action.aiAgentToolFailed).not.toHaveBeenCalled()
  })

  it("counts knowledge lookups as actions", async () => {
    const execute = jest.fn().mockResolvedValue({ sources: [] })
    const toolDefinition: AiToolDefinition = {
      ...definition(execute),
      name: "search_knowledge",
    }

    await callTool(toolDefinition)

    expect(addAction).toHaveBeenCalledTimes(1)
    expect(addAction).toHaveBeenCalledWith(
      ActionType.AI_AGENT,
      expect.any(Function)
    )
  })
})

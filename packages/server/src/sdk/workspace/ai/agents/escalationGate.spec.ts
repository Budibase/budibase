jest.mock("../../../../escalation/processor", () => ({
  escalationProcessor: { create: jest.fn() },
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceId: jest.fn(() => "app_1"),
      getTenantId: jest.fn(() => "tenant_1"),
      getWorkspaceDB: jest.fn(),
    },
  }
})

import { context } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { licensing } from "@budibase/pro"
import {
  ApprovalToolResultStatus,
  BasicOperator,
  ConstantQuotaName,
  EscalationNotificationChannel,
  EscalationSource,
  FieldType,
  ResolutionStrategy,
  ToolAction,
  ToolType,
  type AgentOperation,
  type AgentOperationApprovalPolicy,
  type ApprovalPolicyExpiry,
  type Query,
} from "@budibase/types"
import { cloneDeep } from "lodash"
import sdk from "../../.."
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"
import { initProMocks } from "../../../../tests/utilities/mocks/pro"
import { basicQuery, basicTable } from "../../../../tests/utilities/structures"
import { createEscalationGateRuntime } from "./escalationGate"

initProMocks()

const mockCreateEscalation = escalationProcessor.create as jest.Mock
const mockGetWorkspaceDB = context.getWorkspaceDB as jest.Mock

const operation: AgentOperation = {
  id: "operation_1",
  name: "Prepare Cloud release",
  live: true,
  allowKnowledgeSourceDownload: false,
  approvalPolicies: [
    {
      id: "policy_1",
      name: "Release reviewers",
      notifications: {
        recipients: [
          {
            type: EscalationNotificationChannel.SLACK,
            config: { channelId: "C1" },
          },
        ],
      },
    },
  ],
}

describe("createEscalationGateRuntime", () => {
  // No generated card copy, so the notification falls back to summarised args.
  const buildRuntime = ({
    generateCardCopy,
    reviewParameters = ["workflow_id", "inputs"],
    argsKey,
  }: {
    generateCardCopy?: jest.Mock
    reviewParameters?: string[]
    argsKey?: string
  } = {}) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: "create_workflow_dispatch",
      readableName: "Trigger workflow",
      displayName: "api.github_release_manager.Trigger workflow",
      argsKey,
      rules: [{ policyId: "policy_1", reviewParameters }],
      gateContext: {
        sessionId: "session_1",
        requesterLabel: "Test User (test@example.com)",
        getMessages: () => [],
        getRequestId: () => "request_1",
        generateCardCopy,
      },
    })

  beforeEach(() => {
    mockCreateEscalation
      .mockReset()
      .mockResolvedValue({ escalationId: "esc_1" })
  })

  it("persists the session metadata for a later resume", async () => {
    const sessionMetadata = {
      asset: { type: "agent" as const, id: "agent_1", label: "Support agent" },
      triggeredBy: { type: "user" as const, label: "Test User" },
    }
    const runtime = buildRuntime()

    await context.doInPlatformActionSessionContext(
      {
        sourceType: "agent_session",
        sourceId: "session_1",
        ...sessionMetadata,
      },
      () =>
        runtime.intercept(
          { workflow_id: "test-release.yml", inputs: {} },
          { toolCallId: "call_1", messages: [] }
        )
    )

    expect(mockCreateEscalation).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({ sessionMetadata }),
      })
    )
  })

  it("persists self-contained reviewer context for the frozen tool call", async () => {
    const runtime = buildRuntime()

    const result = await runtime.intercept(
      {
        workflow_id: "test-release.yml",
        inputs: { release_notes: "## Features\n- Useful change" },
      },
      { toolCallId: "call_1", messages: [] }
    )

    expect(mockCreateEscalation).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewContext: {
          requestedBy: "Test User (test@example.com)",
          operation: "Prepare Cloud release",
          action: "Trigger workflow",
          toolName: "api.github_release_manager.Trigger workflow",
          parameters: [
            { name: "workflow_id", value: "test-release.yml" },
            {
              name: "inputs",
              value: '{\n  "release_notes": "## Features\\n- Useful change"\n}',
            },
          ],
        },
        context: expect.objectContaining({
          pendingToolCall: expect.objectContaining({
            toolCallId: "call_1",
            toolName: "create_workflow_dispatch",
          }),
        }),
      })
    )
    expect(result).toEqual(
      expect.objectContaining({
        reviewContext: {
          requestedBy: "Test User (test@example.com)",
          operation: "Prepare Cloud release",
          action: "Trigger workflow",
          toolName: "api.github_release_manager.Trigger workflow",
          parameters: [
            { name: "workflow_id", value: "test-release.yml" },
            {
              name: "inputs",
              value: '{\n  "release_notes": "## Features\\n- Useful change"\n}',
            },
          ],
        },
      })
    )
  })

  it("keeps unselected values out of all reviewer-facing copy", async () => {
    const runtime = buildRuntime({ reviewParameters: ["workflow_id"] })

    await runtime.intercept(
      { workflow_id: "test-release.yml", api_token: "do-not-show" },
      { toolCallId: "call_1", messages: [] }
    )

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.summary).toContain("test-release.yml")
    expect(input.summary).not.toContain("do-not-show")
    expect(input.message).not.toContain("do-not-show")
    expect(input.title).not.toContain("do-not-show")
    expect(JSON.stringify(input.reviewContext.parameters)).not.toContain(
      "do-not-show"
    )
  })

  it("shares no parameters when the matching rule has no allowlist", async () => {
    const generateCardCopy = jest.fn().mockResolvedValue(undefined)
    const runtime = buildRuntime({ generateCardCopy, reviewParameters: [] })

    await runtime.intercept(
      { api_token: "do-not-show" },
      { toolCallId: "call_1", messages: [] }
    )

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.parameters).toBeUndefined()
    expect(input.summary).toBe("Trigger workflow requires approval.")
    expect(generateCardCopy).toHaveBeenCalledWith({
      label: "Trigger workflow",
      operation: "Prepare Cloud release",
      parameters: undefined,
    })
    expect(JSON.stringify(input.reviewContext)).not.toContain("do-not-show")
  })

  it("shares fields inside a tool argument wrapper by their field names", async () => {
    const runtime = buildRuntime({
      reviewParameters: ["rowId", "name", "metadata"],
      argsKey: "data",
    })

    await runtime.intercept(
      {
        rowId: "ro_1",
        rowRev: "1-test",
        data: { name: "Test User", metadata: { tier: "gold" } },
      },
      { toolCallId: "call_1", messages: [] }
    )

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.parameters).toEqual([
      { name: "rowId", value: "ro_1" },
      { name: "name", value: "Test User" },
      { name: "metadata", value: '{\n  "tier": "gold"\n}' },
    ])
  })

  it("omits toolName when it would only repeat the action", async () => {
    const runtime = createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: "ta_1_update_row",
      readableName: "Update row",
      displayName: "Update row",
      rules: [{ policyId: "policy_1" }],
      gateContext: {
        sessionId: "session_1",
        requesterLabel: "Test User (test@example.com)",
        getMessages: () => [],
        getRequestId: () => "request_1",
      },
    })

    await runtime.intercept({ rowId: "ro_1" }, { toolCallId: "call_1" })

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.action).toBe("Update row")
    expect(input.reviewContext.toolName).toBeUndefined()
  })

  it("gives generated copy enough context to identify the request", async () => {
    const generateCardCopy = jest.fn().mockResolvedValue({
      title: "Run the release workflow",
      summary: "Runs test-release.yml against the configured release branch.",
    })
    const runtime = buildRuntime({
      generateCardCopy,
      reviewParameters: ["workflow_id"],
    })
    const args = { workflow_id: "test-release.yml" }

    await runtime.intercept(args, { toolCallId: "call_1", messages: [] })

    expect(generateCardCopy).toHaveBeenCalledWith({
      label: "Trigger workflow",
      parameters: [{ name: "workflow_id", value: "test-release.yml" }],
      operation: "Prepare Cloud release",
    })
  })
})

describe("approved tool call identity", () => {
  const createGate = (executedApproval: {
    toolName: string
    sourceId?: string
    args: unknown
  }) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: "book_meeting",
      sourceId: "automation_1",
      rules: [{ policyId: "policy_1" }],
      gateContext: {
        sessionId: "session_1",
        getMessages: () => [],
        getRequestId: () => undefined,
        executedApproval,
      },
    })

  beforeEach(() => {
    mockCreateEscalation.mockReset().mockResolvedValue({
      escalationId: "escalation_1",
    })
  })

  it("suppresses an exact repeat even when object key order differs", async () => {
    const gate = createGate({
      toolName: "book_meeting",
      sourceId: "automation_1",
      args: { title: "Planning", attendees: ["A", "B"] },
    })

    await expect(
      gate.intercept(
        { attendees: ["A", "B"], title: "Planning" },
        { toolCallId: "call_2" }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.ALREADY_APPROVED,
      })
    )
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })

  it("allows a different call to the same tool through the gate", async () => {
    const gate = createGate({
      toolName: "book_meeting",
      sourceId: "automation_1",
      args: { title: "Planning" },
    })

    await expect(
      gate.intercept({ title: "Retrospective" }, { toolCallId: "call_2" })
    ).resolves.toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
        escalationId: "escalation_1",
      })
    )
    expect(mockCreateEscalation).toHaveBeenCalledTimes(1)
  })

  it("does not suppress a call backed by a different source", async () => {
    const gate = createGate({
      toolName: "book_meeting",
      sourceId: "automation_2",
      args: { title: "Planning" },
    })

    await expect(
      gate.intercept({ title: "Planning" }, { toolCallId: "call_2" })
    ).resolves.toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
        escalationId: "escalation_1",
      })
    )
    expect(mockCreateEscalation).toHaveBeenCalledTimes(1)
  })
})

describe("policy snapshot", () => {
  const recipients = [
    {
      type: EscalationNotificationChannel.SLACK,
      config: { channelId: "C1" },
    },
  ]

  const gateFor = (policy: AgentOperationApprovalPolicy) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation: { ...operation, approvalPolicies: [policy] },
      toolName: "book_meeting",
      sourceId: "automation_1",
      rules: [{ policyId: policy.id }],
      gateContext: {
        sessionId: "session_1",
        getMessages: () => [],
        getRequestId: () => undefined,
      },
    })

  const createInput = () => mockCreateEscalation.mock.calls[0][0]

  beforeEach(() => {
    mockCreateEscalation.mockReset().mockResolvedValue({
      escalationId: "escalation_1",
    })
  })

  it("freezes the matched rule and the policy without its delivery fields", async () => {
    const policy: AgentOperationApprovalPolicy = {
      id: "policy_1",
      name: "Manager approval",
      approvers: ["us_1", "us_2"],
      approvalType: ResolutionStrategy.UNANIMOUS,
      notifications: { recipients },
    }

    await gateFor(policy).intercept(
      { title: "Planning" },
      { toolCallId: "call_1" }
    )

    expect(escalationProcessor.create).toHaveBeenCalledTimes(1)
    expect(createInput()).toEqual(
      expect.objectContaining({
        source: EscalationSource.OPERATION,
        rule: { policyId: "policy_1" },
        policy: {
          id: "policy_1",
          name: "Manager approval",
          approvers: ["us_1", "us_2"],
          approvalType: ResolutionStrategy.UNANIMOUS,
        },
        recipients,
      })
    )
    expect(createInput().policy).not.toHaveProperty("notifications")
  })

  it("drops duplicate approvers from the frozen policy", async () => {
    const policy: AgentOperationApprovalPolicy = {
      id: "policy_1",
      name: "Manager approval",
      approvers: ["us_1", "us_2", "us_1"],
      approvalType: ResolutionStrategy.UNANIMOUS,
      notifications: { recipients },
    }

    await gateFor(policy).intercept(
      { title: "Planning" },
      { toolCallId: "call_1" }
    )

    expect(createInput().policy?.approvers).toEqual(["us_1", "us_2"])
  })

  it.each([
    [
      "unanimous with approvers",
      ["us_1"],
      ResolutionStrategy.UNANIMOUS,
      ResolutionStrategy.UNANIMOUS,
    ],
    [
      "majority with approvers",
      ["us_1"],
      ResolutionStrategy.MAJORITY,
      ResolutionStrategy.MAJORITY,
    ],
    [
      "approvers without a type",
      ["us_1"],
      undefined,
      ResolutionStrategy.FIRST_RESPONSE,
    ],
    [
      "a type without approvers",
      [],
      ResolutionStrategy.MAJORITY,
      ResolutionStrategy.FIRST_RESPONSE,
    ],
    [
      "no approvers field",
      undefined,
      undefined,
      ResolutionStrategy.FIRST_RESPONSE,
    ],
  ])(
    "binds the strategy for %s",
    async (_label, approvers, approvalType, expected) => {
      await gateFor({
        id: "policy_1",
        name: "Manager approval",
        ...(approvers ? { approvers } : {}),
        ...(approvalType ? { approvalType } : {}),
        notifications: { recipients },
      }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

      expect(createInput().resolutionStrategy).toEqual(
        resolutionStrategyBinding(expected)
      )
    }
  )

  it("raises an escalation when the policy has approvers but no recipients", async () => {
    const result = await gateFor({
      id: "policy_1",
      name: "Manager approval",
      approvers: ["us_1", "us_2"],
      approvalType: ResolutionStrategy.UNANIMOUS,
      notifications: { recipients: [] },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(result).toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
      })
    )
    expect(escalationProcessor.create).toHaveBeenCalledTimes(1)
  })

  it("returns unavailable and raises nothing when the policy has no approvers or recipients", async () => {
    const result = await gateFor({
      id: "policy_1",
      name: "Manager approval",
      notifications: { recipients: [] },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(escalationProcessor.create).not.toHaveBeenCalled()
  })

  it("returns unavailable and raises nothing when the rule's policy no longer exists", async () => {
    const result = await createEscalationGateRuntime({
      agentId: "agent_1",
      operation: { ...operation, approvalPolicies: [] },
      toolName: "book_meeting",
      sourceId: "automation_1",
      rules: [{ policyId: "policy_deleted" }],
      gateContext: {
        sessionId: "session_1",
        getMessages: () => [],
        getRequestId: () => undefined,
      },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(escalationProcessor.create).not.toHaveBeenCalled()
  })

  it("never expires when the policy sets no duration", async () => {
    await gateFor({
      id: "policy_1",
      name: "Manager approval",
      notifications: { recipients },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(createInput()).not.toHaveProperty("durationMs")
  })

  it("carries the frozen tool call exactly as invoked", async () => {
    const args = { title: "Planning", attendees: ["A", "B"] }

    await gateFor({
      id: "policy_1",
      name: "Manager approval",
      notifications: { recipients },
    }).intercept(args, { toolCallId: "call_7" })

    expect(createInput().context.pendingToolCall).toEqual({
      toolCallId: "call_7",
      toolName: "book_meeting",
      args,
      sourceId: "automation_1",
    })
  })

  describe("licence cap", () => {
    const DAY_MS = 24 * 60 * 60 * 1000
    const policyWith = (expiry: ApprovalPolicyExpiry) => ({
      id: "policy_1",
      name: "Manager approval",
      expiry,
      notifications: { recipients },
    })

    afterEach(() => {
      mocks.licenses.useUnlimited()
    })

    it("passes the policy duration through on an unlimited plan", async () => {
      await gateFor(
        policyWith({ durationSeconds: 90 * 24 * 60 * 60 })
      ).intercept({ title: "Planning" }, { toolCallId: "call_1" })

      expect(createInput().durationMs).toEqual(90 * DAY_MS)
    })

    it("schedules no expiry for never on an unlimited plan", async () => {
      await gateFor(policyWith({})).intercept(
        { title: "Planning" },
        { toolCallId: "call_1" }
      )

      expect(createInput()).not.toHaveProperty("durationMs")
    })

    it("caps a duration above the plan ceiling", async () => {
      mocks.licenses.setEscalationDurationQuota(7)

      await gateFor(
        policyWith({ durationSeconds: 90 * 24 * 60 * 60 })
      ).intercept({ title: "Planning" }, { toolCallId: "call_1" })

      expect(createInput().durationMs).toEqual(7 * DAY_MS)
    })

    it("turns never into the ceiling on a capped plan", async () => {
      mocks.licenses.setEscalationDurationQuota(7)

      await gateFor(policyWith({})).intercept(
        { title: "Planning" },
        { toolCallId: "call_1" }
      )

      expect(createInput().durationMs).toEqual(7 * DAY_MS)
    })

    it("leaves a duration below the ceiling alone", async () => {
      mocks.licenses.setEscalationDurationQuota(7)

      await gateFor(
        policyWith({ durationSeconds: 3 * 24 * 60 * 60 })
      ).intercept({ title: "Planning" }, { toolCallId: "call_1" })

      expect(createInput().durationMs).toEqual(3 * DAY_MS)
    })

    it("treats a missing quota as unlimited", async () => {
      const license = cloneDeep(await licensing.cache.getCachedLicense())
      Reflect.deleteProperty(
        license.quotas.constant,
        ConstantQuotaName.ESCALATION_DURATION_DAYS
      )
      mocks.licenses.useLicense(license)

      await gateFor(
        policyWith({ durationSeconds: 90 * 24 * 60 * 60 })
      ).intercept({ title: "Planning" }, { toolCallId: "call_1" })

      expect(createInput().durationMs).toEqual(90 * DAY_MS)
    })
  })
})

describe("row write defaults", () => {
  const table = basicTable(undefined, {
    _id: "ta_1",
    schema: {
      category: {
        type: FieldType.STRING,
        name: "category",
        default: "RESTRICTED",
      },
    },
  })

  const buildRuntime = ({
    action,
    reviewParameters,
  }: {
    action: ToolAction
    reviewParameters?: string[]
  }) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: `ta_1_${action}`,
      readableName: `TestTable.${action}`,
      sourceId: "ta_1",
      action,
      argsKey: "data",
      rules: [
        {
          policyId: "policy_1",
          conditions: [
            {
              field: "category",
              operator: BasicOperator.EQUAL,
              value: "RESTRICTED",
              type: FieldType.STRING,
            },
          ],
          reviewParameters,
        },
      ],
      gateContext: {
        sessionId: "session_1",
        getMessages: () => [],
        getRequestId: () => undefined,
      },
    })

  let getTable: jest.SpyInstance
  let findRow: jest.SpyInstance

  beforeEach(() => {
    mockCreateEscalation
      .mockReset()
      .mockResolvedValue({ escalationId: "esc_1" })
    getTable = jest.spyOn(sdk.tables, "getTable").mockResolvedValue(table)
    findRow = jest.spyOn(sdk.rows, "find").mockResolvedValue({
      _id: "ro_1",
      name: "Review",
      category: "PUBLIC",
    })
  })

  afterEach(() => {
    getTable.mockRestore()
    findRow.mockRestore()
  })

  it.each([
    ["leaves out", { name: "Review" }],
    ["sends blank", { name: "Review", category: "" }],
  ])(
    "requires approval when a default fills a field the agent %s",
    async (_, data) => {
      const result = await buildRuntime({
        action: ToolAction.CREATE_ROW,
      }).intercept({ data }, { toolCallId: "call_1" })

      expect(result).toEqual(
        expect.objectContaining({
          status: ApprovalToolResultStatus.PENDING_APPROVAL,
        })
      )
    }
  )

  it("requires approval when an update blanks a field that has a default", async () => {
    const result = await buildRuntime({
      action: ToolAction.UPDATE_ROW,
    }).intercept(
      { rowId: "ro_1", rowRev: "1-test", data: { category: "" } },
      { toolCallId: "call_1" }
    )

    expect(result).toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
      })
    )
  })

  it("lets a value the agent sends override the default", async () => {
    const result = await buildRuntime({
      action: ToolAction.CREATE_ROW,
    }).intercept(
      { data: { name: "Review", category: "PUBLIC" } },
      { toolCallId: "call_1" }
    )

    expect(result).toBeUndefined()
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })

  it("shows reviewers the value a default filled in", async () => {
    await buildRuntime({
      action: ToolAction.CREATE_ROW,
      reviewParameters: ["name", "category"],
    }).intercept({ data: { name: "Review" } }, { toolCallId: "call_1" })

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.parameters).toEqual([
      { name: "name", value: "Review" },
      { name: "category", value: "RESTRICTED" },
    ])
  })

  it("refuses without raising an approval when the row to update can't be found", async () => {
    findRow.mockRejectedValue(new Error("Row not found"))

    const result = await buildRuntime({
      action: ToolAction.UPDATE_ROW,
    }).intercept(
      { rowId: "ro_missing", rowRev: "1-test", data: { category: "PUBLIC" } },
      { toolCallId: "call_1" }
    )

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })

  it("refuses without raising an approval when a rule's column no longer exists", async () => {
    const { category: _deleted, ...schema } = table.schema
    getTable.mockResolvedValue({ ...table, schema })

    const result = await buildRuntime({
      action: ToolAction.CREATE_ROW,
    }).intercept(
      { data: { name: "Review", category: "RESTRICTED" } },
      { toolCallId: "call_1" }
    )

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })
})

describe("query parameter defaults", () => {
  const queryWithDefault = (fallback: string): Query => ({
    ...basicQuery("datasource_1"),
    _id: "query_1",
    parameters: [{ name: "qaWho", default: fallback }],
  })

  const buildRuntime = ({
    reviewParameters,
  }: { reviewParameters?: string[] } = {}) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: "rest_qa_who",
      readableName: "QA who",
      sourceId: "query_1",
      sourceType: ToolType.REST_QUERY,
      rules: [
        {
          policyId: "policy_1",
          conditions: [
            {
              field: "qaWho",
              operator: BasicOperator.EQUAL,
              value: "RESTRICTED",
              type: FieldType.STRING,
            },
          ],
          reviewParameters,
        },
      ],
      gateContext: {
        sessionId: "session_1",
        getMessages: () => [],
        getRequestId: () => undefined,
      },
    })

  const tryGet = jest.fn()
  let getEnvironmentVariables: jest.SpyInstance

  beforeEach(() => {
    mockCreateEscalation
      .mockReset()
      .mockResolvedValue({ escalationId: "esc_1" })
    tryGet.mockReset().mockResolvedValue(queryWithDefault("RESTRICTED"))
    mockGetWorkspaceDB.mockReturnValue({ tryGet })
    getEnvironmentVariables = jest
      .spyOn(context, "getEnvironmentVariables")
      .mockReturnValue({ QA_WHO: "RESTRICTED" })
  })

  afterEach(() => {
    mockGetWorkspaceDB.mockReset()
    getEnvironmentVariables.mockRestore()
  })

  it.each([
    ["leaves out", {}],
    ["sends blank", { qaWho: "" }],
  ])(
    "requires approval when a default fills a parameter the agent %s",
    async (_, input) => {
      const result = await buildRuntime().intercept(input, {
        toolCallId: "call_1",
      })

      expect(result).toEqual(
        expect.objectContaining({
          status: ApprovalToolResultStatus.PENDING_APPROVAL,
        })
      )
    }
  )

  it("lets a value the agent sends override the default", async () => {
    const result = await buildRuntime().intercept(
      { qaWho: "PUBLIC" },
      { toolCallId: "call_1" }
    )

    expect(result).toBeUndefined()
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })

  it("shows reviewers the value a default filled in", async () => {
    await buildRuntime({ reviewParameters: ["qaWho"] }).intercept(
      {},
      { toolCallId: "call_1" }
    )

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.parameters).toEqual([
      { name: "qaWho", value: "RESTRICTED" },
    ])
  })

  it("matches on a resolved environment variable default but shows reviewers the binding", async () => {
    tryGet.mockResolvedValue(queryWithDefault("{{ env.QA_WHO }}"))

    const result = await buildRuntime({
      reviewParameters: ["qaWho"],
    }).intercept({}, { toolCallId: "call_1" })

    expect(result).toEqual(
      expect.objectContaining({
        status: ApprovalToolResultStatus.PENDING_APPROVAL,
      })
    )
    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.reviewContext.parameters).toEqual([
      { name: "qaWho", value: "{{ env.QA_WHO }}" },
    ])
  })

  it("refuses without raising an approval when the query can't be found", async () => {
    tryGet.mockResolvedValue(undefined)

    const result = await buildRuntime().intercept(
      { qaWho: "PUBLIC" },
      { toolCallId: "call_1" }
    )

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(mockCreateEscalation).not.toHaveBeenCalled()
  })
})

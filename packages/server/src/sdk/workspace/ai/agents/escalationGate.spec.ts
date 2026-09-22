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
    },
  }
})

import {
  ApprovalToolResultStatus,
  EscalationNotificationChannel,
  EscalationSource,
  ResolutionStrategy,
  type AgentOperation,
  type AgentOperationApprovalPolicy,
} from "@budibase/types"
import { escalationProcessor } from "../../../../escalation/processor"
import { resolutionStrategyBinding } from "../../../../escalation/resolutionStrategies"
import {
  createEscalationGateRuntime,
  DEFAULT_ESCALATION_DELAY_SECONDS,
} from "./escalationGate"

const mockCreateEscalation = escalationProcessor.create as jest.Mock

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
      expiresAt: "2026-09-10T12:00:00.000Z",
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
      expiresAt: "2026-09-10T12:00:00.000Z",
    })
  })

  it("freezes the matched rule and the policy without its delivery fields", async () => {
    const policy: AgentOperationApprovalPolicy = {
      id: "policy_1",
      name: "Manager approval",
      approvers: ["us_1", "us_2"],
      approvalType: ResolutionStrategy.UNANIMOUS,
      notifications: { recipients, delay: 60 },
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
        delay: 60_000,
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

  // This will change when the Request portal goes in
  // Right now you cant escalate without a notif
  it("returns unavailable and raises nothing when the policy has no recipients", async () => {
    const result = await gateFor({
      id: "policy_1",
      name: "Manager approval",
      approvers: ["us_1", "us_2"],
      approvalType: ResolutionStrategy.UNANIMOUS,
      notifications: { recipients: [] },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(result).toEqual(
      expect.objectContaining({ status: ApprovalToolResultStatus.UNAVAILABLE })
    )
    expect(escalationProcessor.create).not.toHaveBeenCalled()
  })

  it("defaults the delay when the policy sets none", async () => {
    await gateFor({
      id: "policy_1",
      name: "Manager approval",
      notifications: { recipients },
    }).intercept({ title: "Planning" }, { toolCallId: "call_1" })

    expect(createInput().delay).toEqual(DEFAULT_ESCALATION_DELAY_SECONDS * 1000)
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
})

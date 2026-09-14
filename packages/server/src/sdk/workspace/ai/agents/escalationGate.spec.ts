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

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceId: () => "app_1",
      getTenantId: () => "tenant_1",
    },
  }
})

const operation: AgentOperation = {
  id: "operation_1",
  name: "Test operation",
  live: true,
  allowKnowledgeSourceDownload: false,
  approvalPolicies: [
    {
      id: "policy_1",
      name: "Manager approval",
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

describe("approved tool call identity", () => {
  beforeEach(() => {
    jest.spyOn(escalationProcessor, "create").mockResolvedValue({
      escalationId: "escalation_1",
      expiresAt: "2026-09-10T12:00:00.000Z",
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
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
    expect(escalationProcessor.create).not.toHaveBeenCalled()
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
    expect(escalationProcessor.create).toHaveBeenCalledTimes(1)
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
    expect(escalationProcessor.create).toHaveBeenCalledTimes(1)
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

  const createInput = () =>
    (escalationProcessor.create as jest.Mock).mock.calls[0][0]

  beforeEach(() => {
    jest.spyOn(escalationProcessor, "create").mockResolvedValue({
      escalationId: "escalation_1",
      expiresAt: "2026-09-10T12:00:00.000Z",
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

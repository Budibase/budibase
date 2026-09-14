import {
  ApprovalToolResultStatus,
  EscalationNotificationChannel,
  type AgentOperation,
} from "@budibase/types"
import { escalationProcessor } from "../../../../escalation/processor"
import { createEscalationGateRuntime } from "./escalationGate"

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

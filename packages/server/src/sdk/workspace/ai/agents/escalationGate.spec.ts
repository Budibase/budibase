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
  type AgentOperation,
} from "@budibase/types"
import { escalationProcessor } from "../../../../escalation/processor"
import { createEscalationGateRuntime } from "./escalationGate"

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
  const buildRuntime = (generateCardCopy?: jest.Mock) =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation,
      toolName: "create_workflow_dispatch",
      readableName: "Trigger workflow",
      rules: [{ policyId: "policy_1" }],
      gateContext: {
        sessionId: "session_1",
        requesterLabel: "Adria Navarro (adria@example.com)",
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

    await runtime.intercept(
      {
        workflow_id: "test-release.yml",
        inputs: { release_notes: "## Features\n- Useful change" },
      },
      { toolCallId: "call_1", messages: [] }
    )

    expect(mockCreateEscalation).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewContext: {
          requestedBy: "Adria Navarro (adria@example.com)",
          operation: "Prepare Cloud release",
          action: "Trigger workflow",
          parameters: expect.stringContaining("release_notes"),
        },
        context: expect.objectContaining({
          pendingToolCall: expect.objectContaining({
            toolCallId: "call_1",
            toolName: "create_workflow_dispatch",
          }),
        }),
      })
    )
  })

  it("keeps secrets out of the notification copy when card copy is unavailable", async () => {
    const runtime = buildRuntime()

    await runtime.intercept(
      { workflow_id: "test-release.yml", api_token: "do-not-show" },
      { toolCallId: "call_1", messages: [] }
    )

    const [input] = mockCreateEscalation.mock.calls[0]
    expect(input.summary).toContain("[REDACTED]")
    expect(input.summary).not.toContain("do-not-show")
    expect(input.message).not.toContain("do-not-show")
    expect(input.title).not.toContain("do-not-show")
  })

  it("gives generated copy enough context to identify the request", async () => {
    const generateCardCopy = jest.fn().mockResolvedValue({
      title: "Run the release workflow",
      summary: "Adria Navarro is requesting a release workflow run.",
    })
    const runtime = buildRuntime(generateCardCopy)
    const args = { workflow_id: "test-release.yml" }

    await runtime.intercept(args, { toolCallId: "call_1", messages: [] })

    expect(generateCardCopy).toHaveBeenCalledWith({
      label: "Trigger workflow",
      args,
      operation: "Prepare Cloud release",
      requestedBy: "Adria Navarro (adria@example.com)",
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

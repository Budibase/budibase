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

import { EscalationNotificationChannel } from "@budibase/types"
import { escalationProcessor } from "../../../../escalation/processor"
import { createEscalationGateRuntime } from "./escalationGate"

const mockCreateEscalation = escalationProcessor.create as jest.Mock

describe("createEscalationGateRuntime", () => {
  // No generated card copy, so the notification falls back to summarised args.
  const buildRuntime = () =>
    createEscalationGateRuntime({
      agentId: "agent_1",
      operation: {
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
      },
      toolName: "create_workflow_dispatch",
      readableName: "Trigger workflow",
      rules: [{ policyId: "policy_1" }],
      gateContext: {
        sessionId: "session_1",
        requesterLabel: "Adria Navarro (adria@example.com)",
        getMessages: () => [],
        getRequestId: () => "request_1",
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
})

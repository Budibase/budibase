import { ApprovalToolResultStatus, type AgentOperation } from "@budibase/types"
import { createEscalationGateRuntime } from "./escalationGate"

const operation: AgentOperation = {
  id: "operation_1",
  name: "Test operation",
  live: true,
  allowKnowledgeSourceDownload: false,
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
    rules: [],
    gateContext: {
      sessionId: "session_1",
      getMessages: () => [],
      getRequestId: () => undefined,
      executedApproval,
    },
  })

describe("approved tool call identity", () => {
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
  })

  it("allows a different call to the same tool through the gate", async () => {
    const gate = createGate({
      toolName: "book_meeting",
      sourceId: "automation_1",
      args: { title: "Planning" },
    })

    await expect(
      gate.intercept({ title: "Retrospective" }, { toolCallId: "call_2" })
    ).resolves.toBeUndefined()
  })

  it("does not suppress a call backed by a different source", async () => {
    const gate = createGate({
      toolName: "book_meeting",
      sourceId: "automation_2",
      args: { title: "Planning" },
    })

    await expect(
      gate.intercept({ title: "Planning" }, { toolCallId: "call_2" })
    ).resolves.toBeUndefined()
  })
})

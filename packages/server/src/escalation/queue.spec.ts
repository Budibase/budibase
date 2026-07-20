import { context } from "@budibase/backend-core"
import {
  Agent,
  DocumentType,
  ESCALATE_TOOL_NAME,
  EscalationContextDoc,
  EscalationNotificationChannel,
  EscalationRaisedAction,
  EscalationSource,
  SEPARATOR,
  SuspendedOperationContext,
} from "@budibase/types"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import sdk from "../sdk"
import { resumeOperation } from "./queue"
import { createEscalateTool } from "../ai/tools/budibase"

jest.mock("../sdk/workspace/ai/agents", () => {
  const actual = jest.requireActual("../sdk/workspace/ai/agents")
  return {
    ...actual,
    getOrThrow: jest.fn(),
    prepareAgentChatRun: jest.fn(),
  }
})

jest.mock("../sdk/workspace/ai/agentRequests", () => {
  const actual = jest.requireActual("../sdk/workspace/ai/agentRequests")
  return {
    ...actual,
    recordEscalationResolved: jest.fn(actual.recordEscalationResolved),
  }
})

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    readUIMessageStream: (opts: { stream: unknown }) => opts.stream,
  }
})

const prepareAgentChatRunMock = sdk.ai.agents.prepareAgentChatRun as jest.Mock
const getOrThrowMock = sdk.ai.agents.getOrThrow as jest.Mock
const recordEscalationResolvedMock = sdk.ai.agentRequests
  .recordEscalationResolved as jest.Mock

const mockApprovedRun = (text: string) => {
  prepareAgentChatRunMock.mockResolvedValue({
    toolDisplayNames: {},
    sessionLogIndexer: { index: jest.fn().mockResolvedValue(undefined) },
    stream: jest.fn().mockResolvedValue({
      finishReason: Promise.resolve("stop"),
      toUIMessageStream: () =>
        (async function* () {
          yield { id: "", role: "assistant", parts: [{ type: "text", text }] }
        })(),
    }),
  })
  getOrThrowMock.mockResolvedValue({ _id: "agent_1" } as Agent)
}

describe("resumeOperation", () => {
  const config = new TestConfiguration()

  const createRequest = () =>
    sdk.ai.agentRequests.initActiveRequest({
      agentId: "agent_1",
      userId: "user_1",
      sessionId: "session_1",
      latestPrompt: "Buy 1500 pens",
      operation: { name: "Procurement", prompt: "Handle procurement." },
      source: "Chat",
    })

  const baseDoc = (
    overrides: Partial<EscalationContextDoc> = {}
  ): EscalationContextDoc => ({
    _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_primary`,
    source: EscalationSource.OPERATION,
    appId: config.getProdWorkspaceId(),
    tenantId: config.getTenantId(),
    agentId: "agent_1",
    operationId: "op_1",
    sessionId: "session_1",
    delay: 1000,
    resolution: "pending",
    ...overrides,
  })

  const baseCtx: SuspendedOperationContext = {
    agentId: "agent_1",
    operationId: "op_1",
    sessionId: "session_1",
    messages: [],
  }

  beforeEach(async () => {
    prepareAgentChatRunMock.mockReset()
    getOrThrowMock.mockReset()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("records escalation_resolved with outcome approved and continues the resumed turn", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      mockApprovedRun("Approved and booked.")

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_resolved",
            escalationId: "esc_primary",
            outcome: "approved",
            sessionId: "session_1",
          }),
        ])
      )
    })
  })

  it("passes getRequestId resolving to the escalation's request id", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      mockApprovedRun("Approved and booked.")

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const { getRequestId } = prepareAgentChatRunMock.mock.calls[0][0]
      expect(getRequestId()).toEqual(requestId)
    })
  })

  it("records escalation_resolved with outcome rejected", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: false } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_resolved",
            escalationId: "esc_primary",
            outcome: "rejected",
          }),
        ])
      )
      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
    })
  })

  it("records escalation_resolved with outcome expired", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!

      await resumeOperation({
        doc: baseDoc({ requestId }),
        escalationId: "esc_primary",
        resolution: "expired",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_resolved",
            escalationId: "esc_primary",
            outcome: "expired",
          }),
        ])
      )
      expect(request.status).toEqual("failed")
    })
  })

  it("still records escalation_resolved for the expiring escalation, but doesn't finalize the request while another escalation is pending", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      await context.getWorkspaceDB().put(
        baseDoc({
          _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
          requestId,
        })
      )

      await resumeOperation({
        doc: baseDoc({ requestId }),
        escalationId: "esc_primary",
        resolution: "expired",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_resolved",
            escalationId: "esc_primary",
            outcome: "expired",
          }),
        ])
      )
      expect(request.status).toEqual("needs_input")
    })
  })

  it("does nothing when the escalation has no associated request", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await expect(
        resumeOperation({
          doc: baseDoc(),
          escalationId: "esc_primary",
          resolution: "expired",
          ctx: baseCtx,
        })
      ).resolves.toBeUndefined()
    })
  })

  it("continues the resume even if recording the escalation resolution fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      recordEscalationResolvedMock.mockRejectedValueOnce(
        new Error("DB unavailable")
      )

      await resumeOperation({
        doc: baseDoc({ requestId }),
        escalationId: "esc_primary",
        resolution: "expired",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("failed")
      expect(
        (request.actions ?? []).filter(a => a.type === "escalation_resolved")
      ).toEqual([])
    })
  })

  it("raises and tracks a second, genuinely new escalation created during the resumed run", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!

      const secondEscalationInput = {
        title: "New procurement request",
        summary: "Buy 500 more pens for the new starters",
        reason: "Spend exceeds the approved budget",
      }

      prepareAgentChatRunMock.mockImplementation(async ({ getRequestId }) => ({
        toolDisplayNames: {},
        sessionLogIndexer: { index: jest.fn().mockResolvedValue(undefined) },
        stream: jest
          .fn()
          .mockImplementation(async ({ onToolCalls, onToolCallCompleted }) => {
            const escalateTool = createEscalateTool({
              agentId: "agent_1",
              operationId: "op_1",
              sessionId: "session_1",
              recipients: [
                {
                  type: EscalationNotificationChannel.SLACK,
                  config: { channelId: "C1" },
                },
              ],
              delayMs: 1000,
              getMessages: () => [],
              getRequestId,
            })

            if (!escalateTool.execute) {
              throw new Error("escalate tool has no execute function")
            }
            const output = await escalateTool.execute(secondEscalationInput, {
              toolCallId: "tc_second_escalation",
              messages: [],
            })

            onToolCalls?.([ESCALATE_TOOL_NAME])
            await onToolCallCompleted?.({
              toolName: ESCALATE_TOOL_NAME,
              status: "success",
              input: secondEscalationInput,
              output,
            })

            return {
              finishReason: Promise.resolve("stop"),
              toUIMessageStream: () =>
                (async function* () {
                  yield {
                    id: "",
                    role: "assistant",
                    parts: [
                      {
                        type: "text",
                        text: "Escalated the new request for approval.",
                      },
                    ],
                  }
                })(),
            }
          }),
      }))
      getOrThrowMock.mockResolvedValue({ _id: "agent_1" } as Agent)

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")

      const raisedActions = (request.actions ?? []).filter(
        (a): a is EscalationRaisedAction => a.type === "escalation_raised"
      )
      expect(raisedActions).toHaveLength(1)
      const [raisedAction] = raisedActions
      expect(raisedAction.escalationId).not.toEqual("esc_primary")

      const newEscalationDoc = await sdk.escalations.getContextDoc(
        raisedAction.escalationId
      )
      expect(newEscalationDoc?.requestId).toEqual(requestId)
      expect(newEscalationDoc?.resolution).toEqual("pending")

      // The new escalation is still pending, so the request must not close.
      expect(request.status).toEqual("needs_input")
    })
  })
})

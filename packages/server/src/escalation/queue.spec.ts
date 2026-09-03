import { context, events } from "@budibase/backend-core"
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

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    events: {
      ...actual.events,
      platformActions: {
        ...actual.events.platformActions,
        enqueuePlatformActionSessionLifecycle: jest.fn(),
      },
    },
  }
})

const prepareAgentChatRunMock = sdk.ai.agents.prepareAgentChatRun as jest.Mock
const getOrThrowMock = sdk.ai.agents.getOrThrow as jest.Mock
const recordEscalationResolvedMock = sdk.ai.agentRequests
  .recordEscalationResolved as jest.Mock
const enqueueLifecycleMock = events.platformActions
  .enqueuePlatformActionSessionLifecycle as jest.Mock
const aiAgentExecutedMock = jest.spyOn(events.action, "aiAgentExecuted")
const aiAgentFailedMock = jest.spyOn(events.action, "aiAgentFailed")

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
    enqueueLifecycleMock.mockReset().mockResolvedValue(undefined)
    aiAgentExecutedMock.mockReset()
    aiAgentFailedMock.mockReset()
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

  it("marks an action-backed request session active and emits its resumed action", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      mockApprovedRun("Approved and booked.")

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      expect(enqueueLifecycleMock).toHaveBeenCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "active",
      })
      expect(enqueueLifecycleMock).toHaveBeenCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "completed",
      })
      expect(aiAgentExecutedMock).toHaveBeenCalledWith({
        agentId: "agent_1",
        sourceType: "agent_session",
        sourceId: "session_1",
        sessionId: "session_1",
        requestId,
      })
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

  it("emits a failed action when the resumed agent stream fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      prepareAgentChatRunMock.mockResolvedValue({
        toolDisplayNames: {},
        sessionLogIndexer: { index: jest.fn().mockResolvedValue(undefined) },
        stream: jest.fn().mockRejectedValue(new Error("Model unavailable")),
      })
      getOrThrowMock.mockResolvedValue({ _id: "agent_1" } as Agent)

      await expect(
        resumeOperation({
          doc: baseDoc({ requestId, response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })
      ).rejects.toThrow("Model unavailable")

      expect(enqueueLifecycleMock).toHaveBeenCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "active",
      })
      expect(aiAgentFailedMock).toHaveBeenCalledWith({
        agentId: "agent_1",
        sourceType: "agent_session",
        sourceId: "session_1",
        sessionId: "session_1",
        requestId,
        reason: "error",
        errorMessage: "Model unavailable",
      })
    })
  })

  it("emits a failed action when the resumed agent cannot be prepared", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      getOrThrowMock.mockRejectedValue(new Error("Agent unavailable"))

      await expect(
        resumeOperation({
          doc: baseDoc({ requestId, response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })
      ).rejects.toThrow("Agent unavailable")

      expect(aiAgentFailedMock).toHaveBeenCalledWith({
        agentId: "agent_1",
        sourceType: "agent_session",
        sourceId: "session_1",
        sessionId: "session_1",
        requestId,
        reason: "error",
        errorMessage: "Agent unavailable",
      })
    })
  })

  it("keeps a completed agent action when session log indexing fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      prepareAgentChatRunMock.mockResolvedValue({
        toolDisplayNames: {},
        sessionLogIndexer: {
          index: jest
            .fn()
            .mockRejectedValue(new Error("Log index unavailable")),
        },
        stream: jest.fn().mockResolvedValue({
          finishReason: Promise.resolve("stop"),
          toUIMessageStream: () =>
            (async function* () {
              yield {
                id: "",
                role: "assistant",
                parts: [{ type: "text", text: "Approved and booked." }],
              }
            })(),
        }),
      })
      getOrThrowMock.mockResolvedValue({ _id: "agent_1" } as Agent)

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      expect(aiAgentExecutedMock).toHaveBeenCalledWith(
        expect.objectContaining({ requestId })
      )
      expect(aiAgentFailedMock).not.toHaveBeenCalled()
    })
  })

  it("reconstructs an automation user with its requester role", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      mockApprovedRun("Approved and created.")

      await resumeOperation({
        doc: baseDoc({ response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: {
          ...baseCtx,
          userId: "automation:session_1",
          requester: { executorRole: "ADMIN" },
        },
      })

      expect(prepareAgentChatRunMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            _id: "automation:session_1",
            roleId: "ADMIN",
          }),
        })
      )
    })
  })

  it("does not restore a requester role for a missing persisted user", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      mockApprovedRun("Approved and created.")

      await resumeOperation({
        doc: baseDoc({ response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: {
          ...baseCtx,
          userId: "missing-user",
          requester: { executorRole: "ADMIN" },
        },
      })

      expect(prepareAgentChatRunMock).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            _id: "missing-user",
            roleId: undefined,
          }),
        })
      )
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
      expect(enqueueLifecycleMock).toHaveBeenCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "failed",
      })
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
      mockApprovedRun("Approved and booked.")

      await expect(
        resumeOperation({
          doc: baseDoc({ response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })
      ).resolves.toBeUndefined()

      expect(enqueueLifecycleMock).not.toHaveBeenCalled()
      expect(aiAgentExecutedMock).not.toHaveBeenCalled()
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
          .mockImplementation(async ({ onToolCallCompleted }) => {
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
              userId: config.getUser()._id,
              getMessages: () => [],
              getRequestId,
              executionContext: {
                tenantId: config.getTenantId(),
                workspaceId: config.getProdWorkspaceId(),
                agentId: "agent_1",
                operationId: "op_1",
                conversationId: "session_1",
                requester: {
                  executorRole: "BASIC",
                },
              },
            })

            if (!escalateTool.execute) {
              throw new Error("escalate tool has no execute function")
            }
            const output = await escalateTool.execute(secondEscalationInput, {
              toolCallId: "tc_second_escalation",
              messages: [],
              context: {},
            })

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
      expect(aiAgentExecutedMock).toHaveBeenCalledWith(
        expect.objectContaining({
          agentId: "agent_1",
          requestId,
          awaitingEscalation: true,
        })
      )
    })
  })
})

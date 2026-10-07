import zlib from "zlib"
import { readUIMessageStream, type UIMessageChunk } from "ai"
import { context, events } from "@budibase/backend-core"
import {
  Agent,
  ApprovalToolResultStatus,
  DocumentType,
  EscalationAction,
  EscalationContextDoc,
  EscalationNotificationChannel,
  EscalationNotificationDoc,
  EscalationRecipient,
  EscalationSource,
  SEPARATOR,
  SuspendedOperationContext,
} from "@budibase/types"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import sdk from "../sdk"
import {
  getQueue,
  processNotify,
  processResume,
  resumeOperation,
} from "./queue"
import * as slack from "./notifications/slack"
import * as teams from "./notifications/ms-teams"
import { ProviderResponseError } from "./notifications/utils"

jest.mock("./notifications/slack", () => {
  const actual = jest.requireActual("./notifications/slack")
  return { ...actual, sendSlackNotification: jest.fn() }
})

jest.mock("./notifications/ms-teams", () => {
  const actual = jest.requireActual("./notifications/ms-teams")
  return { ...actual, sendMSTeamsNotification: jest.fn() }
})

jest.mock("../sdk/workspace/ai/agents", () => {
  const actual = jest.requireActual("../sdk/workspace/ai/agents")
  return {
    ...actual,
    buildPromptAndTools: jest.fn(),
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

jest.mock("../sdk/workspace/escalations", () => {
  const actual = jest.requireActual("../sdk/workspace/escalations")
  return {
    ...actual,
    listContextDocs: jest.fn(actual.listContextDocs),
  }
})

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    readUIMessageStream: jest.fn(opts => opts.stream),
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
const buildPromptAndToolsMock = sdk.ai.agents.buildPromptAndTools as jest.Mock
const getOrThrowMock = sdk.ai.agents.getOrThrow as jest.Mock
const recordEscalationResolvedMock = sdk.ai.agentRequests
  .recordEscalationResolved as jest.Mock
const enqueueLifecycleMock = events.platformActions
  .enqueuePlatformActionSessionLifecycle as jest.Mock
const aiAgentExecutedMock = jest.spyOn(events.action, "aiAgentExecuted")
const aiAgentFailedMock = jest.spyOn(events.action, "aiAgentFailed")
const listContextDocsMock = sdk.escalations.listContextDocs as jest.Mock

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
    durationMs: 1000,
    resolution: "pending",
    ...overrides,
  })

  const baseCtx: SuspendedOperationContext = {
    agentId: "agent_1",
    operationId: "op_1",
    sessionId: "session_1",
    messages: [],
    pendingToolCall: {
      toolCallId: "tool_call_1",
      toolName: "book_meeting",
      args: { title: "Procurement review" },
    },
  }

  beforeEach(async () => {
    prepareAgentChatRunMock.mockReset()
    buildPromptAndToolsMock.mockReset()
    buildPromptAndToolsMock.mockResolvedValue({
      tools: {
        book_meeting: {
          execute: jest.fn().mockResolvedValue({ booked: true }),
        },
      },
      toolSources: {},
    })
    getOrThrowMock.mockReset()
    enqueueLifecycleMock.mockReset().mockResolvedValue(undefined)
    aiAgentExecutedMock.mockReset()
    aiAgentFailedMock.mockReset()
    getOrThrowMock.mockResolvedValue({
      _id: "agent_1",
      operations: [{ id: "op_1" }],
    } as Agent)
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

  it("reports an approved tool failure without asking the model to narrate it", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      const escalation = baseDoc({
        requestId,
        resolution: "resolved",
        response: { accepted: true },
        title: "Purchase request for 46 euros",
      })
      await context.getWorkspaceDB().put(escalation)
      getOrThrowMock.mockResolvedValue({
        _id: "agent_1",
        operations: [{ id: "op_1" }],
      } as Agent)
      buildPromptAndToolsMock.mockResolvedValue({
        tools: {
          create_row: {
            execute: jest.fn().mockRejectedValue({
              validation: { Department: "can't be blank" },
            }),
          },
        },
        toolSources: {},
      })

      await resumeOperation({
        doc: escalation,
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: {
          ...baseCtx,
          pendingToolCall: {
            toolCallId: "call_1",
            toolName: "create_row",
            args: { data: { amount: 46 } },
          },
        },
      })

      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("failed")
      expect(request.error).toEqual(
        '{"validation":{"Department":"can\'t be blank"}}'
      )
      const storedEscalation = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>(escalation._id!)
      const resumeResult = JSON.parse(
        zlib
          .inflateSync(
            Uint8Array.from(
              Buffer.from(storedEscalation.resumeResultCompressed!, "base64")
            )
          )
          .toString()
      )
      expect(resumeResult.parts).toEqual([
        {
          type: "text",
          text:
            "Your purchase request for 46 euros was approved, but I couldn't " +
            "complete it. Please try again.",
        },
      ])
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "tool_call",
            toolName: "create_row",
            status: "error",
          }),
        ])
      )
    })
  })

  it("keeps the request open when another escalation is pending after an approved tool failure", async () => {
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
      getOrThrowMock.mockResolvedValue({
        _id: "agent_1",
        operations: [{ id: "op_1" }],
      } as Agent)
      buildPromptAndToolsMock.mockResolvedValue({
        tools: {
          create_row: {
            execute: jest.fn().mockRejectedValue(new Error("DB unavailable")),
          },
        },
        toolSources: {},
      })

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: {
          ...baseCtx,
          pendingToolCall: {
            toolCallId: "call_1",
            toolName: "create_row",
            args: { data: { amount: 46 } },
          },
        },
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("needs_input")
      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
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
      expect(prepareAgentChatRunMock).toHaveBeenCalledWith(
        expect.objectContaining({
          executedApproval: {
            toolName: "book_meeting",
            args: { title: "Procurement review" },
            sourceId: undefined,
          },
        })
      )
    })
  })

  it("keeps the request pending when the approved tool has been removed and another approval is in flight", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      buildPromptAndToolsMock.mockResolvedValue({ tools: {}, toolSources: {} })
      const doc = baseDoc({ requestId, response: { accepted: true } })
      await context.getWorkspaceDB().put({ ...doc, resolution: "resolved" })
      await context.getWorkspaceDB().put(
        baseDoc({
          _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
          requestId,
        })
      )

      await resumeOperation({
        doc,
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("needs_input")
      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
    })
  })

  it("leaves an expired escalation retryable when checking pending escalations fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      const doc = baseDoc({ requestId })
      await context.getWorkspaceDB().put({ ...doc, resolution: "expired" })
      recordEscalationResolvedMock.mockResolvedValueOnce(undefined)
      listContextDocsMock.mockRejectedValueOnce(
        new Error("temporary database failure")
      )

      await expect(
        resumeOperation({
          doc,
          escalationId: "esc_primary",
          resolution: "expired",
          ctx: baseCtx,
        })
      ).rejects.toThrow("temporary database failure")

      const stored = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>(doc._id)
      expect(stored.resolution).toEqual("expired")
      expect(stored.resumeResultCompressed).toBeUndefined()
    })
  })

  it("tracks a genuinely new approval raised during the resumed turn", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      prepareAgentChatRunMock.mockResolvedValue({
        toolDisplayNames: {},
        sessionLogIndexer: { index: jest.fn().mockResolvedValue(undefined) },
        stream: jest.fn().mockImplementation(async options => {
          const nextEscalationId = "esc_next"
          await context.getWorkspaceDB().put(
            baseDoc({
              _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${nextEscalationId}`,
              requestId,
            })
          )
          options.pendingToolCalls.add("tool_call_2")
          options.onToolCallCompleted({
            toolName: "book_meeting",
            status: "success",
            input: { title: "A different meeting" },
            output: {
              status: ApprovalToolResultStatus.PENDING_APPROVAL,
              escalationId: nextEscalationId,
            },
          })
          return {
            finishReason: Promise.resolve("tool-calls"),
            toUIMessageStream: () =>
              (async function* () {
                yield { id: "", role: "assistant", parts: [] }
              })(),
          }
        }),
      })

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(aiAgentExecutedMock).toHaveBeenCalledWith(
        expect.objectContaining({ requestId, awaitingEscalation: true }),
        expect.any(Number)
      )
      expect(request.status).toEqual("needs_input")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_raised",
            escalationId: "esc_next",
          }),
        ])
      )
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
        timestamp: expect.any(String),
      })
      expect(enqueueLifecycleMock).toHaveBeenCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "completed",
        timestamp: expect.any(String),
      })
      expect(aiAgentExecutedMock).toHaveBeenCalledWith(
        {
          agentId: "agent_1",
          sourceType: "agent_session",
          sourceId: "session_1",
          sessionId: "session_1",
          requestId,
        },
        expect.any(Number)
      )
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
        timestamp: expect.any(String),
      })
      expect(aiAgentFailedMock).toHaveBeenCalledWith(
        {
          agentId: "agent_1",
          sourceType: "agent_session",
          sourceId: "session_1",
          sessionId: "session_1",
          requestId,
          reason: "error",
          errorMessage: "Model unavailable",
        },
        expect.any(Number)
      )
    })
  })

  it.each([true, false])(
    "keeps pending approvals waiting after a stream failure (request tracking: %s)",
    async tracking => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const requestId = tracking
          ? (await createRequest())!.requestId
          : undefined
        if (requestId) {
          await sdk.ai.agentRequests.updateRequestStatus({
            requestId,
            status: "needs_input",
          })
        }
        await context.getWorkspaceDB().put(
          baseDoc({
            _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
            requestId,
          })
        )
        prepareAgentChatRunMock.mockResolvedValue({
          toolDisplayNames: {},
          stream: jest.fn().mockRejectedValue(new Error("Model unavailable")),
        })

        await expect(
          resumeOperation({
            doc: baseDoc({ requestId, response: { accepted: true } }),
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("Model unavailable")

        expect(aiAgentFailedMock).toHaveBeenCalledTimes(1)
        expect(aiAgentExecutedMock).not.toHaveBeenCalled()
        expect(enqueueLifecycleMock).toHaveBeenLastCalledWith({
          sourceType: "agent_session",
          sourceId: "session_1",
          signal: "waiting",
          timestamp: expect.any(String),
        })
        const requests =
          await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
        expect(requests.map(request => request.status)).toEqual(
          tracking ? ["needs_input"] : []
        )
      })
    }
  )

  it("timestamps the pending correction after the failure even within one millisecond", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await context.getWorkspaceDB().put(
        baseDoc({
          _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
        })
      )
      getOrThrowMock.mockRejectedValue(new Error("Agent unavailable"))
      const now = Date.now()
      const clock = jest.spyOn(Date, "now").mockReturnValue(now)
      try {
        await expect(
          resumeOperation({
            doc: baseDoc({ response: { accepted: true } }),
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("Agent unavailable")

        expect(aiAgentFailedMock).toHaveBeenCalledWith(
          expect.objectContaining({ sourceId: "session_1" }),
          now
        )
        expect(enqueueLifecycleMock).toHaveBeenLastCalledWith({
          sourceType: "agent_session",
          sourceId: "session_1",
          signal: "waiting",
          timestamp: new Date(now + 1).toISOString(),
        })
      } finally {
        clock.mockRestore()
      }
    })
  })

  it("preserves the original resume error and request when the pending lookup fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      getOrThrowMock.mockRejectedValue(new Error("Agent unavailable"))
      listContextDocsMock.mockRejectedValueOnce(new Error("Lookup unavailable"))

      await expect(
        resumeOperation({
          doc: baseDoc({ requestId, response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })
      ).rejects.toThrow("Agent unavailable")

      expect(aiAgentFailedMock).toHaveBeenCalledTimes(1)
      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("needs_input")
    })
  })

  it("preserves the original finalization error and request when the pending lookup fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      mockApprovedRun("Approved and booked.")
      const resolveFinalRequestOutcomeSpy = jest
        .spyOn(sdk.ai.agentRequests, "resolveFinalRequestOutcome")
        .mockRejectedValueOnce(new Error("Finalization unavailable"))
      listContextDocsMock.mockRejectedValueOnce(new Error("Lookup unavailable"))

      try {
        await expect(
          resumeOperation({
            doc: baseDoc({ requestId, response: { accepted: true } }),
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("Finalization unavailable")

        expect(aiAgentExecutedMock).toHaveBeenCalledTimes(1)
        expect(aiAgentFailedMock).not.toHaveBeenCalled()
        expect(
          enqueueLifecycleMock.mock.calls.map(([input]) => input.signal)
        ).toEqual(["active", "failed"])
        const [request] =
          await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("needs_input")
      } finally {
        resolveFinalRequestOutcomeSpy.mockRestore()
      }
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

      expect(aiAgentFailedMock).toHaveBeenCalledWith(
        {
          agentId: "agent_1",
          sourceType: "agent_session",
          sourceId: "session_1",
          sessionId: "session_1",
          requestId,
          reason: "error",
          errorMessage: "Agent unavailable",
        },
        expect.any(Number)
      )
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

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      expect(aiAgentExecutedMock).toHaveBeenCalledWith(
        expect.objectContaining({ requestId }),
        expect.any(Number)
      )
      expect(aiAgentFailedMock).not.toHaveBeenCalled()
    })
  })

  it.each([false, true])(
    "corrects the session without double-counting when finalizing fails (pending approval: %s)",
    async hasPending => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await createRequest())!
        if (hasPending) {
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
        }
        mockApprovedRun("Approved and booked.")
        const resolveFinalRequestOutcomeSpy = jest
          .spyOn(sdk.ai.agentRequests, "resolveFinalRequestOutcome")
          .mockRejectedValueOnce(new Error("DB unavailable"))

        try {
          await expect(
            resumeOperation({
              doc: baseDoc({ requestId, response: { accepted: true } }),
              escalationId: "esc_primary",
              resolution: "resolved",
              ctx: baseCtx,
            })
          ).rejects.toThrow("DB unavailable")

          // The action was already emitted as completed before the failure -
          // don't emit a second action (it would double-count actionCount),
          // correct the materialized session status instead.
          expect(aiAgentExecutedMock).toHaveBeenCalledWith(
            expect.objectContaining({ requestId }),
            expect.any(Number)
          )
          expect(aiAgentFailedMock).not.toHaveBeenCalled()
          expect(
            enqueueLifecycleMock.mock.calls.map(([input]) => input.signal)
          ).toEqual(["active", hasPending ? "waiting" : "failed"])
          expect(enqueueLifecycleMock).toHaveBeenLastCalledWith({
            sourceType: "agent_session",
            sourceId: "session_1",
            signal: hasPending ? "waiting" : "failed",
            timestamp: expect.any(String),
          })
          const [request] =
            await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
          expect(request.status).toEqual(hasPending ? "needs_input" : "failed")
        } finally {
          resolveFinalRequestOutcomeSpy.mockRestore()
        }
      })
    }
  )

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

  it("keeps the session waiting after an approved turn while another escalation is pending", async () => {
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
      mockApprovedRun("Approved and booked.")

      await resumeOperation({
        doc: baseDoc({ requestId, response: { accepted: true } }),
        escalationId: "esc_primary",
        resolution: "resolved",
        ctx: baseCtx,
      })

      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toBe("needs_input")
      expect(aiAgentExecutedMock).toHaveBeenCalledTimes(1)
      expect(aiAgentFailedMock).not.toHaveBeenCalled()
      expect(enqueueLifecycleMock).toHaveBeenLastCalledWith({
        sourceType: "agent_session",
        sourceId: "session_1",
        signal: "waiting",
        timestamp: expect.any(String),
      })
    })
  })

  it("preserves the request when the session status escalation lookup fails", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      await sdk.ai.agentRequests.updateRequestStatus({
        requestId,
        status: "needs_input",
      })
      mockApprovedRun("Approved and booked.")
      const outcomeSpy = jest
        .spyOn(sdk.ai.agentRequests, "resolveFinalRequestOutcome")
        .mockResolvedValueOnce(undefined)
      listContextDocsMock.mockRejectedValueOnce(new Error("DB unavailable"))

      try {
        await resumeOperation({
          doc: baseDoc({ requestId, response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })

        const [request] =
          await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
        expect(request.status).toBe("needs_input")
        expect(aiAgentExecutedMock).toHaveBeenCalledTimes(1)
        expect(aiAgentFailedMock).not.toHaveBeenCalled()
        expect(enqueueLifecycleMock.mock.calls).toEqual([
          [
            {
              sourceType: "agent_session",
              sourceId: "session_1",
              signal: "active",
              timestamp: expect.any(String),
            },
          ],
        ])
      } finally {
        outcomeSpy.mockRestore()
      }
    })
  })

  describe("sessions without request tracking", () => {
    it("marks the session active and emits the resumed action", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        mockApprovedRun("Approved and booked.")

        await resumeOperation({
          doc: baseDoc({ response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })

        expect(enqueueLifecycleMock.mock.calls).toEqual([
          [
            {
              sourceType: "agent_session",
              sourceId: "session_1",
              signal: "active",
              timestamp: expect.any(String),
            },
          ],
        ])
        expect(aiAgentExecutedMock).toHaveBeenCalledWith(
          {
            agentId: "agent_1",
            sourceType: "agent_session",
            sourceId: "session_1",
            sessionId: "session_1",
          },
          expect.any(Number)
        )
      })
    })

    it("keeps the session waiting while another escalation on the session is pending", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await context.getWorkspaceDB().put(
          baseDoc({
            _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
          })
        )
        mockApprovedRun("Approved and booked.")

        await resumeOperation({
          doc: baseDoc({ response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })

        expect(aiAgentExecutedMock).toHaveBeenCalledTimes(1)
        expect(enqueueLifecycleMock).toHaveBeenLastCalledWith({
          sourceType: "agent_session",
          sourceId: "session_1",
          signal: "waiting",
          timestamp: expect.any(String),
        })
      })
    })

    it("flags a new approval raised during the resumed turn", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        prepareAgentChatRunMock.mockResolvedValue({
          toolDisplayNames: {},
          sessionLogIndexer: {
            index: jest.fn().mockResolvedValue(undefined),
          },
          stream: jest.fn().mockImplementation(async options => {
            options.onToolCallCompleted({
              toolName: "book_meeting",
              status: "success",
              input: { title: "A different meeting" },
              output: {
                status: ApprovalToolResultStatus.PENDING_APPROVAL,
                escalationId: "esc_next",
              },
            })
            return {
              finishReason: Promise.resolve("stop"),
              toUIMessageStream: () =>
                (async function* () {
                  yield { id: "", role: "assistant", parts: [] }
                })(),
            }
          }),
        })

        await resumeOperation({
          doc: baseDoc({ response: { accepted: true } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })

        expect(aiAgentExecutedMock).toHaveBeenCalledWith(
          expect.objectContaining({ awaitingEscalation: true }),
          expect.any(Number)
        )
      })
    })

    it("emits a failed action when the resumed agent stream fails", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        prepareAgentChatRunMock.mockResolvedValue({
          toolDisplayNames: {},
          sessionLogIndexer: {
            index: jest.fn().mockResolvedValue(undefined),
          },
          stream: jest.fn().mockRejectedValue(new Error("Model unavailable")),
        })

        await expect(
          resumeOperation({
            doc: baseDoc({ response: { accepted: true } }),
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("Model unavailable")

        expect(aiAgentFailedMock).toHaveBeenCalledWith(
          {
            agentId: "agent_1",
            sourceType: "agent_session",
            sourceId: "session_1",
            sessionId: "session_1",
            reason: "error",
            errorMessage: "Model unavailable",
          },
          expect.any(Number)
        )
      })
    })

    it("emits failure instead of success when the resumed stream contains an error chunk", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const ai = jest.requireActual<typeof import("ai")>("ai")
        jest
          .mocked(readUIMessageStream)
          .mockImplementationOnce(ai.readUIMessageStream)
        prepareAgentChatRunMock.mockResolvedValue({
          toolDisplayNames: {},
          sessionLogIndexer: {
            index: jest.fn().mockResolvedValue(undefined),
          },
          stream: jest.fn().mockResolvedValue({
            finishReason: Promise.resolve("error"),
            toUIMessageStream: () =>
              new ReadableStream<UIMessageChunk>({
                start(controller) {
                  controller.enqueue({ type: "start", messageId: "resume" })
                  controller.enqueue({
                    type: "error",
                    errorText: "Model unavailable",
                  })
                  controller.close()
                },
              }),
          }),
        })

        await expect(
          resumeOperation({
            doc: baseDoc({ response: { accepted: true } }),
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("Model unavailable")

        expect(aiAgentFailedMock).toHaveBeenCalledTimes(1)
        expect(aiAgentFailedMock).toHaveBeenCalledWith(
          {
            agentId: "agent_1",
            sourceType: "agent_session",
            sourceId: "session_1",
            sessionId: "session_1",
            reason: "error",
            errorMessage: "Model unavailable",
          },
          expect.any(Number)
        )
        expect(aiAgentExecutedMock).not.toHaveBeenCalled()
      })
    })

    it("completes the session when the escalation is rejected", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await resumeOperation({
          doc: baseDoc({ response: { accepted: false } }),
          escalationId: "esc_primary",
          resolution: "resolved",
          ctx: baseCtx,
        })

        expect(enqueueLifecycleMock.mock.calls).toEqual([
          [
            {
              sourceType: "agent_session",
              sourceId: "session_1",
              signal: "completed",
              timestamp: expect.any(String),
            },
          ],
        ])
      })
    })

    it("leaves a rejected escalation retryable when checking pending escalations fails", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const doc = baseDoc({
          resolution: "resolved",
          response: { accepted: false },
        })
        await context.getWorkspaceDB().put(doc)
        listContextDocsMock.mockRejectedValueOnce(new Error("DB unavailable"))

        await expect(
          resumeOperation({
            doc,
            escalationId: "esc_primary",
            resolution: "resolved",
            ctx: baseCtx,
          })
        ).rejects.toThrow("DB unavailable")

        const stored = await context
          .getWorkspaceDB()
          .get<EscalationContextDoc>(doc._id!)
        expect(stored.resolution).toBe("resolved")
        expect(stored.resumeResultCompressed).toBeUndefined()
        expect(enqueueLifecycleMock).not.toHaveBeenCalled()
      })
    })

    it("fails the session when the escalation expires without a response", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await resumeOperation({
          doc: baseDoc(),
          escalationId: "esc_primary",
          resolution: "expired",
          ctx: baseCtx,
        })

        expect(enqueueLifecycleMock.mock.calls).toEqual([
          [
            {
              sourceType: "agent_session",
              sourceId: "session_1",
              signal: "failed",
              timestamp: expect.any(String),
            },
          ],
        ])
      })
    })

    it.each(["expired", "resolved"] as const)(
      "reconfirms waiting when a non-approved escalation is %s while another is pending",
      async resolution => {
        await config.doInContext(config.getProdWorkspaceId(), async () => {
          await context.getWorkspaceDB().put(
            baseDoc({
              _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}esc_other`,
            })
          )

          await resumeOperation({
            doc: baseDoc({ response: { accepted: false } }),
            escalationId: "esc_primary",
            resolution,
            ctx: baseCtx,
          })

          expect(enqueueLifecycleMock).toHaveBeenCalledTimes(1)
          expect(enqueueLifecycleMock).toHaveBeenCalledWith({
            sourceType: "agent_session",
            sourceId: "session_1",
            signal: "waiting",
            timestamp: expect.any(String),
          })
          expect(aiAgentExecutedMock).not.toHaveBeenCalled()
          expect(aiAgentFailedMock).not.toHaveBeenCalled()
        })
      }
    )
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
        timestamp: expect.any(String),
      })
    })
  })

  it("runs the frozen call when an expiry was auto-approved", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!
      mockApprovedRun("Approved automatically and booked.")
      const execute = jest.fn().mockResolvedValue({ booked: true })
      buildPromptAndToolsMock.mockResolvedValue({
        tools: { book_meeting: { execute } },
        toolSources: {},
      })

      await resumeOperation({
        doc: baseDoc({
          requestId,
          response: {
            accepted: true,
            actionId: EscalationAction.APPROVE,
            automatic: true,
          },
        }),
        escalationId: "esc_primary",
        resolution: "expired",
        ctx: baseCtx,
      })

      expect(execute).toHaveBeenCalledTimes(1)
      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "escalation_resolved",
            escalationId: "esc_primary",
            outcome: "approved",
          }),
        ])
      )
      expect(request.status).toEqual("completed")
    })
  })

  it("treats an auto-rejected expiry as a rejection rather than a timeout", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const { requestId } = (await createRequest())!

      await resumeOperation({
        doc: baseDoc({
          requestId,
          response: {
            accepted: false,
            actionId: EscalationAction.REJECT,
            automatic: true,
          },
        }),
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
            outcome: "rejected",
          }),
        ])
      )
      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
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

  it("does not touch requests when the escalation has no associated request", async () => {
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

      expect(
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      ).toEqual([])
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
})

describe("processNotify", () => {
  const config = new TestConfiguration()
  const sendSlackMock = slack.sendSlackNotification as jest.Mock
  const sendTeamsMock = teams.sendMSTeamsNotification as jest.Mock

  const seedPending = async (recipient: EscalationRecipient) => {
    const escalationId = `esc_${Date.now()}`
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
        source: EscalationSource.OPERATION,
        appId: config.getProdWorkspaceId(),
        tenantId: config.getTenantId(),
        durationMs: 1000,
        resolution: "pending",
        recipients: [recipient],
      })
    })
    return escalationId
  }

  const runNotify = (escalationId: string) =>
    processNotify({
      id: `esc_${escalationId}_notify`,
      data: {
        phase: "notify",
        escalationId,
        appId: config.getProdWorkspaceId(),
        tenantId: config.getTenantId(),
      },
    })

  const getNotification = async (escalationId: string) =>
    config.doInContext(config.getProdWorkspaceId(), async () => {
      const [doc] = await sdk.escalations.listNotifications(escalationId)
      return doc
    })

  beforeEach(async () => {
    sendSlackMock.mockReset()
    sendTeamsMock.mockReset()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("records a sent outcome on the notification", async () => {
    sendSlackMock.mockResolvedValue(true)
    sendTeamsMock.mockResolvedValue(false)
    const escalationId = await seedPending({
      type: EscalationNotificationChannel.SLACK,
      config: { channelId: "C1" },
    })

    await runNotify(escalationId)

    const doc = await getNotification(escalationId)
    expect(doc.status).toEqual("sent")
    expect(doc.sentAt).toEqual(expect.any(String))
    expect(doc.providerResponse).toBeUndefined()
  })

  it("records a failed outcome with the provider response", async () => {
    sendSlackMock.mockResolvedValue(false)
    sendTeamsMock.mockRejectedValue(
      new ProviderResponseError(
        502,
        '{"error":"ServiceError"}',
        "Teams Bot API"
      )
    )
    const escalationId = await seedPending({
      type: EscalationNotificationChannel.MSTEAMS,
      config: { channelId: "19:abc@thread.tacv2", teamId: "T1" },
    })

    await runNotify(escalationId)

    const doc = await getNotification(escalationId)
    expect(doc.status).toEqual("failed")
    expect(doc.sentAt).toEqual(expect.any(String))
    expect(doc.providerResponse).toEqual({
      code: 502,
      body: '{"error":"ServiceError"}',
    })
  })

  it("keeps a response recorded during the send when writing the outcome", async () => {
    const escalationId = await seedPending({
      type: EscalationNotificationChannel.SLACK,
      config: { channelId: "C1" },
    })
    sendTeamsMock.mockResolvedValue(false)
    sendSlackMock.mockImplementation(
      async ({ notifDoc }: { notifDoc: EscalationNotificationDoc }) => {
        await sdk.escalations.respond(
          escalationId,
          notifDoc._id!,
          { actionId: "esc_approve", user: { userId: "U1" } },
          jest.fn()
        )
        return true
      }
    )

    await runNotify(escalationId)

    const doc = await getNotification(escalationId)
    expect(doc.status).toEqual("sent")
    expect(doc.responses).toHaveLength(1)
    expect(doc.responses?.[0].user.userId).toEqual("U1")
  })

  it("serialises a press that lands while the outcome is being written", async () => {
    const escalationId = await seedPending({
      type: EscalationNotificationChannel.SLACK,
      config: { channelId: "C1" },
    })
    sendTeamsMock.mockResolvedValue(false)
    let notifDoc: EscalationNotificationDoc | undefined
    sendSlackMock.mockImplementation(
      async ({ notifDoc: sent }: { notifDoc: EscalationNotificationDoc }) => {
        notifDoc = sent
        return true
      }
    )
    let press: Promise<unknown> | undefined
    const withLock = sdk.escalations.withEscalationLock
    const lockSpy = jest
      .spyOn(sdk.escalations, "withEscalationLock")
      .mockImplementationOnce((id, task) =>
        withLock(id, async () => {
          press = config.doInContext(config.getProdWorkspaceId(), () =>
            sdk.escalations.respond(
              escalationId,
              notifDoc!._id!,
              { actionId: "esc_approve", user: { userId: "U1" } },
              jest.fn()
            )
          )
          return task()
        })
      )

    try {
      await runNotify(escalationId)
      await press
    } finally {
      lockSpy.mockRestore()
    }

    const doc = await getNotification(escalationId)
    expect(doc.status).toEqual("sent")
    expect(doc.responses).toHaveLength(1)
  })
})

describe("expiry", () => {
  const config = new TestConfiguration()

  const seedPending = async (overrides: Partial<EscalationContextDoc> = {}) => {
    const escalationId = `esc_${Date.now()}`
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({
        _id: `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`,
        source: EscalationSource.OPERATION,
        appId: config.getProdWorkspaceId(),
        tenantId: config.getTenantId(),
        resolution: "pending",
        recipients: [
          {
            type: EscalationNotificationChannel.SLACK,
            config: { channelId: "C1" },
          },
        ],
        ...overrides,
      })
    })
    return escalationId
  }

  const getDoc = (escalationId: string) =>
    config.doInContext(config.getProdWorkspaceId(), () =>
      context
        .getWorkspaceDB()
        .get<EscalationContextDoc>(
          `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`
        )
    )

  const jobData = (escalationId: string) => ({
    escalationId,
    appId: config.getProdWorkspaceId(),
    tenantId: config.getTenantId(),
  })

  const resumeJobsFor = (escalationId: string) =>
    addJobSpy.mock.calls.filter(
      ([job]) => job.phase === "waiting" && job.escalationId === escalationId
    )

  let addJobSpy: jest.SpyInstance

  beforeEach(async () => {
    ;(slack.sendSlackNotification as jest.Mock).mockReset()
    addJobSpy = jest.spyOn(getQueue(), "add")
    await config.newTenant()
  })

  afterEach(() => {
    addJobSpy.mockRestore()
  })

  afterAll(() => {
    config.end()
  })

  it("queues no resume job for an escalation that never expires", async () => {
    const escalationId = await seedPending()

    await processNotify({
      id: `esc_${escalationId}_notify`,
      data: { phase: "notify", ...jobData(escalationId) },
    })

    expect(resumeJobsFor(escalationId)).toHaveLength(0)
  })

  it("queues a resume job for the escalation's duration", async () => {
    const escalationId = await seedPending({ durationMs: 60_000 })

    await processNotify({
      id: `esc_${escalationId}_notify`,
      data: { phase: "notify", ...jobData(escalationId) },
    })

    const [[, opts]] = resumeJobsFor(escalationId)
    expect(opts.delay).toEqual(60_000)
  })

  it("expires without a decision when the policy sets no outcome", async () => {
    const escalationId = await seedPending({
      durationMs: 1000,
      policy: { id: "policy_1", name: "Manager approval", expiry: {} },
    })

    await processResume({
      id: `esc_${escalationId}_resume`,
      data: { phase: "waiting", ...jobData(escalationId) },
    })

    const doc = await getDoc(escalationId)
    expect(doc.resolution).toEqual("expired")
    expect(doc).not.toHaveProperty("response")
  })

  it.each([
    [EscalationAction.APPROVE, true],
    [EscalationAction.REJECT, false],
  ])(
    "records a synthesised %s response when the policy says so",
    async (outcome, accepted) => {
      const escalationId = await seedPending({
        durationMs: 1000,
        policy: {
          id: "policy_1",
          name: "Manager approval",
          expiry: { durationSeconds: 1, outcome },
        },
      })

      await processResume({
        id: `esc_${escalationId}_resume`,
        data: { phase: "waiting", ...jobData(escalationId) },
      })

      const doc = await getDoc(escalationId)
      expect(doc.resolution).toEqual("expired")
      expect(doc.response).toEqual({
        accepted,
        actionId: outcome,
        automatic: true,
      })
    }
  )
})

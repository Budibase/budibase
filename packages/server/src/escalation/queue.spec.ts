import { context } from "@budibase/backend-core"
import {
  Agent,
  DocumentType,
  ESCALATE_TOOL_NAME,
  EscalationContextDoc,
  EscalationNotificationChannel,
  EscalationNotificationDoc,
  EscalationRecipient,
  EscalationRaisedAction,
  EscalationSource,
  SEPARATOR,
  SuspendedOperationContext,
} from "@budibase/types"
import TestConfiguration from "../tests/utilities/TestConfiguration"
import sdk from "../sdk"
import { processNotify, resumeOperation } from "./queue"
import { createEscalateTool } from "../ai/tools/budibase"
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

jest.mock("ai", () => {
  const actual = jest.requireActual("ai")
  return {
    ...actual,
    readUIMessageStream: (opts: { stream: unknown }) => opts.stream,
  }
})

const prepareAgentChatRunMock = sdk.ai.agents.prepareAgentChatRun as jest.Mock
const getOrThrowMock = sdk.ai.agents.getOrThrow as jest.Mock
const buildPromptAndToolsMock = sdk.ai.agents.buildPromptAndTools as jest.Mock
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
    buildPromptAndToolsMock.mockReset()
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

      expect(prepareAgentChatRunMock).not.toHaveBeenCalled()
      const [request] =
        await sdk.ai.agentRequests.fetchRequestsByAgent("agent_1")
      expect(request.status).toEqual("failed")
      expect(request.error).toEqual(
        '{"validation":{"Department":"can\'t be blank"}}'
      )
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
        delay: 1000,
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
})

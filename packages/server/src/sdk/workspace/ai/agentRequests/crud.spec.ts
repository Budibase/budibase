import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { builderSocket } from "../../../../websockets"
import {
  createOrUpdateRequestForPrompt,
  fetchRequests,
  fetchRequestsByAgent,
  fetchRequestsSummary,
  initActiveRequest,
  recordToolCall,
  resolveFinalRequestStatus,
  updateRequestStatus,
} from "./crud"
import {
  analyzeAgentRequestLink,
  generateAgentRequestTitle,
  generateInteractionSummary,
  generateToolCallSummary,
} from "./helpers"

jest.mock("./helpers", () => ({
  analyzeAgentRequestLink: jest.fn(),
  generateAgentRequestTitle: jest.fn(),
  generateInteractionSummary: jest.fn(),
  generateToolCallSummary: jest.fn(),
}))

jest.mock("../../../../websockets", () => ({
  initialise: jest.fn(),
  builderSocket: new Proxy(
    {},
    {
      get: (target: Record<string, jest.Mock>, prop: string) => {
        target[prop] ??= jest.fn()
        return target[prop]
      },
    }
  ),
}))

describe("agentRequests crud", () => {
  const config = new TestConfiguration()

  const analyzeAgentRequestLinkMock = analyzeAgentRequestLink as jest.Mock
  const generateAgentRequestTitleMock = generateAgentRequestTitle as jest.Mock
  const generateInteractionSummaryMock = generateInteractionSummary as jest.Mock
  const generateToolCallSummaryMock = generateToolCallSummary as jest.Mock
  const emitAgentRequestChangeMock =
    builderSocket?.emitAgentRequestChange as jest.Mock

  beforeEach(async () => {
    analyzeAgentRequestLinkMock.mockReset()
    generateAgentRequestTitleMock.mockReset()
    generateAgentRequestTitleMock.mockResolvedValue("Generated title")
    generateInteractionSummaryMock.mockReset()
    generateInteractionSummaryMock.mockResolvedValue("User asked something")
    generateToolCallSummaryMock.mockReset()
    generateToolCallSummaryMock.mockResolvedValue("Did something useful")
    emitAgentRequestChangeMock.mockReset()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  describe("initActiveRequest", () => {
    it("creates a request with active status and generated title", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const result = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        })

        expect(result?.requestId).toContain("agentrequest_")

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("active")
        expect(request.title).toEqual("Generated title")
        expect(request.entries[0].status).toEqual("active")
      })
    })

    it("emits AgentRequestChange with the full request on creation", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        emitAgentRequestChangeMock.mockClear()

        const result = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(emitAgentRequestChangeMock).toHaveBeenCalledWith(
          config.getDevWorkspaceId(),
          request
        )
        expect(request._id).toEqual(result?.requestId)
        expect(request.title).toEqual("Generated title")
      })
    })

    it("returns the existing requestId if the sessionId already has a request", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const first = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        })

        const second = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        })

        expect(second?.requestId).toEqual(first?.requestId)
        expect(await fetchRequestsByAgent("agent_1")).toHaveLength(1)
      })
    })

    it("returns undefined when no operation is provided", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const result = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Hello",
          operation: undefined,
          source: "Chat",
        })

        expect(result).toBeUndefined()
        expect(await fetchRequestsByAgent("agent_1")).toHaveLength(0)
      })
    })

    it("creates the request even if title generation fails", async () => {
      generateAgentRequestTitleMock.mockRejectedValue(new Error("LLM error"))

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const result = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        })

        expect(result?.requestId).toContain("agentrequest_")
        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("active")
        expect(request.title).toBeUndefined()
      })
    })
  })

  describe("updateRequestStatus", () => {
    it("marks a request as completed with completedAt", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("completed")
        expect(request.completedAt).toEqual(expect.any(String))
        expect(request.entries[0].status).toEqual("completed")
        expect(request.entries[0].completedAt).toEqual(expect.any(String))
        expect(request.title).toEqual("Generated title")
      })
    })

    it("emits AgentRequestChange over the builder socket to the request's dev workspace room", async () => {
      // Agent activity runs in the prod workspace context, but the builder's
      // Activity tab (and its socket room) only ever exists in dev.
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!
        emitAgentRequestChangeMock.mockClear()

        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(emitAgentRequestChangeMock).toHaveBeenCalledWith(
          config.getDevWorkspaceId(),
          request
        )
      })
    })

    it("marks a request as failed with error message", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("failed")
        expect(request.error).toEqual("Tool calls incomplete")
        expect(request.completedAt).toEqual(expect.any(String))
        expect(request.entries[0].status).toEqual("failed")
        expect(request.entries[0].error).toEqual("Tool calls incomplete")
      })
    })

    it("marks a request as needs_input without completedAt", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Approve this purchase",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("needs_input")
        expect(request.completedAt).toBeUndefined()
        expect(request.entries[0].status).toEqual("needs_input")
        expect(request.entries[0].completedAt).toBeUndefined()
      })
    })

    it("treats needs_input as non-terminal so initActiveRequest reuses the same requestId", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const first = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Approve this purchase",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({
          requestId: first.requestId,
          status: "needs_input",
        })

        const second = await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Approve this purchase",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        })

        expect(second?.requestId).toEqual(first.requestId)
        expect(await fetchRequestsByAgent("agent_1")).toHaveLength(1)
      })
    })

    it("does not overwrite a request that is already failed", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })
        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("failed")
        expect(request.error).toEqual("Tool calls incomplete")
      })
    })

    it("does not overwrite a request that is already completed", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "completed" })
        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("completed")
        expect(request.error).toBeUndefined()
      })
    })

    it("does nothing if the requestId does not exist", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await expect(
          updateRequestStatus({
            requestId: "agentrequest_nonexistent",
            status: "completed",
          })
        ).resolves.toBeUndefined()
      })
    })

    it("does not move a needs_input request away without isHumanResponse", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Order 1500 pens",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })
        await updateRequestStatus({ requestId, status: "completed" })
        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "boom",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("needs_input")
      })
    })

    it("moves a needs_input request when isHumanResponse is set (escalation resolved)", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Order 1500 pens",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })
        await updateRequestStatus({
          requestId,
          status: "completed",
          isHumanResponse: true,
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        expect(request.status).toEqual("completed")
      })
    })
  })

  describe("status_changed actions", () => {
    it("records a status_changed action when transitioning to completed", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toEqual([
          expect.objectContaining({
            type: "status_changed",
            from: "active",
            to: "completed",
            id: expect.any(String),
            timestamp: expect.any(String),
          }),
        ])
      })
    })

    it("records the error on the status_changed action when failing", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toEqual([
          expect.objectContaining({
            type: "status_changed",
            from: "active",
            to: "failed",
            error: "Tool calls incomplete",
          }),
        ])
      })
    })

    it("records a status_changed action for each real transition", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Order 1500 pens",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })
        await updateRequestStatus({
          requestId,
          status: "completed",
          isHumanResponse: true,
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toEqual([
          expect.objectContaining({ from: "active", to: "needs_input" }),
          expect.objectContaining({ from: "needs_input", to: "completed" }),
        ])
      })
    })

    it("does not record a duplicate action on a defensive re-entry to the same status", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Approve this purchase",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })
        await updateRequestStatus({ requestId, status: "needs_input" })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toHaveLength(1)
      })
    })

    it("does not record an action when a transition is blocked by a terminal status", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await updateRequestStatus({
          requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })
        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toEqual([
          expect.objectContaining({ from: "active", to: "failed" }),
        ])
      })
    })

    it("does not record an action when the needs_input guard blocks the transition", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Order 1500 pens",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
        }))!

        await updateRequestStatus({ requestId, status: "needs_input" })
        await updateRequestStatus({ requestId, status: "completed" })

        const [request] = await fetchRequestsByAgent("agent_1")
        const statusActions = (request.actions ?? []).filter(
          action => action.type === "status_changed"
        )
        expect(statusActions).toEqual([
          expect.objectContaining({ from: "active", to: "needs_input" }),
        ])
      })
    })
  })

  describe("tool_call actions", () => {
    it("records a tool_call action on success", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await recordToolCall({
          requestId,
          agentId: "agent_1",
          sessionId: "session_1",
          toolName: "book_meeting",
          status: "success",
          readableName: "Book meeting",
          input: { date: "2026-07-10" },
          output: { meetingId: "m1" },
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const toolCallActions = (request.actions ?? []).filter(
          action => action.type === "tool_call"
        )
        expect(toolCallActions).toEqual([
          expect.objectContaining({
            type: "tool_call",
            toolName: "book_meeting",
            readableName: "Book meeting",
            summary: "Did something useful",
            status: "success",
            sessionId: "session_1",
            id: expect.any(String),
            timestamp: expect.any(String),
          }),
        ])
        expect(generateToolCallSummaryMock).toHaveBeenCalledWith({
          toolName: "book_meeting",
          readableName: "Book meeting",
          status: "success",
          input: { date: "2026-07-10" },
          output: { meetingId: "m1" },
          agentId: "agent_1",
          sessionId: "session_1",
        })
      })
    })

    it("records a tool_call action on error", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await recordToolCall({
          requestId,
          agentId: "agent_1",
          sessionId: "session_1",
          toolName: "book_meeting",
          status: "error",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const toolCallActions = (request.actions ?? []).filter(
          action => action.type === "tool_call"
        )
        expect(toolCallActions).toEqual([
          expect.objectContaining({
            type: "tool_call",
            toolName: "book_meeting",
            status: "error",
            summary: "Did something useful",
          }),
        ])
        expect(toolCallActions[0]).not.toHaveProperty("readableName")
      })
    })

    it("falls back to no summary when summary generation fails, without dropping the action", async () => {
      generateToolCallSummaryMock.mockRejectedValue(new Error("LLM error"))

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await recordToolCall({
          requestId,
          agentId: "agent_1",
          sessionId: "session_1",
          toolName: "book_meeting",
          status: "success",
          readableName: "Book meeting",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const toolCallActions = (request.actions ?? []).filter(
          action => action.type === "tool_call"
        )
        expect(toolCallActions).toEqual([
          expect.objectContaining({
            toolName: "book_meeting",
            readableName: "Book meeting",
            status: "success",
          }),
        ])
        expect(toolCallActions[0]).not.toHaveProperty("summary")
      })
    })

    it("records one action per tool call, appended to the existing actions", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        await recordToolCall({
          requestId,
          agentId: "agent_1",
          sessionId: "session_1",
          toolName: "list_calendars",
          status: "success",
        })
        await recordToolCall({
          requestId,
          agentId: "agent_1",
          sessionId: "session_1",
          toolName: "book_meeting",
          status: "error",
        })

        const [request] = await fetchRequestsByAgent("agent_1")
        const toolCallActions = (request.actions ?? []).filter(
          action => action.type === "tool_call"
        )
        expect(toolCallActions).toEqual([
          expect.objectContaining({
            toolName: "list_calendars",
            status: "success",
          }),
          expect.objectContaining({
            toolName: "book_meeting",
            status: "error",
          }),
        ])
      })
    })

    it("does nothing if the requestId does not exist", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await expect(
          recordToolCall({
            requestId: "agentrequest_missing",
            agentId: "agent_1",
            sessionId: "session_1",
            toolName: "book_meeting",
            status: "success",
          })
        ).resolves.toBeUndefined()
      })
    })
  })

  describe("fetchRequestsSummary", () => {
    it("counts requests by status across the whole workspace", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const operation = { name: "Scheduling", prompt: "Schedule meetings." }

        await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_active",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        })

        const completed = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_completed",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!
        await updateRequestStatus({
          requestId: completed.requestId,
          status: "completed",
        })

        const failed = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_failed",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!
        await updateRequestStatus({
          requestId: failed.requestId,
          status: "failed",
          error: "Tool calls incomplete",
        })

        const needsInput = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_needs_input",
          latestPrompt: "Approve this purchase",
          operation,
          source: "Chat",
        }))!
        await updateRequestStatus({
          requestId: needsInput.requestId,
          status: "needs_input",
        })

        expect(await fetchRequestsSummary()).toEqual({
          total: 4,
          active: 1,
          completed: 1,
          failed: 1,
          needs_input: 1,
        })
      })
    })
  })

  describe("fetchRequests", () => {
    it("returns every request ordered by most recently updated when no status is given", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const operation = { name: "Scheduling", prompt: "Schedule meetings." }

        const first = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!
        const second = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_2",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!
        await updateRequestStatus({
          requestId: second.requestId,
          status: "completed",
        })

        const requests = await fetchRequests({ limit: 10, page: 1 })
        expect(requests.map(r => r._id)).toEqual([
          second.requestId,
          first.requestId,
        ])
      })
    })

    it("only returns requests matching the given status", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const operation = { name: "Scheduling", prompt: "Schedule meetings." }

        const active = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_active",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!

        const completed = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_completed",
          latestPrompt: "Book me a meeting",
          operation,
          source: "Chat",
        }))!
        await updateRequestStatus({
          requestId: completed.requestId,
          status: "completed",
        })

        const failedRequests = await fetchRequests({
          limit: 10,
          page: 1,
          status: "failed",
        })
        expect(failedRequests).toHaveLength(0)

        const completedRequests = await fetchRequests({
          limit: 10,
          page: 1,
          status: "completed",
        })
        expect(completedRequests.map(r => r._id)).toEqual([completed.requestId])

        const activeRequests = await fetchRequests({
          limit: 10,
          page: 1,
          status: "active",
        })
        expect(activeRequests.map(r => r._id)).toEqual([active.requestId])
      })
    })

    it("paginates within a single status", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const operation = { name: "Scheduling", prompt: "Schedule meetings." }

        for (const sessionId of ["session_1", "session_2", "session_3"]) {
          await initActiveRequest({
            agentId: "agent_1",
            userId: "user_1",
            sessionId,
            latestPrompt: "Book me a meeting",
            operation,
            source: "Chat",
          })
        }

        const firstPage = await fetchRequests({
          limit: 2,
          page: 1,
          status: "active",
        })
        const secondPage = await fetchRequests({
          limit: 2,
          page: 2,
          status: "active",
        })

        expect(firstPage).toHaveLength(2)
        expect(secondPage).toHaveLength(1)
        expect(
          firstPage.map(r => r._id).concat(secondPage.map(r => r._id))
        ).toHaveLength(3)
      })
    })
  })

  describe("resolveFinalRequestStatus", () => {
    it("fails with an incomplete tool calls error when tool calls are incomplete", () => {
      expect(
        resolveFinalRequestStatus({
          toolCallsIncomplete: true,
          unrecoveredToolFailures: new Set(),
        })
      ).toEqual({ status: "failed", error: "Tool calls incomplete" })
    })

    it("fails listing unrecovered tool failures", () => {
      expect(
        resolveFinalRequestStatus({
          toolCallsIncomplete: false,
          unrecoveredToolFailures: new Set(["escalate"]),
        })
      ).toEqual({
        status: "failed",
        error: "Tool call(s) failed: escalate",
      })
    })

    it("completes when nothing failed", () => {
      expect(
        resolveFinalRequestStatus({
          toolCallsIncomplete: false,
          unrecoveredToolFailures: new Set(),
        })
      ).toEqual({ status: "completed" })
    })
  })

  describe("createOrUpdateRequestForPrompt", () => {
    it("creates one thread document for the first prompt", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValue({
        decision: "new_thread",
      })

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const created = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Show me the holidays company policy",
          operation: {
            name: "Support",
            prompt: "Help users with company policy questions.",
          },
          source: "Chat",
          userId: "user_1",
        })

        expect(created?.request._id).toContain("agentrequest_")
        expect(created?.request.entries).toHaveLength(1)
        expect(created?.request.entries[0]).toEqual({
          sessionId: "session_1",
          source: "Chat",
          operationNames: ["Support"],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          status: "active",
        })
        expect(created?.created).toEqual(true)
      })
    })

    it("updates title on the existing doc when existingRequestId is provided", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        generateAgentRequestTitleMock.mockResolvedValue("Updated title")

        const result = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
          userId: "user_1",
          existingRequestId: requestId,
        })

        expect(result?.request._id).toEqual(requestId)
        expect(result?.created).toEqual(false)
        expect(analyzeAgentRequestLinkMock).not.toHaveBeenCalled()
      })
    })

    it("appends a follow-up prompt to the latest entry", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const first = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Show me the holidays company policy",
          operation: {
            name: "Support",
            prompt: "Help users with company policy questions.",
          },
          source: "Chat",
          userId: "user_1",
        })

        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "existing_thread",
          requestId: first!.request._id,
          entryAction: "append_latest_entry",
        })

        const second = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_2",
          latestUserPrompt: "summarise it in 50 words",
          operation: {
            name: "Support",
            prompt: "Summarise company policies clearly.",
          },
          source: "Slack",
          userId: "user_1",
        })

        expect(second?.request._id).toEqual(first?.request._id)
        expect(second?.request.entries).toHaveLength(1)
        expect(second?.request.entries[0]).toEqual({
          sessionId: "session_2",
          source: "Slack",
          operationNames: ["Support"],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          status: "active",
        })
        expect(second?.created).toEqual(false)
      })
    })

    it("keeps needs_input when linking a follow-up prompt into a thread awaiting escalation", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const first = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Order 1500 pens",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
          userId: "user_1",
        })

        await updateRequestStatus({
          requestId: first!.request._id!,
          status: "needs_input",
        })

        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "existing_thread",
          requestId: first!.request._id,
          entryAction: "append_latest_entry",
        })

        const second = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_2",
          latestUserPrompt: "any update on this?",
          operation: {
            name: "Procurement",
            prompt: "Handle procurement requests.",
          },
          source: "Chat",
          userId: "user_1",
        })

        expect(second?.request._id).toEqual(first?.request._id)
        expect(second?.request.status).toEqual("needs_input")
      })
    })

    it("creates a new entry in the same thread when requested", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "new_thread",
        })
        const first = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Show me the holidays company policy",
          operation: {
            name: "Support",
            prompt: "Help users with company policy questions.",
          },
          source: "Chat",
          userId: "user_1",
        })

        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "existing_thread",
          requestId: first!.request._id,
          entryAction: "create_new_entry",
        })
        const second = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_2",
          latestUserPrompt: "turn it into an email",
          operation: {
            name: "Comms",
            prompt: "Turn requested information into a polished email.",
          },
          source: "Slack",
          userId: "user_1",
        })

        expect(second?.request._id).toEqual(first?.request._id)
        expect(second?.request.entries).toHaveLength(2)
        expect(second?.request.entries[1]).toEqual({
          sessionId: "session_2",
          source: "Slack",
          operationNames: ["Comms"],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          status: "active",
        })
      })
    })

    it("lists threads from production db for display", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "new_thread",
        })
        await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Prod request",
          operation: {
            name: "Support",
            prompt: "Help users with company policy questions.",
          },
          source: "Chat",
          userId: "user_1",
        })
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const requests = await fetchRequestsByAgent("agent_1")
        expect(requests).toHaveLength(1)
        expect(requests[0].entries[0]).toEqual({
          sessionId: "session_1",
          source: "Chat",
          operationNames: ["Support"],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          status: "active",
        })
      })
    })

    it("appends a follow-up to an existing request even when no operation is selected", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "new_thread",
        })
        const first = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "I need a new laptop",
          operation: {
            name: "IT support",
            prompt: "Create and track IT support requests.",
          },
          source: "Chat",
          userId: "user_1",
        })

        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "existing_thread",
          requestId: first!.request._id,
          entryAction: "append_latest_entry",
        })

        const second = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Is there any ETA?",
          operation: undefined,
          source: "Chat",
          userId: "user_1",
        })

        expect(second?.request._id).toEqual(first?.request._id)
        expect(second?.request.entries).toHaveLength(1)
        expect(second?.request.entries[0]).toEqual({
          sessionId: "session_1",
          source: "Chat",
          operationNames: ["IT support"],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          status: "active",
        })
      })
    })

    it("does not create a new request when no operation is selected", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const created = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Is there any ETA?",
          operation: undefined,
          source: "Chat",
          userId: "user_1",
        })

        expect(created).toBeUndefined()
      })
    })
  })

  describe("user_message actions", () => {
    it("records the generated summary as the first action when creating a thread", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValue({ decision: "new_thread" })
      generateInteractionSummaryMock.mockResolvedValue(
        "User asked about VPN access"
      )

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const created = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "I can't connect to the VPN from home",
          operation: { name: "Support", prompt: "Help with IT issues." },
          source: "Chat",
          userId: "user_1",
        })

        expect(created?.request.actions).toEqual([
          {
            id: expect.any(String),
            timestamp: expect.any(String),
            sessionId: "session_1",
            type: "user_message",
            summary: "User asked about VPN access",
          },
        ])
        expect(generateInteractionSummaryMock).toHaveBeenCalledWith({
          latestPrompt: "I can't connect to the VPN from home",
          agentId: "agent_1",
          sessionId: "session_1",
        })
      })
    })

    it("falls back to a generic placeholder when summary generation fails, never the raw prompt", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValue({ decision: "new_thread" })
      generateInteractionSummaryMock.mockRejectedValue(new Error("LLM error"))
      const sensitivePrompt =
        "My SSN is 123-45-6789, please update my HR record with it"

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const created = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: sensitivePrompt,
          operation: { name: "Support", prompt: "Help with IT issues." },
          source: "Chat",
          userId: "user_1",
        })

        expect(created?.request.actions?.[0]).toEqual(
          expect.objectContaining({
            type: "user_message",
            summary: "User sent a message",
          })
        )
        expect(created?.request.actions?.[0]).not.toEqual(
          expect.objectContaining({
            summary: expect.stringContaining("123-45-6789"),
          })
        )
      })
    })

    it("appends a new user_message action for a follow-up turn via existingRequestId", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const { requestId } = (await initActiveRequest({
          agentId: "agent_1",
          userId: "user_1",
          sessionId: "session_1",
          latestPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
        }))!

        generateInteractionSummaryMock.mockResolvedValue(
          "User booked a meeting"
        )

        const result = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Book me a meeting",
          operation: { name: "Scheduling", prompt: "Schedule meetings." },
          source: "Chat",
          userId: "user_1",
          existingRequestId: requestId,
        })

        expect(result?.request.actions).toEqual([
          {
            id: expect.any(String),
            timestamp: expect.any(String),
            sessionId: "session_1",
            type: "user_message",
            summary: "User booked a meeting",
          },
        ])
      })
    })

    it("appends one action per follow-up turn linked into the same thread", async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })
      generateInteractionSummaryMock.mockResolvedValueOnce(
        "User asked about company policy"
      )

      await config.doInContext(config.getProdWorkspaceId(), async () => {
        const first = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_1",
          latestUserPrompt: "Show me the holidays company policy",
          operation: {
            name: "Support",
            prompt: "Help users with company policy questions.",
          },
          source: "Chat",
          userId: "user_1",
        })

        analyzeAgentRequestLinkMock.mockResolvedValueOnce({
          decision: "existing_thread",
          requestId: first!.request._id,
          entryAction: "append_latest_entry",
        })
        generateInteractionSummaryMock.mockResolvedValueOnce(
          "User asked for a summary"
        )

        const second = await createOrUpdateRequestForPrompt({
          agentId: "agent_1",
          sessionId: "session_2",
          latestUserPrompt: "summarise it in 50 words",
          operation: {
            name: "Support",
            prompt: "Summarise company policies clearly.",
          },
          source: "Slack",
          userId: "user_1",
        })

        expect(second?.request.actions).toEqual([
          expect.objectContaining({
            type: "user_message",
            summary: "User asked about company policy",
            sessionId: "session_1",
          }),
          expect.objectContaining({
            type: "user_message",
            summary: "User asked for a summary",
            sessionId: "session_2",
          }),
        ])
      })
    })
  })
})

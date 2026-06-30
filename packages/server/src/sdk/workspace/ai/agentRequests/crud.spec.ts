import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  createOrUpdateRequestForPrompt,
  fetchRequestsByAgent,
  initActiveRequest,
  updateRequestStatus,
} from "./crud"
import { analyzeAgentRequestLink, generateAgentRequestTitle } from "./helpers"

jest.mock("./helpers", () => ({
  analyzeAgentRequestLink: jest.fn(),
  generateAgentRequestTitle: jest.fn(),
}))

describe("agentRequests crud", () => {
  const config = new TestConfiguration()

  const analyzeAgentRequestLinkMock = analyzeAgentRequestLink as jest.Mock
  const generateAgentRequestTitleMock = generateAgentRequestTitle as jest.Mock

  beforeEach(async () => {
    analyzeAgentRequestLinkMock.mockReset()
    generateAgentRequestTitleMock.mockReset()
    generateAgentRequestTitleMock.mockResolvedValue("Generated title")
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
})

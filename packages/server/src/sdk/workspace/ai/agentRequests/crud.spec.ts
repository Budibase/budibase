import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  createOrUpdateRequestForPrompt,
  fetchThread,
  fetchRequestsByAgent,
} from "./crud"
import { analyzeAgentRequestLink } from "./helpers"

jest.mock("./helpers", () => ({
  analyzeAgentRequestLink: jest.fn(),
}))

describe("agentRequests crud", () => {
  const config = new TestConfiguration()

  const analyzeAgentRequestLinkMock = analyzeAgentRequestLink as jest.Mock

  beforeEach(async () => {
    analyzeAgentRequestLinkMock.mockReset()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

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
        status: "completed",
      })
      expect(created?.request.latestSessionId).toEqual("session_1")
      expect(created?.request.createdAt).toEqual(expect.any(String))
      expect(created?.request.updatedAt).toEqual(expect.any(String))
      expect(created?.created).toEqual(true)
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
        status: "completed",
      })
      expect(second?.request.latestSessionId).toEqual("session_2")
      expect(second?.request.updatedAt).toEqual(expect.any(String))
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
        status: "completed",
      })
    })
  })

  it("fetches thread details", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })
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

      const thread = await fetchThread(created!.request._id!)

      expect(thread?._id).toEqual(created?.request._id)
      expect(thread?.entries).toHaveLength(1)
      expect(thread?.entries[0]).toEqual({
        sessionId: "session_1",
        source: "Chat",
        operationNames: ["Support"],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        status: "completed",
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
        status: "completed",
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
        status: "completed",
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

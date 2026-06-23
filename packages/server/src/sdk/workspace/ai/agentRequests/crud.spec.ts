import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  continueRequestForPrompt,
  createOrUpdateRequestForPrompt,
  fetchThread,
  fetchRequestsByAgent,
  startRequestForPrompt,
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
      expect(created?.request.entries[0].source).toEqual("Chat")
      expect(created?.request.entries[0].promptHistory).toEqual([
        {
          message: "Show me the holidays company policy",
          date: expect.any(String),
          operations: [
            {
              name: "Support",
              prompt: "Help users with company policy questions.",
            },
          ],
        },
      ])
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
      expect(second?.request.entries[0].promptHistory).toEqual([
        {
          message: "Show me the holidays company policy",
          date: expect.any(String),
          operations: [
            {
              name: "Support",
              prompt: "Help users with company policy questions.",
            },
          ],
        },
        {
          message: "summarise it in 50 words",
          date: expect.any(String),
          operations: [
            {
              name: "Support",
              prompt: "Summarise company policies clearly.",
            },
          ],
        },
      ])
      expect(second?.request.entries[0].source).toEqual("Slack")
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
      expect(second?.request.entries[1].source).toEqual("Slack")
      expect(second?.request.entries[1].promptHistory).toEqual([
        {
          message: "turn it into an email",
          date: expect.any(String),
          operations: [
            {
              name: "Comms",
              prompt: "Turn requested information into a polished email.",
            },
          ],
        },
      ])
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
      expect(thread?.entries[0].promptHistory).toEqual([
        {
          message: "Show me the holidays company policy",
          date: expect.any(String),
          operations: [
            {
              name: "Support",
              prompt: "Help users with company policy questions.",
            },
          ],
        },
      ])
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
      expect(requests[0].entries[0].promptHistory).toEqual([
        {
          message: "Prod request",
          date: expect.any(String),
          operations: [
            {
              name: "Support",
              prompt: "Help users with company policy questions.",
            },
          ],
        },
      ])
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
      expect(second?.request.entries[0].promptHistory).toEqual([
        {
          message: "I need a new laptop",
          date: expect.any(String),
          operations: [
            {
              name: "IT support",
              prompt: "Create and track IT support requests.",
            },
          ],
        },
        {
          message: "Is there any ETA?",
          date: expect.any(String),
        },
      ])
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

  it("continue only appends to an existing request", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })
      const first = await startRequestForPrompt({
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

      const continued = await continueRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestUserPrompt: "Is there any ETA?",
        source: "Chat",
        userId: "user_1",
      })

      expect(continued?._id).toEqual(first?.request._id)
      expect(continued?.entries).toHaveLength(1)
      expect(continued?.entries[0].promptHistory).toEqual([
        {
          message: "I need a new laptop",
          date: expect.any(String),
          operations: [
            {
              name: "IT support",
              prompt: "Create and track IT support requests.",
            },
          ],
        },
        {
          message: "Is there any ETA?",
          date: expect.any(String),
        },
      ])
    })
  })

  it("continue does not create a new request", async () => {
    analyzeAgentRequestLinkMock.mockResolvedValueOnce({
      decision: "new_thread",
    })

    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const continued = await continueRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestUserPrompt: "Is there any ETA?",
        source: "Chat",
        userId: "user_1",
      })

      expect(continued).toBeUndefined()
    })
  })
})

import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  createOrUpdateRequestForPrompt,
  fetchThread,
  fetchRequestsByAgent,
  markLatestCompletedBySession,
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
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      expect(created?._id).toContain("agentrequest_")
      expect(created?.entries).toHaveLength(1)
      expect(created?.sessionIds).toEqual(["session_1"])
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
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "existing_thread",
        requestId: first!.requestId,
        entryAction: "append_latest_entry",
      })

      const second = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_2",
        latestPrompt: "summarise it in 50 words",
        userId: "user_1",
      })

      expect(second?.requestId).toEqual(first?.requestId)
      expect(second?.entries).toHaveLength(1)
      expect(second?.entries[0].promptHistory).toEqual([
        "Show me the holidays company policy",
        "summarise it in 50 words",
      ])
      expect(second?.sessionIds).toEqual(["session_1", "session_2"])
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
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "existing_thread",
        requestId: first!.requestId,
        entryAction: "create_new_entry",
      })
      const second = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_2",
        latestPrompt: "turn it into an email",
        userId: "user_1",
      })

      expect(second?.requestId).toEqual(first?.requestId)
      expect(second?.entries).toHaveLength(2)
      expect(second?.requestCount).toEqual(2)
    })
  })

  it("marks the latest session entry as completed", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      analyzeAgentRequestLinkMock.mockResolvedValueOnce({
        decision: "new_thread",
      })
      const created = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      const completed = await markLatestCompletedBySession({
        agentId: "agent_1",
        sessionId: "session_1",
      })

      expect(completed?.requestId).toEqual(created?.requestId)
      expect(completed?.entries[0].status).toEqual("completed")
      expect(completed?.latestCompletedAt).toBeDefined()
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
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      const thread = await fetchThread(created!.requestId)

      expect(thread?.requestId).toEqual(created?.requestId)
      expect(thread?.entries).toHaveLength(1)
      expect(thread?.entries[0].promptHistory).toEqual([
        "Show me the holidays company policy",
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
        latestPrompt: "Prod request",
        userId: "user_1",
      })
    })

    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const requests = await fetchRequestsByAgent("agent_1")
      expect(requests).toHaveLength(1)
      expect(requests[0].entries[0].promptHistory).toEqual(["Prod request"])
    })
  })
})

import { context } from "@budibase/backend-core"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  appendToRequest,
  createRequest,
  createOrUpdateRequestForPrompt,
  fetchBySession,
  fetchLatestBySession,
  markCompleted,
} from "./crud"
import { analyzeAgentRequestBoundary } from "./helpers"

jest.mock("./helpers", () => ({
  analyzeAgentRequestBoundary: jest.fn(),
}))

describe("agentRequests crud", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    ;(analyzeAgentRequestBoundary as jest.Mock).mockReset()
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("appends a follow-up prompt to an existing request", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await createRequest({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      const completed = await markCompleted(first!._id!)

      const second = await appendToRequest({
        request: completed!,
        latestPrompt: "summarise it in 50 words",
      })

      expect(second?._id).toEqual(first?._id)
      expect(second?.interactionCount).toEqual(2)
      expect(second?.promptHistory).toEqual([
        "Show me the holidays company policy",
        "summarise it in 50 words",
      ])
      expect(second?.status).toEqual("waiting")
    })
  })

  it("creates a new request document", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await createRequest({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      await markCompleted(first!._id!)

      const second = await createRequest({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "I need a new laptop",
        userId: "user_1",
      })

      const requests = await fetchBySession("agent_1", "session_1")

      expect(second?._id).not.toEqual(first?._id)
      expect(requests).toHaveLength(2)
      expect(requests.map(request => request.interactionCount)).toEqual([1, 1])
    })
  })

  it("marks a request as completed", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const request = await createRequest({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      await markCompleted(request!._id!)
      const latest = await fetchLatestBySession("agent_1", "session_1")

      expect(latest?.status).toEqual("completed")
      expect(await context.getWorkspaceDB().tryGet(latest!._id!)).toBeDefined()
    })
  })

  it("creates a new request when the sdk boundary analysis says new request", async () => {
    ;(analyzeAgentRequestBoundary as jest.Mock).mockResolvedValue({
      decision: "new_request",
    })

    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      const second = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "I need a new laptop",
        userId: "user_1",
      })

      expect(first?._id).not.toEqual(second?._id)
    })
  })

  it("appends to the existing request when the sdk boundary analysis says same request", async () => {
    ;(analyzeAgentRequestBoundary as jest.Mock).mockResolvedValue({
      decision: "same_request",
    })

    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await createRequest({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      const second = await createOrUpdateRequestForPrompt({
        agentId: "agent_1",
        sessionId: "session_1",
        latestPrompt: "summarise it in 50 words",
        userId: "user_1",
      })

      expect(second?._id).toEqual(first?._id)
      expect(second?.interactionCount).toEqual(2)
    })
  })
})

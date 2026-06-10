import { context } from "@budibase/backend-core"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  fetchByConversation,
  fetchLatestByConversation,
  markCompleted,
  startRequest,
} from "./crud"

describe("agentRequests crud", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("reuses the latest request for follow-up prompts", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await startRequest({
        agentId: "agent_1",
        chatConversationId: "chatconvo_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      await markCompleted(first!._id!)

      const second = await startRequest({
        agentId: "agent_1",
        chatConversationId: "chatconvo_1",
        latestPrompt: "summarise it in 50 words",
        userId: "user_1",
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

  it("creates a new request for an unrelated prompt", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const first = await startRequest({
        agentId: "agent_1",
        chatConversationId: "chatconvo_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      await markCompleted(first!._id!)

      const second = await startRequest({
        agentId: "agent_1",
        chatConversationId: "chatconvo_1",
        latestPrompt: "I need a new laptop",
        userId: "user_1",
      })

      const requests = await fetchByConversation("agent_1", "chatconvo_1")

      expect(second?._id).not.toEqual(first?._id)
      expect(requests).toHaveLength(2)
      expect(requests.map(request => request.interactionCount)).toEqual([1, 1])
    })
  })

  it("marks a request as completed", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const request = await startRequest({
        agentId: "agent_1",
        chatConversationId: "chatconvo_1",
        latestPrompt: "Show me the holidays company policy",
        userId: "user_1",
      })

      await markCompleted(request!._id!)
      const latest = await fetchLatestByConversation("agent_1", "chatconvo_1")

      expect(latest?.status).toEqual("completed")
      expect(
        await context.getWorkspaceDB().tryGet(latest!._id!)
      ).toBeDefined()
    })
  })
})

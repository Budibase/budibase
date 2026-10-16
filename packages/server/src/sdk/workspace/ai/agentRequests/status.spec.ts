import { context } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { buildRequestStatusPrompt } from "./status"

describe("request status lookup", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("request-status-lookup")
  })

  afterAll(() => {
    config.end()
  })

  it("reads the user's published requests from the builder's development workspace", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const request: AgentRequest = {
        _id: "agentrequest_preview_book",
        agentId: "preview_agent",
        userId: "preview_user",
        title: "Buy a book for 5 euros",
        status: "completed",
        entries: [],
      }
      await context.getWorkspaceDB().put(request)
    })

    const prompt = await config.doInContext(config.getDevWorkspaceId(), () =>
      buildRequestStatusPrompt({
        agentId: "preview_agent",
        userId: "preview_user",
        isPreview: true,
      })
    )

    expect(prompt).toContain(
      '"title":"Buy a book for 5 euros","status":"completed"'
    )
    expect(prompt).not.toContain(
      "The user's saved request status is unavailable."
    )
    expect(prompt).not.toContain("The saved request lookup failed.")
  })

  it("reads saved statuses across conversations and preserves completed and failed requests without changing them", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const requests: AgentRequest[] = [
        {
          _id: "agentrequest_laptop",
          agentId: "agent_1",
          userId: "user_1",
          title: "Buy a laptop",
          status: "needs_input",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          actions: [
            {
              id: "approval_1",
              type: "escalation_resolved",
              escalationId: "escalation_1",
              timestamp: "2024-01-01T01:00:00.000Z",
              outcome: "approved",
            },
          ],
          entries: [
            {
              sessionId: "slack:another_thread",
              source: "Slack",
              status: "needs_input",
              createdAt: "2024-01-01T00:00:00.000Z",
              updatedAt: "2024-01-01T00:00:00.000Z",
            },
          ],
        },
        {
          _id: "agentrequest_melon",
          agentId: "agent_1",
          userId: "user_1",
          title: "Buy a melon",
          status: "failed",
          error: "Item unavailable",
          updatedAt: "2024-01-02T00:00:00.000Z",
          entries: [],
        },
        {
          _id: "agentrequest_other_user",
          agentId: "agent_1",
          userId: "user_2",
          title: "Another user's private request",
          status: "active",
          entries: [],
        },
        {
          _id: "agentrequest_other_agent",
          agentId: "agent_2",
          userId: "user_1",
          title: "Another agent's request",
          status: "active",
          entries: [],
        },
      ]
      for (const request of requests) {
        await db.put(request)
      }

      const initialPrompt = await buildRequestStatusPrompt({
        agentId: "agent_1",
        userId: "user_1",
      })
      const laptop = await db.get<AgentRequest>("agentrequest_laptop")
      await db.put({ ...laptop, status: "completed" })
      const savedLaptop = await db.get<AgentRequest>("agentrequest_laptop")

      const currentPrompt = await buildRequestStatusPrompt({
        agentId: "agent_1",
        userId: "user_1",
      })

      expect(initialPrompt).toContain(
        '"title":"Buy a laptop","status":"needs_input"'
      )
      expect(
        JSON.parse(currentPrompt.split("Saved request facts (JSON):\n")[1])
      ).toEqual([
        {
          title: "Buy a laptop",
          status: "completed",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: expect.any(String),
          recentActivity: [
            {
              type: "escalation_resolved",
              timestamp: "2024-01-01T01:00:00.000Z",
              outcome: "approved",
            },
          ],
        },
        {
          title: "Buy a melon",
          status: "failed",
          error: "Item unavailable",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          recentActivity: [],
        },
      ])
      expect(await db.get<AgentRequest>("agentrequest_laptop")).toEqual(
        savedLaptop
      )
    })
  })
})

import { context } from "@budibase/backend-core"
import { AGENT_REQUEST_TYPE } from "@budibase/types"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { STATUS_RANK } from "./requestsStore"
import { buildRequestStatusPrompt } from "./status"
import { queryRequestsByAgentAndUser } from "./views"

type SeedRequest = Omit<
  AgentRequest,
  | "type"
  | "workspaceId"
  | "statusRank"
  | "approvers"
  | "pendingApprovers"
  | "respondedApprovers"
>

const toRequest = (request: SeedRequest): AgentRequest => ({
  ...request,
  type: AGENT_REQUEST_TYPE,
  workspaceId: context.getProdWorkspaceId(),
  statusRank: STATUS_RANK[request.status],
  approvers: [],
  pendingApprovers: [],
  respondedApprovers: [],
})

describe("request status lookup", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("request-status-lookup")
  })

  afterAll(() => {
    config.end()
  })

  it("bounds oversized facts and refuses to infer a status from incomplete history", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const request = toRequest({
        _id: "req_large_history",
        agentId: "large_history_agent",
        userId: "large_history_user",
        title: "Buy a laptop",
        status: "needs_input",
        entries: [],
        error: "Oversized recorded details ".repeat(10000),
      })
      await context.getRequestsDB().put(request)
      await context.getRequestsDB().put({
        ...request,
        _id: "req_small_history",
        title: "Buy a melon",
        error: undefined,
      })

      const prompt = await buildRequestStatusPrompt({
        agentId: "large_history_agent",
        userId: "large_history_user",
        maxTokens: 1024,
      })

      expect(prompt.length).toBeLessThanOrEqual(4096)
      expect(prompt).toContain("The saved request history exceeds")
      expect(prompt).not.toContain("Saved request facts (JSON):")
      expect(prompt).not.toContain("Oversized recorded details")
      expect(prompt).not.toContain("Buy a melon")
    })
  })

  it("pages only the user's requests and includes requests beyond the first page when they fit", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const requests = Array.from({ length: 27 }, (_, index) =>
        toRequest({
          _id: `req_paged_${String(index).padStart(2, "0")}`,
          agentId: "paged_agent",
          userId: "paged_user",
          title: `Request ${String(index).padStart(2, "0")}`,
          status: "completed",
          entries: [],
        })
      )
      await context.getRequestsDB().bulkDocs([
        ...requests,
        toRequest({
          _id: "req_paged_other_user",
          agentId: "paged_agent",
          userId: "other_user",
          title: "Another user's request",
          status: "active",
          entries: [],
        }),
      ])

      const page = await queryRequestsByAgentAndUser({
        agentId: "paged_agent",
        userId: "paged_user",
        page: 2,
        limit: 2,
      })
      const prompt = await buildRequestStatusPrompt({
        agentId: "paged_agent",
        userId: "paged_user",
      })

      expect(page.map(request => request.title)).toEqual([
        "Request 24",
        "Request 23",
      ])
      expect(
        JSON.parse(prompt.split("Saved request facts (JSON):\n")[1])
      ).toHaveLength(27)
      expect(prompt).toContain('"title":"Request 00","status":"completed"')
      expect(prompt).not.toContain("Another user's request")
    })
  })

  it("reads saved statuses across conversations and preserves completed and failed requests without changing them", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getRequestsDB()
      const requests: SeedRequest[] = [
        {
          _id: "req_laptop",
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
          _id: "req_melon",
          agentId: "agent_1",
          userId: "user_1",
          title: "Buy a melon",
          status: "failed",
          error: "Item unavailable",
          updatedAt: "2024-01-02T00:00:00.000Z",
          entries: [],
        },
        {
          _id: "req_other_user",
          agentId: "agent_1",
          userId: "user_2",
          title: "Another user's private request",
          status: "active",
          entries: [],
        },
        {
          _id: "req_other_agent",
          agentId: "agent_2",
          userId: "user_1",
          title: "Another agent's request",
          status: "active",
          entries: [],
        },
      ]
      for (const request of requests) {
        await db.put(toRequest(request))
      }

      const initialPrompt = await buildRequestStatusPrompt({
        agentId: "agent_1",
        userId: "user_1",
      })
      const laptop = await db.get<AgentRequest>("req_laptop")
      await db.put({ ...laptop, status: "completed" })
      const savedLaptop = await db.get<AgentRequest>("req_laptop")

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
      expect(await db.get<AgentRequest>("req_laptop")).toEqual(savedLaptop)
    })
  })
})

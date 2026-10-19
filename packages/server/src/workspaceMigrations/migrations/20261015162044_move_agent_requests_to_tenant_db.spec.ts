import { context, db as dbCore } from "@budibase/backend-core"
import { DocumentType, EscalationSource, SEPARATOR } from "@budibase/types"
import type { AgentRequest, EscalationContextDoc } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import migration from "./20261015162044_move_agent_requests_to_tenant_db"

const escalationDocId = (escalationId: string) =>
  `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}${escalationId}`

describe("move agent requests to tenant db migration", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const seedLegacyRequest = async (
    id: string,
    overrides: Partial<AgentRequest> = {}
  ) => {
    const now = new Date().toISOString()
    await context.getWorkspaceDB().put({
      _id: `${DocumentType.AGENT_REQUEST}${SEPARATOR}${id}`,
      agentId: "agent_1",
      userId: "user_1",
      operationId: "op_1",
      title: `Request ${id}`,
      status: "completed",
      entries: [],
      actions: [],
      createdAt: now,
      updatedAt: now,
      ...overrides,
    })
  }

  const seedEscalation = async (
    escalationId: string,
    requestId: string,
    overrides: Partial<EscalationContextDoc> = {}
  ) => {
    await context.getWorkspaceDB().put({
      _id: escalationDocId(escalationId),
      source: EscalationSource.OPERATION,
      appId: context.getWorkspaceId(),
      tenantId: config.getTenantId(),
      agentId: "agent_1",
      sessionId: "session_1",
      requestId,
      resolution: "pending",
      policy: {
        id: "policy_1",
        name: "Two approvers",
        approvers: ["approver_1", "approver_2"],
      },
      approvals: [
        {
          userId: "approver_1",
          actionId: "approve",
          respondedAt: new Date().toISOString(),
        },
      ],
      ...overrides,
    })
  }

  it("copies prod requests into the tenant DB with derived fields and relinks escalations", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await seedLegacyRequest("open", {
        status: "needs_input",
        actions: [
          {
            id: "action_1",
            type: "escalation_raised",
            escalationId: "esc_1",
            recipients: [],
            sessionId: "session_1",
            timestamp: new Date().toISOString(),
          },
        ],
      })
      await seedLegacyRequest("done")
      await seedEscalation("esc_1", "agentrequest_open")

      await migration()

      const requestsDb = context.getRequestsDB()
      const open = await requestsDb.get<AgentRequest>("req_open")
      expect(open).toEqual(
        expect.objectContaining({
          type: "agentRequest",
          workspaceId: config.getProdWorkspaceId(),
          status: "needs_input",
          statusRank: 0,
          approvers: ["approver_1", "approver_2"],
          pendingApprovers: ["approver_2"],
          respondedApprovers: ["approver_1"],
          title: "Request open",
        })
      )
      const done = await requestsDb.get<AgentRequest>("req_done")
      expect(done).toEqual(
        expect.objectContaining({
          status: "completed",
          statusRank: 2,
          approvers: [],
          pendingApprovers: [],
        })
      )

      const escalation = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>(escalationDocId("esc_1"))
      expect(escalation.requestId).toEqual("req_open")

      const originals = await context.getWorkspaceDB().allDocs({
        startkey: `${DocumentType.AGENT_REQUEST}${SEPARATOR}`,
        endkey: `${DocumentType.AGENT_REQUEST}${SEPARATOR}￰`,
      })
      expect(originals.rows.map(row => row.id).sort()).toEqual([
        "agentrequest_done",
        "agentrequest_open",
      ])
    })
  })

  it("leaves requests already in the tenant DB untouched on a rerun", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await seedLegacyRequest("once")
      await migration()
      const first = await context.getRequestsDB().get<AgentRequest>("req_once")

      await migration()

      const second = await context.getRequestsDB().get<AgentRequest>("req_once")
      expect(second._rev).toEqual(first._rev)
    })
  })

  it("fails when an escalation cannot be relinked so the migration reruns", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await seedLegacyRequest("conflicted")
      await seedEscalation("esc_conflicted", "agentrequest_conflicted")
      const bulkDocs = jest
        .spyOn(dbCore.DatabaseImpl.prototype, "bulkDocs")
        .mockResolvedValueOnce([
          {
            id: escalationDocId("esc_conflicted"),
            error: "conflict",
            reason: "Document update conflict.",
          },
        ])

      try {
        await expect(migration()).rejects.toThrow(
          "Failed to relink 1 of 1 escalations: conflict"
        )
      } finally {
        bulkDocs.mockRestore()
      }

      const escalation = await context
        .getWorkspaceDB()
        .get<EscalationContextDoc>(escalationDocId("esc_conflicted"))
      expect(escalation.requestId).toEqual("agentrequest_conflicted")
      expect(await context.getRequestsDB().exists("req_conflicted")).toBe(true)
    })
  })

  it("does nothing for a dev workspace DB", async () => {
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await seedLegacyRequest("dev_only")

      await migration()

      expect(await context.getRequestsDB().exists("req_dev_only")).toBe(false)
      expect(
        await context.getWorkspaceDB().exists("agentrequest_dev_only")
      ).toBe(true)
    })
  })
})

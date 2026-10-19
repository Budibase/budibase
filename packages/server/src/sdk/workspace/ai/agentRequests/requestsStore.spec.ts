import { context } from "@budibase/backend-core"
import { DocumentType, SEPARATOR } from "@budibase/types"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import migration from "../../../../workspaceMigrations/migrations/20261015162044_move_agent_requests_to_tenant_db"
import { getRequest, toRequestId } from "./requestsStore"

describe("requestsStore", () => {
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

  const seedLegacyRequest = async (id: string) => {
    const now = new Date().toISOString()
    await context.getWorkspaceDB().put({
      _id: `${DocumentType.AGENT_REQUEST}${SEPARATOR}${id}`,
      agentId: "agent_1",
      userId: "user_1",
      status: "needs_input",
      title: `Request ${id}`,
      entries: [],
      actions: [],
      createdAt: now,
      updatedAt: now,
    })
  }

  describe("toRequestId", () => {
    it("keeps the hex and swaps the prefix", () => {
      expect(toRequestId("agentrequest_abc123")).toEqual("req_abc123")
    })
  })

  describe("getRequest", () => {
    it("returns a request stored in the tenant DB", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedLegacyRequest("stored")
        await migration()

        const request = await getRequest("req_stored")

        expect(request?._id).toEqual("req_stored")
      })
    })

    it("copies a legacy request from the workspace DB when asked for by its old id", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedLegacyRequest("pending")

        const request = await getRequest("agentrequest_pending")

        expect(request).toEqual(
          expect.objectContaining({
            _id: "req_pending",
            type: "agentRequest",
            workspaceId: config.getProdWorkspaceId(),
            status: "needs_input",
            statusRank: 0,
          })
        )
        const stored = await context
          .getRequestsDB()
          .get<AgentRequest>("req_pending")
        expect(stored._rev).toEqual(request?._rev)
      })
    })

    it("lets the migration skip a request the fallback already copied", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedLegacyRequest("early")
        const copied = await getRequest("agentrequest_early")

        await migration()

        const afterMigration = await context
          .getRequestsDB()
          .get<AgentRequest>("req_early")
        expect(afterMigration._rev).toEqual(copied?._rev)
      })
    })

    it("returns undefined for an old id with no legacy doc behind it", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        expect(await getRequest("agentrequest_missing")).toBeUndefined()
      })
    })

    it("returns undefined for a new id that does not exist", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        expect(await getRequest("req_missing")).toBeUndefined()
      })
    })
  })
})

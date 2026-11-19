import { context, db as dbCore } from "@budibase/backend-core"
import { DocumentType, SEPARATOR, SortOrder } from "@budibase/types"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import migration from "../../../../workspaceMigrations/migrations/20261015162044_move_agent_requests_to_tenant_db"
import {
  createDesignDoc,
  getRequest,
  searchRequests,
  toRequestId,
} from "./requestsStore"

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

  describe("createDesignDoc", () => {
    it("treats a conflict from a concurrent first write as success", async () => {
      await config.doInContext(config.getProdWorkspaceId(), async () => {
        await seedLegacyRequest("first")
        await migration()
        const put = jest
          .spyOn(dbCore.DatabaseImpl.prototype, "put")
          .mockRejectedValueOnce({ status: 409, error: "conflict" })

        try {
          await expect(createDesignDoc()).resolves.toBeUndefined()
        } finally {
          put.mockRestore()
        }

        const { requests } = await searchRequests({
          filters: { equal: { workspaceId: config.getProdWorkspaceId() } },
          sort: [{ field: "createdAt", direction: SortOrder.DESCENDING }],
          limit: 10,
        })
        expect(requests.map(r => r._id)).toEqual(["req_first"])
      })
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

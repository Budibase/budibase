import { mocks, structures } from "@budibase/backend-core/tests"
import { context, events } from "@budibase/backend-core"
import { Event, IdentityType } from "@budibase/types"
import { TestConfiguration } from "../../../../tests"

mocks.licenses.useAuditLogs()

const BASE_IDENTITY = {
  account: undefined,
  type: IdentityType.USER,
}
const USER_AUDIT_LOG_COUNT = 3
const APP_ID = "app_1"

describe("/api/global/auditlogs (%s)", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  describe("POST /api/global/auditlogs/search", () => {
    it("should be able to fire some events (create audit logs)", async () => {
      await context.doInTenant(config.tenantId, async () => {
        const userId = config.user!._id!
        const identity = {
          ...BASE_IDENTITY,
          _id: userId,
          tenantId: config.tenantId,
        }
        await context.doInIdentityContext(identity, async () => {
          for (let i = 0; i < USER_AUDIT_LOG_COUNT; i++) {
            await events.user.created(structures.users.user())
          }
          await context.doInAppContext(APP_ID, async () => {
            await events.app.created(structures.apps.app(APP_ID))
          })
          // fetch the user created events
          const response = await config.api.auditLogs.search({
            events: [Event.USER_CREATED],
          })
          expect(response.data).toBeDefined()
          // there will be an initial event which comes from the default user creation
          expect(response.data.length).toBe(USER_AUDIT_LOG_COUNT + 1)
        })
      })
    })

    it("should be able to search by event", async () => {
      const response = await config.api.auditLogs.search({
        events: [Event.USER_CREATED],
      })
      expect(response.data.length).toBeGreaterThan(0)
      for (let log of response.data) {
        expect(log.event).toBe(Event.USER_CREATED)
      }
    })

    it("should be able to search by time range (frozen)", async () => {
      // this is frozen, only need to add 1 and minus 1
      const now = new Date()
      const start = new Date()
      start.setSeconds(now.getSeconds() - 1)
      const end = new Date()
      end.setSeconds(now.getSeconds() + 1)
      const response = await config.api.auditLogs.search({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
      expect(response.data.length).toBeGreaterThan(0)
      for (let log of response.data) {
        expect(log.timestamp).toBe(now.toISOString())
      }
    })

    it("should be able to search by user ID", async () => {
      const userId = config.user!._id!
      const response = await config.api.auditLogs.search({
        userIds: [userId],
      })
      expect(response.data.length).toBeGreaterThan(0)
      for (let log of response.data) {
        expect(log.user._id).toBe(userId)
      }
    })

    it("should be able to search by app ID", async () => {
      const response = await config.api.auditLogs.search({
        appIds: [APP_ID],
      })
      expect(response.data.length).toBeGreaterThan(0)
      for (let log of response.data) {
        expect(log.app?._id).toBe(APP_ID)
      }
    })

    it("should be able to search by full string", async () => {
      const response = await config.api.auditLogs.search({
        fullSearch: "User",
      })
      expect(response.data.length).toBeGreaterThan(0)
      for (let log of response.data) {
        expect(log.name.includes("User")).toBe(true)
      }
    })
  })
})

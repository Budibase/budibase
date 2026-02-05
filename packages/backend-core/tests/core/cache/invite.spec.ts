import * as inviteCache from "../../../src/cache/invite"
import * as redis from "../../../src/redis/init"
import { Duration, newid } from "../../../src/utils"
import { testEnv } from "../../extra"

describe("invite cache", () => {
  beforeAll(() => {
    testEnv.multiTenant()
  })

  afterEach(async () => {
    const inviteClient = await redis.getInviteClient()
    await inviteClient.clear()
    const inviteListClient = await redis.getInviteListClient()
    await inviteListClient.clear()
  })

  it("stores invites in tenant list and retrieves", async () => {
    await testEnv.withTenant(async tenantId => {
      const code = await inviteCache.createCode("alpha@budibase.com", {
        tenantId,
      })

      const invite = await inviteCache.getCode(code)
      expect(invite.email).toBe("alpha@budibase.com")
      expect(invite.info.tenantId).toBe(tenantId)

      const invites = await inviteCache.getInviteCodes()
      expect(invites.some(inv => inv.code === code)).toBe(true)

      const inviteClient = await redis.getInviteClient()
      expect(await inviteClient.exists(code)).toBe(0)
    })
  })

  it("migrates legacy invites into the list", async () => {
    await testEnv.withTenant(async tenantId => {
      const inviteClient = await redis.getInviteClient()
      const code = `legacy-${newid()}`
      await inviteClient.store(
        code,
        {
          email: "legacy@budibase.com",
          info: { tenantId },
        },
        Duration.fromDays(7).toSeconds()
      )

      const invites = await inviteCache.getInviteCodes()
      expect(invites.some(inv => inv.code === code)).toBe(true)

      const inviteListClient = await redis.getInviteListClient()
      const list = (await inviteListClient.get(
        `invitation-list-${tenantId}`
      )) as any
      expect(list).toBeDefined()
      expect(list.legacyComplete).toBe(true)
      expect(list.invites[code].email).toBe("legacy@budibase.com")
      expect(list.tenantId).toBe(tenantId)
    })
  })

  it("deletes list invites", async () => {
    await testEnv.withTenant(async tenantId => {
      const code = await inviteCache.createCode("delete@budibase.com", {
        tenantId,
      })

      await inviteCache.deleteCode(code)
      await expect(inviteCache.getCode(code)).rejects.toBeDefined()

      const inviteListClient = await redis.getInviteListClient()
      const list = (await inviteListClient.get(
        `invitation-list-${tenantId}`
      )) as any
      expect(list).toBeDefined()
      expect(list.invites[code]).toBeUndefined()
    })
  })
})

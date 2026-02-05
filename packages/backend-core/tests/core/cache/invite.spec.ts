import * as inviteCache from "../../../src/cache/invite"
import { setEnv } from "../../../src/environment"
import * as redis from "../../../src/redis/init"
import { Duration, newid } from "../../../src/utils"
import { testEnv } from "../../extra"

describe("invite cache", () => {
  let resetEnv: (() => void) | undefined

  beforeAll(() => {
    resetEnv = setEnv({ MULTI_TENANCY: "1" })
  })

  afterAll(() => {
    resetEnv?.()
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

      const invite = await inviteCache.getCode(code, tenantId)
      expect(invite.email).toBe("alpha@budibase.com")
      expect(invite.info.tenantId).toBe(tenantId)

      const invites = await inviteCache.getInviteCodes()
      expect(invites.some(inv => inv.code === code)).toBe(true)

      const inviteClient = await redis.getInviteClient()
      expect(await inviteClient.exists(code)).toBe(0)
    })
  })

  it("combines legacy invites with tenant list", async () => {
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
      const list = (await inviteListClient.get(tenantId)) as any
      if (list) {
        expect(list.invites[code]).toBeUndefined()
      }
    })
  })

  it("deletes list invites", async () => {
    await testEnv.withTenant(async tenantId => {
      const code = await inviteCache.createCode("delete@budibase.com", {
        tenantId,
      })

      await inviteCache.deleteCode(code, tenantId)
      await expect(inviteCache.getCode(code, tenantId)).rejects.toBeDefined()

      const inviteListClient = await redis.getInviteListClient()
      const list = (await inviteListClient.get(tenantId)) as any
      expect(list).toBeDefined()
      expect(list.invites[code]).toBeUndefined()
    })
  })
})

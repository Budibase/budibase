import {
  cache,
  context,
  redis,
  sessions,
  users,
  utils,
} from "@budibase/backend-core"
import { loginUser, resetUpdate } from "../auth"
import { generator, structures } from "@budibase/backend-core/tests"
import { TestConfiguration } from "../../../tests"
import jwt from "jsonwebtoken"

describe("auth", () => {
  const config = new TestConfiguration()

  afterAll(config.afterAll)

  describe("resetUpdate", () => {
    it("providing a valid code will update the password", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const user = await config.createUser()
        const previousPassword = user.password

        const code = await cache.passwordReset.createCode(user._id!, {})
        const newPassword = generator.hash()

        await resetUpdate(code, newPassword)

        const persistedUser = await config.getUser(user.email)
        expect(persistedUser.password).not.toBe(previousPassword)
        expect(
          await utils.compare(newPassword, persistedUser.password!)
        ).toBeTruthy()
      })
    })

    it("wrong code will not allow to reset the password", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const code = generator.hash()
        const newPassword = generator.hash()

        await expect(resetUpdate(code, newPassword)).rejects.toThrow(
          "Provided information is not valid, cannot reset password - please try again."
        )
      })
    })

    it("rejects a legacy reset code without a tenant ID", async () => {
      const user = await config.createUser()
      const code = generator.hash()
      const client = await redis.clients.getPasswordResetClient()
      await client.store(code, { userId: user._id, info: {} }, 60)

      await context.doInTenant(config.tenantId, async () => {
        await expect(resetUpdate(code, generator.hash())).rejects.toThrow(
          "Provided information is not valid, cannot reset password - please try again."
        )
      })
    })

    it("cannot redeem a reset code in another tenant", async () => {
      const user = await config.createUser()
      const otherTenantId = structures.tenant.id()
      const victim = structures.users.user({
        _id: user._id,
        tenantId: otherTenantId,
        password: user.password,
      })
      await context.doInTenant(otherTenantId, () =>
        context.getGlobalDB().put(victim)
      )
      const code = await context.doInTenant(config.tenantId, () =>
        cache.passwordReset.createCode(user._id!, {})
      )
      const newPassword = generator.hash()

      await context.doInTenant(otherTenantId, async () => {
        await expect(resetUpdate(code, newPassword)).rejects.toThrow(
          "Provided information is not valid, cannot reset password - please try again."
        )
      })

      await context.doInTenant(config.tenantId, async () => {
        await resetUpdate(code, newPassword)
      })

      const persistedUser = await config.getUser(user.email)
      const persistedVictim = await context.doInTenant(otherTenantId, () =>
        users.getGlobalUserByEmail(victim.email)
      )
      expect(
        await utils.compare(newPassword, persistedUser.password!)
      ).toBeTruthy()
      expect(persistedVictim?.password).toBe(victim.password)
    })

    it("the same code cannot be used twice", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const user = await config.createUser()

        const code = await cache.passwordReset.createCode(user._id!, {})
        const newPassword = generator.hash()

        await resetUpdate(code, newPassword)
        await expect(resetUpdate(code, newPassword)).rejects.toThrow(
          "Provided information is not valid, cannot reset password - please try again."
        )
      })
    })

    it("updating the password will invalidate all the sessions", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const user = await config.createUser()

        await loginUser(user)

        expect(await sessions.getSessionsForUser(user._id!)).toHaveLength(1)

        const code = await cache.passwordReset.createCode(user._id!, {})
        const newPassword = generator.hash()

        await resetUpdate(code, newPassword)

        expect(await sessions.getSessionsForUser(user._id!)).toHaveLength(0)
      })
    })

    it("loginUser should return session invalidation count", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const user = await config.createUser()

        const loginResult1 = await loginUser(user)
        expect(loginResult1.invalidatedSessionCount).toBe(0)

        const loginResult2 = await loginUser(user)
        expect(loginResult2.invalidatedSessionCount).toBe(0)

        const loginResult3 = await loginUser(user)
        expect(loginResult3.invalidatedSessionCount).toBe(0)

        const loginResult4 = await loginUser(user)
        expect(loginResult4.invalidatedSessionCount).toBe(1)

        expect(await sessions.getSessionsForUser(user._id!)).toHaveLength(3)
      })
    })

    it("loginUser should return an auth token with an expiry", async () => {
      await context.doInTenant(structures.tenant.id(), async () => {
        const user = await config.createUser()

        const loginResult = await loginUser(user)
        const decodedToken = jwt.decode(loginResult.token)

        expect(decodedToken).toMatchObject({
          exp: expect.any(Number),
        })
      })
    })
  })
})

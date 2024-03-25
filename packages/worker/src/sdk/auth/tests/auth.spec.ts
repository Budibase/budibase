import { cache, context, sessions, utils } from "@budibase/backend-core"
import { loginUser, resetUpdate } from "../auth"
import { generator, structures } from "@budibase/backend-core/tests"
import { TestConfiguration } from "../../../tests"

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
  })
})

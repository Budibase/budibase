import { cache, context, utils } from "@budibase/backend-core"
import { resetUpdate } from "../auth"
import { generator, structures } from "@budibase/backend-core/tests"
import { TestConfiguration } from "../../../tests"

describe("auth", () => {
  const config = new TestConfiguration()

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
  })
})

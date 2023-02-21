import { structures } from "../../../tests"
import * as users from "../users"
import env from "../../../environment"
import { mocks } from "@budibase/backend-core/tests"
import { CloudAccount } from "@budibase/types"

describe("users", () => {
  describe("isPreventSSOPasswords", () => {
    it("returns true for sso account user", async () => {
      const user = structures.users.user()
      mocks.accounts.getAccount.mockReturnValue(
        Promise.resolve(structures.accounts.ssoAccount() as CloudAccount)
      )
      const result = await users.isPreventSSOPasswords(user)
      expect(result).toBe(true)
    })

    it("returns true for sso user", async () => {
      const user = structures.users.ssoUser()
      const result = await users.isPreventSSOPasswords(user)
      expect(result).toBe(true)
    })

    describe("sso maintenance mode", () => {
      beforeEach(() => {
        env._set("ENABLE_SSO_MAINTENANCE_MODE", true)
      })

      afterEach(() => {
        env._set("ENABLE_SSO_MAINTENANCE_MODE", false)
      })

      describe("non-admin user", () => {
        it("returns true", async () => {
          const user = structures.users.ssoUser()
          const result = await users.isPreventSSOPasswords(user)
          expect(result).toBe(true)
        })
      })

      describe("admin user", () => {
        it("returns false", async () => {
          const user = structures.users.ssoUser({
            user: structures.users.adminUser(),
          })
          const result = await users.isPreventSSOPasswords(user)
          expect(result).toBe(false)
        })
      })
    })
  })
})

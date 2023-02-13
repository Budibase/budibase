import { structures } from "../../../tests"
import * as users from "../users"
import env from "../../../environment"
import { mocks } from "@budibase/backend-core/tests"
import { CloudAccount } from "@budibase/types"

describe("users", () => {
  describe("preventSSOPasswords", () => {
    it("returns true for sso account user", async () => {
      const user = structures.users.user()
      mocks.accounts.getAccount.mockReturnValue(
        Promise.resolve(structures.accounts.ssoAccount() as CloudAccount)
      )
      const result = await users.preventSSOPasswords(user)
      expect(result).toBe(true)
    })

    it("returns true for sso user", async () => {
      const user = structures.users.ssoUser()
      const result = await users.preventSSOPasswords(user)
      expect(result).toBe(true)
    })

    it("returns false in maintenance mode", async () => {
      env._set("ENABLE_SSO_MAINTENANCE_MODE", true)
      const user = structures.users.ssoUser()
      const result = await users.preventSSOPasswords(user)
      expect(result).toBe(false)
      env._set("ENABLE_SSO_MAINTENANCE_MODE", false)
    })
  })
})

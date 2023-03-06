import { structures } from "../../../tests"
import { mocks } from "@budibase/backend-core/tests"
import { env } from "@budibase/backend-core"
import * as users from "../users"
import { CloudAccount } from "@budibase/types"
import { isPreventPasswordActions } from "../users"

jest.mock("@budibase/pro")
import * as _pro from "@budibase/pro"
const pro = jest.mocked(_pro, true)

describe("users", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("isPreventPasswordActions", () => {
    it("returns false for non sso user", async () => {
      const user = structures.users.user()
      const result = await users.isPreventPasswordActions(user)
      expect(result).toBe(false)
    })

    it("returns true for sso account user", async () => {
      const user = structures.users.user()
      mocks.accounts.getAccount.mockReturnValue(
        Promise.resolve(structures.accounts.ssoAccount() as CloudAccount)
      )
      const result = await users.isPreventPasswordActions(user)
      expect(result).toBe(true)
    })

    it("returns true for sso user", async () => {
      const user = structures.users.ssoUser()
      const result = await users.isPreventPasswordActions(user)
      expect(result).toBe(true)
    })

    describe("enforced sso", () => {
      it("returns true for all users when sso is enforced", async () => {
        const user = structures.users.user()
        pro.features.isSSOEnforced.mockReturnValue(Promise.resolve(true))
        const result = await users.isPreventPasswordActions(user)
        expect(result).toBe(true)
      })
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
          const result = await users.isPreventPasswordActions(user)
          expect(result).toBe(true)
        })
      })

      describe("admin user", () => {
        it("returns false", async () => {
          const user = structures.users.ssoUser({
            user: structures.users.adminUser(),
          })
          const result = await users.isPreventPasswordActions(user)
          expect(result).toBe(false)
        })
      })
    })
  })
})

import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { generator } from "../../../shared"

describe("accounts", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("performs signup and deletion flow", async () => {
    await config.doInNewState(async () => {
      const createAccountRequest = fixtures.accounts.generateAccount()
      const email = createAccountRequest.email
      const tenantId = createAccountRequest.tenantId

      // Validation - email and tenant id allowed
      await config.api.accounts.validateEmail(email)
      await config.api.accounts.validateTenantId(tenantId)

      // Create unverified account
      await config.api.accounts.create(createAccountRequest)

      // Validation - email and tenant id no longer valid
      await config.api.accounts.validateEmail(email, { status: 400 })
      await config.api.accounts.validateTenantId(tenantId, { status: 400 })

      // Attempt to log in using unverified account
      await config.loginAsAccount(createAccountRequest, { status: 400 })

      // Re-send verification email to get access to code
      const [_, code] = await config.accountsApi.accounts.sendVerificationEmail(email)

      // Send the verification request
      await config.accountsApi.accounts.verifyAccount(code!)

      // Can now login to the account
      await config.loginAsAccount(createAccountRequest)

      // Delete account
      await config.api.accounts.deleteCurrentAccount()

      // Can't login
      await config.loginAsAccount(createAccountRequest, { status: 403 })
    })
  })

  describe("searching accounts", () => {
    it("searches by tenant id", async () => {
      const tenantId = generator.string()

      // empty result
      const [emptyRes, emptyBody] = await config.api.accounts.search(tenantId, "tenantId")
      expect(emptyBody.length).toBe(0)

      // hit result
      const [hitRes, hitBody] = await config.api.accounts.search(config.state.tenantId!, "tenantId")
      expect(hitBody.length).toBe(1)
      expect(hitBody[0].tenantId).toBe(config.state.tenantId)
    })

    it("searches by email", async () => {
      const email = generator.email()

      // empty result
      const [emptyRes, emptyBody] = await config.api.accounts.search(email, "email")
      expect(emptyBody.length).toBe(0)

      // hit result
      const [hitRes, hitBody] = await config.api.accounts.search(config.state.email!, "email")
      expect(hitBody.length).toBe(1)
      expect(hitBody[0].email).toBe(config.state.email)
    })
  })
})

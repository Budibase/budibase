import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { generator } from "../../../shared"
import { Hosting } from "@budibase/types"

describe("Password Management", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("performs password reset flow", async () => {
    // Create account
    const createAccountRequest = fixtures.accounts.generateAccount({
      hosting: Hosting.CLOUD,
    })
    await config.api.accounts.create(createAccountRequest, { autoVerify: true })

    // Request password reset to get code
    const [_, code] = await config.api.auth.resetPassword(
      createAccountRequest.email
    )

    // Change password using code
    const password = generator.string()
    await config.api.auth.resetPasswordUpdate(code, password)

    // Login using the new password
    await config.api.auth.login(createAccountRequest.email, password)

    // Logout of account
    await config.api.auth.logout()

    // Cannot log in using old password
    await config.api.auth.login(
      createAccountRequest.email,
      createAccountRequest.password,
      { status: 403 }
    )
  })
})

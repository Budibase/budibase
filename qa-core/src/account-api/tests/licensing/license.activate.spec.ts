import TestConfiguration from "../../config/TestConfiguration"
import * as fixures from "../../fixtures"
import { Feature, Hosting } from "@budibase/types"

describe("license activation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("creates, activates and deletes online license - self host", async () => {
    // Remove existing license key
    await config.internalApi.license.deleteLicenseKey()

    // Verify license key not found
    await config.internalApi.license.getLicenseKey({ status: 404 })

    // Create self host account
    const createAccountRequest = fixures.accounts.generateAccount({
      hosting: Hosting.SELF,
    })
    const [, account] = await config.accountsApi.accounts.create(
      createAccountRequest,
      {
        autoVerify: true,
      }
    )

    let licenseKey: string = " "
    await config.doInNewState(async () => {
      await config.loginAsAccount(createAccountRequest)
      // Retrieve license key
      const [, body] = await config.accountsApi.licenses.getLicenseKey()
      licenseKey = body.licenseKey
    })

    const accountId = account.accountId!

    // Update license to have paid feature
    await config.accountsApi.licenses.updateLicense(accountId, {
      overrides: {
        features: [Feature.APP_BACKUPS],
      },
    })

    // Activate license key
    await config.internalApi.license.activateLicenseKey({ licenseKey })

    // Verify license updated with new feature
    await config.doInNewState(async () => {
      await config.loginAsAccount(createAccountRequest)
      const [, body] = await config.api.accounts.self()
      expect(body.license.features[0]).toBe("appBackups")
    })

    // Remove license key
    await config.internalApi.license.deleteLicenseKey()

    // Verify license key not found
    await config.internalApi.license.getLicenseKey({ status: 404 })
  })
})

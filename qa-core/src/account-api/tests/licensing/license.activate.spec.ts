import TestConfiguration from "../../config/TestConfiguration"
import * as fixures from "../../fixtures"
import { Feature, Hosting, PlanType } from "@budibase/types"

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
    const [createAccountRes, account] =
      await config.accountsApi.accounts.create(createAccountRequest)
    const accountId = account.accountId!
    const tenantId = account.tenantId!

    // Update license to have paid feature
    const [res, acc] = await config.accountsApi.licenses.updateLicense(
      accountId,
      {
        overrides: {
          features: [Feature.APP_BACKUPS],
        },
      }
    )

    // Retrieve license key
    const [getLicenseRes, body] =
      await config.accountsApi.licenses.getLicenseKey()

    // TODO: Activate license key
    //await config.internalApi.license.activateLicenseKey()

    // TODO: Verify license updated with new feature

    // Remove license key
    await config.internalApi.license.deleteLicenseKey()

    // Verify license key not found
    await config.internalApi.license.getLicenseKey({ status: 404 })

    // TODO: Verify user downgraded to free license
  })
})

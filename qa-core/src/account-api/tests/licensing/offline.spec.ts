import TestConfiguration from "../../config/TestConfiguration"
import * as fixures from "../../fixtures"
import { Hosting, Feature } from "@budibase/types"

describe("offline", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  // TODO: Currently requires a self host install + account portal
  // Ignored until we set this up
  xit("creates, activates and deletes offline license", async () => {
    // installation: Delete any token
    await config.internalApi.license.deleteOfflineLicenseToken()

    // installation: Assert token not found
    let [getTokenRes] = await config.internalApi.license.getOfflineLicenseToken(
      { status: 404 }
    )

    // installation: Retrieve Identifier
    const [getIdentifierRes, identifier] =
      await config.internalApi.license.getOfflineIdentifier()

    // account-portal: Create self-host account
    const createAccountRequest = fixures.accounts.generateAccount({
      hosting: Hosting.SELF,
    })
    const [createAccountRes, account] =
      await config.accountsApi.accounts.create(createAccountRequest)
    const accountId = account.accountId!
    const tenantId = account.tenantId!

    // account-portal: Enable feature on license
    await config.accountsApi.licenses.updateLicense(accountId, {
      overrides: {
        features: [Feature.OFFLINE],
      },
    })

    // account-portal: Create offline token
    const expireAt = new Date()
    expireAt.setDate(new Date().getDate() + 1)
    await config.accountsApi.licenses.createOfflineLicense(
      accountId,
      tenantId,
      {
        expireAt: expireAt.toISOString(),
        installationIdentifierBase64: identifier.identifierBase64,
      }
    )

    // account-portal: Retrieve offline token
    const [getLicenseRes, offlineLicense] =
      await config.accountsApi.licenses.getOfflineLicense(accountId, tenantId)

    // installation: Activate offline token
    await config.internalApi.license.activateOfflineLicenseToken({
      offlineLicenseToken: offlineLicense.offlineLicenseToken,
    })

    // installation: Assert token found
    await config.internalApi.license.getOfflineLicenseToken()

    // TODO: Assert on license for current user

    // installation: Remove the token
    await config.internalApi.license.deleteOfflineLicenseToken()

    // installation: Assert token not found
    await config.internalApi.license.getOfflineLicenseToken({ status: 404 })
  })
})

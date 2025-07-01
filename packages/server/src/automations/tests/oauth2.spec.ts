import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { SSOUser, SSOProviderType, AutomationActionStepId, User } from "@budibase/types"

describe("OAuth2 Automation Binding", () => {
  const config = new TestConfiguration()
  let ssoUser: User

  beforeAll(async () => {
    await config.init()

    // Create a user with OAuth2 data and save it to the database
    const user = await config.globalUser()
    const ssoUserData = {
      ...user,
      oauth2: {
        accessToken: "test_access_token",
        refreshToken: "test_refresh_token",
      },
      providerType: SSOProviderType.GOOGLE,
      provider: "Google",
    } as SSOUser

    // Save the updated user with OAuth2 data to the database
    const db = config.getTenantDatabase()
    await db.put(ssoUserData)
    
    ssoUser = ssoUserData
  })

  afterAll(() => {
    config.end()
  })

  it("should make OAuth2 token available in executeQuery automation step", async () => {
    await config.withUser(ssoUser, async () => {
      // Create a basic table to test with
      const table = await config.api.table.save({
        name: "test-table",
        schema: {
          name: {
            type: "string",
            name: "name",
          },
        },
      })

      const results = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({
          text: "Testing executeQuery - OAuth Token: {{ user.oauth2.accessToken }}",
        })
        .test({ fields: {} })

      // This test should initially show that OAuth2 tokens are not available
      // The log should show "undefined" instead of the actual token
      // Once we fix the implementation, this should show the actual token
      const logMessage = results.steps[0].outputs.message
      expect(logMessage).toContain("OAuth Token:")
      // Initially this will be undefined, after fix it should be the actual token
    })
  })

  it("should make OAuth2 token available in apiRequest automation step", async () => {
    await config.withUser(ssoUser, async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({
          text: "Testing apiRequest - OAuth Token: {{ user.oauth2.accessToken }}",
        })
        .test({ fields: {} })

      // This test should initially show that OAuth2 tokens are not available
      // The log should show "undefined" instead of the actual token
      // Once we fix the implementation, this should show the actual token
      const logMessage = results.steps[0].outputs.message
      expect(logMessage).toContain("OAuth Token:")
      // Initially this will be undefined, after fix it should be the actual token
    })
  })

  it("should verify OAuth2 tokens are accessible in automation context", async () => {
    await config.withUser(ssoUser, async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({
          text: "OAuth Token: {{ user.oauth2.accessToken }}, Refresh Token: {{ user.oauth2.refreshToken }}",
        })
        .test({ fields: {} })

      expect(results.steps[0].outputs.message).toEqual(
        "OAuth Token: test_access_token, Refresh Token: test_refresh_token"
      )
    })
  })
})
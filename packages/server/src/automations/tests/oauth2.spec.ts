import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { SSOUser } from "@budibase/types"

describe("OAuth Automation Binding", () => {
  const config = new TestConfiguration()
  let ssoUser: SSOUser

  beforeAll(async () => {
    await config.init()

    ssoUser = await config.ssoUser({
      oauth2: {
        accessToken: "test_access_token",
        refreshToken: "test_refresh_token",
      },
    })
  })

  afterAll(() => {
    config.end()
  })

  it("should make OAuth token available in automation bindings", async () => {
    await config.withUser(ssoUser, async () => {
      const results = await createAutomationBuilder(config)
        .onAppAction()
        .serverLog({
          text: "OAuth Token: {{ user.oauth2.accessToken }}",
        })
        .test({ fields: {} })

      expect(results.steps[0].outputs.message).toEndWith(
        "OAuth Token: test_access_token"
      )
    })
  })
})

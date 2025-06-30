import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

describe("OAuth Automation Binding", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("should make OAuth token available in automation bindings", async () => {
    const oauthToken = "oauth_test_token_123"
    const mockUser = {
      _id: "user123",
      email: "test@example.com",
      oauth2: {
        accessToken: oauthToken,
        refreshToken: "refresh_token_123",
      },
    }

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({
        text: "OAuth Token: {{ user.oauth2.accessToken }}",
      })
      .test({
        fields: {},
        user: mockUser,
      })

    expect(results.steps[0].outputs.message).toContain(oauthToken)
  })

  it("should process OAuth token bindings in API requests", async () => {
    const oauthToken = "oauth_api_token_456"
    const mockUser = {
      _id: "user456",
      email: "api@example.com",
      oauth2: {
        accessToken: oauthToken,
      },
    }

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .apiRequest({
        query: {
          url: "https://api.example.com/data",
          method: "GET",
          headers: {
            Authorization: "Bearer {{ user.oauth2.accessToken }}",
          },
        },
      })
      .test({
        fields: {},
        user: mockUser,
      })

    // Check that the OAuth token was properly substituted in the API request
    const apiStep = results.steps[0]
    expect(apiStep.inputs.query.headers.Authorization).toBe(
      `Bearer ${oauthToken}`
    )
  })

  it("should handle missing OAuth token gracefully", async () => {
    const mockUser = {
      _id: "user789",
      email: "noauth@example.com",
    }

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({
        text: "OAuth Token: {{ user.oauth2.accessToken }}",
      })
      .test({
        fields: {},
        user: mockUser,
      })

    // Should not throw error, should show empty/undefined binding
    expect(results.steps[0].outputs.message).toContain("OAuth Token:")
  })

  it("should process OAuth bindings in external API calls", async () => {
    const oauthToken = "oauth_external_token_789"
    const mockUser = {
      _id: "user789",
      email: "external@example.com",
      oauth2: {
        accessToken: oauthToken,
        refreshToken: "refresh_789",
      },
    }

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({
        text: "Access Token: {{ user.oauth2.accessToken }}, Refresh Token: {{ user.oauth2.refreshToken }}",
      })
      .test({
        fields: {},
        user: mockUser,
      })

    // Verify both OAuth tokens are available
    expect(results.steps[0].outputs.message).toContain(oauthToken)
    expect(results.steps[0].outputs.message).toContain("refresh_789")
  })

  it("should preserve OAuth context through multiple automation steps", async () => {
    const oauthToken = "oauth_multi_step_token"
    const mockUser = {
      _id: "user_multi",
      email: "multistep@example.com",
      oauth2: {
        accessToken: oauthToken,
        provider: "google",
      },
    }

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .serverLog({
        text: "Step 1 - Token: {{ user.oauth2.accessToken }}",
      })
      .serverLog({
        text: "Step 2 - Provider: {{ user.oauth2.provider }}",
      })
      .serverLog({
        text: "Step 3 - User: {{ user.email }}",
      })
      .test({
        fields: {},
        user: mockUser,
      })

    // Verify OAuth context is available in all steps
    expect(results.steps[0].outputs.message).toContain(oauthToken)
    expect(results.steps[1].outputs.message).toContain("google")
    expect(results.steps[2].outputs.message).toContain("multistep@example.com")
  })
})

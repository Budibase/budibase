import { createAutomationBuilder } from "./utilities/AutomationTestBuilder"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import {
  SSOUser,
  SSOProviderType,
  User,
  BodyType,
  RestQueryFields,
  GoogleConfig,
  ConfigType,
} from "@budibase/types"
import { configs, context } from "@budibase/backend-core"
import * as setup from "./utilities"
import nock from "nock"

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

    await config.doInTenant(async () => {
      // Save the updated user with OAuth2 data to the database
      const db = context.getGlobalDB()
      await db.put(ssoUserData)

      const googleConfig: GoogleConfig = {
        type: ConfigType.GOOGLE,
        config: {
          clientID: "test_client_id",
          clientSecret: "test_client_secret",
          callbackURL: "http://callback.example.com",
          activated: true,
        },
      }

      await configs.save(googleConfig)
    })

    ssoUser = ssoUserData
  })

  afterAll(() => {
    config.end()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("should make OAuth2 token available in executeQuery automation step", async () => {
    await config.withUser(ssoUser, async () => {
      // Mock the external API call that the query will make
      const scope = nock("https://api.example.com")
        .get("/test")
        .matchHeader("Authorization", "Bearer test_access_token")
        .reply(200, { success: true, data: "OAuth token worked!" })

      // Create a basic REST datasource
      const datasource = await config.restDatasource({
        name: "OAuth Test Datasource",
      })

      // Create a query that will use the OAuth token in query headers
      const queryFields: RestQueryFields = {
        path: "https://api.example.com/test",
        queryString: "",
        headers: {
          Authorization: "Bearer {{ user.oauth2.accessToken }}",
        },
        disabledHeaders: {},
        bodyType: BodyType.NONE,
      }

      const query = await setup.saveRESTQuery(config, datasource, queryFields)

      const results = await createAutomationBuilder(config)
        .onAppAction()
        .executeQuery({
          query: {
            queryId: query._id!,
          },
        })
        .test({ fields: {} })

      // Verify the request was made with the correct OAuth token
      expect(scope.isDone()).toBe(true)
      expect(results.steps[0].outputs.success).toBe(true)
      expect(results.steps[0].outputs.response).toEqual([
        { success: true, data: "OAuth token worked!" },
      ])
    })
  })

  it("should make OAuth2 token available in apiRequest automation step", async () => {
    await config.withUser(ssoUser, async () => {
      // Mock the external API call that the API request will make
      const scope = nock("https://api.example.com")
        .post("/api-request")
        .matchHeader("Authorization", "Bearer test_access_token")
        .reply(200, {
          success: true,
          message: "API request with OAuth token succeeded!",
        })

      // Create a basic REST datasource
      const datasource = await config.restDatasource({
        name: "OAuth API Request Datasource",
      })

      // Create a query for the API request step with OAuth headers
      const queryFields: RestQueryFields = {
        path: "https://api.example.com/api-request",
        queryString: "",
        headers: {
          Authorization: "Bearer {{ user.oauth2.accessToken }}",
        },
        disabledHeaders: {},
        bodyType: BodyType.JSON,
        requestBody: JSON.stringify({ test: "data" }),
      }

      const query = await setup.saveRESTQuery(
        config,
        datasource,
        queryFields,
        [],
        "create"
      )

      const results = await createAutomationBuilder(config)
        .onAppAction()
        .apiRequest({
          query: {
            queryId: query._id!,
          },
        })
        .test({ fields: {} })

      // Verify the request was made with the correct OAuth token
      expect(scope.isDone()).toBe(true)
      expect(results.steps[0].outputs.success).toBe(true)
      expect(results.steps[0].outputs.response).toEqual([
        {
          success: true,
          message: "API request with OAuth token succeeded!",
        },
      ])
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

      expect(results.steps[0].outputs.message).toContain(
        "OAuth Token: test_access_token, Refresh Token: test_refresh_token"
      )
    })
  })

  it("should handle 401 Unauthorized and retry mechanism in apiRequest step", async () => {
    await config.withUser(ssoUser, async () => {
      nock("https://api.example.com")
        .post("/protected-endpoint")
        .matchHeader("Authorization", "Bearer test_access_token")
        .reply(401, { error: "Unauthorized" })

      nock("https://www.googleapis.com/").post("/oauth2/v4/token").reply(200, {
        access_token: "test_access_token2",
      })

      nock("https://api.example.com")
        .post("/protected-endpoint")
        .matchHeader("Authorization", "Bearer test_access_token2")
        .reply(200, { success: true, message: "Request succeeded on retry!" })

      const datasource = await config.restDatasource({
        name: "OAuth Retry Test Datasource",
      })

      const queryFields: RestQueryFields = {
        path: "https://api.example.com/protected-endpoint",
        queryString: "",
        headers: {
          Authorization: "Bearer {{ user.oauth2.accessToken }}",
        },
        disabledHeaders: {},
        bodyType: BodyType.JSON,
        requestBody: JSON.stringify({ test: "data" }),
      }

      const query = await setup.saveRESTQuery(
        config,
        datasource,
        queryFields,
        [],
        "create"
      )

      const results = await createAutomationBuilder(config)
        .onAppAction()
        .apiRequest({
          query: {
            queryId: query._id!,
          },
        })
        .test({ fields: {} })

      expect(results.steps[0].outputs.response).toEqual([
        {
          success: true,
          message: "Request succeeded on retry!",
        },
      ])
    })
  })
})

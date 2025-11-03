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
import { setEnv } from "../../environment"
import {
  installHttpMocking,
  resetHttpMocking,
  getPool,
} from "../../tests/jestEnv"
import nock from "nock"

const jsonHeaders = { "content-type": "application/json" }

interface OAuthRetryResponse {
  success: boolean
  message?: string
  error?: string
}

const buildReply = (statusCode: number, data: OAuthRetryResponse) => ({
  statusCode,
  data,
  responseOptions: { headers: jsonHeaders },
})

const parseJsonBody = (body: unknown) => {
  if (!body) {
    return undefined
  }
  if (typeof body === "string") {
    return JSON.parse(body)
  }
  if (Buffer.isBuffer(body)) {
    return JSON.parse(body.toString())
  }
  if (ArrayBuffer.isView(body)) {
    return JSON.parse(
      Buffer.from(body.buffer, body.byteOffset, body.byteLength).toString()
    )
  }
  return body as Record<string, unknown>
}

const getAuthHeader = (headers: any) => {
  if (!headers) {
    return undefined
  }
  if (typeof (headers as any)?.get === "function") {
    return (headers as any).get("authorization")
  }
  const entries = headers as Record<string, string>
  const key = Object.keys(entries).find(
    header => header.toLowerCase() === "authorization"
  )
  return key ? entries[key] : undefined
}

describe("OAuth2 Automation Binding", () => {
  const config = new TestConfiguration()
  let ssoUser: User
  let restoreEnv: (() => void) | undefined

  beforeAll(async () => {
    restoreEnv = setEnv({ REST_REJECT_UNAUTHORIZED: false })
    await config.init()

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

  beforeEach(() => {
    installHttpMocking()
    nock.cleanAll()
  })

  afterEach(async () => {
    await resetHttpMocking()
    nock.cleanAll()
  })

  afterAll(() => {
    restoreEnv?.()
    config.end()
  })

  it("should make OAuth2 token available in executeQuery automation step", async () => {
    await config.withUser(ssoUser, async () => {
      const pool = getPool("https://api.example.com")
      let requestCount = 0

      pool
        .intercept({ path: path => path.startsWith("/test"), method: "GET" })
        .reply(({ headers }) => {
          requestCount++
          expect(getAuthHeader(headers as any)).toEqual(
            "Bearer test_access_token"
          )
          return {
            statusCode: 200,
            data: { success: true, data: "OAuth token worked!" },
            responseOptions: { headers: jsonHeaders },
          }
        })

      const datasource = await config.restDatasource({
        name: "OAuth Test Datasource",
      })

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

      expect(requestCount).toBe(1)
      expect(results.steps[0].outputs.success).toBe(true)
      expect(results.steps[0].outputs.response).toEqual([
        { success: true, data: "OAuth token worked!" },
      ])
    })
  })

  it("should make OAuth2 token available in apiRequest automation step", async () => {
    await config.withUser(ssoUser, async () => {
      const pool = getPool("https://api.example.com")
      let requestCount = 0

      pool
        .intercept({
          path: path => path.startsWith("/api-request"),
          method: "POST",
        })
        .reply(({ headers, body }) => {
          requestCount++
          expect(getAuthHeader(headers as any)).toEqual(
            "Bearer test_access_token"
          )
          expect(parseJsonBody(body)).toEqual({ test: "data" })
          return {
            statusCode: 200,
            data: {
              success: true,
              message: "API request with OAuth token succeeded!",
            },
            responseOptions: { headers: jsonHeaders },
          }
        })

      const datasource = await config.restDatasource({
        name: "OAuth API Request Datasource",
      })

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

      expect(requestCount).toBe(1)
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
      const apiPool = getPool("https://api.example.com")
      let firstCall = true

      apiPool
        .intercept({
          path: path => path.startsWith("/protected-endpoint"),
          method: "POST",
        })
        .reply(({ headers }) => {
          const authHeader = getAuthHeader(headers as any)
          if (firstCall) {
            firstCall = false
            expect(authHeader).toEqual("Bearer test_access_token")
            return buildReply(401, {
              success: false,
              error: "Unauthorized",
            })
          }
          expect(authHeader).toEqual("Bearer test_access_token2")
          return buildReply(200, {
            success: true,
            message: "Request succeeded on retry!",
          })
        })
        .times(2)

      nock("https://www.googleapis.com")
        .post("/oauth2/v4/token")
        .reply(200, { access_token: "test_access_token2" })

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

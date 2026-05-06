import { env, features } from "@budibase/backend-core"
import { AgentKnowledgeSourceType, FeatureFlag } from "@budibase/types"
import sdk from "../../../../sdk"
import { createKnowledgeSourceConnection } from "../../../../sdk/workspace/ai/knowledgeSources"
import { installHttpMocking, resetHttpMocking } from "../../../../tests/jestEnv"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe("sharepoint oauth callback", () => {
  const config = new TestConfiguration()
  let originalClientId: string | undefined
  let originalClientSecret: string | undefined
  let originalTenantId: string | undefined
  let originalScope: string | undefined

  beforeAll(() => {
    originalClientId = env.MICROSOFT_CLIENT_ID
    originalClientSecret = env.MICROSOFT_CLIENT_SECRET
    originalTenantId = env.MICROSOFT_TENANT_ID
    originalScope = env.RAG_SHAREPOINT_DEFAULT_SCOPE
    env._set("MICROSOFT_CLIENT_ID", "client-id")
    env._set("MICROSOFT_CLIENT_SECRET", "client-secret")
    env._set("MICROSOFT_TENANT_ID", "common")
    env._set(
      "RAG_SHAREPOINT_DEFAULT_SCOPE",
      "offline_access User.Read Sites.Read.All"
    )
    installHttpMocking()
  })

  afterAll(async () => {
    await resetHttpMocking()
    config.end()
    env._set("MICROSOFT_CLIENT_ID", originalClientId)
    env._set("MICROSOFT_CLIENT_SECRET", originalClientSecret)
    env._set("MICROSOFT_TENANT_ID", originalTenantId)
    env._set("RAG_SHAREPOINT_DEFAULT_SCOPE", originalScope)
  })

  beforeEach(async () => {
    await resetHttpMocking()
    installHttpMocking()
    await config.newTenant()
    jest.restoreAllMocks()
  })

  const startOauthAndGetState = async () => {
    const headers = config.defaultHeaders()
    const connectResponse = await config
      .getRequest()!
      .get("/api/agent/knowledge-sources/sharepoint/connect")
      .query({
        appId: config.getDevWorkspaceId(),
        returnPath: `/builder/workspace/${config.getDevWorkspaceId()}`,
      })
      .set(headers)
      .expect(302)

    const authorizeLocation = String(connectResponse.headers.location)
    const state = new URL(authorizeLocation).searchParams.get("state")
    expect(state).toBeTruthy()

    return {
      state: state!,
      callbackHeaders: {
        Host: config.tenantHost(),
        Cookie: connectResponse.headers["set-cookie"],
      },
    }
  }

  const mockMicrosoftTokenAndProfile = (profile: {
    mail?: string
    userPrincipalName?: string
  }) => {
    const tokenPool = installHttpMocking().get(
      "https://login.microsoftonline.com"
    )
    tokenPool
      .intercept({
        method: "POST",
        path: "/common/oauth2/v2.0/token",
      })
      .reply(200, {
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
        expires_in: 3600,
        token_type: "Bearer",
      })

    const graphPool = installHttpMocking().get("https://graph.microsoft.com")
    graphPool
      .intercept({
        method: "GET",
        path: "/v1.0/me?$select=displayName,mail,userPrincipalName",
      })
      .reply(200, profile)
  }

  it("reuses existing sharepoint connection by normalized account, updates expiry, and marks redirect", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      async () => {
        const nowSpy = jest.spyOn(Date, "now").mockReturnValue(1_000_000)

        await config.doInContext(config.getDevWorkspaceId(), async () => {
          await createKnowledgeSourceConnection({
            sourceType: AgentKnowledgeSourceType.SHAREPOINT,
            account: "USER@EXAMPLE.COM",
            tokenEndpoint:
              "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            accessToken: "old-access-token",
            refreshToken: "old-refresh-token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
            clientId: "client-id",
            clientSecret: "client-secret",
          })
        })

        const { state, callbackHeaders } = await startOauthAndGetState()
        mockMicrosoftTokenAndProfile({ mail: "user@example.com" })

        const callbackResponse = await config
          .getRequest()!
          .get("/api/agent/knowledge-sources/sharepoint/callback")
          .query({
            state,
            code: "oauth-code",
          })
          .set(callbackHeaders)
          .expect(302)

        expect(String(callbackResponse.headers.location)).toContain(
          "microsoft_connection_reused=1"
        )

        const connections = await config.doInContext(
          config.getDevWorkspaceId(),
          async () => {
            return await sdk.ai.knowledgeSources.listKnowledgeSourceConnections()
          }
        )
        expect(connections).toHaveLength(1)
        expect(connections[0].account).toBe("user@example.com")
        expect(connections[0].expiresAt).toBe(1_000_000 + (3600 - 60) * 1000)

        nowSpy.mockRestore()
      }
    )
  })

  it("creates a new connection when oauth account is unknown", async () => {
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.AI_RAG]: true },
      async () => {
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          await createKnowledgeSourceConnection({
            sourceType: AgentKnowledgeSourceType.SHAREPOINT,
            account: "existing@example.com",
            tokenEndpoint:
              "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            accessToken: "old-access-token",
            refreshToken: "old-refresh-token",
            tokenType: "Bearer",
            expiresAt: Date.now() + 60_000,
            clientId: "client-id",
            clientSecret: "client-secret",
          })
        })

        const { state, callbackHeaders } = await startOauthAndGetState()
        mockMicrosoftTokenAndProfile({})

        const callbackResponse = await config
          .getRequest()!
          .get("/api/agent/knowledge-sources/sharepoint/callback")
          .query({
            state,
            code: "oauth-code",
          })
          .set(callbackHeaders)
          .expect(302)

        expect(String(callbackResponse.headers.location)).not.toContain(
          "microsoft_connection_reused=1"
        )

        const connections = await config.doInContext(
          config.getDevWorkspaceId(),
          async () => {
            return await sdk.ai.knowledgeSources.listKnowledgeSourceConnections()
          }
        )
        expect(connections).toHaveLength(2)
        expect(connections.some(c => c.account === "unknown")).toBe(true)
      }
    )
  })
})

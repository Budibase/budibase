import {
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  SourceName,
  type Datasource,
} from "@budibase/types"
import {
  calculateBufferedTokenExpiry,
  upsertDelegatedSharePointAuthConfig,
} from "./sharepointAuth"
import sdk from "../../../sdk"
import * as sharePointCredentials from "../../../sdk/workspace/ai/knowledgeSources/sharepoint/credentials"
import tk from "timekeeper"

jest.mock(
  "../../../sdk/workspace/ai/knowledgeSources/sharepoint/credentials",
  () => ({
    saveSharePointCredential: jest.fn(),
  })
)

describe("calculateBufferedTokenExpiry", () => {
  beforeEach(() => {
    tk.reset()
  })

  it("applies a 60 second safety buffer for normal token ttl", () => {
    tk.freeze(new Date(1_000_000))

    expect(calculateBufferedTokenExpiry(3600)).toBe(
      1_000_000 + (3600 - 60) * 1000
    )
  })

  it("returns current time when ttl equals the buffer", () => {
    tk.freeze(new Date(2_000_000))

    expect(calculateBufferedTokenExpiry(60)).toBe(2_000_000)
  })

  it("never returns a past expiry when ttl is smaller than the buffer", () => {
    tk.freeze(new Date(3_000_000))

    expect(calculateBufferedTokenExpiry(30)).toBe(3_000_000)
  })
})

describe("upsertDelegatedSharePointAuthConfig", () => {
  const datasourceId = "datasource_1"

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const delegatedCredentials = {
    account: "person@example.com",
    accessToken: "access-token",
    refreshToken: "refresh-token",
    tokenType: "Bearer",
    expiresAt: 123456,
    tokenEndpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    clientId: "client-id",
    clientSecret: "client-secret",
  }

  const datasource = (authConfigs: any[] = []): Datasource => ({
    _id: datasourceId,
    _rev: "1",
    type: "datasource",
    source: SourceName.REST,
    name: "Microsoft SharePoint",
    restTemplateId: "microsoft-sharepoint",
    config: {
      url: "https://graph.microsoft.com/v1.0",
      authConfigs,
    },
  })

  it("creates a delegated OAuth auth config on the SharePoint datasource", async () => {
    jest.spyOn(sdk.datasources, "get").mockResolvedValue(datasource())
    const save = jest
      .spyOn(sdk.datasources, "save")
      .mockResolvedValue({} as any)
    const saveCredential = jest.mocked(
      sharePointCredentials.saveSharePointCredential
    )
    saveCredential.mockResolvedValue(undefined)

    const result = await upsertDelegatedSharePointAuthConfig(
      "app_1",
      datasourceId,
      undefined,
      delegatedCredentials
    )

    const savedDatasource = save.mock.calls[0][0] as Datasource
    const authConfig = savedDatasource.config!.authConfigs[0]
    expect(result.reusedExistingConnection).toBe(false)
    expect(authConfig).toEqual(
      expect.objectContaining({
        type: RestAuthType.OAUTH2,
        authType: "delegated_oauth",
        name: "Microsoft SharePoint (person@example.com)",
        account: "person@example.com",
        url: delegatedCredentials.tokenEndpoint,
        clientId: delegatedCredentials.clientId,
        method: OAuth2CredentialsMethod.BODY,
        grantType: OAuth2GrantType.AUTHORIZATION_CODE,
      })
    )
    expect(saveCredential).toHaveBeenCalledWith(
      expect.objectContaining({
        datasourceId,
        authConfigId: authConfig._id,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      })
    )
  })

  it("reuses an existing delegated config for the same account", async () => {
    jest.spyOn(sdk.datasources, "get").mockResolvedValue(
      datasource([
        {
          _id: "auth_existing",
          type: RestAuthType.OAUTH2,
          authType: "delegated_oauth",
          name: "Existing",
          account: "person@example.com",
          url: delegatedCredentials.tokenEndpoint,
          clientId: "old-client-id",
          clientSecret: "old-secret",
          method: OAuth2CredentialsMethod.BODY,
          grantType: OAuth2GrantType.AUTHORIZATION_CODE,
        },
      ])
    )
    const save = jest
      .spyOn(sdk.datasources, "save")
      .mockResolvedValue({} as any)

    const result = await upsertDelegatedSharePointAuthConfig(
      "app_1",
      datasourceId,
      undefined,
      delegatedCredentials
    )

    const savedDatasource = save.mock.calls[0][0] as Datasource
    expect(result).toEqual({
      authConfigId: "auth_existing",
      reusedExistingConnection: true,
    })
    expect(savedDatasource.config!.authConfigs).toHaveLength(1)
    expect(savedDatasource.config!.authConfigs[0].clientId).toBe("client-id")
  })
})

import {
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  SourceName,
  type Datasource,
  type RestAuthConfig,
} from "@budibase/types"
import { deriveKnowledgeConnections } from "./knowledgeConnectionsUtils"

const sharePointDatasource = (authConfigs: RestAuthConfig[]): Datasource => ({
  _id: "datasource_1",
  type: "datasource",
  source: SourceName.REST,
  restTemplateId: "microsoft-sharepoint",
  config: { authConfigs },
})

describe("deriveKnowledgeConnections", () => {
  it("distinguishes a SharePoint datasource with Basic Auth from no datasource", () => {
    const result = deriveKnowledgeConnections([
      sharePointDatasource([
        {
          _id: "auth_1",
          name: "Basic Auth",
          type: RestAuthType.BASIC,
          config: { username: "user", password: "password" },
        },
      ]),
    ])

    expect(result.connections).toEqual([])
    expect(result.sharePointDatasourceIds).toEqual(["datasource_1"])
  })

  it("returns OAuth2 client credentials as compatible connections", () => {
    const result = deriveKnowledgeConnections([
      sharePointDatasource([
        {
          _id: "auth_1",
          name: "Agent Knowledge",
          type: RestAuthType.OAUTH2,
          url: "https://login.microsoftonline.com/tenant/oauth2/v2.0/token",
          clientId: "client-id",
          clientSecret: "client-secret",
          method: OAuth2CredentialsMethod.BODY,
          grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
        },
      ]),
    ])

    expect(result.connections).toEqual([
      expect.objectContaining({
        datasourceId: "datasource_1",
        authConfigId: "auth_1",
      }),
    ])
  })
})

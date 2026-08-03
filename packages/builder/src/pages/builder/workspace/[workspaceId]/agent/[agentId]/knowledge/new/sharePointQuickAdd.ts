import {
  MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  RestAuthType,
  type Datasource,
  type RestConfig,
  type UIIntegration,
} from "@budibase/types"

export const SHAREPOINT_CONNECTION_NAME = "Microsoft SharePoint"

export interface SharePointQuickAddCredentials {
  tenantId: string
  clientId: string
  clientSecret: string
}

interface CreateSharePointDatasourceParams {
  integration: UIIntegration
  config: RestConfig
  name: string
  restTemplateId: typeof MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID
}

interface UpdateSharePointDatasourceParams {
  integration: UIIntegration
  datasource: Datasource
}

export const buildSharePointConnectionConfig = ({
  credentials,
  authConfigId,
}: {
  credentials: SharePointQuickAddCredentials
  authConfigId: string
}): RestConfig => {
  const tenantId = credentials.tenantId.trim()

  return {
    url: "https://graph.microsoft.com",
    defaultHeaders: {},
    defaultQueryParameters: {},
    staticVariables: {},
    rejectUnauthorized: true,
    downloadImages: true,
    authConfigs: [
      {
        _id: authConfigId,
        name: "Client credentials",
        type: RestAuthType.OAUTH2,
        url: `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
        clientId: credentials.clientId.trim(),
        clientSecret: credentials.clientSecret.trim(),
        method: OAuth2CredentialsMethod.BODY,
        grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
        scope: "https://graph.microsoft.com/.default",
      },
    ],
  }
}

export const saveSharePointQuickDatasource = async ({
  credentials,
  authConfigId,
  integration,
  existingDatasource,
  createDatasource,
  updateDatasource,
}: {
  credentials: SharePointQuickAddCredentials
  authConfigId: string
  integration: UIIntegration
  existingDatasource?: Datasource
  createDatasource: (
    _params: CreateSharePointDatasourceParams
  ) => Promise<Datasource>
  updateDatasource: (
    _params: UpdateSharePointDatasourceParams
  ) => Promise<Datasource>
}) => {
  const config = buildSharePointConnectionConfig({
    credentials,
    authConfigId,
  })

  if (existingDatasource) {
    return await updateDatasource({
      integration,
      datasource: {
        ...existingDatasource,
        config,
      },
    })
  }

  return await createDatasource({
    integration,
    config,
    name: SHAREPOINT_CONNECTION_NAME,
    restTemplateId: MICROSOFT_SHAREPOINT_REST_TEMPLATE_ID,
  })
}

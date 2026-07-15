import {
  type Datasource,
  type RestAuthConfig,
  isOAuth2ClientCredentialsAuthConfig,
} from "@budibase/types"

export interface KnowledgeConnection {
  _id: string
  datasourceId: string
  authConfigId: string
  sourceType: "sharepoint"
  authType: "client_credentials"
  datasourceName: string
  authConfigName: string
}

export interface KnowledgeConnectionsState {
  connections: KnowledgeConnection[]
  sharePointDatasourceIds: string[]
}

export const deriveKnowledgeConnections = (
  list: Datasource[]
): KnowledgeConnectionsState => {
  const sharePointDatasources = list.filter(
    datasource =>
      (datasource.restTemplateId || datasource.restTemplate) ===
      "microsoft-sharepoint"
  )
  const connections = sharePointDatasources.flatMap(datasource => {
    const authConfigs = (datasource.config?.authConfigs ||
      []) as RestAuthConfig[]
    return authConfigs
      .filter(config => isOAuth2ClientCredentialsAuthConfig(config))
      .map(config => ({
        _id: `${datasource._id}:${config._id}`,
        datasourceId: datasource._id!,
        authConfigId: config._id,
        sourceType: "sharepoint" as const,
        authType: "client_credentials" as const,
        datasourceName: datasource.name || "Datasource",
        authConfigName: config.name || "OAuth2 config",
      }))
  })

  return {
    connections,
    sharePointDatasourceIds: sharePointDatasources.flatMap(datasource =>
      datasource._id ? [datasource._id] : []
    ),
  }
}

import { context, encryption, utils } from "@budibase/backend-core"
import {
  Datasource,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  OAuth2RestAuthConfig,
  RestAuthType,
  SourceName,
  isOAuth2DelegatedAuthConfig,
} from "@budibase/types"
import sdk from "../../../../"
import { saveDelegatedOAuthCredential } from "./credentials"

interface DelegatedSharePointCredentials {
  account: string
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
  tokenEndpoint: string
  clientId: string
  clientSecret: string
}

const isSharePointDatasource = (datasource: Datasource) => {
  return (
    datasource.source === SourceName.REST &&
    datasource.restTemplateId === "microsoft-sharepoint"
  )
}

const generateUniqueAuthConfigId = (
  authConfigs: OAuth2RestAuthConfig[],
  datasourceId: string
) => {
  const existingIds = new Set(authConfigs.map(config => config._id))
  let nextId = ""
  do {
    nextId = `${datasourceId}_auth_${utils.newid()}`
  } while (existingIds.has(nextId))
  return nextId
}

export const upsertDelegatedSharePointAuthConfig = async (
  appId: string,
  datasourceId: string,
  authConfigId: string | undefined,
  credentials: DelegatedSharePointCredentials,
  scope: string
) => {
  return context.doInWorkspaceContext(appId, async () => {
    const account = credentials.account.trim() || "unknown"
    const datasource = await sdk.datasources.get(datasourceId)
    if (!isSharePointDatasource(datasource)) {
      throw new Error(
        "SharePoint OAuth can only be used with SharePoint datasources"
      )
    }

    const authConfigs = (
      (datasource.config?.authConfigs || []) as OAuth2RestAuthConfig[]
    ).filter(Boolean)

    const explicitConfig = authConfigId
      ? authConfigs.find(config => config._id === authConfigId)
      : undefined
    if (authConfigId && !explicitConfig) {
      throw new Error("SharePoint auth config not found on datasource")
    }

    const matchingConfig =
      explicitConfig ||
      authConfigs.find(
        config =>
          isOAuth2DelegatedAuthConfig(config) &&
          config.account?.toLowerCase() === account.toLowerCase()
      )
    const nextAuthConfig = {
      ...(matchingConfig || {}),
      _id:
        matchingConfig?._id ||
        generateUniqueAuthConfigId(authConfigs, datasourceId),
      type: RestAuthType.DELEGATED_OAUTH,
      name: matchingConfig?.name || `Microsoft SharePoint (${account})`,
      account,
      url: credentials.tokenEndpoint,
      clientId: credentials.clientId,
      clientSecret: encryption.encrypt(credentials.clientSecret),
      method: OAuth2CredentialsMethod.BODY,
      grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
      scope,
    }
    const nextAuthConfigs = matchingConfig
      ? authConfigs.map(config =>
          config._id === matchingConfig._id ? nextAuthConfig : config
        )
      : [...authConfigs, nextAuthConfig]

    await sdk.datasources.save({
      ...datasource,
      config: {
        ...datasource.config,
        authConfigs: nextAuthConfigs,
      },
    })

    await saveDelegatedOAuthCredential({
      authConfigId: nextAuthConfig._id,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      tokenType: credentials.tokenType,
      expiresAt: credentials.expiresAt,
    })

    return {
      authConfigId: nextAuthConfig._id,
      reusedExistingConnection: !!matchingConfig,
    }
  })
}

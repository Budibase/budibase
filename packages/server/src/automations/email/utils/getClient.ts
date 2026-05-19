import { blacklist } from "@budibase/backend-core"
import {
  EmailTriggerAuthType,
  EmailTriggerInputs,
  OAuth2RestAuthConfig,
  RestAuthConfig,
  RestAuthType,
} from "@budibase/types"
import { ImapFlow } from "imapflow"
import sdk from "../../../sdk"
import {
  getToken,
  getTokenFromConfig,
} from "../../../sdk/workspace/oauth2/utils"

const stripBearerPrefix = (token: string) => token.slice("Bearer ".length)

const getLegacyOAuth2AccessToken = async (authConfigId: string) => {
  const token = await getToken(authConfigId)
  return stripBearerPrefix(token)
}

const getOAuth2AccessToken = async (
  datasourceId: string,
  authConfigId: string
) => {
  if (datasourceId !== authConfigId) {
    let datasource: Awaited<ReturnType<typeof sdk.datasources.get>>
    try {
      datasource = await sdk.datasources.get(datasourceId)
    } catch {
      // Not a REST datasource — fall through to legacy OAuth2 lookup
      return getLegacyOAuth2AccessToken(authConfigId)
    }

    const oauth2Config = datasource.config?.authConfigs?.find(
      (config: RestAuthConfig) =>
        config._id === authConfigId && config.type === RestAuthType.OAUTH2
    ) as OAuth2RestAuthConfig | undefined

    if (!oauth2Config) {
      throw new Error("OAuth2 auth config not found")
    }

    const token = await getTokenFromConfig(
      `${datasourceId}:${authConfigId}`,
      oauth2Config
    )
    return stripBearerPrefix(token)
  }

  return getLegacyOAuth2AccessToken(authConfigId)
}

const resolveOAuth2Ids = (inputs: EmailTriggerInputs) => {
  if (inputs.datasourceId && inputs.authConfigId) {
    return {
      datasourceId: inputs.datasourceId,
      authConfigId: inputs.authConfigId,
    }
  }

  const legacyId = (inputs as EmailTriggerInputs & { oauth2ConfigId?: string })
    .oauth2ConfigId
  if (legacyId) {
    return { datasourceId: legacyId, authConfigId: legacyId }
  }

  return null
}

const getAuthConfig = async (inputs: EmailTriggerInputs) => {
  const authType = inputs.authType || EmailTriggerAuthType.PASSWORD

  if (authType === EmailTriggerAuthType.OAUTH2) {
    const oauth2Ids = resolveOAuth2Ids(inputs)
    if (!oauth2Ids) {
      throw new Error("OAuth2 connection is required")
    }
    const accessToken = await getOAuth2AccessToken(
      oauth2Ids.datasourceId,
      oauth2Ids.authConfigId
    )
    return {
      user: inputs.username,
      accessToken,
    }
  }

  if (!inputs.password) {
    throw new Error("IMAP password is required")
  }

  return {
    user: inputs.username,
    pass: inputs.password,
  }
}

export const getClient = async (inputs: EmailTriggerInputs) => {
  if (!inputs) {
    throw new Error("Email trigger inputs are required")
  }

  if (await blacklist.isBlacklisted(inputs.host)) {
    throw new Error("IMAP host is blocked or could not be resolved safely")
  }

  const client = new ImapFlow({
    host: inputs.host,
    port: inputs.port,
    secure: inputs.secure,
    auth: await getAuthConfig(inputs),
    // imap flow has its own pino instance enabled by default and is very very chatty!
    logger: false,
  })

  return client
}

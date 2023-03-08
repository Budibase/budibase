import {
  events,
  DocumentType,
  SEPARATOR,
  UNICODE_MAX,
} from "@budibase/backend-core"
import {
  Config,
  isSMTPConfig,
  isGoogleConfig,
  isOIDCConfig,
  isSettingsConfig,
  ConfigType,
} from "@budibase/types"
import env from "./../../../../environment"

export const getConfigParams = () => {
  return {
    include_docs: true,
    startkey: `${DocumentType.CONFIG}${SEPARATOR}`,
    endkey: `${DocumentType.CONFIG}${SEPARATOR}${UNICODE_MAX}`,
  }
}

const getConfigs = async (globalDb: any): Promise<Config[]> => {
  const response = await globalDb.allDocs(getConfigParams())
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (
  globalDb: any,
  timestamp: string | number | undefined
) => {
  const configs = await getConfigs(globalDb)

  for (const config of configs) {
    if (isSMTPConfig(config)) {
      await events.email.SMTPCreated(timestamp)
    }
    if (isGoogleConfig(config)) {
      await events.auth.SSOCreated(ConfigType.GOOGLE, timestamp)
      if (config.config.activated) {
        await events.auth.SSOActivated(ConfigType.GOOGLE, timestamp)
      }
    }
    if (isOIDCConfig(config)) {
      await events.auth.SSOCreated(ConfigType.OIDC, timestamp)
      if (config.config.configs[0].activated) {
        await events.auth.SSOActivated(ConfigType.OIDC, timestamp)
      }
    }
    if (isSettingsConfig(config)) {
      const company = config.config.company
      if (company && company !== "Budibase") {
        await events.org.nameUpdated(timestamp)
      }

      const logoUrl = config.config.logoUrl
      if (logoUrl) {
        await events.org.logoUpdated(timestamp)
      }

      const platformUrl = config.config.platformUrl
      if (
        platformUrl &&
        platformUrl !== "http://localhost:10000" &&
        env.SELF_HOSTED
      ) {
        await events.org.platformURLUpdated(timestamp)
      }
    }
  }
}

import { events, db } from "@budibase/backend-core"
import {
  Config,
  isSMTPConfig,
  isGoogleConfig,
  isOIDCConfig,
  isSettingsConfig,
} from "@budibase/types"
import env from "./../../../../environment"

const getConfigs = async (globalDb: any): Promise<Config[]> => {
  const response = await globalDb.allDocs(
    db.getConfigParams(
      {},
      {
        include_docs: true,
      }
    )
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (globalDb: any) => {
  const configs = await getConfigs(globalDb)

  for (const config of configs) {
    if (isSMTPConfig(config)) {
      await events.email.SMTPCreated(config)
    }
    if (isGoogleConfig(config)) {
      await events.auth.SSOCreated("google")
      if (config.config.activated) {
        await events.auth.SSOActivated("google")
      }
    }
    if (isOIDCConfig(config)) {
      await events.auth.SSOCreated("oidc")
      if (config.config.configs[0].activated) {
        await events.auth.SSOActivated("oidc")
      }
    }
    if (isSettingsConfig(config)) {
      const company = config.config.company
      if (company && company !== "Budibase") {
        await events.org.nameUpdated()
      }

      const logoUrl = config.config.logoUrl
      if (logoUrl) {
        await events.org.logoUpdated()
      }

      const platformUrl = config.config.platformUrl
      if (
        platformUrl &&
        platformUrl !== "http://localhost:10000" &&
        env.SELF_HOSTED
      ) {
        await events.org.platformURLUpdated()
      }
    }
  }
}

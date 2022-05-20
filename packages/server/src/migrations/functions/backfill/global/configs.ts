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
      events.email.SMTPCreated(config)
    }
    if (isGoogleConfig(config)) {
      events.auth.SSOCreated("google")
      if (config.config.activated) {
        events.auth.SSOActivated("google")
      }
    }
    if (isOIDCConfig(config)) {
      events.auth.SSOCreated("oidc")
      if (config.config.configs[0].activated) {
        events.auth.SSOActivated("oidc")
      }
    }
    if (isSettingsConfig(config)) {
      const company = config.config.company
      if (company && company !== "Budibase") {
        events.org.nameUpdated()
      }

      const logoUrl = config.config.logoUrl
      if (logoUrl) {
        events.org.logoUpdated()
      }

      const platformUrl = config.config.platformUrl
      if (
        platformUrl &&
        platformUrl !== "http://localhost:10000" &&
        env.SELF_HOSTED
      ) {
        events.org.platformURLUpdated()
      }
    }
  }
}

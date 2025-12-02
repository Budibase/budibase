import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import { Config, ConfigType, FindConfigResponse } from "@budibase/types"

export function hasConfig<T = any>(doc: any): doc is Config<T> {
  return doc && typeof doc === "object" && "config" in doc
}

function ensureAuth(config: Config) {
  if (!hasConfig(config)) {
    ;(config as Config).config = {}
  }
  if (hasConfig(config) && config.config.auth == null) {
    config.config.auth = {
      type: "login",
      user: "",
      pass: "",
    }
  } else if (hasConfig(config) && config.config.auth) {
    config.config.auth.user ??= ""
    config.config.auth.pass ??= ""
  }
}

export async function fetchSmtp() {
  let smtpConfig: FindConfigResponse | null = null
  try {
    // Fetch the configs for smtp
    const smtpDoc = await API.getConfig(ConfigType.SMTP)
    if (!("_id" in smtpDoc)) {
      smtpConfig = {
        type: ConfigType.SMTP,
        config: {
          secure: true,
        },
      }
    } else {
      smtpConfig = smtpDoc
    }

    // Always attach the auth for the forms purpose -
    // this will be removed later if required
    ensureAuth(smtpConfig as Config)
  } catch (error) {
    notifications.error("Error fetching SMTP config")
    return null
  }
  return smtpConfig
}

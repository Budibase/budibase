import { API } from "@/api"
import { notifications } from "@budibase/bbui"
import { Config, ConfigType, FindConfigResponse } from "@budibase/types"

export function hasConfig<T = any>(doc: any): doc is Config<T> {
  return doc && typeof doc === "object" && "config" in doc
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
    if (!hasConfig(smtpConfig)) {
      ;(smtpConfig as Config).config = {}
    }
    if (hasConfig(smtpConfig) && smtpConfig.config.auth == null) {
      smtpConfig.config.auth = {
        type: "login",
      }
    }
  } catch (error) {
    notifications.error("Error fetching SMTP config")
    return null
  }
  return smtpConfig
}

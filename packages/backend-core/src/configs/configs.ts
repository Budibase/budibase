import {
  AIConfig,
  Config,
  ConfigType,
  GoogleConfig,
  GoogleInnerConfig,
  OIDCConfig,
  OIDCInnerConfig,
  OIDCLogosConfig,
  SCIMConfig,
  SCIMInnerConfig,
  SettingsConfig,
  SettingsInnerConfig,
  SMTPConfig,
  SMTPInnerConfig,
} from "@budibase/types"
import { DocumentType, SEPARATOR } from "../constants"
import { CacheKey, TTL, withCache } from "../cache"
import * as context from "../context"
import env from "../environment"

// UTILS

/**
 * Generates a new configuration ID.
 * @returns The new configuration ID which the config doc can be stored under.
 */
export function generateConfigID(type: ConfigType) {
  return `${DocumentType.CONFIG}${SEPARATOR}${type}`
}

export async function getConfig<T extends Config>(
  type: ConfigType
): Promise<T | undefined> {
  const db = context.getGlobalDB()
  try {
    // await to catch error
    return (await db.get(generateConfigID(type))) as T
  } catch (e: any) {
    if (e.status === 404) {
      return
    }
    throw e
  }
}

export async function save(
  config: Config
): Promise<{ id: string; rev: string }> {
  const db = context.getGlobalDB()
  return db.put(config)
}

// SETTINGS

export async function getSettingsConfigDoc(): Promise<SettingsConfig> {
  let config = await getConfig<SettingsConfig>(ConfigType.SETTINGS)

  if (!config) {
    config = {
      _id: generateConfigID(ConfigType.SETTINGS),
      type: ConfigType.SETTINGS,
      config: {},
    }
  }

  // overridden fields
  config.config.platformUrl = await getPlatformUrl({
    tenantAware: true,
    config: config.config,
  })
  config.config.analyticsEnabled = await analyticsEnabled({
    config: config.config,
  })

  return config
}

export async function getSettingsConfig(): Promise<SettingsInnerConfig> {
  return (await getSettingsConfigDoc()).config
}

export async function getPlatformUrl(
  opts: { tenantAware: boolean; config?: SettingsInnerConfig } = {
    tenantAware: true,
  }
) {
  let platformUrl = env.PLATFORM_URL || "http://localhost:10000"

  if (!env.SELF_HOSTED && env.MULTI_TENANCY && opts.tenantAware) {
    // cloud and multi tenant - add the tenant to the default platform url
    const tenantId = context.getTenantId()
    if (!platformUrl.includes("localhost:")) {
      platformUrl = platformUrl.replace("://", `://${tenantId}.`)
    }
  } else if (env.SELF_HOSTED) {
    const config = opts?.config
      ? opts.config
      : // direct to db to prevent infinite loop
        (await getConfig<SettingsConfig>(ConfigType.SETTINGS))?.config
    if (config?.platformUrl) {
      platformUrl = config.platformUrl
    }
  }

  return platformUrl
}

export const analyticsEnabled = async (opts?: {
  config?: SettingsInnerConfig
}) => {
  // cloud - always use the environment variable
  if (!env.SELF_HOSTED) {
    return !!env.ENABLE_ANALYTICS
  }

  // self host - prefer the settings doc
  // use cache as events have high throughput
  const enabledInDB = await withCache(
    CacheKey.ANALYTICS_ENABLED,
    TTL.ONE_DAY,
    async () => {
      const config = opts?.config
        ? opts.config
        : // direct to db to prevent infinite loop
          (await getConfig<SettingsConfig>(ConfigType.SETTINGS))?.config

      // need to do explicit checks in case the field is not set
      if (config?.analyticsEnabled === false) {
        return false
      } else if (config?.analyticsEnabled === true) {
        return true
      }
    }
  )

  if (enabledInDB !== undefined) {
    return enabledInDB
  }

  // fallback to the environment variable
  // explicitly check for 0 or false here, undefined or otherwise is treated as true
  const envEnabled: any = env.ENABLE_ANALYTICS
  if (envEnabled === 0 || envEnabled === false) {
    return false
  } else {
    return true
  }
}

// GOOGLE

async function getGoogleConfigDoc(): Promise<GoogleConfig | undefined> {
  return await getConfig<GoogleConfig>(ConfigType.GOOGLE)
}

export async function getGoogleConfig(): Promise<
  GoogleInnerConfig | undefined
> {
  const config = await getGoogleConfigDoc()
  return config?.config
}

export async function getGoogleDatasourceConfig(): Promise<
  GoogleInnerConfig | undefined
> {
  if (!env.SELF_HOSTED) {
    // always use the env vars in cloud
    return getDefaultGoogleConfig()
  }

  // prefer the config in self-host
  let config = await getGoogleConfig()

  // fallback to env vars
  if (!config || !config.activated) {
    config = getDefaultGoogleConfig()
  }

  return config
}

export function getDefaultGoogleConfig(): GoogleInnerConfig | undefined {
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    return {
      clientID: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      activated: true,
    }
  }
}

// OIDC

export async function getOIDCLogosDoc(): Promise<OIDCLogosConfig | undefined> {
  return getConfig<OIDCLogosConfig>(ConfigType.OIDC_LOGOS)
}

async function getOIDCConfigDoc(): Promise<OIDCConfig | undefined> {
  return getConfig<OIDCConfig>(ConfigType.OIDC)
}

export async function getOIDCConfig(): Promise<OIDCInnerConfig | undefined> {
  const config = (await getOIDCConfigDoc())?.config
  // default to the 0th config
  return config?.configs && config.configs[0]
}

/**
 * @param configId The config id of the inner config to retrieve
 */
export async function getOIDCConfigById(
  configId: string
): Promise<OIDCInnerConfig | undefined> {
  const config = (await getConfig<OIDCConfig>(ConfigType.OIDC))?.config
  return config && config.configs.filter((c: any) => c.uuid === configId)[0]
}

// SMTP

export async function getSMTPConfigDoc(): Promise<SMTPConfig | undefined> {
  return getConfig<SMTPConfig>(ConfigType.SMTP)
}

export async function getSMTPConfig(
  isAutomation?: boolean
): Promise<SMTPInnerConfig | undefined> {
  const config = await getSMTPConfigDoc()
  if (config) {
    return config.config
  }

  // always allow fallback in self host
  // in cloud don't allow for automations
  const allowFallback = env.SELF_HOSTED || !isAutomation

  // Use an SMTP fallback configuration from env variables
  if (env.SMTP_FALLBACK_ENABLED && allowFallback) {
    return {
      port: env.SMTP_PORT,
      host: env.SMTP_HOST!,
      secure: false,
      from: env.SMTP_FROM_ADDRESS!,
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASSWORD!,
      },
    }
  }
}

// SCIM

export async function getSCIMConfig(): Promise<SCIMInnerConfig | undefined> {
  const config = await getConfig<SCIMConfig>(ConfigType.SCIM)
  return config?.config
}

// AI

export async function getAIConfig(): Promise<AIConfig | undefined> {
  return getConfig<AIConfig>(ConfigType.AI)
}

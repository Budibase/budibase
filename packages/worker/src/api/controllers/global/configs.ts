import * as email from "../../../utilities/email"
import env from "../../../environment"
import { googleCallbackUrl, oidcCallbackUrl } from "./auth"
import {
  cache,
  configs,
  db as dbCore,
  env as coreEnv,
  events,
  objectStore,
  tenancy,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"
import {
  Config,
  ConfigType,
  Ctx,
  GetPublicOIDCConfigResponse,
  GetPublicSettingsResponse,
  GoogleInnerConfig,
  isGoogleConfig,
  isOIDCConfig,
  isSettingsConfig,
  isSMTPConfig,
  OIDCConfigs,
  SettingsBrandingConfig,
  SettingsInnerConfig,
  SSOConfig,
  SSOConfigType,
  UserCtx,
  OIDCLogosConfig,
} from "@budibase/types"
import * as pro from "@budibase/pro"

const getEventFns = async (config: Config, existing?: Config) => {
  const fns = []

  if (!existing) {
    if (isSMTPConfig(config)) {
      fns.push(events.email.SMTPCreated)
    } else if (isGoogleConfig(config)) {
      fns.push(() => events.auth.SSOCreated(ConfigType.GOOGLE))
      if (config.config.activated) {
        fns.push(() => events.auth.SSOActivated(ConfigType.GOOGLE))
      }
    } else if (isOIDCConfig(config)) {
      fns.push(() => events.auth.SSOCreated(ConfigType.OIDC))
      if (config.config.configs[0].activated) {
        fns.push(() => events.auth.SSOActivated(ConfigType.OIDC))
      }
    } else if (isSettingsConfig(config)) {
      // company
      const company = config.config.company
      if (company && company !== "Budibase") {
        fns.push(events.org.nameUpdated)
      }

      // logo
      const logoUrl = config.config.logoUrl
      if (logoUrl) {
        fns.push(events.org.logoUpdated)
      }

      // platform url
      const platformUrl = config.config.platformUrl
      if (
        platformUrl &&
        platformUrl !== "http://localhost:10000" &&
        env.SELF_HOSTED
      ) {
        fns.push(events.org.platformURLUpdated)
      }
    }
  } else {
    if (isSMTPConfig(config)) {
      fns.push(events.email.SMTPUpdated)
    } else if (isGoogleConfig(config)) {
      fns.push(() => events.auth.SSOUpdated(ConfigType.GOOGLE))
      if (!existing.config.activated && config.config.activated) {
        fns.push(() => events.auth.SSOActivated(ConfigType.GOOGLE))
      } else if (existing.config.activated && !config.config.activated) {
        fns.push(() => events.auth.SSODeactivated(ConfigType.GOOGLE))
      }
    } else if (isOIDCConfig(config)) {
      fns.push(() => events.auth.SSOUpdated(ConfigType.OIDC))
      if (
        !existing.config.configs[0].activated &&
        config.config.configs[0].activated
      ) {
        fns.push(() => events.auth.SSOActivated(ConfigType.OIDC))
      } else if (
        existing.config.configs[0].activated &&
        !config.config.configs[0].activated
      ) {
        fns.push(() => events.auth.SSODeactivated(ConfigType.OIDC))
      }
    } else if (isSettingsConfig(config)) {
      // company
      const existingCompany = existing.config.company
      const company = config.config.company
      if (company && company !== "Budibase" && existingCompany !== company) {
        fns.push(events.org.nameUpdated)
      }

      // logo
      const existingLogoUrl = existing.config.logoUrl
      const logoUrl = config.config.logoUrl
      if (logoUrl && existingLogoUrl !== logoUrl) {
        fns.push(events.org.logoUpdated)
      }

      // platform url
      const existingPlatformUrl = existing.config.platformUrl
      const platformUrl = config.config.platformUrl
      if (
        platformUrl &&
        platformUrl !== "http://localhost:10000" &&
        existingPlatformUrl !== platformUrl &&
        env.SELF_HOSTED
      ) {
        fns.push(events.org.platformURLUpdated)
      }
    }
  }

  return fns
}

type SSOConfigs = { [key in SSOConfigType]: SSOConfig | undefined }

async function getSSOConfigs(): Promise<SSOConfigs> {
  const google = await configs.getGoogleConfig()
  const oidc = await configs.getOIDCConfig()
  return {
    [ConfigType.GOOGLE]: google,
    [ConfigType.OIDC]: oidc,
  }
}

async function hasActivatedConfig(ssoConfigs?: SSOConfigs) {
  if (!ssoConfigs) {
    ssoConfigs = await getSSOConfigs()
  }
  return !!Object.values(ssoConfigs).find(c => c?.activated)
}

async function verifySettingsConfig(
  config: SettingsInnerConfig & SettingsBrandingConfig,
  existingConfig?: SettingsInnerConfig & SettingsBrandingConfig
) {
  if (config.isSSOEnforced) {
    const valid = await hasActivatedConfig()
    if (!valid) {
      throw new Error("Cannot enforce SSO without an activated configuration")
    }
  }

  // always preserve file attributes
  // these should be set via upload instead
  // only allow for deletion by checking empty string to bypass this behaviour

  if (existingConfig && config.logoUrl !== "") {
    config.logoUrl = existingConfig.logoUrl
    config.logoUrlEtag = existingConfig.logoUrlEtag
  }
  if (existingConfig && config.faviconUrl !== "") {
    config.faviconUrl = existingConfig.faviconUrl
    config.faviconUrlEtag = existingConfig.faviconUrlEtag
  }
}

async function verifySSOConfig(type: SSOConfigType, config: SSOConfig) {
  const settings = await configs.getSettingsConfig()
  if (settings.isSSOEnforced && !config.activated) {
    // config is being saved as deactivated
    // ensure there is at least one other activated sso config
    const ssoConfigs = await getSSOConfigs()

    // overwrite the config being updated
    // to reflect the desired state
    ssoConfigs[type] = config

    const activated = await hasActivatedConfig(ssoConfigs)
    if (!activated) {
      throw new Error(
        "Configuration cannot be deactivated while SSO is enforced"
      )
    }
  }
}

async function verifyGoogleConfig(config: GoogleInnerConfig) {
  await verifySSOConfig(ConfigType.GOOGLE, config)
}

async function verifyOIDCConfig(config: OIDCConfigs) {
  await verifySSOConfig(ConfigType.OIDC, config.configs[0])
}

export async function save(ctx: UserCtx<Config>) {
  const body = ctx.request.body
  const type = body.type
  const config = body.config

  const existingConfig = await configs.getConfig(type)
  let eventFns = await getEventFns(ctx.request.body, existingConfig)

  if (existingConfig) {
    body._rev = existingConfig._rev
  }

  try {
    // verify the configuration
    switch (type) {
      case ConfigType.SMTP:
        await email.verifyConfig(config)
        break
      case ConfigType.SETTINGS:
        await verifySettingsConfig(config, existingConfig?.config)
        break
      case ConfigType.GOOGLE:
        await verifyGoogleConfig(config)
        break
      case ConfigType.OIDC:
        await verifyOIDCConfig(config)
        break
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }

  // Ignore branding changes if the license does not permit it
  // Favicon and Logo Url are excluded.
  try {
    const brandingEnabled = await pro.features.isBrandingEnabled()
    if (existingConfig?.config && !brandingEnabled) {
      const {
        emailBrandingEnabled,
        testimonialsEnabled,
        platformTitle,
        metaDescription,
        loginHeading,
        loginButton,
        metaImageUrl,
        metaTitle,
      } = existingConfig.config

      body.config = {
        ...body.config,
        emailBrandingEnabled,
        testimonialsEnabled,
        platformTitle,
        metaDescription,
        loginHeading,
        loginButton,
        metaImageUrl,
        metaTitle,
      }
    }
  } catch (e) {
    console.error("There was an issue retrieving the license", e)
  }

  try {
    body._id = configs.generateConfigID(type)
    const response = await configs.save(body)
    await cache.bustCache(cache.CacheKey.CHECKLIST)
    await cache.bustCache(cache.CacheKey.ANALYTICS_ENABLED)

    for (const fn of eventFns) {
      await fn()
    }

    ctx.body = {
      type,
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }
}

function enrichOIDCLogos(oidcLogos: OIDCLogosConfig) {
  if (!oidcLogos) {
    return
  }
  oidcLogos.config = Object.keys(oidcLogos.config || {}).reduce(
    (acc: any, key: string) => {
      if (!key.endsWith("Etag")) {
        const etag = oidcLogos.config[`${key}Etag`]
        const objectStoreUrl = objectStore.getGlobalFileUrl(
          oidcLogos.type,
          key,
          etag
        )
        acc[key] = objectStoreUrl
      } else {
        acc[key] = oidcLogos.config[key]
      }
      return acc
    },
    {}
  )
}

export async function find(ctx: UserCtx) {
  try {
    // Find the config with the most granular scope based on context
    const type = ctx.params.type
    let scopedConfig = await configs.getConfig(type)

    if (scopedConfig) {
      if (type === ConfigType.OIDC_LOGOS) {
        enrichOIDCLogos(scopedConfig)
      }
      ctx.body = scopedConfig
    } else {
      // don't throw an error, there simply is nothing to return
      ctx.body = {}
    }
  } catch (err: any) {
    ctx.throw(err?.status || 400, err)
  }
}

export async function publicOidc(ctx: Ctx<void, GetPublicOIDCConfigResponse>) {
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig = await configs.getOIDCConfig()
    const oidcCustomLogos = await configs.getOIDCLogosDoc()

    if (oidcCustomLogos) {
      enrichOIDCLogos(oidcCustomLogos)
    }

    if (!oidcConfig) {
      ctx.body = []
    } else {
      ctx.body = [
        {
          logo: oidcCustomLogos?.config[oidcConfig.logo] ?? oidcConfig.logo,
          name: oidcConfig.name,
          uuid: oidcConfig.uuid,
        },
      ]
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function publicSettings(
  ctx: Ctx<void, GetPublicSettingsResponse>
) {
  try {
    // settings
    const configDoc = await configs.getSettingsConfigDoc()
    const config = configDoc.config

    const branding = await pro.branding.getBrandingConfig(config)

    // enrich the logo url - empty url means deleted
    if (config.logoUrl && config.logoUrl !== "") {
      config.logoUrl = objectStore.getGlobalFileUrl(
        "settings",
        "logoUrl",
        config.logoUrlEtag
      )
    }

    // enrich the favicon url - empty url means deleted
    const faviconUrl =
      branding.faviconUrl && branding.faviconUrl !== ""
        ? objectStore.getGlobalFileUrl(
            "settings",
            "faviconUrl",
            branding.faviconUrlEtag
          )
        : undefined

    // google
    const googleConfig = await configs.getGoogleConfig()
    const googleDatasourceConfigured =
      !!(await configs.getGoogleDatasourceConfig())
    const preActivated = googleConfig && googleConfig.activated == null
    const google = preActivated || !!googleConfig?.activated
    const _googleCallbackUrl = await googleCallbackUrl(googleConfig)

    // oidc
    const oidcConfig = await configs.getOIDCConfig()
    const oidc = oidcConfig?.activated || false
    const _oidcCallbackUrl = await oidcCallbackUrl()

    // sso enforced
    const isSSOEnforced = await pro.features.isSSOEnforced({ config })

    ctx.body = {
      type: ConfigType.SETTINGS,
      _id: configDoc._id,
      _rev: configDoc._rev,
      config: {
        ...config,
        ...branding,
        ...{ faviconUrl },
        google,
        googleDatasourceConfigured,
        oidc,
        isSSOEnforced,
        oidcCallbackUrl: _oidcCallbackUrl,
        googleCallbackUrl: _googleCallbackUrl,
      },
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function upload(ctx: UserCtx) {
  if (ctx.request.files == null || Array.isArray(ctx.request.files.file)) {
    ctx.throw(400, "One file must be uploaded.")
  }
  const file = ctx.request.files.file as any
  const { type, name } = ctx.params

  let bucket = coreEnv.GLOBAL_BUCKET_NAME
  const key = objectStore.getGlobalFileS3Key(type, name)

  const result = await objectStore.upload({
    bucket,
    filename: key,
    path: file.path,
    type: file.type,
  })

  // add to configuration structure
  let config = await configs.getConfig(type)
  if (!config) {
    config = {
      _id: configs.generateConfigID(type),
      type,
      config: {},
    }
  }

  // save the Etag for cache bursting
  const etag = result.ETag
  if (etag) {
    config.config[`${name}Etag`] = etag.replace(/"/g, "")
  }

  // save the file key
  config.config[`${name}`] = key

  // write back to db
  await configs.save(config)

  ctx.body = {
    message: "File has been uploaded and url stored to config.",
    url: objectStore.getGlobalFileUrl(type, name, etag),
  }
}

export async function destroy(ctx: UserCtx) {
  const db = tenancy.getGlobalDB()
  const { id, rev } = ctx.params
  try {
    await db.remove(id, rev)
    await cache.destroy(cache.CacheKey.CHECKLIST)
    ctx.body = { message: "Config deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function configChecklist(ctx: Ctx) {
  const tenantId = tenancy.getTenantId()

  try {
    ctx.body = await cache.withCache(
      cache.CacheKey.CHECKLIST,
      env.CHECKLIST_CACHE_TTL,
      async () => {
        let apps = []
        if (!env.MULTI_TENANCY || tenantId) {
          // Apps exist
          apps = await dbCore.getAllApps({ idsOnly: true, efficient: true })
        }

        // They have set up SMTP
        const smtpConfig = await configs.getSMTPConfig()

        // They have set up Google Auth
        const googleConfig = await configs.getGoogleConfig()

        // They have set up OIDC
        const oidcConfig = await configs.getOIDCConfig()

        // They have set up a global user
        const userExists = await checkAnyUserExists()
        return {
          apps: {
            checked: apps.length > 0,
            label: "Create your first app",
            link: "/builder/portal/apps",
          },
          smtp: {
            checked: !!smtpConfig,
            label: "Set up email",
            link: "/builder/portal/settings/email",
          },
          adminUser: {
            checked: userExists,
            label: "Create your first user",
            link: "/builder/portal/users/users",
          },
          sso: {
            checked: !!googleConfig || !!oidcConfig,
            label: "Set up single sign-on",
            link: "/builder/portal/settings/auth",
          },
        }
      }
    )
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

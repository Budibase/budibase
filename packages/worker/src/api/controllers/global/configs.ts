import * as email from "../../../utilities/email"
import env from "../../../environment"
import * as auth from "./auth"
import {
  BadRequestError,
  ForbiddenError,
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
  AIInnerConfig,
  Config,
  ConfigChecklistResponse,
  ConfigType,
  Ctx,
  DeleteConfigResponse,
  FindConfigResponse,
  GetPublicOIDCConfigResponse,
  GetPublicSettingsResponse,
  GoogleInnerConfig,
  isAIConfig,
  isGoogleConfig,
  isOIDCConfig,
  isRecaptchaConfig,
  isSettingsConfig,
  isSMTPConfig,
  OIDCConfigs,
  OIDCLogosConfig,
  PASSWORD_REPLACEMENT,
  RecaptchaInnerConfig,
  SaveConfigRequest,
  SaveConfigResponse,
  SettingsBrandingConfig,
  SettingsInnerConfig,
  SMTPInnerConfig,
  SSOConfig,
  SSOConfigType,
  UploadConfigFileResponse,
  UserCtx,
} from "@budibase/types"
import * as pro from "@budibase/pro"

const getEventFns = async (config: Config, existing?: Config) => {
  const fns = []

  if (!existing) {
    if (isSMTPConfig(config)) {
      fns.push(events.email.SMTPCreated)
    } else if (isAIConfig(config)) {
      fns.push(() => events.ai.AIConfigCreated)
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
    } else if (isAIConfig(config)) {
      fns.push(() => events.ai.AIConfigUpdated)
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

async function processSMTPConfig(
  config: SMTPInnerConfig,
  existingConfig?: SMTPInnerConfig
) {
  await email.verifyConfig(config)
  if (config.auth?.pass === PASSWORD_REPLACEMENT) {
    // if the password is being replaced, use the existing password
    if (existingConfig && existingConfig.auth?.pass) {
      config.auth.pass = existingConfig.auth.pass
    } else {
      // otherwise, throw an error
      throw new BadRequestError("SMTP password is required")
    }
  }
}

async function processSettingsConfig(
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

async function processGoogleConfig(
  config: GoogleInnerConfig,
  existing?: GoogleInnerConfig
) {
  await verifySSOConfig(ConfigType.GOOGLE, config)

  if (existing && config.clientSecret === PASSWORD_REPLACEMENT) {
    config.clientSecret = existing.clientSecret
  }
}

async function processOIDCConfig(config: OIDCConfigs, existing?: OIDCConfigs) {
  await verifySSOConfig(ConfigType.OIDC, config.configs[0])

  if (existing) {
    for (const c of config.configs) {
      const existingConfig = existing.configs.find(e => e.uuid === c.uuid)
      if (!existingConfig) {
        continue
      }
      if (c.clientSecret === PASSWORD_REPLACEMENT) {
        c.clientSecret = existingConfig.clientSecret
      }
    }
  }
}

export async function processAIConfig(
  newConfig: AIInnerConfig,
  existingConfig: AIInnerConfig
) {
  for (const key in existingConfig) {
    if (newConfig[key]?.apiKey === PASSWORD_REPLACEMENT) {
      newConfig[key].apiKey = existingConfig[key].apiKey
    }
  }

  let numBudibaseAI = 0
  for (const config of Object.values(newConfig)) {
    if (config.provider === "BudibaseAI") {
      numBudibaseAI++
      if (numBudibaseAI > 1) {
        throw new BadRequestError("Only one Budibase AI provider is allowed")
      }
    } else {
      if (!config.apiKey) {
        throw new BadRequestError(
          `API key is required for provider ${config.provider}`
        )
      }
    }
  }
}

export async function processRecaptchaConfig(
  config: RecaptchaInnerConfig,
  existingConfig?: RecaptchaInnerConfig
) {
  if (!(await pro.features.isRecaptchaEnabled())) {
    throw new ForbiddenError("License does not allow use of recaptcha")
  }
  if (config.secretKey === PASSWORD_REPLACEMENT && !existingConfig) {
    throw new BadRequestError("No secret key provided")
  }
  if (config.secretKey === PASSWORD_REPLACEMENT && existingConfig) {
    config.secretKey = existingConfig.secretKey
  }
}

export async function save(
  ctx: UserCtx<SaveConfigRequest, SaveConfigResponse>
) {
  const body = ctx.request.body
  const type = body.type
  const config = body.config

  const existingConfig = await configs.getConfig(type)
  let eventFns = await getEventFns(ctx.request.body, existingConfig)

  if (existingConfig) {
    body._rev = existingConfig._rev
  }

  try {
    switch (type) {
      case ConfigType.SMTP:
        await processSMTPConfig(config, existingConfig?.config)
        break
      case ConfigType.SETTINGS:
        await processSettingsConfig(config, existingConfig?.config)
        break
      case ConfigType.GOOGLE:
        await processGoogleConfig(config, existingConfig?.config)
        break
      case ConfigType.OIDC:
        await processOIDCConfig(config, existingConfig?.config)
        break
      case ConfigType.AI:
        if (existingConfig) {
          await processAIConfig(config, existingConfig.config)
        }
        break
      case ConfigType.RECAPTCHA:
        await processRecaptchaConfig(config, existingConfig?.config)
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

async function enrichOIDCLogos(oidcLogos: OIDCLogosConfig) {
  if (!oidcLogos) {
    return
  }
  const newConfig: Record<string, string> = {}
  const keys = Object.keys(oidcLogos.config || {})

  for (const key of keys) {
    if (!key.endsWith("Etag")) {
      const etag = oidcLogos.config[`${key}Etag`]
      const objectStoreUrl = await objectStore.getGlobalFileUrl(
        oidcLogos.type,
        key,
        etag
      )
      newConfig[key] = objectStoreUrl
    } else {
      newConfig[key] = oidcLogos.config[key]
    }
  }
  oidcLogos.config = newConfig
}

export async function find(ctx: UserCtx<void, FindConfigResponse>) {
  // Find the config with the most granular scope based on context
  const type = ctx.params.type
  let config = await configs.getConfig(type)

  if (!config && type === ConfigType.AI) {
    config = { type: ConfigType.AI, config: {} }
  }

  if (!config) {
    ctx.body = {}
    return
  }

  switch (type) {
    case ConfigType.OIDC_LOGOS:
      await enrichOIDCLogos(config)
      break
    case ConfigType.AI:
      await pro.sdk.ai.enrichAIConfig(config)
      break
  }

  stripSecrets(config)
  ctx.body = config
}

function stripSecrets(config: Config) {
  if (isAIConfig(config)) {
    for (const key in config.config) {
      if (config.config[key].apiKey) {
        config.config[key].apiKey = PASSWORD_REPLACEMENT
      }
    }
  } else if (isSMTPConfig(config)) {
    if (config.config.auth?.pass) {
      config.config.auth.pass = PASSWORD_REPLACEMENT
    }
  } else if (isGoogleConfig(config)) {
    config.config.clientSecret = PASSWORD_REPLACEMENT
  } else if (isOIDCConfig(config)) {
    for (const c of config.config.configs) {
      c.clientSecret = PASSWORD_REPLACEMENT
    }
  } else if (isRecaptchaConfig(config)) {
    config.config.secretKey = PASSWORD_REPLACEMENT
  }
}

export async function publicOidc(ctx: Ctx<void, GetPublicOIDCConfigResponse>) {
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig = await configs.getOIDCConfig()
    const oidcCustomLogos = await configs.getOIDCLogosDoc()

    if (oidcCustomLogos) {
      await enrichOIDCLogos(oidcCustomLogos)
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
    const [configDoc, googleConfig] = await Promise.all([
      configs.getSettingsConfigDoc(),
      configs.getGoogleConfig(),
    ])
    const config = configDoc.config

    const brandingPromise = pro.branding.getBrandingConfig(config)

    const getLogoUrl = () => {
      // enrich the logo url - empty url means deleted
      if (config.logoUrl && config.logoUrl !== "") {
        return objectStore.getGlobalFileUrl(
          "settings",
          "logoUrl",
          config.logoUrlEtag
        )
      }
    }

    // google
    const googleDatasourcePromise = configs.getGoogleDatasourceConfig()
    const preActivated = googleConfig && googleConfig.activated == null
    const google = preActivated || !!googleConfig?.activated
    const googleCallbackUrlPromise = auth.googleCallbackUrl(googleConfig)

    // oidc
    const oidcConfigPromise = configs.getOIDCConfig()
    const oidcCallbackUrlPromise = auth.oidcCallbackUrl()

    // sso enforced
    const isSSOEnforcedPromise = pro.features.isSSOEnforced({ config })

    // performance all async work at same time, there is no need for all of these
    // operations to occur in sync, slowing the endpoint down significantly
    const [
      branding,
      googleDatasource,
      googleCallbackUrl,
      oidcConfig,
      oidcCallbackUrl,
      isSSOEnforced,
      logoUrl,
    ] = await Promise.all([
      brandingPromise,
      googleDatasourcePromise,
      googleCallbackUrlPromise,
      oidcConfigPromise,
      oidcCallbackUrlPromise,
      isSSOEnforcedPromise,
      getLogoUrl(),
    ])

    // enrich the favicon url - empty url means deleted
    const faviconUrl =
      branding.faviconUrl && branding.faviconUrl !== ""
        ? await objectStore.getGlobalFileUrl(
            "settings",
            "faviconUrl",
            branding.faviconUrlEtag
          )
        : undefined

    const oidc = oidcConfig?.activated || false
    const googleDatasourceConfigured = !!googleDatasource
    if (logoUrl) {
      config.logoUrl = logoUrl
    }

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
        oidcCallbackUrl,
        googleCallbackUrl,
      },
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function upload(ctx: UserCtx<void, UploadConfigFileResponse>) {
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
    url: await objectStore.getGlobalFileUrl(type, name, etag),
  }
}

export async function destroy(ctx: UserCtx<void, DeleteConfigResponse>) {
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

export async function configChecklist(ctx: Ctx<void, ConfigChecklistResponse>) {
  const tenantId = tenancy.getTenantId()

  try {
    ctx.body = await cache.withCache(
      cache.CacheKey.CHECKLIST,
      env.CHECKLIST_CACHE_TTL,
      async (): Promise<ConfigChecklistResponse> => {
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

        // They have set up branding
        const configDoc = await configs.getSettingsConfigDoc()
        const config = configDoc.config
        const branding = await pro.branding.getBrandingConfig(config)

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
            fallback: smtpConfig?.fallback || false,
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
          branding,
        }
      }
    )
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

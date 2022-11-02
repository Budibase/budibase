const {
  generateConfigID,
  getConfigParams,
  getScopedFullConfig,
  getAllApps,
} = require("@budibase/backend-core/db")
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const env = require("../../../environment")
const { googleCallbackUrl, oidcCallbackUrl } = require("./auth")
const {
  withCache,
  CacheKeys,
  bustCache,
  cache,
} = require("@budibase/backend-core/cache")
const { checkAnyUserExists } = require("../../../utilities/users")
import {
  Config,
  ConfigType,
  isGoogleConfig,
  isOIDCConfig,
  isSettingsConfig,
  isSMTPConfig,
  OIDCConfig,
  Ctx,
  UserCtx,
} from "@budibase/types"
import { events, objectStore, env as coreEnv } from "@budibase/backend-core"

const getEventFns = async (db: any, config: Config) => {
  const fns = []

  let existing
  if (config._id) {
    existing = await db.get(config._id)
  }

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

export const save = async function (ctx: UserCtx) {
  const db = getGlobalDB()
  const { type, workspace, user, config } = ctx.request.body
  let eventFns = await getEventFns(db, ctx.request.body)
  // Config does not exist yet
  if (!ctx.request.body._id) {
    ctx.request.body._id = generateConfigID({
      type,
      workspace,
      user,
    })
  }
  try {
    // verify the configuration
    switch (type) {
      case Configs.SMTP:
        await email.verifyConfig(config)
        break
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }

  try {
    const response = await db.put(ctx.request.body)
    await bustCache(CacheKeys.CHECKLIST)
    await bustCache(CacheKeys.ANALYTICS_ENABLED)

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

export const fetch = async function (ctx: UserCtx) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getConfigParams(
      { type: ctx.params.type },
      {
        include_docs: true,
      }
    )
  )
  ctx.body = response.rows.map((row: any) => row.doc)
}

/**
 * Gets the most granular config for a particular configuration type.
 * The hierarchy is type -> workspace -> user.
 */
export const find = async function (ctx: UserCtx) {
  const db = getGlobalDB()

  const { userId, workspaceId } = ctx.query
  if (workspaceId && userId) {
    const workspace = await db.get(workspaceId)
    const userInWorkspace = workspace.users.some(
      (workspaceUser: any) => workspaceUser === userId
    )
    if (!ctx.user!.admin && !userInWorkspace) {
      ctx.throw(400, `User is not in specified workspace: ${workspace}.`)
    }
  }

  try {
    // Find the config with the most granular scope based on context
    const scopedConfig = await getScopedFullConfig(db, {
      type: ctx.params.type,
      user: userId,
      workspace: workspaceId,
    })

    if (scopedConfig) {
      ctx.body = scopedConfig
    } else {
      // don't throw an error, there simply is nothing to return
      ctx.body = {}
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export const publicOidc = async function (ctx: Ctx) {
  const db = getGlobalDB()
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig: OIDCConfig = await getScopedFullConfig(db, {
      type: Configs.OIDC,
    })

    if (!oidcConfig) {
      ctx.body = {}
    } else {
      ctx.body = oidcConfig.config.configs.map(config => ({
        logo: config.logo,
        name: config.name,
        uuid: config.uuid,
      }))
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export const publicSettings = async function (ctx: Ctx) {
  const db = getGlobalDB()

  try {
    // Find the config with the most granular scope based on context
    const publicConfig = await getScopedFullConfig(db, {
      type: Configs.SETTINGS,
    })

    const googleConfig = await getScopedFullConfig(db, {
      type: Configs.GOOGLE,
    })

    const oidcConfig = await getScopedFullConfig(db, {
      type: Configs.OIDC,
    })

    let config
    if (!publicConfig) {
      config = {
        config: {},
      }
    } else {
      config = publicConfig
    }

    // enrich the logo url
    // empty url means deleted
    if (config.config.logoUrl !== "") {
      config.config.logoUrl = objectStore.getGlobalFileUrl(
        "settings",
        "logoUrl",
        config.config.logoUrlEtag
      )
    }

    // google button flag
    if (googleConfig && googleConfig.config) {
      // activated by default for configs pre-activated flag
      config.config.google =
        googleConfig.config.activated == null || googleConfig.config.activated
    } else {
      config.config.google = false
    }

    // callback urls
    config.config.oidcCallbackUrl = await oidcCallbackUrl()
    config.config.googleCallbackUrl = await googleCallbackUrl()

    // oidc button flag
    if (oidcConfig && oidcConfig.config) {
      config.config.oidc = oidcConfig.config.configs[0].activated
    } else {
      config.config.oidc = false
    }

    ctx.body = config
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export const upload = async function (ctx: UserCtx) {
  if (ctx.request.files == null || Array.isArray(ctx.request.files.file)) {
    ctx.throw(400, "One file must be uploaded.")
  }
  const file = ctx.request.files.file
  const { type, name } = ctx.params

  let bucket = coreEnv.GLOBAL_BUCKET_NAME

  let baseKey = `${type}/${name}`
  let key
  if (env.MULTI_TENANCY) {
    key = `${getTenantId()}/${baseKey}`
  } else {
    key = baseKey
  }

  const result = await objectStore.upload({
    bucket,
    filename: key,
    path: file.path,
    type: file.type,
  })

  // add to configuration structure
  // TODO: right now this only does a global level
  const db = getGlobalDB()
  let cfgStructure = await getScopedFullConfig(db, { type })
  if (!cfgStructure) {
    cfgStructure = {
      _id: generateConfigID({ type }),
      config: {},
    }
  }

  const url = objectStore.getGlobalFilePath(type, name)
  cfgStructure.config[`${name}`] = url
  if (result.ETag) {
    cfgStructure.config[`${name}Etag`] = result.ETag.replace(/"/g, "")
  }
  // write back to db with url updated
  await db.put(cfgStructure)

  ctx.body = {
    message: "File has been uploaded and url stored to config.",
    url,
  }
}

export const destroy = async function (ctx: UserCtx) {
  const db = getGlobalDB()
  const { id, rev } = ctx.params
  try {
    await db.remove(id, rev)
    await cache.delete(CacheKeys.CHECKLIST)
    ctx.body = { message: "Config deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export const configChecklist = async function (ctx: Ctx) {
  const db = getGlobalDB()
  const tenantId = getTenantId()

  try {
    ctx.body = await withCache(
      CacheKeys.CHECKLIST,
      env.CHECKLIST_CACHE_TTL,
      async () => {
        let apps = []
        if (!env.MULTI_TENANCY || tenantId) {
          // Apps exist
          apps = await getAllApps({ idsOnly: true, efficient: true })
        }

        // They have set up SMTP
        const smtpConfig = await getScopedFullConfig(db, {
          type: Configs.SMTP,
        })

        // They have set up Google Auth
        const googleConfig = await getScopedFullConfig(db, {
          type: Configs.GOOGLE,
        })

        // They have set up OIDC
        const oidcConfig = await getScopedFullConfig(db, {
          type: Configs.OIDC,
        })

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
            link: "/builder/portal/manage/email",
          },
          adminUser: {
            checked: userExists,
            label: "Create your first user",
            link: "/builder/portal/manage/users",
          },
          sso: {
            checked: !!googleConfig || !!oidcConfig,
            label: "Set up single sign-on",
            link: "/builder/portal/manage/auth",
          },
        }
      }
    )
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

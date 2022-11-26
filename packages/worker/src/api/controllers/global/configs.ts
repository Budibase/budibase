import * as email from "../../../utilities/email"
import env from "../../../environment"
import { googleCallbackUrl, oidcCallbackUrl } from "./auth"
import {
  events,
  cache,
  objectStore,
  tenancy,
  db as dbCore,
} from "@budibase/backend-core"
import { checkAnyUserExists } from "../../../utilities/users"
import {
  Database,
  Config as ConfigDoc,
  ConfigType,
  SSOType,
  GoogleConfig,
  OIDCConfig,
  SettingsConfig,
  BBContext,
} from "@budibase/types"

const getEventFns = async (db: Database, config: ConfigDoc) => {
  const fns = []
  const type = config.type

  let existing
  if (config._id) {
    existing = await db.get(config._id)
  }

  const ssoType = type as SSOType
  if (!existing) {
    switch (config.type) {
      case ConfigType.SMTP: {
        fns.push(events.email.SMTPCreated)
        break
      }
      case ConfigType.GOOGLE: {
        const googleCfg = config as GoogleConfig
        fns.push(() => events.auth.SSOCreated(ssoType))
        if (googleCfg.config.activated) {
          fns.push(() => events.auth.SSOActivated(ssoType))
        }
        break
      }
      case ConfigType.OIDC: {
        const oidcCfg = config as OIDCConfig
        fns.push(() => events.auth.SSOCreated(ssoType))
        if (oidcCfg.config.configs[0].activated) {
          fns.push(() => events.auth.SSOActivated(ssoType))
        }
        break
      }
      case ConfigType.SETTINGS: {
        // company
        const settingsCfg = config as SettingsConfig
        const company = settingsCfg.config.company
        if (company && company !== "Budibase") {
          fns.push(events.org.nameUpdated)
        }

        // logo
        const logoUrl = settingsCfg.config.logoUrl
        if (logoUrl) {
          fns.push(events.org.logoUpdated)
        }

        // platform url
        const platformUrl = settingsCfg.config.platformUrl
        if (
          platformUrl &&
          platformUrl !== "http://localhost:10000" &&
          env.SELF_HOSTED
        ) {
          fns.push(events.org.platformURLUpdated)
        }
        break
      }
    }
  } else {
    switch (config.type) {
      case ConfigType.SMTP: {
        fns.push(events.email.SMTPUpdated)
        break
      }
      case ConfigType.GOOGLE: {
        const googleCfg = config as GoogleConfig
        fns.push(() => events.auth.SSOUpdated(ssoType))
        if (!existing.config.activated && googleCfg.config.activated) {
          fns.push(() => events.auth.SSOActivated(ssoType))
        } else if (existing.config.activated && !googleCfg.config.activated) {
          fns.push(() => events.auth.SSODeactivated(ssoType))
        }
        break
      }
      case ConfigType.OIDC: {
        const oidcCfg = config as OIDCConfig
        fns.push(() => events.auth.SSOUpdated(ssoType))
        if (
          !existing.config.configs[0].activated &&
          oidcCfg.config.configs[0].activated
        ) {
          fns.push(() => events.auth.SSOActivated(ssoType))
        } else if (
          existing.config.configs[0].activated &&
          !oidcCfg.config.configs[0].activated
        ) {
          fns.push(() => events.auth.SSODeactivated(ssoType))
        }
        break
      }
      case ConfigType.SETTINGS: {
        // company
        const settingsCfg = config as SettingsConfig
        const existingCompany = existing.config.company
        const company = settingsCfg.config.company
        if (company && company !== "Budibase" && existingCompany !== company) {
          fns.push(events.org.nameUpdated)
        }

        // logo
        const existingLogoUrl = existing.config.logoUrl
        const logoUrl = settingsCfg.config.logoUrl
        if (logoUrl && existingLogoUrl !== logoUrl) {
          fns.push(events.org.logoUpdated)
        }

        // platform url
        const existingPlatformUrl = existing.config.platformUrl
        const platformUrl = settingsCfg.config.platformUrl
        if (
          platformUrl &&
          platformUrl !== "http://localhost:10000" &&
          existingPlatformUrl !== platformUrl &&
          env.SELF_HOSTED
        ) {
          fns.push(events.org.platformURLUpdated)
        }
        break
      }
    }
  }

  return fns
}

export async function save(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  const { type, workspace, user, config } = ctx.request.body
  let eventFns = await getEventFns(db, ctx.request.body)
  // Config does not exist yet
  if (!ctx.request.body._id) {
    ctx.request.body._id = dbCore.generateConfigID({
      type,
      workspace,
      user,
    })
  }
  try {
    // verify the configuration
    switch (type) {
      case ConfigType.SMTP:
        await email.verifyConfig(config)
        break
    }
  } catch (err: any) {
    ctx.throw(400, err)
  }

  try {
    const response = await db.put(ctx.request.body)
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

export async function fetch(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbCore.getConfigParams(
      { type: ctx.params.type },
      {
        include_docs: true,
      }
    )
  )
  ctx.body = response.rows.map(row => row.doc)
}

/**
 * Gets the most granular config for a particular configuration type.
 * The hierarchy is type -> workspace -> user.
 */
export async function find(ctx: BBContext) {
  const db = tenancy.getGlobalDB()

  const { userId, workspaceId } = ctx.query
  if (workspaceId && userId) {
    const workspace = await db.get(workspaceId as string)
    const userInWorkspace = workspace.users.some(
      (workspaceUser: any) => workspaceUser === userId
    )
    if (!ctx.user!.admin && !userInWorkspace) {
      ctx.throw(400, `User is not in specified workspace: ${workspace}.`)
    }
  }

  try {
    // Find the config with the most granular scope based on context
    const scopedConfig = await dbCore.getScopedFullConfig(db, {
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
    ctx.throw(err?.status || 400, err)
  }
}

export async function publicOidc(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig = await dbCore.getScopedFullConfig(db, {
      type: ConfigType.OIDC,
    })

    if (!oidcConfig) {
      ctx.body = {}
    } else {
      ctx.body = oidcConfig.config.configs.map((config: any) => ({
        logo: config.logo,
        name: config.name,
        uuid: config.uuid,
      }))
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function publicSettings(ctx: BBContext) {
  const db = tenancy.getGlobalDB()

  try {
    // Find the config with the most granular scope based on context
    const publicConfig = await dbCore.getScopedFullConfig(db, {
      type: ConfigType.SETTINGS,
    })

    const googleConfig = await dbCore.getScopedFullConfig(db, {
      type: ConfigType.GOOGLE,
    })

    const oidcConfig = await dbCore.getScopedFullConfig(db, {
      type: ConfigType.OIDC,
    })

    let config
    if (!publicConfig) {
      config = {
        config: {},
      }
    } else {
      config = publicConfig
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

export async function upload(ctx: BBContext) {
  if (ctx.request.files == null || ctx.request.files.file.length > 1) {
    ctx.throw(400, "One file must be uploaded.")
  }
  const file = ctx.request.files.file
  const { type, name } = ctx.params

  let bucket
  if (env.SELF_HOSTED) {
    bucket = objectStore.ObjectStoreBuckets.GLOBAL
  } else {
    bucket = objectStore.ObjectStoreBuckets.GLOBAL_CLOUD
  }

  let key
  if (env.MULTI_TENANCY) {
    key = `${tenancy.getTenantId()}/${type}/${name}`
  } else {
    key = `${type}/${name}`
  }

  await objectStore.upload({
    bucket,
    filename: key,
    path: file.path,
    type: file.type,
  })

  // add to configuration structure
  // TODO: right now this only does a global level
  const db = tenancy.getGlobalDB()
  let cfgStructure = await dbCore.getScopedFullConfig(db, { type })
  if (!cfgStructure) {
    cfgStructure = {
      _id: dbCore.generateConfigID({ type }),
      config: {},
    }
  }
  let url
  if (env.SELF_HOSTED) {
    url = `/${bucket}/${key}`
  } else {
    url = `${env.CDN_URL}/${key}`
  }

  cfgStructure.config[`${name}`] = url
  // write back to db with url updated
  await db.put(cfgStructure)

  ctx.body = {
    message: "File has been uploaded and url stored to config.",
    url,
  }
}

export async function destroy(ctx: BBContext) {
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

export async function configChecklist(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
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
        const smtpConfig = await dbCore.getScopedFullConfig(db, {
          type: ConfigType.SMTP,
        })

        // They have set up Google Auth
        const googleConfig = await dbCore.getScopedFullConfig(db, {
          type: ConfigType.GOOGLE,
        })

        // They have set up OIDC
        const oidcConfig = await dbCore.getScopedFullConfig(db, {
          type: ConfigType.OIDC,
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

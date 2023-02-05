import * as email from "../../../utilities/email"
import env from "../../../environment"
import { googleCallbackUrl, oidcCallbackUrl } from "./auth"
import {
  events,
  cache,
  objectStore,
  tenancy,
  db as dbCore,
  env as coreEnv,
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
  isGoogleConfig,
  isOIDCConfig,
  isSettingsConfig,
  isSMTPConfig,
  Ctx,
  UserCtx,
} from "@budibase/types"

const getEventFns = async (db: Database, config: ConfigDoc) => {
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

export async function save(ctx: UserCtx) {
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

export async function fetch(ctx: UserCtx) {
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
export async function find(ctx: UserCtx) {
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

export async function publicOidc(ctx: Ctx) {
  const db = tenancy.getGlobalDB()
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig: OIDCConfig = await dbCore.getScopedFullConfig(db, {
      type: ConfigType.OIDC,
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

export async function publicSettings(ctx: Ctx) {
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

    // enrich the logo url
    // empty url means deleted
    if (config.config.logoUrl && config.config.logoUrl !== "") {
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
  // TODO: right now this only does a global level
  const db = tenancy.getGlobalDB()
  let cfgStructure = await dbCore.getScopedFullConfig(db, { type })
  if (!cfgStructure) {
    cfgStructure = {
      _id: dbCore.generateConfigID({ type }),
      config: {},
    }
  }

  // save the Etag for cache bursting
  const etag = result.ETag
  if (etag) {
    cfgStructure.config[`${name}Etag`] = etag.replace(/"/g, "")
  }

  // save the file key
  cfgStructure.config[`${name}`] = key

  // write back to db
  await db.put(cfgStructure)

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

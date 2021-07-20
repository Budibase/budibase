const {
  generateConfigID,
  getConfigParams,
  getGlobalUserParams,
  getScopedFullConfig,
  getGlobalDBFromCtx,
  getGlobalDB,
  getAllApps,
} = require("@budibase/auth/db")
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const { upload, ObjectStoreBuckets } = require("@budibase/auth").objectStore

exports.save = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)
  const { type, workspace, user, config } = ctx.request.body

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
  } catch (err) {
    ctx.throw(400, err)
  }

  try {
    const response = await db.put(ctx.request.body)
    ctx.body = {
      type,
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.fetch = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)
  const response = await db.allDocs(
    getConfigParams(
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
exports.find = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)

  const { userId, workspaceId } = ctx.query
  if (workspaceId && userId) {
    const workspace = await db.get(workspaceId)
    const userInWorkspace = workspace.users.some(
      workspaceUser => workspaceUser === userId
    )
    if (!ctx.user.admin && !userInWorkspace) {
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
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.publicOidc = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig = await getScopedFullConfig(db, {
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
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.publicSettings = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)

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

    config.config.google = !googleConfig
      ? !!googleConfig
      : googleConfig.config.activated
    config.config.oidc = !oidcConfig
      ? !!oidcConfig
      : oidcConfig.config.configs[0].activated
    ctx.body = config
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.upload = async function (ctx) {
  if (ctx.request.files == null || ctx.request.files.file.length > 1) {
    ctx.throw(400, "One file must be uploaded.")
  }
  const file = ctx.request.files.file
  const { type, name } = ctx.params

  const bucket = ObjectStoreBuckets.GLOBAL
  const key = `${type}/${name}`
  await upload({
    bucket,
    filename: key,
    path: file.path,
    type: file.type,
  })

  // add to configuration structure
  // TODO: right now this only does a global level
  const db = getGlobalDBFromCtx(ctx)
  let cfgStructure = await getScopedFullConfig(db, { type })
  if (!cfgStructure) {
    cfgStructure = {
      _id: generateConfigID({ type }),
      config: {},
    }
  }
  const url = `/${bucket}/${key}`
  cfgStructure.config[`${name}`] = url
  // write back to db with url updated
  await db.put(cfgStructure)

  ctx.body = {
    message: "File has been uploaded and url stored to config.",
    url,
  }
}

exports.destroy = async function (ctx) {
  const db = getGlobalDBFromCtx(ctx)
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Config deleted successfully" }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.configChecklist = async function (ctx) {
  const tenantId = ctx.request.query.tenantId
  const db = tenantId ? getGlobalDB(tenantId) : getGlobalDBFromCtx(ctx)

  try {
    // TODO: Watch get started video

    // Apps exist
    const apps = await getAllApps({ tenantId })

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
    // They have set up an admin user
    const users = await db.allDocs(
      getGlobalUserParams(null, {
        include_docs: true,
      })
    )
    const adminUser = users.rows.some(row => row.doc.admin)

    ctx.body = {
      apps: apps.length,
      smtp: !!smtpConfig,
      adminUser,
      sso: !!googleConfig || !!oidcConfig,
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

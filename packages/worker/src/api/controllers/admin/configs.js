const CouchDB = require("../../../db")
const {
  generateConfigID,
  StaticDatabases,
  getConfigParams,
  getGlobalUserParams,
  getScopedFullConfig,
} = require("@budibase/auth").db
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const { upload, ObjectStoreBuckets } = require("@budibase/auth").objectStore

const APP_PREFIX = "app_"

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async function (ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const { type, group, user, config } = ctx.request.body

  // Config does not exist yet
  if (!ctx.request.body._id) {
    ctx.request.body._id = generateConfigID({
      type,
      group,
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
  const db = new CouchDB(GLOBAL_DB)
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
 * The hierarchy is type -> group -> user.
 */
exports.find = async function (ctx) {
  const db = new CouchDB(GLOBAL_DB)

  const { userId, groupId } = ctx.query
  if (groupId && userId) {
    const group = await db.get(groupId)
    const userInGroup = group.users.some(groupUser => groupUser === userId)
    if (!ctx.user.admin && !userInGroup) {
      ctx.throw(400, `User is not in specified group: ${group}.`)
    }
  }

  try {
    // Find the config with the most granular scope based on context
    const scopedConfig = await getScopedFullConfig(db, {
      type: ctx.params.type,
      user: userId,
      group: groupId,
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
  const db = new CouchDB(GLOBAL_DB)
  try {
    // Find the config with the most granular scope based on context
    const oidcConfig = await getScopedFullConfig(db, {
      type: Configs.OIDC,
    })

    if (!oidcConfig) {
      ctx.body = {}
    } else {
      const partialOidcCofig = oidcConfig.config.configs.map(config => {
        return {
          logo: config.logo,
          name: config.name,
          uuid: config.uuid,
        }
      })
      ctx.body = partialOidcCofig
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.publicSettings = async function (ctx) {
  const db = new CouchDB(GLOBAL_DB)

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

    let config = {}
    if (!publicConfig) {
      config = {
        config: {},
      }
    } else {
      config = publicConfig
    }

    config.config.google = !googleConfig
      ? !!googleConfig
      : !googleConfig.config.activated
      ? false
      : true
    config.config.oidc = !oidcConfig
      ? !!oidcConfig
      : !oidcConfig.config.configs[0].activated
      ? false
      : true
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
  const db = new CouchDB(GLOBAL_DB)
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
  const db = new CouchDB(GLOBAL_DB)
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Config deleted successfully" }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.configChecklist = async function (ctx) {
  const db = new CouchDB(GLOBAL_DB)

  try {
    // TODO: Watch get started video

    // Apps exist
    let allDbs = await CouchDB.allDbs()
    const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))

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
      apps: appDbNames.length,
      smtp: !!smtpConfig,
      adminUser,
      sso: !!googleConfig || !!oidcConfig,
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

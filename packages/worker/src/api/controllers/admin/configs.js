const CouchDB = require("../../../db")
const {
  generateConfigID,
  StaticDatabases,
  getConfigParams,
  determineScopedConfig,
  getGlobalUserParams,
  getScopedFullConfig,
} = require("@budibase/auth").db
const fetch = require("node-fetch")
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const env = require("../../../environment")

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

  // verify the configuration
  switch (type) {
    case Configs.SMTP:
      await email.verifyConfig(config)
      break
  }

  try {
    const response = await db.put(ctx.request.body)
    ctx.body = {
      type,
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(err.status, err)
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
      ctx.throw(400, "No configuration exists.")
    }
  } catch (err) {
    ctx.throw(err.status, err)
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
    let allDbs
    if (env.COUCH_DB_URL) {
      allDbs = await (await fetch(`${env.COUCH_DB_URL}/_all_dbs`)).json()
    } else {
      allDbs = await CouchDB.allDbs()
    }
    const appDbNames = allDbs.filter(dbName => dbName.startsWith(APP_PREFIX))

    // They have set up SMTP
    const smtpConfig = await determineScopedConfig(db, {
      type: Configs.SMTP,
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
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

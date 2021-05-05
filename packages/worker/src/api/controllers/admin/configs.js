const CouchDB = require("../../../db")
const {
  generateConfigID,
  StaticDatabases,
  getConfigParams,
  determineScopedConfig,
} = require("@budibase/auth").db
const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")

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
    getConfigParams(undefined, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

/**
 * Gets the most granular config for a particular configuration type.
 * The hierarchy is type -> group -> user.
 */
exports.find = async function (ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const userId = ctx.params.user && ctx.params.user._id

  const { group } = ctx.query
  if (group) {
    const group = await db.get(group)
    const userInGroup = group.users.some(groupUser => groupUser === userId)
    if (!ctx.user.admin && !userInGroup) {
      ctx.throw(400, `User is not in specified group: ${group}.`)
    }
  }

  try {
    // Find the config with the most granular scope based on context
    const scopedConfig = await determineScopedConfig(db, {
      type: ctx.params.type,
      user: userId,
      group,
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

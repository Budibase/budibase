const CouchDB = require("../../../db")
const { StaticDatabases } = require("@budibase/auth")
const { generateConfigID, getConfigParams } = require("@budibase/auth")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const configDoc = ctx.request.body
  const { type, group, user } = configDoc

  // Config does not exist yet
  if (!configDoc._id) {
    configDoc._id = generateConfigID({
      type,
      group,
      user,
    })
  }

  try {
    const response = await db.post(configDoc)
    ctx.body = {
      type,
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.fetch = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const response = await db.allDocs(
    getConfigParams(undefined, {
      include_docs: true,
    })
  )
  const groups = response.rows.map(row => row.doc)
  ctx.body = groups
}

/**
 * Gets the most granular config for a particular configuration type.
 * The hierarchy is type -> group -> user.
 */
exports.find = async function(ctx) {
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
    const response = await db.allDocs(
      getConfigParams(
        {
          type: ctx.params.type,
          user: userId,
          group,
        },
        {
          include_docs: true,
        }
      )
    )
    const configs = response.rows.map(row => row.doc)

    // Find the config with the most granular scope based on context
    const scopedConfig = configs.find(config => {
      // Config is specific to a user and a group
      if (
        config._id.includes(
          generateConfigID({ type: ctx.params.type, user: userId, group })
        )
      ) {
        return config
      }

      // Config is specific to a user
      if (
        config._id.includes(
          generateConfigID({ type: ctx.params.type, user: userId })
        )
      ) {
        return config
      }

      // Config is specific to a group only
      if (
        config._id.includes(generateConfigID({ type: ctx.params.type, group }))
      ) {
        return config
      }

      // Config specific to a config type only
      return config
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

exports.destroy = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Config deleted successfully" }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

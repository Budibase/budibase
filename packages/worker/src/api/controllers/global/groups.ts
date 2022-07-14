const { Configs } = require("../../../constants")
const email = require("../../../utilities/email")
const { getGlobalDB, getTenantId } = require("@budibase/backend-core/tenancy")
const env = require("../../../environment")
const {
  withCache,
  CacheKeys,
  bustCache,
} = require("@budibase/backend-core/cache")
const { groups } = require("@budibase/pro")

exports.save = async function (ctx: any) {
  const db = getGlobalDB()

  // Config does not exist yet
  if (!ctx.request.body._id) {
    ctx.request.body._id = groups.generateUserGroupID(ctx.request.body.name)
  }

  try {
    const response = await db.put(ctx.request.body)
    ctx.body = {
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.fetch = async function (ctx: any) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    groups.getUserGroupsParams(null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map((row: any) => row.doc)
}

exports.destroy = async function (ctx: any) {
  const db = getGlobalDB()
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Group deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

/**
 * Gets a group by ID from the global database.
 */
exports.find = async function (ctx: any) {
  const db = getGlobalDB()
  try {
    ctx.body = await db.get(ctx.params.id)
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

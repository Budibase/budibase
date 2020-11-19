const CouchDB = require("../../db")
const {
  BUILTIN_LEVELS,
  AccessLevel,
  getAccessLevel,
} = require("../../utilities/security/accessLevels")
const {
  generateAccessLevelID,
  getAccessLevelParams,
} = require("../../db/utils")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const body = await db.allDocs(
    getAccessLevelParams(null, {
      include_docs: true,
    })
  )
  const customAccessLevels = body.rows.map(row => row.doc)

  const staticAccessLevels = [BUILTIN_LEVELS.ADMIN, BUILTIN_LEVELS.POWER]
  ctx.body = [...staticAccessLevels, ...customAccessLevels]
}

exports.find = async function(ctx) {
  ctx.body = await getAccessLevel(ctx.user.appId, ctx.params.levelId)
}

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  let id = ctx.request.body._id || generateAccessLevelID()
  const level = new AccessLevel(
    id,
    ctx.request.body.name,
    ctx.request.body.inherits
  )
  if (ctx.request.body._rev) {
    level._rev = ctx.request.body._rev
  }
  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Access Level '${level.name}' created successfully.`
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  await db.remove(ctx.params.levelId, ctx.params.rev)
  ctx.message = `Access Level ${ctx.params.id} deleted successfully`
  ctx.status = 200
}

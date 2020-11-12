const CouchDB = require("../../db")
const { BUILTIN_LEVELS } = require("../../utilities/security/accessLevels")
const {
  BUILTIN_PERMISSION_NAMES,
} = require("../../utilities/security/permissions")
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

  const staticAccessLevels = [
    {
      ...BUILTIN_LEVELS.admin,
      permissions: [BUILTIN_PERMISSION_NAMES.ADMIN],
    },
    {
      ...BUILTIN_LEVELS.power,
      permissions: [BUILTIN_PERMISSION_NAMES.POWER],
    },
  ]

  ctx.body = [...staticAccessLevels, ...customAccessLevels]
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  ctx.body = await db.get(ctx.params.levelId)
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const level = await db.get(ctx.params.levelId)
  level.name = ctx.body.name
  level.permissions = ctx.request.body.permissions
  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Level ${level.name} updated successfully.`
}

exports.patch = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)
  const level = await db.get(ctx.params.levelId)
  const { removedPermissions, addedPermissions, _rev } = ctx.request.body

  if (!_rev) throw new Error("Must supply a _rev to update an access level")

  level._rev = _rev

  if (removedPermissions) {
    level.permissions = level.permissions.filter(
      permission => removedPermissions.indexOf(permission) === -1
    )
  }

  if (addedPermissions) {
    level.permissions = [
      ...new Set([...addedPermissions, ...level.permissions]),
    ]
  }

  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Access Level ${level.name} updated successfully.`
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.appId)

  const level = {
    name: ctx.request.body.name,
    _rev: ctx.request.body._rev,
    permissions: ctx.request.body.permissions || [],
    _id: generateAccessLevelID(),
    type: "accesslevel",
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

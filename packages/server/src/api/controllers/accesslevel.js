const CouchDB = require("../../db")
const newid = require("../../db/newid")
const {
  generateAdminPermissions,
  generatePowerUserPermissions,
  POWERUSER_LEVEL_ID,
  ADMIN_LEVEL_ID,
} = require("../../utilities/accessLevels")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const body = await db.query("database/by_type", {
    include_docs: true,
    key: ["accesslevel"],
  })
  const customAccessLevels = body.rows.map(row => row.doc)

  const staticAccessLevels = [
    {
      _id: ADMIN_LEVEL_ID,
      name: "Admin",
      permissions: await generateAdminPermissions(ctx.user.instanceId),
    },
    {
      _id: POWERUSER_LEVEL_ID,
      name: "Power User",
      permissions: await generatePowerUserPermissions(ctx.user.instanceId),
    },
  ]

  ctx.body = [...staticAccessLevels, ...customAccessLevels]
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.levelId)
}

exports.update = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const level = await db.get(ctx.params.levelId)
  level.name = ctx.body.name
  level.permissions = ctx.request.body.permissions
  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Level ${level.name} updated successfully.`
}

exports.patch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const level = await db.get(ctx.params.levelId)
  const { removedPermissions, addedPermissions, _rev } = ctx.request.body

  if (!_rev) throw new Error("Must supply a _rev to update an access level")

  level._rev = _rev

  if (removedPermissions) {
    level.permissions = level.permissions.filter(
      p =>
        !removedPermissions.some(
          rem => rem.name === p.name && rem.itemId === p.itemId
        )
    )
  }

  if (addedPermissions) {
    level.permissions = [
      ...level.permissions.filter(
        p =>
          !addedPermissions.some(
            add => add.name === p.name && add.itemId === p.itemId
          )
      ),
      ...addedPermissions,
    ]
  }

  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Access Level ${level.name} updated successfully.`
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)

  const level = {
    name: ctx.request.body.name,
    _rev: ctx.request.body._rev,
    permissions: ctx.request.body.permissions || [],
    _id: newid(),
    type: "accesslevel",
  }

  const result = await db.put(level)
  level._rev = result.rev
  ctx.body = level
  ctx.message = `Access Level '${level.name}' created successfully.`
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  await db.remove(ctx.params.levelId, ctx.params.rev)
  ctx.message = `Access Level ${ctx.params.id} deleted successfully`
  ctx.status = 200
}

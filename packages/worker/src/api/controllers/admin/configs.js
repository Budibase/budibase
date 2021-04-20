const CouchDB = require("../../../db")
const { StaticDatabases } = require("@budibase/auth")
const { generateConfigID } = require("@budibase/auth")
const { getConfigParams } = require("@budibase/auth/src/db/utils")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const configDoc = ctx.request.body

  // Config does not exist yet
  if (!configDoc._id) {
    configDoc._id = generateConfigID(configDoc.type, configDoc.group)
  }

  try {
    const response = await db.post(configDoc)
    ctx.body = {
      type: configDoc.type,
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

exports.find = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  try {
    const record = await db.get(ctx.params.id)
    ctx.body = record
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

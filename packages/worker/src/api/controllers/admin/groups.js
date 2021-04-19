const CouchDB = require("../../../db")
const { getGroupParams, StaticDatabases } = require("@budibase/auth")
const { generateGroupID } = require("@budibase/auth")

const GLOBAL_DB = StaticDatabases.GLOBAL.name

exports.save = async function(ctx) {
  const db = new CouchDB(GLOBAL_DB)
  const groupDoc = ctx.request.body

  // Group does not exist yet
  if (!groupDoc._id) {
    groupDoc._id = generateGroupID()
  }

  try {
    const response = await db.post(groupDoc)
    ctx.body = {
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
    getGroupParams(undefined, {
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
    ctx.body = { message: "Group deleted successfully" }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

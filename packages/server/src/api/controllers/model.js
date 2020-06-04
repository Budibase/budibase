const CouchDB = require("../../db")
const newid = require("../../db/newid")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const body = await db.query("database/by_type", {
    include_docs: true,
    key: ["model"],
  })
  ctx.body = body.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const model = await db.get(ctx.params.id)
  ctx.body = model
}

exports.create = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const newModel = {
    type: "model",
    ...ctx.request.body,
    _id: newid(),
  }

  const result = await db.post(newModel)
  newModel._rev = result.rev

  const designDoc = await db.get("_design/database")
  designDoc.views = {
    ...designDoc.views,
    [`all_${newModel._id}`]: {
      map: `function(doc) {
        if (doc.modelId === "${newModel._id}") {
          emit(doc[doc.key], doc._id); 
        }
      }`,
    },
  }
  await db.put(designDoc)

  ctx.status = 200
  ctx.message = `Model ${ctx.request.body.name} created successfully.`
  ctx.body = newModel
}

exports.update = async function() {}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)

  await db.remove(ctx.params.modelId, ctx.params.revId)
  const modelViewId = `all_${ctx.params.modelId}`

  // Delete all records for that model
  const records = await db.query(`database/${modelViewId}`)
  await db.bulkDocs(
    records.rows.map(record => ({ id: record.id, _deleted: true }))
  )

  // delete the "all" view
  const designDoc = await db.get("_design/database")
  delete designDoc.views[modelViewId]
  await db.put(designDoc)

  ctx.status = 200
  ctx.message = `Model ${ctx.params.modelId} deleted.`
}

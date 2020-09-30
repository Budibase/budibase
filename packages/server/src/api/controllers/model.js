const CouchDB = require("../../db")
const newid = require("../../db/newid")
const linkRecords = require("../../db/linkedRecords")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const body = await db.query("database/by_type", {
    include_docs: true,
    key: ["model"],
  })
  ctx.body = body.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.save = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const modelToSave = {
    type: "model",
    _id: newid(),
    views: {},
    ...ctx.request.body,
  }

  // rename record fields when table column is renamed
  const { _rename } = modelToSave
  if (_rename) {
    const records = await db.query(`database/all_${modelToSave._id}`, {
      include_docs: true,
    })
    const docs = records.rows.map(({ doc }) => {
      doc[_rename.updated] = doc[_rename.old]
      delete doc[_rename.old]
      return doc
    })

    await db.bulkDocs(docs)
    delete modelToSave._rename
  }

  // update schema of non-statistics views when new columns are added
  for (let view in modelToSave.views) {
    const modelView = modelToSave.views[view]
    if (!modelView) continue

    if (modelView.schema.group || modelView.schema.field) continue
    modelView.schema = modelToSave.schema
  }

  const result = await db.post(modelToSave)
  modelToSave._rev = result.rev

  const designDoc = await db.get("_design/database")
  /** TODO: should we include the doc type here - currently it is possible for anything
      with a modelId in it to be returned */
  designDoc.views = {
    ...designDoc.views,
    [`all_${modelToSave._id}`]: {
      map: `function(doc) {
        if (doc.modelId === "${modelToSave._id}") {
          emit(doc._id); 
        }
      }`,
    },
  }
  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.MODEL_SAVE,
    model: modelToSave,
  })
  await db.put(designDoc)

  ctx.eventEmitter &&
    ctx.eventEmitter.emitModel(`model:save`, instanceId, modelToSave)
  ctx.status = 200
  ctx.message = `Model ${ctx.request.body.name} saved successfully.`
  ctx.body = modelToSave
}

exports.destroy = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)

  const modelToDelete = await db.get(ctx.params.modelId)

  await db.remove(modelToDelete)

  const modelViewId = `all_${ctx.params.modelId}`

  // Delete all records for that model
  const records = await db.query(`database/${modelViewId}`)
  await db.bulkDocs(
    records.rows.map(record => ({ _id: record.id, _deleted: true }))
  )

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.MODEL_DELETE,
    model: modelToDelete,
  })
  // delete the "all" view
  const designDoc = await db.get("_design/database")
  delete designDoc.views[modelViewId]
  await db.put(designDoc)

  ctx.eventEmitter &&
    ctx.eventEmitter.emitModel(`model:delete`, instanceId, modelToDelete)
  ctx.status = 200
  ctx.message = `Model ${ctx.params.modelId} deleted.`
}

const CouchDB = require("../../db")
const linkRecords = require("../../db/linkedRecords")
const {
  getRecordParams,
  getModelParams,
  generateModelID,
} = require("../../db/utils")

exports.fetch = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const body = await db.allDocs(
    getModelParams(null, {
      include_docs: true,
    })
  )
  ctx.body = body.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  ctx.body = await db.get(ctx.params.id)
}

exports.save = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const oldModelId = ctx.request.body._id
  const modelToSave = {
    type: "model",
    _id: generateModelID(),
    views: {},
    ...ctx.request.body,
  }
  // get the model in its previous state for differencing
  let oldModel = null
  if (oldModelId) {
    oldModel = await db.get(oldModelId)
  }

  // rename record fields when table column is renamed
  const { _rename } = modelToSave
  if (_rename && modelToSave.schema[_rename.updated].type === "link") {
    throw "Cannot rename a linked field."
  } else if (_rename && modelToSave.primaryDisplay === _rename.old) {
    throw "Cannot rename the primary display field."
  } else if (_rename) {
    const records = await db.allDocs(
      getRecordParams(modelToSave._id, null, {
        include_docs: true,
      })
    )

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

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: oldModel
      ? linkRecords.EventType.MODEL_UPDATED
      : linkRecords.EventType.MODEL_SAVE,
    model: modelToSave,
    oldModel: oldModel,
  })

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

  // Delete all records for that model
  const records = await db.allDocs(
    getRecordParams(ctx.params.modelId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(
    records.rows.map(record => ({ _id: record.id, _deleted: true }))
  )

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.MODEL_DELETE,
    model: modelToDelete,
  })

  ctx.eventEmitter &&
    ctx.eventEmitter.emitModel(`model:delete`, instanceId, modelToDelete)
  ctx.status = 200
  ctx.message = `Model ${ctx.params.modelId} deleted.`
}

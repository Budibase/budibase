const CouchDB = require("../../db")
const linkRecords = require("../../db/linkedRecords")
const csvParser = require("../../utilities/csvParser")
const {
  getRecordParams,
  getModelParams,
  generateModelID,
  generateRecordID,
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
  const { dataImport, ...rest } = ctx.request.body
  const modelToSave = {
    type: "model",
    _id: generateModelID(),
    views: {},
    ...rest,
  }

  // if the model obj had an _id then it will have been retrieved
  const oldModel = ctx.preExisting

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

  if (dataImport && dataImport.path) {
    // Populate the table with records imported from CSV in a bulk update
    const data = await csvParser.transform(dataImport)

    for (let row of data) {
      row._id = generateRecordID(modelToSave._id)
      row.modelId = modelToSave._id
    }

    await db.bulkDocs(data)
  }

  ctx.status = 200
  ctx.message = `Model ${ctx.request.body.name} saved successfully.`
  ctx.body = modelToSave
}

exports.destroy = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const modelToDelete = await db.get(ctx.params.modelId)

  // Delete all records for that model
  const records = await db.allDocs(
    getRecordParams(ctx.params.modelId, null, {
      include_docs: true,
    })
  )
  await db.bulkDocs(
    records.rows.map(record => ({ ...record.doc, _deleted: true }))
  )

  // update linked records
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.MODEL_DELETE,
    model: modelToDelete,
  })

  // don't remove the table itself until very end
  await db.remove(modelToDelete)

  ctx.eventEmitter &&
    ctx.eventEmitter.emitModel(`model:delete`, instanceId, modelToDelete)
  ctx.status = 200
  ctx.message = `Model ${ctx.params.modelId} deleted.`
}

exports.validateCSVSchema = async function(ctx) {
  const { file, schema = {} } = ctx.request.body
  const result = await csvParser.parse(file.path, schema)
  ctx.body = {
    schema: result,
    path: file.path,
  }
}

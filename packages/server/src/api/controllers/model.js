const CouchDB = require("../../db")
const csvParser = require("../../utilities/csvParser")
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
  const db = new CouchDB(ctx.user.instanceId)
  const { dataImport, ...rest } = ctx.request.body
  const modelToSave = {
    type: "model",
    _id: generateModelID(),
    views: {},
    ...rest,
  }

  // rename record fields when table column is renamed
  const { _rename } = modelToSave
  if (_rename) {
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

  const { schema } = ctx.request.body
  for (let key of Object.keys(schema)) {
    // model has a linked record
    if (schema[key].type === "link") {
      // create the link field in the other model
      const linkedModel = await db.get(schema[key].modelId)
      linkedModel.schema[modelToSave.name] = {
        name: modelToSave.name,
        type: "link",
        modelId: modelToSave._id,
        constraints: {
          type: "array",
        },
      }
      await db.put(linkedModel)
    }
  }

  if (dataImport && dataImport.path) {
    // Populate the table with records imported from CSV in a bulk update
    const data = await csvParser.transform(dataImport)

    for (let row of data) row.modelId = modelToSave._id

    await db.bulkDocs(data)
  }

  ctx.status = 200
  ctx.message = `Model ${ctx.request.body.name} saved successfully.`
  ctx.body = modelToSave
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)

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

  // Delete linked record fields in dependent models
  for (let key of Object.keys(modelToDelete.schema)) {
    const { type, modelId } = modelToDelete.schema[key]
    if (type === "link") {
      const linkedModel = await db.get(modelId)
      delete linkedModel.schema[modelToDelete.name]
      await db.put(linkedModel)
    }
  }

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

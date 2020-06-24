const CouchDB = require("../../db")
const validateJs = require("validate.js")
const newid = require("../../db/newid")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = ctx.request.body
  record.modelId = ctx.params.modelId

  if (!record._rev && !record._id) {
    record._id = newid()
  }

  const model = await db.get(record.modelId)

  const validateResult = await validate({
    record,
    model,
  })

  if (!validateResult.valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validateResult.errors,
    }
    return
  }

  const existingRecord = record._rev && (await db.get(record._id))

  if (existingRecord) {
    const response = await db.put(record)
    record._rev = response.rev
    record.type = "record"
    ctx.body = record
    ctx.status = 200
    ctx.message = `${model.name} updated successfully.`
    return
  }

  record.type = "record"
  const response = await db.post(record)
  record._rev = response.rev

  // create links in other tables
  for (let key in record) {
    if (model.schema[key] && model.schema[key].type === "link") {
      const linked = await db.allDocs({
        include_docs: true,
        keys: record[key],
      })

      // add this record to the linked records in attached models
      const linkedDocs = linked.rows.map(row => {
        const doc = row.doc
        return {
          ...doc,
          [model._id]: doc[model._id]
            ? [...doc[model._id], record._id]
            : [record._id],
        }
      })

      await db.bulkDocs(linkedDocs)
    }
  }

  ctx.eventEmitter &&
    ctx.eventEmitter.emit(`record:save`, {
      record,
      instanceId: ctx.user.instanceId,
    })
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} created successfully`
}

exports.fetchView = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.query(`database/${ctx.params.viewName}`, {
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.fetchModelRecords = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.query(`database/all_${ctx.params.modelId}`, {
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.search = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const response = await db.allDocs({
    include_docs: true,
    ...ctx.request.body,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId does not match the records modelId")
    return
  }
  ctx.body = record
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.user.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId doe not match the record's modelId")
    return
  }
  ctx.body = await db.remove(ctx.params.recordId, ctx.params.revId)
  ctx.eventEmitter && ctx.eventEmitter.emit(`record:delete`, record)
}

exports.validate = async function(ctx) {
  const errors = await validate({
    instanceId: ctx.user.instanceId,
    modelId: ctx.params.modelId,
    record: ctx.request.body,
  })
  ctx.status = 200
  ctx.body = errors
}

async function validate({ instanceId, modelId, record, model }) {
  if (!model) {
    const db = new CouchDB(instanceId)
    model = await db.get(modelId)
  }
  const errors = {}
  for (let fieldName in model.schema) {
    const res = validateJs.single(
      record[fieldName],
      model.schema[fieldName].constraints
    )
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

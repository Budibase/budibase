const CouchDB = require("../../db")
const validateJs = require("validate.js")
const newid = require("../../db/newid")

exports.save = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
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

  ctx.eventEmitter.emit(`record:save`, {
    record,
    instanceId: ctx.params.instanceId,
  })
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} created successfully`
}

exports.fetchView = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const response = await db.query(`database/${ctx.params.viewName}`, {
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.fetchModel = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const response = await db.query(`database/all_${ctx.params.modelId}`, {
    include_docs: true,
  })
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId doe not match the record's modelId")
    return
  }
  ctx.body = record
}

exports.destroy = async function(ctx) {
  const db = new CouchDB(ctx.params.instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId doe not match the record's modelId")
    return
  }
  ctx.body = await db.remove(ctx.params.recordId, ctx.params.revId)
  ctx.eventEmitter.emit(`record:delete`, record)
}

exports.validate = async function(ctx) {
  const errors = await validate({
    instanceId: ctx.params.instanceId,
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

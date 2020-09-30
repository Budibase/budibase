const CouchDB = require("../../db")
const validateJs = require("validate.js")
const newid = require("../../db/newid")
const linkRecords = require("../../db/linkedRecords")

validateJs.extend(validateJs.validators.datetime, {
  parse: function(value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function(value) {
    return new Date(value).toISOString()
  },
})

exports.patch = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const model = await db.get(record.modelId)
  let record = await db.get(ctx.params.id)
  const patchfields = ctx.request.body

  for (let key of Object.keys(patchfields)) {
    if (!model.schema[key]) continue
    record[key] = patchfields[key]
  }

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

  // returned record is cleaned and prepared for writing to DB
  record = await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_UPDATE,
    record,
    modelId: record.modelId,
    model,
  })
  const response = await db.put(record)
  record._rev = response.rev
  record.type = "record"

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRecord(`record:update`, instanceId, record, model)
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} updated successfully.`
}

exports.save = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  let record = ctx.request.body
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

  record = await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_SAVE,
    record,
    modelId: record.modelId,
    model,
  })
  record.type = "record"
  const response = await db.post(record)
  record._rev = response.rev

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRecord(`record:save`, instanceId, record, model)
  ctx.body = record
  ctx.status = 200
  ctx.message = `${model.name} created successfully`
}

exports.fetchView = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const { stats, group, field } = ctx.query
  const response = await db.query(`database/${ctx.params.viewName}`, {
    include_docs: !stats,
    group,
  })

  if (stats) {
    response.rows = response.rows.map(row => ({
      group: row.key,
      field,
      ...row.value,
      avg: row.value.sum / row.value.count,
    }))
  } else {
    response.rows = response.rows.map(row => row.doc)
  }

  ctx.body = await linkRecords.attachLinkInfo(instanceId, response.rows)
}

exports.fetchModelRecords = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const response = await db.query(`database/all_${ctx.params.modelId}`, {
    include_docs: true,
  })
  ctx.body = await linkRecords.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
}

exports.search = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const response = await db.allDocs({
    include_docs: true,
    ...ctx.request.body,
  })
  ctx.body = await linkRecords.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
}

exports.find = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId does not match the records modelId")
    return
  }
  ctx.body = await linkRecords.attachLinkInfoSingleRecord(instanceId, record)
}

exports.destroy = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.modelId !== ctx.params.modelId) {
    ctx.throw(400, "Supplied modelId doesn't match the record's modelId")
    return
  }
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_DELETE,
    record,
    modelId: record.modelId,
  })
  ctx.body = await db.remove(ctx.params.recordId, ctx.params.revId)
  ctx.status = 200

  // for automations include the record that was deleted
  ctx.record = record
  ctx.eventEmitter &&
    ctx.eventEmitter.emitRecord(`record:delete`, instanceId, record)
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
  for (let fieldName of Object.keys(model.schema)) {
    const res = validateJs.single(
      record[fieldName],
      model.schema[fieldName].constraints
    )
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

exports.fetchLinkedRecords = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const modelId = ctx.params.modelId
  const fieldName = ctx.params.fieldName
  const recordId = ctx.params.recordId
  if (instanceId == null || modelId == null || recordId == null) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      error:
        "Cannot handle request, URI params have not been successfully prepared.",
    }
    return
  }
  // get the link docs
  const linkDocIds = await linkRecords.getLinkDocuments({
    instanceId,
    modelId,
    fieldName,
    recordId,
  })
  // now get the docs from the all docs index
  const response = await db.allDocs({
    include_docs: true,
    keys: linkDocIds,
  })
  ctx.body = response.rows.map(row => row.doc)
  ctx.status = 200
}

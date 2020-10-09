const CouchDB = require("../../db")
const validateJs = require("validate.js")
const linkRecords = require("../../db/linkedRecords")
const {
  getRecordParams,
  generateRecordID,
  DocumentTypes,
  SEPARATOR,
} = require("../../db/utils")
const { cloneDeep } = require("lodash")

const MODEL_VIEW_BEGINS_WITH = `all${SEPARATOR}${DocumentTypes.MODEL}${SEPARATOR}`

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
  let record = await db.get(ctx.params.id)
  const model = await db.get(record.modelId)
  const patchfields = ctx.request.body
  record = coerceRecordValues(record, model)

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
    record._id = generateRecordID(record.modelId)
  }

  const model = await db.get(record.modelId)

  record = coerceRecordValues(record, model)

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

  // make sure link records are up to date
  record = await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_SAVE,
    record,
    modelId: record.modelId,
    model,
  })

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
  const viewName = ctx.params.viewName

  // if this is a model view being looked for just transfer to that
  if (viewName.indexOf(MODEL_VIEW_BEGINS_WITH) === 0) {
    ctx.params.modelId = viewName.substring(4)
    await exports.fetchModelRecords(ctx)
    return
  }

  const response = await db.query(`database/${viewName}`, {
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
  const response = await db.allDocs(
    getRecordParams(ctx.params.modelId, null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
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
  ctx.body = await linkRecords.attachLinkInfo(instanceId, record)
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

exports.fetchEnrichedRecord = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const modelId = ctx.params.modelId
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
  // need model to work out where links go in record
  const [model, record] = await Promise.all([db.get(modelId), db.get(recordId)])
  // get the link docs
  const linkVals = await linkRecords.getLinkDocuments({
    instanceId,
    modelId,
    recordId,
  })
  // look up the actual records based on the ids
  const response = await db.allDocs({
    include_docs: true,
    keys: linkVals.map(linkVal => linkVal.id),
  })
  // need to include the IDs in these records for any links they may have
  let linkedRecords = await linkRecords.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
  // insert the link records in the correct place throughout the main record
  for (let fieldName of Object.keys(model.schema)) {
    let field = model.schema[fieldName]
    if (field.type === "link") {
      record[fieldName] = linkedRecords.filter(
        linkRecord => linkRecord.modelId === field.modelId
      )
    }
  }
  ctx.body = record
  ctx.status = 200
}

function coerceRecordValues(rec, model) {
  const record = cloneDeep(rec)
  for (let [key, value] of Object.entries(record)) {
    const field = model.schema[key]
    if (!field) continue

    // eslint-disable-next-line no-prototype-builtins
    if (TYPE_TRANSFORM_MAP[field.type].hasOwnProperty(value)) {
      record[key] = TYPE_TRANSFORM_MAP[field.type][value]
    } else if (TYPE_TRANSFORM_MAP[field.type].parse) {
      record[key] = TYPE_TRANSFORM_MAP[field.type].parse(value)
    }
  }
  return record
}

const TYPE_TRANSFORM_MAP = {
  link: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  options: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  string: {
    "": "",
    [null]: "",
    [undefined]: undefined,
  },
  number: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    parse: n => parseFloat(n),
  },
  datetime: {
    "": null,
    [undefined]: undefined,
    [null]: null,
  },
  attachment: {
    "": [],
    [null]: [],
    [undefined]: undefined,
  },
  boolean: {
    "": null,
    [null]: null,
    [undefined]: undefined,
    true: true,
    false: false,
  },
}

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

const TABLE_VIEW_BEGINS_WITH = `all${SEPARATOR}${DocumentTypes.TABLE}${SEPARATOR}`

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
  const table = await db.get(record.tableId)
  const patchfields = ctx.request.body
  record = coerceRecordValues(record, table)

  for (let key of Object.keys(patchfields)) {
    if (!table.schema[key]) continue
    record[key] = patchfields[key]
  }

  const validateResult = await validate({
    record,
    table,
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
    tableId: record.tableId,
    table,
  })
  const response = await db.put(record)
  record._rev = response.rev
  record.type = "record"

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRecord(`record:update`, instanceId, record, table)
  ctx.body = record
  ctx.status = 200
  ctx.message = `${table.name} updated successfully.`
}

exports.save = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  let record = ctx.request.body
  record.tableId = ctx.params.tableId

  if (!record._rev && !record._id) {
    record._id = generateRecordID(record.tableId)
  }

  // if the record obj had an _id then it will have been retrieved
  const existingRecord = ctx.preExisting

  const table = await db.get(record.tableId)

  record = coerceRecordValues(record, table)

  const validateResult = await validate({
    record,
    table,
  })

  if (!validateResult.valid) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      errors: validateResult.errors,
    }
    return
  }

  // make sure link records are up to date
  record = await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_SAVE,
    record,
    tableId: record.tableId,
    table,
  })

  if (existingRecord) {
    const response = await db.put(record)
    record._rev = response.rev
    record.type = "record"
    ctx.body = record
    ctx.status = 200
    ctx.message = `${table.name} updated successfully.`
    return
  }

  record.type = "record"
  const response = await db.post(record)
  record._rev = response.rev

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRecord(`record:save`, instanceId, record, table)
  ctx.body = record
  ctx.status = 200
  ctx.message = `${table.name} created successfully`
}

exports.fetchView = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const { stats, group, field } = ctx.query
  const viewName = ctx.params.viewName

  // if this is a table view being looked for just transfer to that
  if (viewName.indexOf(TABLE_VIEW_BEGINS_WITH) === 0) {
    ctx.params.tableId = viewName.substring(4)
    await exports.fetchTableRecords(ctx)
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

exports.fetchTableRecords = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const response = await db.allDocs(
    getRecordParams(ctx.params.tableId, null, {
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
  if (record.tableId !== ctx.params.tableId) {
    ctx.throw(400, "Supplied tableId does not match the records tableId")
    return
  }
  ctx.body = await linkRecords.attachLinkInfo(instanceId, record)
}

exports.destroy = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const record = await db.get(ctx.params.recordId)
  if (record.tableId !== ctx.params.tableId) {
    ctx.throw(400, "Supplied tableId doesn't match the record's tableId")
    return
  }
  await linkRecords.updateLinks({
    instanceId,
    eventType: linkRecords.EventType.RECORD_DELETE,
    record,
    tableId: record.tableId,
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
    tableId: ctx.params.tableId,
    record: ctx.request.body,
  })
  ctx.status = 200
  ctx.body = errors
}

async function validate({ instanceId, tableId, record, table }) {
  if (!table) {
    const db = new CouchDB(instanceId)
    table = await db.get(tableId)
  }
  const errors = {}
  for (let fieldName of Object.keys(table.schema)) {
    const res = validateJs.single(
      record[fieldName],
      table.schema[fieldName].constraints
    )
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

exports.fetchEnrichedRecord = async function(ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const tableId = ctx.params.tableId
  const recordId = ctx.params.recordId
  if (instanceId == null || tableId == null || recordId == null) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      error:
        "Cannot handle request, URI params have not been successfully prepared.",
    }
    return
  }
  // need table to work out where links go in record
  const [table, record] = await Promise.all([db.get(tableId), db.get(recordId)])
  // get the link docs
  const linkVals = await linkRecords.getLinkDocuments({
    instanceId,
    tableId,
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
  for (let fieldName of Object.keys(table.schema)) {
    let field = table.schema[fieldName]
    if (field.type === "link") {
      record[fieldName] = linkedRecords.filter(
        linkRecord => linkRecord.tableId === field.tableId
      )
    }
  }
  ctx.body = record
  ctx.status = 200
}

function coerceRecordValues(rec, table) {
  const record = cloneDeep(rec)
  for (let [key, value] of Object.entries(record)) {
    const field = table.schema[key]
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

const CouchDB = require("../../db")
const validateJs = require("validate.js")
const linkRows = require("../../db/linkedRows")
const {
  getRowParams,
  generateRowID,
  DocumentTypes,
  SEPARATOR,
} = require("../../db/utils")
const { cloneDeep } = require("lodash")

const TABLE_VIEW_BEGINS_WITH = `all${SEPARATOR}${DocumentTypes.TABLE}${SEPARATOR}`

validateJs.extend(validateJs.validators.datetime, {
  parse: function (value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function (value) {
    return new Date(value).toISOString()
  },
})

exports.patch = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  let row = await db.get(ctx.params.id)
  const table = await db.get(row.tableId)
  const patchfields = ctx.request.body
  row = coerceRowValues(row, table)

  for (let key of Object.keys(patchfields)) {
    if (!table.schema[key]) continue
    row[key] = patchfields[key]
  }

  const validateResult = await validate({
    row,
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

  // returned row is cleaned and prepared for writing to DB
  row = await linkRows.updateLinks({
    instanceId,
    eventType: linkRows.EventType.ROW_UPDATE,
    row,
    tableId: row.tableId,
    table,
  })
  const response = await db.put(row)
  row._rev = response.rev
  row.type = "row"

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRow(`row:update`, instanceId, row, table)
  ctx.body = row
  ctx.status = 200
  ctx.message = `${table.name} updated successfully.`
}

exports.save = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  let row = ctx.request.body
  row.tableId = ctx.params.tableId

  if (ctx.request.body.type === "delete") {
    await bulkDelete(ctx)
    ctx.body = ctx.request.body.rows
    return
  }

  if (!row._rev && !row._id) {
    row._id = generateRowID(row.tableId)
  }

  // if the row obj had an _id then it will have been retrieved
  const existingRow = ctx.preExisting

  const table = await db.get(row.tableId)

  row = coerceRowValues(row, table)

  const validateResult = await validate({
    row,
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

  // make sure link rows are up to date
  row = await linkRows.updateLinks({
    instanceId,
    eventType: linkRows.EventType.ROW_SAVE,
    row,
    tableId: row.tableId,
    table,
  })

  if (existingRow) {
    const response = await db.put(row)
    row._rev = response.rev
    row.type = "row"
    ctx.body = row
    ctx.status = 200
    ctx.message = `${table.name} updated successfully.`
    return
  }

  row.type = "row"
  const response = await db.post(row)
  row._rev = response.rev

  ctx.eventEmitter &&
    ctx.eventEmitter.emitRow(`row:save`, instanceId, row, table)
  ctx.body = row
  ctx.status = 200
  ctx.message = `${table.name} created successfully`
}

exports.fetchView = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const { stats, group, field } = ctx.query
  const viewName = ctx.params.viewName

  // if this is a table view being looked for just transfer to that
  if (viewName.indexOf(TABLE_VIEW_BEGINS_WITH) === 0) {
    ctx.params.tableId = viewName.substring(4)
    await exports.fetchTableRows(ctx)
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

  ctx.body = await linkRows.attachLinkInfo(instanceId, response.rows)
}

exports.fetchTableRows = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const response = await db.allDocs(
    getRowParams(ctx.params.tableId, null, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
  ctx.body = await linkRows.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
}

exports.search = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const response = await db.allDocs({
    include_docs: true,
    ...ctx.request.body,
  })
  ctx.body = await linkRows.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
}

exports.find = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const row = await db.get(ctx.params.rowId)
  if (row.tableId !== ctx.params.tableId) {
    ctx.throw(400, "Supplied tableId does not match the rows tableId")
    return
  }
  ctx.body = await linkRows.attachLinkInfo(instanceId, row)
}

exports.destroy = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const row = await db.get(ctx.params.rowId)
  if (row.tableId !== ctx.params.tableId) {
    ctx.throw(400, "Supplied tableId doesn't match the row's tableId")
    return
  }
  await linkRows.updateLinks({
    instanceId,
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId: row.tableId,
  })
  ctx.body = await db.remove(ctx.params.rowId, ctx.params.revId)
  ctx.status = 200

  // for automations include the row that was deleted
  ctx.row = row
  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, instanceId, row)
}

exports.validate = async function (ctx) {
  const errors = await validate({
    instanceId: ctx.user.instanceId,
    tableId: ctx.params.tableId,
    row: ctx.request.body,
  })
  ctx.status = 200
  ctx.body = errors
}

async function validate({ instanceId, tableId, row, table }) {
  if (!table) {
    const db = new CouchDB(instanceId)
    table = await db.get(tableId)
  }
  const errors = {}
  for (let fieldName of Object.keys(table.schema)) {
    const res = validateJs.single(
      row[fieldName],
      table.schema[fieldName].constraints
    )
    if (res) errors[fieldName] = res
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

exports.fetchEnrichedRow = async function (ctx) {
  const instanceId = ctx.user.instanceId
  const db = new CouchDB(instanceId)
  const tableId = ctx.params.tableId
  const rowId = ctx.params.rowId
  if (instanceId == null || tableId == null || rowId == null) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      error:
        "Cannot handle request, URI params have not been successfully prepared.",
    }
    return
  }
  // need table to work out where links go in row
  const [table, row] = await Promise.all([db.get(tableId), db.get(rowId)])
  // get the link docs
  const linkVals = await linkRows.getLinkDocuments({
    instanceId,
    tableId,
    rowId,
  })
  // look up the actual rows based on the ids
  const response = await db.allDocs({
    include_docs: true,
    keys: linkVals.map(linkVal => linkVal.id),
  })
  // need to include the IDs in these rows for any links they may have
  let linkedRows = await linkRows.attachLinkInfo(
    instanceId,
    response.rows.map(row => row.doc)
  )
  // insert the link rows in the correct place throughout the main row
  for (let fieldName of Object.keys(table.schema)) {
    let field = table.schema[fieldName]
    if (field.type === "link") {
      row[fieldName] = linkedRows.filter(
        linkRow => linkRow.tableId === field.tableId
      )
    }
  }
  ctx.body = row
  ctx.status = 200
}

function coerceRowValues(rec, table) {
  const row = cloneDeep(rec)
  for (let [key, value] of Object.entries(row)) {
    const field = table.schema[key]
    if (!field) continue

    // eslint-disable-next-line no-prototype-builtins
    if (TYPE_TRANSFORM_MAP[field.type].hasOwnProperty(value)) {
      row[key] = TYPE_TRANSFORM_MAP[field.type][value]
    } else if (TYPE_TRANSFORM_MAP[field.type].parse) {
      row[key] = TYPE_TRANSFORM_MAP[field.type].parse(value)
    }
  }
  return row
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

async function bulkDelete(ctx) {
  const instanceId = ctx.user.instanceId
  const { rows } = ctx.request.body
  const db = new CouchDB(instanceId)

  const linkUpdates = rows.map(row =>
    linkRows.updateLinks({
      instanceId,
      eventType: linkRows.EventType.ROW_DELETE,
      row,
      tableId: row.tableId,
    })
  )

  await db.bulkDocs(rows.map(row => ({ ...row, _deleted: true })))
  await Promise.all(linkUpdates)

  rows.forEach(row => {
    ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, instanceId, row)
  })
}

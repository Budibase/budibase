const CouchDB = require("../../db")
const validateJs = require("validate.js")
const linkRows = require("../../db/linkedRows")
const {
  getRowParams,
  generateRowID,
  DocumentTypes,
  SEPARATOR,
  ViewNames,
} = require("../../db/utils")
const usersController = require("./user")
const { coerceRowValues, enrichRows } = require("../../utilities")

const TABLE_VIEW_BEGINS_WITH = `all${SEPARATOR}${DocumentTypes.TABLE}${SEPARATOR}`

const CALCULATION_TYPES = {
  SUM: "sum",
  COUNT: "count",
  STATS: "stats",
}

validateJs.extend(validateJs.validators.datetime, {
  parse: function(value) {
    return new Date(value).getTime()
  },
  // Input is a unix timestamp
  format: function(value) {
    return new Date(value).toISOString()
  },
})

async function findRow(db, appId, tableId, rowId) {
  let row
  if (tableId === ViewNames.USERS) {
    let ctx = {
      params: {
        userId: rowId,
      },
      user: {
        appId,
      },
    }
    await usersController.find(ctx)
    row = ctx.body
  } else {
    row = await db.get(rowId)
  }
  if (row.tableId !== tableId) {
    throw "Supplied tableId does not match the rows tableId"
  }
  return row
}

exports.patch = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  let row = await db.get(ctx.params.id)
  const table = await db.get(row.tableId)
  const patchfields = ctx.request.body

  // need to build up full patch fields before coerce
  for (let key of Object.keys(patchfields)) {
    if (!table.schema[key]) continue
    row[key] = patchfields[key]
  }

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

  // returned row is cleaned and prepared for writing to DB
  row = await linkRows.updateLinks({
    appId,
    eventType: linkRows.EventType.ROW_UPDATE,
    row,
    tableId: row.tableId,
    table,
  })

  // Creation of a new user goes to the user controller
  if (row.tableId === ViewNames.USERS) {
    // the row has been updated, need to put it into the ctx
    ctx.request.body = row
    await usersController.update(ctx)
    return
  }

  const response = await db.put(row)
  row._rev = response.rev
  row.type = "row"

  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:update`, appId, row, table)
  ctx.body = row
  ctx.status = 200
  ctx.message = `${table.name} updated successfully.`
}

exports.save = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  let row = ctx.request.body
  row.tableId = ctx.params.tableId

  // TODO: find usage of this and break out into own endpoint
  if (ctx.request.body.type === "delete") {
    await bulkDelete(ctx)
    ctx.body = ctx.request.body.rows
    return
  }

  // if the row obj had an _id then it will have been retrieved
  const existingRow = ctx.preExisting
  if (existingRow) {
    ctx.params.id = row._id
    await exports.patch(ctx)
    return
  }

  if (!row._rev && !row._id) {
    row._id = generateRowID(row.tableId)
  }

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
    appId,
    eventType: linkRows.EventType.ROW_SAVE,
    row,
    tableId: row.tableId,
    table,
  })

  // Creation of a new user goes to the user controller
  if (row.tableId === ViewNames.USERS) {
    // the row has been updated, need to put it into the ctx
    ctx.request.body = row
    await usersController.create(ctx)
    return
  }

  row.type = "row"
  const response = await db.put(row)
  row._rev = response.rev
  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:save`, appId, row, table)
  ctx.body = row
  ctx.status = 200
  ctx.message = `${table.name} saved successfully`
}

exports.fetchView = async function(ctx) {
  const appId = ctx.user.appId
  const viewName = ctx.params.viewName

  // if this is a table view being looked for just transfer to that
  if (viewName.startsWith(TABLE_VIEW_BEGINS_WITH)) {
    ctx.params.tableId = viewName.substring(4)
    await exports.fetchTableRows(ctx)
    return
  }

  const db = new CouchDB(appId)
  const { calculation, group, field } = ctx.query
  const response = await db.query(`database/${viewName}`, {
    include_docs: !calculation,
    group,
  })

  if (!calculation) {
    response.rows = response.rows.map(row => row.doc)
    let table
    try {
      table = await db.get(ctx.params.tableId)
    } catch (err) {
      table = {
        schema: {},
      }
    }
    ctx.body = await enrichRows(appId, table, response.rows)
  }

  if (calculation === CALCULATION_TYPES.STATS) {
    response.rows = response.rows.map(row => ({
      group: row.key,
      field,
      ...row.value,
      avg: row.value.sum / row.value.count,
    }))
    ctx.body = response.rows
  }

  if (
    calculation === CALCULATION_TYPES.COUNT ||
    calculation === CALCULATION_TYPES.SUM
  ) {
    ctx.body = response.rows.map(row => ({
      group: row.key,
      field,
      value: row.value,
    }))
  }
}

exports.createIndex = async function(ctx) {
  const appId = "app_1987903cf3604d459969c80cf17651a0"
  const db = new CouchDB(appId)

  const indexes = await db.getIndexes()

  // ctx.body = await db.get("_design/search_ddoc")
  ctx.body = await db.createIndex({
    index: {
      fields: ctx.request.body.fields,
      name: "other_search_index",
      ddoc: "search_ddoc",
      type: "json",
    },
  })
  // ctx.body = await db.getIndexes()
}

exports.search = async function(ctx) {
  // const appId = ctx.user.appId
  const appId = "app_1987903cf3604d459969c80cf17651a0"

  const db = new CouchDB(appId)

  const {
    query,
    pagination: { pageSize = 10, page },
  } = ctx.request.body

  query.tableId = ctx.params.tableId

  // Paginating
  // if (cursor) {
  //   if (backwards) {
  //     query._id = { $lte: cursor }
  //   } else {
  //     query._id = { $gte: cursor }
  //   }
  // }

  const response = await db.find({
    selector: query,
    limit: pageSize,
    skip: pageSize * page,
    // sort: ["_id"],
  })

  const rows = response.docs

  // delete passwords from users
  if (query.tableId === ViewNames.USERS) {
    for (let row of rows) {
      delete row.password
    }
  }

  // ctx.body = response
  ctx.body = await linkRows.attachLinkInfo(appId, rows)
}

exports.fetchTableRows = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)

  // special case for users, fetch through the user controller
  let rows,
    table = await db.get(ctx.params.tableId)
  if (ctx.params.tableId === ViewNames.USERS) {
    await usersController.fetch(ctx)
    rows = ctx.body
  } else {
    const response = await db.allDocs(
      getRowParams(ctx.params.tableId, null, {
        include_docs: true,
      })
    )
    rows = response.rows.map(row => row.doc)
  }
  ctx.body = await enrichRows(appId, table, rows)
}

exports.find = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  try {
    const table = await db.get(ctx.params.tableId)
    const row = await findRow(db, appId, ctx.params.tableId, ctx.params.rowId)
    ctx.body = await enrichRows(appId, table, row)
  } catch (err) {
    ctx.throw(400, err)
  }
}

exports.destroy = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  const row = await db.get(ctx.params.rowId)
  if (row.tableId !== ctx.params.tableId) {
    ctx.throw(400, "Supplied tableId doesn't match the row's tableId")
    return
  }
  await linkRows.updateLinks({
    appId,
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId: row.tableId,
  })
  ctx.body = await db.remove(ctx.params.rowId, ctx.params.revId)
  ctx.status = 200

  // for automations include the row that was deleted
  ctx.row = row
  ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, row)
}

exports.validate = async function(ctx) {
  const errors = await validate({
    appId: ctx.user.appId,
    tableId: ctx.params.tableId,
    row: ctx.request.body,
  })
  ctx.status = 200
  ctx.body = errors
}

async function validate({ appId, tableId, row, table }) {
  if (!table) {
    const db = new CouchDB(appId)
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

exports.fetchEnrichedRow = async function(ctx) {
  const appId = ctx.user.appId
  const db = new CouchDB(appId)
  const tableId = ctx.params.tableId
  const rowId = ctx.params.rowId
  if (appId == null || tableId == null || rowId == null) {
    ctx.status = 400
    ctx.body = {
      status: 400,
      error:
        "Cannot handle request, URI params have not been successfully prepared.",
    }
    return
  }
  // need table to work out where links go in row
  let [table, row] = await Promise.all([
    db.get(tableId),
    findRow(db, appId, tableId, rowId),
  ])
  // get the link docs
  const linkVals = await linkRows.getLinkDocuments({
    appId,
    tableId,
    rowId,
  })
  // look up the actual rows based on the ids
  const response = await db.allDocs({
    include_docs: true,
    keys: linkVals.map(linkVal => linkVal.id),
  })
  // need to include the IDs in these rows for any links they may have
  let linkedRows = await enrichRows(
    appId,
    table,
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

async function bulkDelete(ctx) {
  const appId = ctx.user.appId
  const { rows } = ctx.request.body
  const db = new CouchDB(appId)

  const linkUpdates = rows.map(row =>
    linkRows.updateLinks({
      appId,
      eventType: linkRows.EventType.ROW_DELETE,
      row,
      tableId: row.tableId,
    })
  )

  await db.bulkDocs(rows.map(row => ({ ...row, _deleted: true })))
  await Promise.all(linkUpdates)

  rows.forEach(row => {
    ctx.eventEmitter && ctx.eventEmitter.emitRow(`row:delete`, appId, row)
  })
}

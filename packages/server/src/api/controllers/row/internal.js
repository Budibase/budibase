const CouchDB = require("../../../db")
const linkRows = require("../../../db/linkedRows")
const {
  getRowParams,
  generateRowID,
  DocumentTypes,
  InternalTables,
} = require("../../../db/utils")
const userController = require("../user")
const {
  inputProcessing,
  outputProcessing,
} = require("../../../utilities/rowProcessor")
const { FieldTypes } = require("../../../constants")
const { isEqual } = require("lodash")
const { validate, findRow } = require("./utils")
const { fullSearch, paginatedSearch } = require("./internalSearch")

const CALCULATION_TYPES = {
  SUM: "sum",
  COUNT: "count",
  STATS: "stats",
}

exports.patch = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const inputs = ctx.request.body
  const tableId = inputs.tableId
  const isUserTable = tableId === InternalTables.USER_METADATA
  let dbRow
  try {
    dbRow = await db.get(inputs._id)
  } catch (err) {
    if (isUserTable) {
      // don't include the rev, it'll be the global rev
      // this time
      dbRow = {
        _id: inputs._id,
      }
    } else {
      throw "Row does not exist"
    }
  }
  let dbTable = await db.get(tableId)
  // need to build up full patch fields before coerce
  for (let key of Object.keys(inputs)) {
    if (!dbTable.schema[key]) continue
    dbRow[key] = inputs[key]
  }

  // this returns the table and row incase they have been updated
  let { table, row } = inputProcessing(ctx.user, dbTable, dbRow)
  const validateResult = await validate({
    row,
    table,
  })

  if (!validateResult.valid) {
    throw validateResult.errors
  }

  // returned row is cleaned and prepared for writing to DB
  row = await linkRows.updateLinks({
    appId,
    eventType: linkRows.EventType.ROW_UPDATE,
    row,
    tableId: row.tableId,
    table,
  })

  if (isUserTable) {
    // the row has been updated, need to put it into the ctx
    ctx.request.body = row
    await userController.updateMetadata(ctx)
    return { row: ctx.body, table }
  }

  const response = await db.put(row)
  // don't worry about rev, tables handle rev/lastID updates
  if (!isEqual(dbTable, table)) {
    await db.put(table)
  }
  row._rev = response.rev
  row.type = "row"
  return { row, table }
}

exports.save = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  let inputs = ctx.request.body
  inputs.tableId = ctx.params.tableId

  if (!inputs._rev && !inputs._id) {
    inputs._id = generateRowID(inputs.tableId)
  }

  // this returns the table and row incase they have been updated
  const dbTable = await db.get(inputs.tableId)
  let { table, row } = inputProcessing(ctx.user, dbTable, inputs)
  const validateResult = await validate({
    row,
    table,
  })

  if (!validateResult.valid) {
    throw validateResult.errors
  }

  // make sure link rows are up to date
  row = await linkRows.updateLinks({
    appId,
    eventType: linkRows.EventType.ROW_SAVE,
    row,
    tableId: row.tableId,
    table,
  })

  row.type = "row"
  const response = await db.put(row)
  // don't worry about rev, tables handle rev/lastID updates
  if (!isEqual(dbTable, table)) {
    await db.put(table)
  }
  row._rev = response.rev
  return { row, table }
}

exports.fetchView = async ctx => {
  const appId = ctx.appId
  const viewName = ctx.params.viewName

  // if this is a table view being looked for just transfer to that
  if (viewName.includes(DocumentTypes.TABLE)) {
    ctx.params.tableId = viewName
    return exports.fetch(ctx)
  }

  const db = new CouchDB(appId)
  const { calculation, group, field } = ctx.query
  const designDoc = await db.get("_design/database")
  const viewInfo = designDoc.views[viewName]
  if (!viewInfo) {
    throw "View does not exist."
  }
  const response = await db.query(`database/${viewName}`, {
    include_docs: !calculation,
    group: !!group,
  })

  let rows
  if (!calculation) {
    response.rows = response.rows.map(row => row.doc)
    let table
    try {
      table = await db.get(viewInfo.meta.tableId)
    } catch (err) {
      /* istanbul ignore next */
      table = {
        schema: {},
      }
    }
    rows = await outputProcessing(appId, table, response.rows)
  }

  if (calculation === CALCULATION_TYPES.STATS) {
    response.rows = response.rows.map(row => ({
      group: row.key,
      field,
      ...row.value,
      avg: row.value.sum / row.value.count,
    }))
    rows = response.rows
  }

  if (
    calculation === CALCULATION_TYPES.COUNT ||
    calculation === CALCULATION_TYPES.SUM
  ) {
    rows = response.rows.map(row => ({
      group: row.key,
      field,
      value: row.value,
    }))
  }
  return rows
}

exports.fetch = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)

  let rows,
    table = await db.get(ctx.params.tableId)
  if (ctx.params.tableId === InternalTables.USER_METADATA) {
    await userController.fetchMetadata(ctx)
    rows = ctx.body
  } else {
    const response = await db.allDocs(
      getRowParams(ctx.params.tableId, null, {
        include_docs: true,
      })
    )
    rows = response.rows.map(row => row.doc)
  }
  return outputProcessing(appId, table, rows)
}

exports.find = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const table = await db.get(ctx.params.tableId)
  let row = await findRow(ctx, db, ctx.params.tableId, ctx.params.rowId)
  row = await outputProcessing(appId, table, row)
  return row
}

exports.destroy = async function (ctx) {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const { _id, _rev } = ctx.request.body
  const row = await db.get(_id)

  if (row.tableId !== ctx.params.tableId) {
    throw "Supplied tableId doesn't match the row's tableId"
  }
  await linkRows.updateLinks({
    appId,
    eventType: linkRows.EventType.ROW_DELETE,
    row,
    tableId: row.tableId,
  })
  if (ctx.params.tableId === InternalTables.USER_METADATA) {
    ctx.params = {
      id: _id,
    }
    await userController.destroyMetadata(ctx)
    return { response: ctx.body, row }
  } else {
    const response = await db.remove(_id, _rev)
    return { response, row }
  }
}

exports.bulkDestroy = async ctx => {
  const appId = ctx.appId
  const { rows } = ctx.request.body
  const db = new CouchDB(appId)

  let updates = rows.map(row =>
    linkRows.updateLinks({
      appId,
      eventType: linkRows.EventType.ROW_DELETE,
      row,
      tableId: row.tableId,
    })
  )
  // TODO remove special user case in future
  if (ctx.params.tableId === InternalTables.USER_METADATA) {
    updates = updates.concat(
      rows.map(row => {
        ctx.params = {
          id: row._id,
        }
        return userController.destroyMetadata(ctx)
      })
    )
  } else {
    await db.bulkDocs(rows.map(row => ({ ...row, _deleted: true })))
  }
  await Promise.all(updates)
  return { response: { ok: true }, rows }
}

exports.search = async ctx => {
  const appId = ctx.appId
  const { tableId } = ctx.params
  const db = new CouchDB(appId)
  const { paginate, query, ...params } = ctx.request.body
  params.version = ctx.version
  params.tableId = tableId

  let response
  if (paginate) {
    response = await paginatedSearch(appId, query, params)
  } else {
    response = await fullSearch(appId, query, params)
  }

  // Enrich search results with relationships
  if (response.rows && response.rows.length) {
    const table = await db.get(tableId)
    response.rows = await outputProcessing(appId, table, response.rows)
  }

  return response
}

exports.validate = async ctx => {
  return validate({
    appId: ctx.appId,
    tableId: ctx.params.tableId,
    row: ctx.request.body,
  })
}

exports.fetchEnrichedRow = async ctx => {
  const appId = ctx.appId
  const db = new CouchDB(appId)
  const tableId = ctx.params.tableId
  const rowId = ctx.params.rowId
  // need table to work out where links go in row
  let [table, row] = await Promise.all([
    db.get(tableId),
    findRow(ctx, db, tableId, rowId),
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
  let linkedRows = await outputProcessing(
    appId,
    table,
    response.rows.map(row => row.doc)
  )
  // insert the link rows in the correct place throughout the main row
  for (let fieldName of Object.keys(table.schema)) {
    let field = table.schema[fieldName]
    if (field.type === FieldTypes.LINK) {
      // find the links that pertain to this field, get their indexes
      const linkIndexes = linkVals
        .filter(link => link.fieldName === fieldName)
        .map(link => linkVals.indexOf(link))
      // find the rows that the links state are linked to this field
      row[fieldName] = linkedRows.filter((linkRow, index) =>
        linkIndexes.includes(index)
      )
    }
  }
  return row
}

const rowController = require("../row")
const { addRev } = require("./utils")

// makes sure that the user doesn't need to pass in the type, tableId or _id params for
// the call to be correct
function fixRow(row, params) {
  if (!params || !row) {
    return row
  }
  if (params.rowId) {
    row._id = params.rowId
  }
  if (params.tableId) {
    row.tableId = params.tableId
  }
  if (!row.type) {
    row.type = "row"
  }
  return row
}

exports.search = async ctx => {
  await rowController.search(ctx)
}

exports.create = async ctx => {
  ctx.request.body = fixRow(ctx.request.body, ctx.params)
  await rowController.save(ctx)
  ctx.body = { row: ctx.body }
}

exports.read = async ctx => {
  await rowController.find(ctx)
  ctx.body = { row: ctx.body }
}

exports.update = async ctx => {
  ctx.request.body = await addRev(fixRow(ctx.request.body, ctx.params.tableId))
  ctx.body = { row: ctx.body }
}

exports.delete = async ctx => {
  // set the body as expected, with the _id and _rev fields
  ctx.request.body = await addRev(fixRow({}, ctx.params.tableId))
  await rowController.destroy(ctx)
  // destroy controller doesn't currently return the row as the body, need to adjust this
  // in the public API to be correct
  ctx.body = { row: ctx.row }
}

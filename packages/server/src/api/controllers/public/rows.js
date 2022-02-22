const rowController = require("../row")

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

exports.create = ctx => {
  ctx.request.body = fixRow(ctx.request.body, ctx.params)
}

exports.read = () => {}

exports.update = async ctx => {
  ctx.request.body = fixRow(ctx.request.body, ctx.params)
}

exports.delete = () => {}

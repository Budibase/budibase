import * as rowController from "../row"
import { addRev } from "./utils"
import { Row, UserCtx } from "@budibase/types"
import { convertBookmark } from "../../../utilities"
import { Next } from "koa"

// makes sure that the user doesn't need to pass in the type, tableId or _id params for
// the call to be correct
export function fixRow(row: Row, params: any) {
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

export async function search(ctx: UserCtx, next: Next) {
  let { sort, paginate, bookmark, limit, query } = ctx.request.body
  // update the body to the correct format of the internal search
  if (!sort) {
    sort = {}
  }
  ctx.request.body = {
    sort: sort.column,
    sortType: sort.type,
    sortOrder: sort.order,
    bookmark: convertBookmark(bookmark),
    paginate,
    limit,
    query,
  }
  await rowController.search(ctx)
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
  ctx.request.body = fixRow(ctx.request.body, ctx.params)
  await rowController.save(ctx)
  await next()
}

export async function read(ctx: UserCtx, next: Next) {
  await rowController.fetchEnrichedRow(ctx)
  await next()
}

export async function update(ctx: UserCtx, next: Next) {
  const { tableId } = ctx.params
  ctx.request.body = await addRev(fixRow(ctx.request.body, ctx.params), tableId)
  await rowController.save(ctx)
  await next()
}

export async function destroy(ctx: UserCtx, next: Next) {
  const { tableId } = ctx.params
  // set the body as expected, with the _id and _rev fields
  ctx.request.body = await addRev(
    fixRow({ _id: ctx.params.rowId }, ctx.params),
    tableId
  )
  await rowController.destroy(ctx)
  // destroy controller doesn't currently return the row as the body, need to adjust this
  // in the public API to be correct
  ctx.body = ctx.row
  await next()
}

export default {
  create,
  read,
  update,
  destroy,
  search,
}

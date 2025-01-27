import { Row, RowSearch } from "./types"
import { RequiredKeys } from "@budibase/types"

function row(body: any): RequiredKeys<Row> {
  delete body._rev
  // have to input everything, since structure unknown
  return {
    ...body,
    _id: body._id,
    tableId: body.tableId,
  }
}

function mapRowSearch(ctx: any): RowSearch {
  const rows = ctx.body.rows.map((body: any) => row(body))
  return {
    data: rows,
    hasNextPage: ctx.body.hasNextPage,
    bookmark: ctx.body.bookmark,
  }
}

function mapRow(ctx: any): { data: Row } {
  return {
    data: row(ctx.body),
  }
}

export default {
  mapRowSearch,
  mapRow,
}

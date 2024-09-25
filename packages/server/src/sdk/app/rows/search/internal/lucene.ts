import { PROTECTED_INTERNAL_COLUMNS } from "@budibase/shared-core"
import { fullSearch, paginatedSearch } from "../utils"
import { InternalTables } from "../../../../../db/utils"
import {
  Row,
  RowSearchParams,
  SearchResponse,
  SortType,
  Table,
  User,
} from "@budibase/types"
import { getGlobalUsersFromMetadata } from "../../../../../utilities/global"
import { outputProcessing } from "../../../../../utilities/rowProcessor"
import pick from "lodash/pick"

export async function search(
  options: RowSearchParams,
  table: Table
): Promise<SearchResponse<Row>> {
  const { tableId } = options

  const { paginate, query } = options

  const params: RowSearchParams = {
    tableId: options.tableId,
    sort: options.sort,
    sortOrder: options.sortOrder,
    sortType: options.sortType,
    limit: options.limit,
    bookmark: options.bookmark,
    version: options.version,
    disableEscaping: options.disableEscaping,
    query: {},
  }

  if (params.sort && !params.sortType) {
    const schema = table.schema
    const sortField = schema[params.sort]
    params.sortType =
      sortField.type === "number" ? SortType.NUMBER : SortType.STRING
  }

  let response
  if (paginate) {
    response = await paginatedSearch(query, params)
  } else {
    response = await fullSearch(query, params)
  }

  // Enrich search results with relationships
  if (response.rows && response.rows.length) {
    // enrich with global users if from users table
    if (tableId === InternalTables.USER_METADATA) {
      response.rows = await getGlobalUsersFromMetadata(response.rows as User[])
    }

    if (options.fields) {
      const fields = [...options.fields, ...PROTECTED_INTERNAL_COLUMNS]
      response.rows = response.rows.map((r: any) => pick(r, fields))
    }

    response.rows = await outputProcessing(table, response.rows, {
      squash: true,
      fromViewId: options.viewId,
    })
  }

  return response
}

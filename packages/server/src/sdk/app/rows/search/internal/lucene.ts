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
  ViewV2,
} from "@budibase/types"
import { getGlobalUsersFromMetadata } from "../../../../../utilities/global"
import { outputProcessing } from "../../../../../utilities/rowProcessor"
import pick from "lodash/pick"
import sdk from "../../../../"

export async function search(
  options: RowSearchParams,
  source: Table | ViewV2
): Promise<SearchResponse<Row>> {
  let table: Table
  if (sdk.views.isView(source)) {
    table = await sdk.views.getTable(source.id)
  } else {
    table = source
  }

  const { paginate, query } = options

  const params: RowSearchParams = {
    tableId: options.tableId,
    viewId: options.viewId,
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
    if (table._id === InternalTables.USER_METADATA) {
      response.rows = await getGlobalUsersFromMetadata(response.rows as User[])
    }

    const visibleFields =
      options.fields ||
      Object.keys(source.schema || {}).filter(
        key => source.schema?.[key].visible !== false
      )
    const allowedFields = [...visibleFields, ...PROTECTED_INTERNAL_COLUMNS]
    response.rows = response.rows.map((r: any) => pick(r, allowedFields))

    response.rows = await outputProcessing(source, response.rows, {
      squash: true,
    })
  }

  return response
}

import { quotas } from "@budibase/pro"
import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
  RequiredKeys,
  SearchParams,
} from "@budibase/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../../sdk"

export async function searchView(
  ctx: UserCtx<SearchViewRowRequest, SearchRowResponse>
) {
  const { viewId } = ctx.params

  const view = await sdk.views.get(viewId)
  if (!view) {
    ctx.throw(404, `View ${viewId} not found`)
  }

  if (view.version !== 2) {
    ctx.throw(400, `This method only supports viewsV2`)
  }

  const table = await sdk.tables.getTable(view?.tableId)

  const viewFields =
    (view.schema &&
      Object.entries(view.schema).length &&
      Object.keys(sdk.views.enrichSchema(view, table.schema).schema)) ||
    undefined

  ctx.status = 200

  const { body } = ctx.request
  const query = dataFilters.buildLuceneQuery(view.query || [])

  const searchOptions: RequiredKeys<SearchViewRowRequest> &
    RequiredKeys<Pick<SearchParams, "tableId" | "query" | "fields">> = {
    tableId: view.tableId,
    query,
    fields: viewFields,
    ...getSortOptions(body, view),
    limit: body.limit,
    bookmark: body.bookmark,
    paginate: body.paginate,
  }

  const result = await quotas.addQuery(() => sdk.rows.search(searchOptions), {
    datasourceId: view.tableId,
  })

  result.rows.forEach(r => (r._viewId = view.id))
  ctx.body = result
}

function getSortOptions(request: SearchViewRowRequest, view: ViewV2) {
  if (request.sort) {
    return {
      sort: request.sort,
      sortOrder: request.sortOrder,
      sortType: request.sortType,
    }
  }
  if (view.sort) {
    return {
      sort: view.sort.field,
      sortOrder: view.sort.order,
      sortType: view.sort.type,
    }
  }

  return {
    sort: undefined,
    sortOrder: undefined,
    sortType: undefined,
  }
}

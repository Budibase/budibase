import { quotas } from "@budibase/pro"
import {
  UserCtx,
  SearchResponse,
  SortOrder,
  SortType,
  ViewV2,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function searchView(ctx: UserCtx<void, SearchResponse>) {
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
    (view.columns &&
      Object.entries(view.columns).length &&
      Object.keys(sdk.views.enrichSchema(view, table.schema).schema)) ||
    undefined

  ctx.status = 200
  const result = await quotas.addQuery(
    () =>
      sdk.rows.search({
        tableId: view.tableId,
        query: view.query || {},
        fields: viewFields,
        ...getSortOptions(ctx, view),
      }),
    {
      datasourceId: view.tableId,
    }
  )

  result.rows.forEach(r => (r._viewId = view.id))
  ctx.body = result
}

function getSortOptions(
  ctx: UserCtx,
  view: ViewV2
):
  | {
      sort: string
      sortOrder?: SortOrder
      sortType?: SortType
    }
  | undefined {
  const { sort_column, sort_order, sort_type } = ctx.query
  if (Array.isArray(sort_column)) {
    ctx.throw(400, "sort_column cannot be an array")
  }
  if (Array.isArray(sort_order)) {
    ctx.throw(400, "sort_order cannot be an array")
  }
  if (Array.isArray(sort_type)) {
    ctx.throw(400, "sort_type cannot be an array")
  }

  if (sort_column) {
    return {
      sort: sort_column,
      sortOrder: sort_order as SortOrder,
      sortType: sort_type as SortType,
    }
  }
  if (view.sort) {
    return {
      sort: view.sort.field,
      sortOrder: view.sort.order,
      sortType: view.sort.type,
    }
  }

  return
}

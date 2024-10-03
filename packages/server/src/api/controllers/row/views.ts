import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
  RequiredKeys,
  RowSearchParams,
} from "@budibase/types"
import sdk from "../../../sdk"
import { context } from "@budibase/backend-core"

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

  const viewFields = Object.entries(view.schema || {})
    .filter(([_, value]) => value.visible)
    .map(([key]) => key)
  const { body } = ctx.request

  await context.ensureSnippetContext(true)

  const searchOptions: RequiredKeys<SearchViewRowRequest> &
    RequiredKeys<
      Pick<RowSearchParams, "tableId" | "viewId" | "query" | "fields">
    > = {
    tableId: view.tableId,
    viewId: view.id,
    query: body.query,
    fields: viewFields,
    ...getSortOptions(body, view),
    limit: body.limit,
    bookmark: body.bookmark,
    paginate: body.paginate,
    countRows: body.countRows,
  }

  const result = await sdk.rows.search(searchOptions, {
    user: sdk.users.getUserContextBindings(ctx.user),
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

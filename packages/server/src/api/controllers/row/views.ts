import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
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

  const { body } = ctx.request

  await context.ensureSnippetContext(true)

  const result = await sdk.rows.search(
    {
      viewId: view.id,
      tableId: view.tableId,
      query: body.query,
      ...getSortOptions(body, view),
      limit: body.limit,
      bookmark: body.bookmark,
      paginate: body.paginate,
      countRows: body.countRows,
    },
    {
      user: sdk.users.getUserContextBindings(ctx.user),
    }
  )

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

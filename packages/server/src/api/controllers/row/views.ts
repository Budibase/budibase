import {
  UserCtx,
  ViewV2,
  SearchViewRowRequest,
  RequiredKeys,
  RowSearchParams,
  PaginatedSearchRowResponse,
  SortOrder,
  SortType,
} from "@budibase/types"
import sdk from "../../../sdk"
import { context } from "@budibase/backend-core"

export async function searchView(
  ctx: UserCtx<SearchViewRowRequest, PaginatedSearchRowResponse>
) {
  const { viewId } = ctx.params

  const view: ViewV2 = await sdk.views.get(viewId)
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

  await context.ensureSnippetContext()

  const searchOptions: RequiredKeys<RowSearchParams> = {
    tableId: view.tableId,
    viewId: view.id,
    query: body.query || {},
    fields: viewFields,
    ...getSortOptions(body, view),
    limit: body.limit,
    bookmark: body.bookmark ?? undefined,
    paginate: body.paginate,
    countRows: body.countRows,
    version: undefined,
    disableEscaping: undefined,
    indexer: undefined,
    rows: undefined,
  }

  const result = await sdk.rows.search(searchOptions, {
    user: sdk.users.getUserContextBindings(ctx.user),
  })
  result.rows.forEach(r => (r._viewId = view.id))

  ctx.body = {
    rows: result.rows,
    bookmark: result.bookmark,
    hasNextPage: result.hasNextPage,
    totalRows: result.totalRows,
  }
}

function getSortOptions(request: SearchViewRowRequest, view: ViewV2) {
  if (request.sort) {
    if (typeof request.sort === "string") {
      return {
        sort: request.sort,
        sortOrder: request.sortOrder,
        sortType: request.sortType ?? undefined,
      }
    }
    return {
      sort: request.sort,
      sortOrder: undefined,
      sortType: undefined,
    }
  }
  if (view.sort) {
    const viewSort = Array.isArray(view.sort) ? view.sort : [view.sort]
    const sort = viewSort.reduce((acc, sortEntry) => {
      if (!sortEntry?.field) {
        return acc
      }
      acc[sortEntry.field] = {
        direction: sortEntry.order || SortOrder.ASCENDING,
        ...(sortEntry.type ? { type: sortEntry.type as SortType } : {}),
      }
      return acc
    }, {} as Record<string, { direction: SortOrder; type?: SortType }>)
    if (Object.keys(sort).length) {
      return {
        sort,
        sortOrder: undefined,
        sortType: undefined,
      }
    }
  }

  return {
    sort: undefined,
    sortOrder: undefined,
    sortType: undefined,
  }
}

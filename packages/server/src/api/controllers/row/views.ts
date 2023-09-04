import { quotas } from "@budibase/pro"
import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
  RequiredKeys,
  SearchParams,
  SearchFilters,
} from "@budibase/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../../sdk"
import { db } from "@budibase/backend-core"

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

  const viewFields = Object.keys(view.schema || {})
  const { body } = ctx.request

  // Enrich saved query with ephemeral query params.
  // We prevent searching on any fields that are saved as part of the query, as
  // that could let users find rows they should not be allowed to access.
  let query = dataFilters.buildLuceneQuery(view.query || [])
  if (body.query) {
    // Extract existing fields
    const existingFields =
      view.query
        ?.filter(filter => filter.field)
        .map(filter => db.removeKeyNumbering(filter.field)) || []

    // Delete extraneous search params that cannot be overridden
    delete body.query.allOr
    delete body.query.onEmptyFilter

    // Carry over filters for unused fields
    Object.keys(body.query).forEach(key => {
      const operator = key as keyof Omit<
        SearchFilters,
        "allOr" | "onEmptyFilter"
      >
      Object.keys(body.query[operator] || {}).forEach(field => {
        if (!existingFields.includes(db.removeKeyNumbering(field))) {
          query[operator]![field] = body.query[operator]![field]
        }
      })
    })
  }

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

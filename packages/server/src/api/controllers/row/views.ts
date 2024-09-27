import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
  SearchFilterKey,
  LogicalOperator,
  SearchFilter,
} from "@budibase/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../../sdk"
import { db, context, features } from "@budibase/backend-core"
import { enrichSearchContext } from "./utils"
import { isExternalTableID } from "../../../integrations/utils"

export async function searchView(
  ctx: UserCtx<SearchViewRowRequest, SearchRowResponse>
) {
  const { viewId } = ctx.params

  const view: ViewV2 = await sdk.views.get(viewId)
  if (!view) {
    ctx.throw(404, `View ${viewId} not found`)
  }
  if (view.version !== 2) {
    ctx.throw(400, `This method only supports viewsV2`)
  }

  const { body } = ctx.request

  const sqsEnabled = await features.flags.isEnabled("SQS")
  const supportsLogicalOperators = isExternalTableID(view.tableId) || sqsEnabled

  // Enrich saved query with ephemeral query params.
  // We prevent searching on any fields that are saved as part of the query, as
  // that could let users find rows they should not be allowed to access.
  let query = supportsLogicalOperators
    ? dataFilters.buildQuery(view.query)
    : dataFilters.buildQueryLegacy(view.query)

  delete query?.onEmptyFilter

  if (body.query) {
    // Delete extraneous search params that cannot be overridden
    delete body.query.onEmptyFilter

    if (!supportsLogicalOperators) {
      // In the unlikely event that a Grouped Filter is in a non-SQS environment
      // It needs to be ignored entirely
      let queryFilters: SearchFilter[] = Array.isArray(view.query)
        ? view.query
        : []

      // Extract existing fields
      const existingFields =
        queryFilters
          ?.filter(filter => filter.field)
          .map(filter => db.removeKeyNumbering(filter.field)) || []

      // Carry over filters for unused fields
      Object.keys(body.query).forEach(key => {
        const operator = key as Exclude<SearchFilterKey, LogicalOperator>
        Object.keys(body.query[operator] || {}).forEach(field => {
          if (query && !existingFields.includes(db.removeKeyNumbering(field))) {
            query[operator]![field] = body.query[operator]![field]
          }
        })
      })
    } else {
      const conditions = query ? [query] : []
      query = {
        $and: {
          conditions: [...conditions, body.query],
        },
      }
    }
  }

  await context.ensureSnippetContext(true)

  const enrichedQuery = await enrichSearchContext(query || {}, {
    user: sdk.users.getUserContextBindings(ctx.user),
  })

  const result = await sdk.rows.search({
    viewId: view.id,
    tableId: view.tableId,
    query: enrichedQuery,
    ...getSortOptions(body, view),
    limit: body.limit,
    bookmark: body.bookmark,
    paginate: body.paginate,
    countRows: body.countRows,
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

import {
  UserCtx,
  ViewV2,
  SearchRowResponse,
  SearchViewRowRequest,
  RequiredKeys,
  RowSearchParams,
  SearchFilterKey,
  LogicalOperator,
} from "@budibase/types"
import { dataFilters } from "@budibase/shared-core"
import sdk from "../../../sdk"
import { db, context } from "@budibase/backend-core"
import { enrichSearchContext } from "./utils"
import { isExternalTableID } from "../../../integrations/utils"

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

  // Enrich saved query with ephemeral query params.
  // We prevent searching on any fields that are saved as part of the query, as
  // that could let users find rows they should not be allowed to access.
  let query = dataFilters.buildQuery(view.query || [])
  if (body.query) {
    // Delete extraneous search params that cannot be overridden
    delete body.query.allOr
    delete body.query.onEmptyFilter

    if (!isExternalTableID(view.tableId) && !db.isSqsEnabledForTenant()) {
      // Extract existing fields
      const existingFields =
        view.query
          ?.filter(filter => filter.field)
          .map(filter => db.removeKeyNumbering(filter.field)) || []

      // Carry over filters for unused fields
      Object.keys(body.query).forEach(key => {
        const operator = key as Exclude<SearchFilterKey, LogicalOperator>
        Object.keys(body.query[operator] || {}).forEach(field => {
          if (!existingFields.includes(db.removeKeyNumbering(field))) {
            query[operator]![field] = body.query[operator]![field]
          }
        })
      })
    } else {
      query = {
        $and: {
          conditions: [query, body.query],
        },
      }
    }
  }

  await context.ensureSnippetContext(true)

  const enrichedQuery = await enrichSearchContext(query, {
    user: sdk.users.getUserContextBindings(ctx.user),
  })

  const searchOptions: RequiredKeys<SearchViewRowRequest> &
    RequiredKeys<Pick<RowSearchParams, "tableId" | "query" | "fields">> = {
    tableId: view.tableId,
    query: enrichedQuery,
    fields: viewFields,
    ...getSortOptions(body, view),
    limit: body.limit,
    bookmark: body.bookmark,
    paginate: body.paginate,
    countRows: body.countRows,
  }

  const result = await sdk.rows.search(searchOptions)
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

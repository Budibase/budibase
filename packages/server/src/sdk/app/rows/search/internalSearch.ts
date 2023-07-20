import { db as dbCore, context, SearchParams } from "@budibase/backend-core"
import { SearchFilters, Row, SearchIndex } from "@budibase/types"

export async function paginatedSearch(
  query: SearchFilters,
  params: SearchParams<Row>
) {
  const appId = context.getAppId()
  return dbCore.paginatedSearch(appId!, SearchIndex.ROWS, query, params)
}

export async function fullSearch(
  query: SearchFilters,
  params: SearchParams<Row>
) {
  const appId = context.getAppId()
  return dbCore.fullSearch(appId!, SearchIndex.ROWS, query, params)
}

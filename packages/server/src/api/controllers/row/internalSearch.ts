import { SearchIndexes } from "../../../db/utils"
import { db as dbCore, context, SearchParams } from "@budibase/backend-core"
import { SearchFilters } from "@budibase/types"

export async function paginatedSearch(
  query: SearchFilters,
  params: SearchParams
) {
  const appId = context.getAppId()
  return dbCore.paginatedSearch(appId!, SearchIndexes.ROWS, query, params)
}

export async function fullSearch(query: SearchFilters, params: SearchParams) {
  const appId = context.getAppId()
  return dbCore.fullSearch(appId!, SearchIndexes.ROWS, query, params)
}

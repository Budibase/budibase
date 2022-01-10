import DataFetch from "./DataFetch.js"
import { executeQuery, fetchQueryDefinition } from "api"
import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"

export default class QueryFetch extends DataFetch {
  determineFeatureFlags(definition) {
    const supportsPagination =
      !!definition?.fields?.pagination?.type &&
      !!definition?.fields?.pagination?.location &&
      !!definition?.fields?.pagination?.pageParam
    return { supportsPagination }
  }

  static async getDefinition(datasource) {
    if (!datasource?._id) {
      return null
    }
    return await fetchQueryDefinition(datasource._id)
  }

  async getData() {
    const { datasource, limit, paginate } = this.options
    const { supportsPagination } = get(this.featureStore)
    const { cursor, definition } = get(this.store)
    const type = definition?.fields?.pagination?.type

    // Set the default query params
    let parameters = cloneDeep(datasource?.queryParams || {})
    for (let param of datasource?.parameters || {}) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }

    // Add pagination to query if supported
    let queryPayload = { queryId: datasource?._id, parameters }
    if (paginate && supportsPagination) {
      const requestCursor = type === "page" ? parseInt(cursor || 1) : cursor
      queryPayload.pagination = { page: requestCursor, limit }
    }

    // Execute query
    const { data, pagination, ...rest } = await executeQuery(queryPayload)

    // Derive pagination info from response
    let nextCursor = null
    let hasNextPage = false
    if (paginate && supportsPagination) {
      if (type === "page") {
        // For "page number" pagination, increment the existing page number
        nextCursor = queryPayload.pagination.page + 1
        hasNextPage = data?.length === limit && limit > 0
      } else {
        // For "cursor" pagination, the cursor should be in the response
        nextCursor = pagination?.cursor
        hasNextPage = nextCursor != null
      }
    }

    return {
      rows: data || [],
      info: rest,
      cursor: nextCursor,
      hasNextPage,
    }
  }
}

import DataFetch from "./DataFetch"
import { Helpers } from "@budibase/bbui"
import { ExecuteQueryRequest, Query } from "@budibase/types"
import { get } from "svelte/store"

interface QueryDatasource {
  _id: string
  fields: Record<string, any> & {
    pagination?: {
      type: string
      location: string
      pageParam: string
    }
  }
  queryParams?: Record<string, string>
  parameters: { name: string; default: string }[]
}

export default class QueryFetch extends DataFetch<QueryDatasource, Query> {
  async determineFeatureFlags() {
    const definition = await this.getDefinition()
    const supportsPagination =
      !!definition?.fields?.pagination?.type &&
      !!definition?.fields?.pagination?.location &&
      !!definition?.fields?.pagination?.pageParam
    return { supportsPagination }
  }

  async getDefinition() {
    const { datasource } = this.options

    if (!datasource?._id) {
      return null
    }
    try {
      const definition = await this.API.fetchQueryDefinition(datasource._id)
      // After getting the definition of query, it loses "fields" attribute
      // because of security reason from the server. However, this attribute
      // needs to be inside the definition for pagination.
      if (!definition.fields) {
        definition.fields = datasource.fields
      }
      return definition
    } catch (error) {
      return null
    }
  }

  getDefaultSortColumn() {
    return null
  }

  async getData() {
    const { datasource, limit, paginate } = this.options
    const { supportsPagination } = this.features
    const { cursor, definition } = get(this.store)
    const type = definition?.fields?.pagination?.type

    // Set the default query params
    const parameters = Helpers.cloneDeep(datasource.queryParams || {})
    for (const param of datasource?.parameters || []) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }

    // Add pagination to query if supported
    const queryPayload: ExecuteQueryRequest = { parameters }
    if (paginate && supportsPagination) {
      const requestCursor = type === "page" ? parseInt(cursor || "1") : cursor
      queryPayload.pagination = { page: requestCursor, limit }
    }

    // Execute query
    try {
      const res = await this.API.executeQuery(datasource?._id, queryPayload)
      const { data, pagination, ...rest } = res

      // Derive pagination info from response
      let nextCursor = null
      let hasNextPage = false
      if (paginate && supportsPagination) {
        if (type === "page") {
          // For "page number" pagination, increment the existing page number
          nextCursor = queryPayload.pagination!.page! + 1
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
    } catch (error) {
      return {
        rows: [],
        hasNextPage: false,
      }
    }
  }
}

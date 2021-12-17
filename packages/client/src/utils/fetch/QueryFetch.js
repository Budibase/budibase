import DataFetch from "./DataFetch.js"
import { executeQuery, fetchQueryDefinition } from "api"
import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"

export default class QueryFetch extends DataFetch {
  determineFeatureFlags(definition) {
    console.log("pagination config", definition?.fields?.pagination)
    this.supportsPagination =
      definition?.fields?.pagination?.type != null &&
      definition?.fields?.pagination?.pageParam != null
  }

  static async getDefinition(datasource) {
    if (!datasource?._id) {
      return null
    }
    return await fetchQueryDefinition(datasource._id)
  }

  async getData() {
    const { datasource, limit } = this.options

    // Set the default query params
    let parameters = cloneDeep(datasource?.queryParams || {})
    for (let param of datasource?.parameters || {}) {
      if (!parameters[param.name]) {
        parameters[param.name] = param.default
      }
    }

    // Add pagination to query if supported
    let queryPayload = { queryId: datasource?._id, parameters }
    if (this.supportsPagination) {
      const { cursor, definition, pageNumber } = get(this.store)
      const { type } = definition.fields.pagination
      const page = type === "page" ? pageNumber : cursor
      queryPayload.pagination = { page, limit }
    }

    const { data, pagination, ...rest } = await executeQuery(queryPayload)
    return {
      rows: data || [],
      info: rest,
      cursor: pagination?.page,
      hasNextPage: data?.length === limit && limit > 0,
    }
  }
}

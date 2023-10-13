import DataFetch from "./DataFetch.js"
import { get } from "svelte/store"

export default class ViewV2Fetch extends DataFetch {
  determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  getSchema(datasource, definition) {
    return definition?.schema
  }

  async getDefinition(datasource) {
    if (!datasource?.id) {
      return null
    }
    try {
      const res = await this.API.viewV2.fetchDefinition(datasource.id)
      return res?.data
    } catch (error) {
      this.store.update(state => ({
        ...state,
        error,
      }))
      return null
    }
  }

  getDefaultSortColumn() {
    return null
  }

  async getData() {
    const {
      datasource,
      limit,
      sortColumn,
      sortOrder,
      sortType,
      paginate,
      filter,
    } = this.options
    const { cursor, query, definition } = get(this.store)

    // If sort params are not defined, update options to store the sorting
    // params built in to this view. This ensures that we can accurately
    // compare old and new sorting params and skip a redundant API call.
    if (!sortColumn && definition.sort?.field) {
      this.options.sortColumn = definition.sort.field
      this.options.sortOrder = definition.sort.order
    }

    // If sort params are not defined, update options to store the sorting
    // params built in to this view. This ensures that we can accurately
    // compare old and new sorting params and skip a redundant API call.
    if (!filter?.length && definition.query?.length) {
      this.options.filter = definition.query
    }

    try {
      const res = await this.API.viewV2.fetch({
        viewId: datasource.id,
        query,
        paginate,
        limit,
        bookmark: cursor,
        sort: sortColumn,
        sortOrder: sortOrder?.toLowerCase(),
        sortType,
      })
      return {
        rows: res?.rows || [],
        hasNextPage: res?.hasNextPage || false,
        cursor: res?.bookmark || null,
      }
    } catch (error) {
      return {
        rows: [],
        hasNextPage: false,
        error,
      }
    }
  }
}

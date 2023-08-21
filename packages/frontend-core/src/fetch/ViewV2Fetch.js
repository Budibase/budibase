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
    const { datasource, limit, sortColumn, sortOrder, sortType, paginate } =
      this.options
    const { cursor, query } = get(this.store)
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

import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"

export default class TableFetch extends DataFetch {
  determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  async getData() {
    const { datasource, limit, sortColumn, sortOrder, sortType, paginate } =
      this.options
    const { tableId } = datasource
    const { cursor, query } = get(this.store)

    // Search table
    try {
      const res = await this.API.searchTable({
        tableId,
        query,
        limit,
        sort: sortColumn,
        sortOrder: sortOrder?.toLowerCase() ?? "ascending",
        sortType,
        paginate,
        bookmark: cursor,
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

import { get } from "svelte/store"
import DataFetch from "./DataFetch.js"
import { SortOrder, Table, UITable } from "@budibase/types"

export default class TableFetch extends DataFetch<UITable, Table> {
  determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  async getDefinition(datasource: UITable) {
    if (!datasource?.tableId) {
      return null
    }
    try {
      return await this.API.fetchTableDefinition(datasource.tableId)
    } catch (error: any) {
      this.store.update(state => ({
        ...state,
        error,
      }))
      return null
    }
  }

  getSchema(_datasource: UITable | null, definition: Table | null) {
    return definition?.schema
  }

  async getData() {
    const { datasource, limit, sortColumn, sortOrder, sortType, paginate } =
      this.options
    const { tableId } = datasource
    const { cursor, query } = get(this.store)

    // Search table
    try {
      const res = await this.API.searchTable(tableId, {
        query: query ?? undefined,
        limit,
        sort: sortColumn,
        sortOrder: sortOrder ?? SortOrder.ASCENDING,
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

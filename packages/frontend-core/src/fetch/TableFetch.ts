import { get } from "svelte/store"
import BaseDataFetch from "./DataFetch"
import { SortOrder, Table, TableDatasource } from "@budibase/types"

export default class TableFetch extends BaseDataFetch<TableDatasource, Table> {
  async determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  async getDefinition() {
    const { datasource } = this.options

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

  async getData() {
    const { datasource, limit, sortColumn, sortOrder, sortType, paginate } =
      this.options
    const { tableId } = datasource
    const { cursor, query } = get(this.store)

    // Search table
    try {
      const res = await this.API.searchTable(tableId, {
        query,
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

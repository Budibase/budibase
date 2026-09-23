import { get } from "svelte/store"
import BaseDataFetch from "./DataFetch"
import {
  SortField,
  SortJson,
  SortOrder,
  SortType,
  Table,
  TableDatasource,
} from "@budibase/types"

const buildSortPayload = (sorts?: SortField[] | null) => {
  if (!sorts?.length) {
    return undefined
  }
  const sort: SortJson = {}
  sorts.forEach(sortEntry => {
    if (!sortEntry?.field) {
      return
    }
    sort[sortEntry.field] = {
      direction: sortEntry.order || SortOrder.ASCENDING,
      ...(sortEntry.type ? { type: sortEntry.type as SortType } : {}),
    }
  })
  return Object.keys(sort).length ? sort : undefined
}

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
    const { datasource, limit, sorts, paginate } = this.options
    const { tableId } = datasource
    const { cursor, query } = get(this.store)
    const sort = buildSortPayload(sorts)

    // Search table
    try {
      const res = await this.API.searchTable(tableId, {
        query,
        limit,
        sort,
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

import { ViewV2Type } from "@budibase/types"
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
    const { cursor, query, definition } = get(this.store)

    // If this is a calculation view and we have no calculations, return nothing
    if (
      definition.type === ViewV2Type.CALCULATION &&
      !Object.values(definition.schema || {}).some(x => x.calculationType)
    ) {
      return {
        rows: [],
        hasNextPage: false,
        cursor: null,
        error: null,
      }
    }

    // If sort/filter params are not defined, update options to store the
    // params built in to this view. This ensures that we can accurately
    // compare old and new params and skip a redundant API call.
    if (!sortColumn && definition.sort?.field) {
      this.options.sortColumn = definition.sort.field
      this.options.sortOrder = definition.sort.order
    }

    try {
      const res = await this.API.viewV2.fetch({
        viewId: datasource.id,
        ...(query ? { query } : {}),
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
        cursor: null,
        error,
      }
    }
  }
}

import {
  SortOrder,
  ViewDatasource,
  ViewV2Enriched,
  ViewV2Type,
} from "@budibase/types"
import BaseDataFetch from "./DataFetch"
import { get } from "svelte/store"
import { helpers } from "@budibase/shared-core"

export default class ViewV2Fetch extends BaseDataFetch<
  ViewDatasource,
  ViewV2Enriched
> {
  async determineFeatureFlags() {
    return {
      supportsSearch: true,
      supportsSort: true,
      supportsPagination: true,
    }
  }

  async getDefinition() {
    const { datasource } = this.options

    try {
      const res = await this.API.viewV2.fetchDefinition(datasource.id)
      return res?.data
    } catch (error: any) {
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
      sorts,
      paginate,
    } = this.options
    const { cursor, query, definition } = get(this.store)

    // If this is a calculation view and we have no calculations, return nothing
    if (
      definition?.type === ViewV2Type.CALCULATION &&
      !Object.values(definition.schema || {}).some(
        helpers.views.isCalculationField
      )
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
    const definitionPrimarySort = definition?.sorts?.[0] || definition?.sort
    if (!sortColumn && definitionPrimarySort?.field) {
      this.options.sortColumn = definitionPrimarySort.field
      this.options.sortOrder =
        definitionPrimarySort.order || SortOrder.ASCENDING
    }

    const definitionSecondarySorts = definition?.sorts?.slice(1) || []

    const requestSorts = sorts?.length
      ? sorts
      : sortColumn && definitionSecondarySorts.length
        ? [
            {
              sort: sortColumn,
              sortOrder: sortOrder,
              sortType: sortType ?? undefined,
            },
            ...definitionSecondarySorts
              .filter(s => s?.field && s.field !== sortColumn)
              .map(s => ({
                sort: s.field,
                sortOrder: s.order || SortOrder.ASCENDING,
                sortType: s.type ?? undefined,
              })),
          ]
        : undefined

    try {
      const request = {
        query,
        paginate,
        limit,
        bookmark: cursor,
        sort: sortColumn,
        sortOrder: sortOrder,
        sortType,
        sorts: requestSorts,
      }

      if (paginate) {
        const res = await this.API.viewV2.fetch(datasource.id, {
          ...request,
          paginate,
        })
        return {
          rows: res?.rows || [],
          hasNextPage: res?.hasNextPage || false,
          cursor: res?.bookmark || null,
        }
      } else {
        const res = await this.API.viewV2.fetch(datasource.id, {
          ...request,
          paginate,
        })
        return {
          rows: res?.rows || [],
          hasNextPage: false,
          cursor: null,
        }
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

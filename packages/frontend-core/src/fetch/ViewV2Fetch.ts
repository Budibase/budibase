import {
  SortOrder,
  SortField,
  SortJson,
  SortType,
  ViewDatasource,
  ViewV2Enriched,
  ViewV2Type,
} from "@budibase/types"
import BaseDataFetch from "./DataFetch"
import { get } from "svelte/store"
import { helpers } from "@budibase/shared-core"

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
    if (!sortColumn && definition?.sort && !sorts?.length) {
      this.options.sorts = (
        Array.isArray(definition.sort) ? definition.sort : [definition.sort]
      ).filter(sortEntry => sortEntry?.field)
    }

    const sortPayload = buildSortPayload(this.options.sorts)

    try {
      const request = {
        query,
        paginate,
        limit,
        bookmark: cursor,
        sort: sortPayload || sortColumn,
        sortOrder: sortPayload ? undefined : sortOrder,
        sortType: sortPayload ? undefined : sortType,
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

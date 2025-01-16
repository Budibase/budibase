import { get } from "svelte/store"
import {
  Row,
  SaveRowRequest,
  SortOrder,
  UIDatasource,
  UpdateViewRequest,
} from "@budibase/types"
import { Store as StoreContext } from ".."
import { DatasourceViewActions } from "."
import ViewV2Fetch from "../../../../fetch/ViewV2Fetch"

const SuppressErrors = true

interface ViewActions {
  viewV2: {
    actions: DatasourceViewActions
  }
}

export type Store = ViewActions

export const createActions = (context: StoreContext): ViewActions => {
  const { API, datasource, columns } = context

  const saveDefinition = async (newDefinition: UpdateViewRequest) => {
    await API.viewV2.update(newDefinition)
  }

  const saveRow = async (row: SaveRowRequest) => {
    const $datasource = get(datasource)
    row = {
      ...row,
      tableId: $datasource?.tableId,
      _viewId: $datasource?.id,
    }
    const newRow = await API.saveRow(row, SuppressErrors)
    return {
      ...newRow,
      _id: newRow._id!,
      _viewId: row._viewId,
    }
  }

  const deleteRows = async (rows: Row[]) => {
    await API.deleteRows(get(datasource).id, rows)
  }

  const getRow = async (id: string) => {
    const res = await API.viewV2.fetch(get(datasource).id, {
      limit: 1,
      query: {
        equal: {
          _id: id,
        },
      },
      paginate: false,
    })
    const row = res?.rows?.[0]
    if (!row) {
      return
    }

    return { ...row, _id: row._id! }
  }

  const isDatasourceValid = (datasource: UIDatasource) => {
    return (
      datasource?.type === "viewV2" && !!datasource?.id && !!datasource?.tableId
    )
  }

  const canUseColumn = (name: string) => {
    return get(columns).some(col => col.name === name && col.visible)
  }

  return {
    viewV2: {
      actions: {
        saveDefinition,
        addRow: saveRow,
        updateRow: saveRow,
        deleteRows,
        getRow,
        isDatasourceValid,
        canUseColumn,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const {
    definition,
    datasource,
    sort,
    rows,
    filter,
    inlineFilters,
    allFilters,
    subscribe,
    viewV2,
    initialFilter,
    initialSortColumn,
    initialSortOrder,
    config,
    fetch,
  } = context

  // Keep a list of subscriptions so that we can clear them when the datasource
  // config changes
  let unsubscribers: any[] = []

  // Observe datasource changes and apply logic for view V2 datasources
  datasource.subscribe($datasource => {
    // Clear previous subscriptions
    unsubscribers?.forEach(unsubscribe => unsubscribe())
    unsubscribers = []
    if (!viewV2.actions.isDatasourceValid($datasource)) {
      return
    }

    // Reset state for new view
    filter.set(get(initialFilter) ?? undefined)
    inlineFilters.set([])
    sort.set({
      column: get(initialSortColumn),
      order: get(initialSortOrder) || SortOrder.ASCENDING,
    })

    // Keep sort and filter state in line with the view definition when in builder
    unsubscribers.push(
      definition.subscribe($definition => {
        if (!get(config).canSaveSchema) {
          return
        }
        if (!$definition || !("id" in $definition)) {
          return
        }
        if ($definition?.id !== $datasource.id) {
          return
        }
        // Only override sorting if we don't have an initial sort column
        if (!get(initialSortColumn)) {
          sort.set({
            column: $definition.sort?.field,
            order: $definition.sort?.order || SortOrder.ASCENDING,
          })
        }
        // Only override filter state if we don't have an initial filter
        if (!get(initialFilter)) {
          filter.set($definition.queryUI)
        }
      })
    )

    function sortHasChanged(
      newSort: {
        column: string | null | undefined
        order: SortOrder
      },
      existingSort?: {
        field: string
        order?: SortOrder
      }
    ) {
      const newColumn = newSort.column ?? null
      const existingColumn = existingSort?.field ?? null
      if (newColumn !== existingColumn) {
        return true
      }

      if (!newColumn) {
        return false
      }

      const newOrder = newSort.order ?? null
      const existingOrder = existingSort?.order ?? null
      if (newOrder !== existingOrder) {
        return true
      }

      return false
    }

    // When sorting changes, ensure view definition is kept up to date
    unsubscribers.push(
      sort.subscribe(async $sort => {
        // Ensure we're updating the correct view
        const $view = get(definition)
        if (!$view || !("id" in $view)) {
          return
        }
        if ($view?.id !== $datasource.id) {
          return
        }

        // Skip if nothing actually changed
        if (!sortHasChanged($sort, $view.sort)) {
          return
        }

        // If we can mutate schema then update the view definition
        if (get(config).canSaveSchema) {
          await datasource.actions.saveDefinition({
            ...$view,
            sort: {
              field: $sort.column!,
              order: $sort.order || SortOrder.ASCENDING,
            },
          })
        }

        // Also update the fetch to ensure the new sort is respected.
        // Ensure we're updating the correct fetch.
        const $fetch = get(fetch) as ViewV2Fetch | null
        if ($fetch?.options?.datasource?.id !== $datasource.id) {
          return
        }
        $fetch.update({
          sortOrder: $sort.order,
          sortColumn: $sort.column ?? undefined,
        })
      })
    )

    // When filters change, ensure view definition is kept up to date
    unsubscribers?.push(
      filter.subscribe(async $filter => {
        if (!get(config).canSaveSchema) {
          return
        }
        const $view = get(definition)
        if (!$view || !("id" in $view)) {
          return
        }
        if ($view?.id !== $datasource.id) {
          return
        }
        if (JSON.stringify($filter) !== JSON.stringify($view.queryUI)) {
          await datasource.actions.saveDefinition({
            ...$view,
            queryUI: $filter,
          } as never as UpdateViewRequest)

          // Refresh data since view definition changed
          await rows.actions.refreshData()
        }
      })
    )

    // Keep fetch up to date with inline filters when in the data section
    unsubscribers.push(
      inlineFilters.subscribe($inlineFilters => {
        if (!get(config).canSaveSchema) {
          return
        }
        const $fetch = get(fetch) as ViewV2Fetch | null
        if ($fetch?.options?.datasource?.id !== $datasource.id) {
          return
        }
        $fetch.update({
          filter: $inlineFilters,
        })
      })
    )

    // Keep fetch up to date with all filters when not in the data section
    unsubscribers.push(
      allFilters.subscribe($allFilters => {
        if (get(config).canSaveSchema) {
          return
        }
        const $fetch = get(fetch) as ViewV2Fetch | null
        if ($fetch?.options?.datasource?.id !== $datasource.id) {
          return
        }
        $fetch.update({
          filter: $allFilters,
        })
      })
    )

    // When hidden we show columns, we need to refresh data in order to fetch
    // values for those columns
    unsubscribers.push(
      subscribe("show-column", async () => {
        await rows.actions.refreshData()
      })
    )
  })
}

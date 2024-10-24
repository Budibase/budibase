import { get } from "svelte/store"
import { SortOrder } from "@budibase/types"

const SuppressErrors = true

export const createActions = context => {
  const { API, datasource, columns } = context

  const saveDefinition = async newDefinition => {
    await API.viewV2.update(newDefinition)
  }

  const saveRow = async row => {
    const $datasource = get(datasource)
    row = {
      ...row,
      tableId: $datasource?.tableId,
      _viewId: $datasource?.id,
    }
    return {
      ...(await API.saveRow(row, SuppressErrors)),
      _viewId: row._viewId,
    }
  }

  const deleteRows = async rows => {
    await API.deleteRows({
      tableId: get(datasource).id,
      rows,
    })
  }

  const getRow = async id => {
    const res = await API.viewV2.fetch({
      viewId: get(datasource).id,
      limit: 1,
      query: {
        equal: {
          _id: id,
        },
      },
      paginate: false,
    })
    return res?.rows?.[0]
  }

  const isDatasourceValid = datasource => {
    return (
      datasource?.type === "viewV2" && datasource?.id && datasource?.tableId
    )
  }

  const canUseColumn = name => {
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

export const initialise = context => {
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
  let unsubscribers = []

  // Observe datasource changes and apply logic for view V2 datasources
  datasource.subscribe($datasource => {
    // Clear previous subscriptions
    unsubscribers?.forEach(unsubscribe => unsubscribe())
    unsubscribers = []
    if (!viewV2.actions.isDatasourceValid($datasource)) {
      return
    }

    // Reset state for new view
    filter.set(get(initialFilter))
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

    // When sorting changes, ensure view definition is kept up to date
    unsubscribers.push(
      sort.subscribe(async $sort => {
        // Ensure we're updating the correct view
        const $view = get(definition)
        if ($view?.id !== $datasource.id) {
          return
        }

        // Skip if nothing actually changed
        if (
          $sort?.column === $view.sort?.field &&
          $sort?.order === $view.sort?.order
        ) {
          return
        }

        // If we can mutate schema then update the view definition
        if (get(config).canSaveSchema) {
          await datasource.actions.saveDefinition({
            ...$view,
            sort: {
              field: $sort.column,
              order: $sort.order || SortOrder.ASCENDING,
            },
          })
        }

        // Also update the fetch to ensure the new sort is respected.
        // Ensure we're updating the correct fetch.
        const $fetch = get(fetch)
        if ($fetch?.options?.datasource?.id !== $datasource.id) {
          return
        }
        $fetch.update({
          sortOrder: $sort.order,
          sortColumn: $sort.column,
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
        if ($view?.id !== $datasource.id) {
          return
        }
        if (JSON.stringify($filter) !== JSON.stringify($view.queryUI)) {
          await datasource.actions.saveDefinition({
            ...$view,
            queryUI: $filter,
          })

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
        const $fetch = get(fetch)
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
        const $fetch = get(fetch)
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

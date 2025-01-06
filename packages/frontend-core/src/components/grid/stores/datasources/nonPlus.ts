import { SortOrder, UIDatasource } from "@budibase/types"
import { get } from "svelte/store"
import { Store as StoreContext } from ".."
import { DatasourceNonPlusActions } from "."

interface NonPlusActions {
  nonPlus: {
    actions: DatasourceNonPlusActions
  }
}

export type Store = NonPlusActions

export const createActions = (context: StoreContext): NonPlusActions => {
  const { columns, table, viewV2 } = context

  const saveDefinition = async () => {
    throw "This datasource does not support updating the definition"
  }

  const saveRow = async () => {
    throw "This datasource does not support saving rows"
  }

  const deleteRows = async () => {
    throw "This datasource does not support deleting rows"
  }

  const getRow = () => {
    throw "This datasource does not support fetching individual rows"
  }

  const isDatasourceValid = (datasource: UIDatasource) => {
    // There are many different types and shapes of datasource, so we only
    // check that we aren't null
    return (
      !table.actions.isDatasourceValid(datasource) &&
      !viewV2.actions.isDatasourceValid(datasource) &&
      datasource?.type != null
    )
  }

  const canUseColumn = (name: string) => {
    return get(columns).some(col => col.name === name)
  }

  return {
    nonPlus: {
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

// Small util to compare datasource definitions
const isSameDatasource = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const initialise = (context: StoreContext) => {
  const {
    datasource,
    sort,
    filter,
    inlineFilters,
    allFilters,
    nonPlus,
    initialFilter,
    initialSortColumn,
    initialSortOrder,
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
    if (!nonPlus.actions.isDatasourceValid($datasource)) {
      return
    }

    // Wipe state
    filter.set(get(initialFilter) ?? undefined)
    inlineFilters.set([])
    sort.set({
      column: get(initialSortColumn),
      order: get(initialSortOrder) || SortOrder.ASCENDING,
    })

    // Update fetch when filter changes
    unsubscribers.push(
      allFilters.subscribe($allFilters => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if (!isSameDatasource($fetch?.options?.datasource, $datasource)) {
          return
        }
        $fetch?.update({
          filter: $allFilters,
        })
      })
    )

    // Update fetch when sorting changes
    unsubscribers.push(
      sort.subscribe($sort => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if (!isSameDatasource($fetch?.options?.datasource, $datasource)) {
          return
        }
        $fetch?.update({
          sortOrder: $sort.order || SortOrder.ASCENDING,
          sortColumn: $sort.column ?? undefined,
        })
      })
    )
  })
}

import { get } from "svelte/store"

export const createActions = context => {
  const { API, columns, stickyColumn } = context

  const saveDefinition = async newDefinition => {
    await API.saveQuery(newDefinition)
  }

  const saveRow = async () => {
    throw "Rows cannot be updated through queries"
  }

  const deleteRows = async () => {
    throw "Rows cannot be deleted through queries"
  }

  const getRow = () => {
    throw "Queries don't support fetching individual rows"
  }

  const isDatasourceValid = datasource => {
    return datasource?.type === "query" && datasource?._id
  }

  const canUseColumn = name => {
    const $columns = get(columns)
    const $sticky = get(stickyColumn)
    return $columns.some(col => col.name === name) || $sticky?.name === name
  }

  return {
    query: {
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
    datasource,
    sort,
    filter,
    query,
    initialFilter,
    initialSortColumn,
    initialSortOrder,
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
    if (!query.actions.isDatasourceValid($datasource)) {
      return
    }

    // Wipe state
    filter.set(get(initialFilter))
    sort.set({
      column: get(initialSortColumn),
      order: get(initialSortOrder) || "ascending",
    })

    // Update fetch when filter changes
    unsubscribers.push(
      filter.subscribe($filter => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if ($fetch?.options?.datasource?._id !== $datasource._id) {
          return
        }
        $fetch.update({
          filter: $filter,
        })
      })
    )

    // Update fetch when sorting changes
    unsubscribers.push(
      sort.subscribe($sort => {
        // Ensure we're updating the correct fetch
        const $fetch = get(fetch)
        if ($fetch?.options?.datasource?._id !== $datasource._id) {
          return
        }
        $fetch.update({
          sortOrder: $sort.order || "ascending",
          sortColumn: $sort.column,
        })
      })
    )
  })
}

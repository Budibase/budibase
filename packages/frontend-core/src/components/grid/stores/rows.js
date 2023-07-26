import { writable, derived, get } from "svelte/store"
import { fetchData } from "../../../fetch/fetchData"
import { NewRowID, RowPageSize } from "../lib/constants"
import { tick } from "svelte"

const SuppressErrors = true

export const createStores = () => {
  const rows = writable([])
  const table = writable(null)
  const loading = writable(false)
  const loaded = writable(false)
  const rowChangeCache = writable({})
  const inProgressChanges = writable({})
  const hasNextPage = writable(false)
  const error = writable(null)

  // Generate a lookup map to quick find a row by ID
  const rowLookupMap = derived(
    rows,
    $rows => {
      let map = {}
      for (let i = 0; i < $rows.length; i++) {
        map[$rows[i]._id] = i
      }
      return map
    },
    {}
  )

  // Mark loaded as true if we've ever stopped loading
  let hasStartedLoading = false
  loading.subscribe($loading => {
    if ($loading) {
      hasStartedLoading = true
    } else if (hasStartedLoading) {
      loaded.set(true)
    }
  })

  return {
    rows,
    rowLookupMap,
    table,
    loaded,
    loading,
    rowChangeCache,
    inProgressChanges,
    hasNextPage,
    error,
  }
}

export const deriveStores = context => {
  const {
    rows,
    rowLookupMap,
    table,
    filter,
    loading,
    sort,
    tableId,
    API,
    scroll,
    validation,
    focusedCellId,
    columns,
    rowChangeCache,
    inProgressChanges,
    previousFocusedRowId,
    hasNextPage,
    error,
    notifications,
  } = context
  const instanceLoaded = writable(false)
  const fetch = writable(null)

  // Local cache of row IDs to speed up checking if a row exists
  let rowCacheMap = {}

  // Enrich rows with an index property and any pending changes
  const enrichedRows = derived(
    [rows, rowChangeCache],
    ([$rows, $rowChangeCache]) => {
      return $rows.map((row, idx) => ({
        ...row,
        ...$rowChangeCache[row._id],
        __idx: idx,
      }))
    },
    []
  )

  // Reset everything when table ID changes
  let unsubscribe = null
  let lastResetKey = null
  tableId.subscribe(async $tableId => {
    // Unsub from previous fetch if one exists
    unsubscribe?.()
    fetch.set(null)
    instanceLoaded.set(false)
    loading.set(true)

    // Tick to allow other reactive logic to update stores when table ID changes
    // before proceeding. This allows us to wipe filters etc if needed.
    await tick()
    const $filter = get(filter)
    const $sort = get(sort)

    // Create new fetch model
    const newFetch = fetchData({
      API,
      datasource: {
        type: "table",
        tableId: $tableId,
      },
      options: {
        filter: $filter,
        sortColumn: $sort.column,
        sortOrder: $sort.order,
        limit: RowPageSize,
        paginate: true,
      },
    })

    // Subscribe to changes of this fetch model
    unsubscribe = newFetch.subscribe(async $fetch => {
      if ($fetch.error) {
        // Present a helpful error to the user
        let message = "An unknown error occurred"
        if ($fetch.error.status === 403) {
          message = "You don't have access to this data"
        } else if ($fetch.error.message) {
          message = $fetch.error.message
        }
        error.set(message)
      } else if ($fetch.loaded && !$fetch.loading) {
        error.set(null)
        hasNextPage.set($fetch.hasNextPage)
        const $instanceLoaded = get(instanceLoaded)
        const resetRows = $fetch.resetKey !== lastResetKey
        const previousResetKey = lastResetKey
        lastResetKey = $fetch.resetKey

        // If resetting rows due to a table change, wipe data and wait for
        // derived stores to compute. This prevents stale data being passed
        // to cells when we save the new schema.
        if (!$instanceLoaded && previousResetKey) {
          rows.set([])
          await tick()
        }

        // Reset state properties when dataset changes
        if (!$instanceLoaded || resetRows) {
          table.set($fetch.definition)
          sort.set({
            column: $fetch.sortColumn,
            order: $fetch.sortOrder,
          })
        }

        // Reset scroll state when data changes
        if (!$instanceLoaded) {
          // Reset both top and left for a new table ID
          instanceLoaded.set(true)
          scroll.set({ top: 0, left: 0 })
        } else if (resetRows) {
          // Only reset top scroll position when resetting rows
          scroll.update(state => ({ ...state, top: 0 }))
        }

        // Process new rows
        handleNewRows($fetch.rows, resetRows)

        // Notify that we're loaded
        loading.set(false)
      }
    })

    fetch.set(newFetch)
  })

  // Update fetch when filter or sort config changes
  filter.subscribe($filter => {
    get(fetch)?.update({
      filter: $filter,
    })
  })
  sort.subscribe($sort => {
    get(fetch)?.update({
      sortOrder: $sort.order,
      sortColumn: $sort.column,
    })
  })

  // Gets a row by ID
  const getRow = id => {
    const index = get(rowLookupMap)[id]
    return index >= 0 ? get(rows)[index] : null
  }

  // Handles validation errors from the rows API and updates local validation
  // state, storing error messages against relevant cells
  const handleValidationError = (rowId, error) => {
    if (error?.json?.validationErrors) {
      // Normal validation errors
      const keys = Object.keys(error.json.validationErrors)
      const $columns = get(columns)

      // Filter out missing columns from columns that we have
      let erroredColumns = []
      let missingColumns = []
      for (let column of keys) {
        if (columns.actions.hasColumn(column)) {
          erroredColumns.push(column)
        } else {
          missingColumns.push(column)
        }
      }

      // Process errors for columns that we have
      for (let column of erroredColumns) {
        validation.actions.setError(
          `${rowId}-${column}`,
          `${column} ${error.json.validationErrors[column]}`
        )

        // Ensure the column is visible
        const index = $columns.findIndex(x => x.name === column)
        if (index !== -1 && !$columns[index].visible) {
          columns.update(state => {
            state[index].visible = true
            return state.slice()
          })
        }
      }

      // Notify about missing columns
      for (let column of missingColumns) {
        get(notifications).error(`${column} is required but is missing`)
      }

      // Focus the first cell with an error
      if (erroredColumns.length) {
        focusedCellId.set(`${rowId}-${erroredColumns[0]}`)
      }
    } else {
      get(notifications).error(error?.message || "An unknown error occurred")
    }
  }

  // Adds a new row
  const addRow = async (row, idx, bubble = false) => {
    try {
      // Create row
      const newRow = await API.saveRow(
        { ...row, tableId: get(tableId) },
        SuppressErrors
      )

      // Update state
      if (idx != null) {
        rowCacheMap[newRow._id] = true
        rows.update(state => {
          state.splice(idx, 0, newRow)
          return state.slice()
        })
      } else {
        handleNewRows([newRow])
      }

      // Refresh row to ensure data is in the correct format
      get(notifications).success("Row created successfully")
      return newRow
    } catch (error) {
      if (bubble) {
        throw error
      } else {
        handleValidationError(NewRowID, error)
      }
    }
  }

  // Duplicates a row, inserting the duplicate row after the existing one
  const duplicateRow = async row => {
    let clone = { ...row }
    delete clone._id
    delete clone._rev
    delete clone.__idx
    try {
      return await addRow(clone, row.__idx + 1, true)
    } catch (error) {
      handleValidationError(row._id, error)
    }
  }

  // Fetches a row by ID using the search endpoint
  const fetchRow = async id => {
    const res = await API.searchTable({
      tableId: get(tableId),
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

  // Replaces a row in state with the newly defined row, handling updates,
  // addition and deletion
  const replaceRow = (id, row) => {
    // Get index of row to check if it exists
    const $rows = get(rows)
    const $rowLookupMap = get(rowLookupMap)
    const index = $rowLookupMap[id]

    // Process as either an update, addition or deletion
    if (row) {
      if (index != null) {
        // An existing row was updated
        rows.update(state => {
          state[index] = { ...row }
          return state
        })
      } else {
        // A new row was created
        handleNewRows([row])
      }
    } else if (index != null) {
      // A row was removed
      handleRemoveRows([$rows[index]])
    }
  }

  // Refreshes a specific row
  const refreshRow = async id => {
    const row = await fetchRow(id)
    replaceRow(id, row)
  }

  // Refreshes all data
  const refreshData = () => {
    get(fetch)?.getInitialData()
  }

  // Patches a row with some changes
  const updateRow = async (rowId, changes) => {
    const $rows = get(rows)
    const $rowLookupMap = get(rowLookupMap)
    const index = $rowLookupMap[rowId]
    const row = $rows[index]
    if (index == null || !Object.keys(changes || {}).length) {
      return
    }

    // Abandon if no changes
    let same = true
    for (let column of Object.keys(changes)) {
      if (row[column] !== changes[column]) {
        same = false
        break
      }
    }
    if (same) {
      return
    }

    // Immediately update state so that the change is reflected
    rowChangeCache.update(state => ({
      ...state,
      [rowId]: {
        ...state[rowId],
        ...changes,
      },
    }))

    // Save change
    try {
      inProgressChanges.update(state => ({
        ...state,
        [rowId]: true,
      }))
      const saved = await API.saveRow(
        { ...row, ...get(rowChangeCache)[rowId] },
        SuppressErrors
      )

      // Update state after a successful change
      if (saved?._id) {
        rows.update(state => {
          state[index] = saved
          return state.slice()
        })
      } else if (saved?.id) {
        // Handle users table edge case
        await refreshRow(saved.id)
      }
      rowChangeCache.update(state => {
        delete state[rowId]
        return state
      })
    } catch (error) {
      handleValidationError(rowId, error)
    }
    inProgressChanges.update(state => ({
      ...state,
      [rowId]: false,
    }))
  }

  // Updates a value of a row
  const updateValue = async (rowId, column, value) => {
    return await updateRow(rowId, { [column]: value })
  }

  // Deletes an array of rows
  const deleteRows = async rowsToDelete => {
    if (!rowsToDelete?.length) {
      return
    }

    // Actually delete rows
    rowsToDelete.forEach(row => {
      delete row.__idx
    })
    await API.deleteRows({
      tableId: get(tableId),
      rows: rowsToDelete,
    })

    // Update state
    handleRemoveRows(rowsToDelete)
  }

  // Local handler to process new rows inside the fetch, and append any new
  // rows to state that we haven't encountered before
  const handleNewRows = (newRows, resetRows) => {
    if (resetRows) {
      rowCacheMap = {}
    }
    let rowsToAppend = []
    let newRow
    for (let i = 0; i < newRows.length; i++) {
      newRow = newRows[i]
      if (!rowCacheMap[newRow._id]) {
        rowCacheMap[newRow._id] = true
        rowsToAppend.push(newRow)
      }
    }
    if (resetRows) {
      rows.set(rowsToAppend)
    } else if (rowsToAppend.length) {
      rows.update(state => [...state, ...rowsToAppend])
    }
  }

  // Local handler to remove rows from state
  const handleRemoveRows = rowsToRemove => {
    const deletedIds = rowsToRemove.map(row => row._id)

    // We deliberately do not remove IDs from the cache map as the data may
    // still exist inside the fetch, but we don't want to add it again
    rows.update(state => {
      return state.filter(row => !deletedIds.includes(row._id))
    })
  }

  // Loads the next page of data if available
  const loadNextPage = () => {
    get(fetch)?.nextPage()
  }

  // Refreshes the schema of the data fetch subscription
  const refreshTableDefinition = async () => {
    const definition = await API.fetchTableDefinition(get(tableId))
    table.set(definition)
  }

  // Checks if we have a row with a certain ID
  const hasRow = id => {
    if (id === NewRowID) {
      return true
    }
    return get(rowLookupMap)[id] != null
  }

  // Wipe the row change cache when changing row
  previousFocusedRowId.subscribe(id => {
    if (id && !get(inProgressChanges)[id]) {
      rowChangeCache.update(state => {
        delete state[id]
        return state
      })
    }
  })

  return {
    enrichedRows,
    rows: {
      ...rows,
      actions: {
        addRow,
        duplicateRow,
        getRow,
        updateValue,
        updateRow,
        deleteRows,
        hasRow,
        loadNextPage,
        refreshRow,
        replaceRow,
        refreshData,
        refreshTableDefinition,
      },
    },
  }
}

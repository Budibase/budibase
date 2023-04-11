import { writable, derived, get } from "svelte/store"
import { fetchData } from "../../../fetch/fetchData"
import { notifications } from "@budibase/bbui"

const initialSortState = {
  column: null,
  order: "ascending",
}

export const createStores = () => {
  const rows = writable([])
  const table = writable(null)
  const filter = writable([])
  const loaded = writable(false)
  const sort = writable(initialSortState)
  const rowChangeCache = writable({})
  const inProgressChanges = writable({})

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

  return {
    rows,
    rowLookupMap,
    table,
    filter,
    loaded,
    sort,
    rowChangeCache,
    inProgressChanges,
  }
}

export const deriveStores = context => {
  const {
    rows,
    rowLookupMap,
    table,
    filter,
    loaded,
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
  tableId.subscribe($tableId => {
    // Unsub from previous fetch if one exists
    unsubscribe?.()
    fetch.set(null)
    instanceLoaded.set(false)

    // Reset state
    sort.set(initialSortState)
    filter.set([])

    // Create new fetch model
    const newFetch = fetchData({
      API,
      datasource: {
        type: "table",
        tableId: $tableId,
      },
      options: {
        filter: [],
        sortColumn: initialSortState.column,
        sortOrder: initialSortState.order,
        limit: 100,
        paginate: true,
      },
    })

    // Subscribe to changes of this fetch model
    unsubscribe = newFetch.subscribe($fetch => {
      if ($fetch.loaded && !$fetch.loading) {
        const resetRows = $fetch.pageNumber === 0

        // Reset scroll state when data changes
        if (!get(instanceLoaded)) {
          // Reset both top and left for a new table ID
          instanceLoaded.set(true)
          scroll.set({ top: 0, left: 0 })
        } else if (resetRows) {
          // Only reset top scroll position when resetting rows
          scroll.update(state => ({ ...state, top: 0 }))
        }

        // Update table definition
        table.set($fetch.definition)

        // Process new rows
        handleNewRows($fetch.rows, resetRows)

        // Notify that we're loaded
        loaded.set(true)
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
      // Normal validation error
      const keys = Object.keys(error.json.validationErrors)
      const $columns = get(columns)
      for (let column of keys) {
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
      // Focus the first cell with an error
      focusedCellId.set(`${rowId}-${keys[0]}`)
    } else {
      // Some other error - just update the current cell
      validation.actions.setError(get(focusedCellId), error?.message || "Error")
    }
  }

  // Adds a new row
  const addRow = async (row, idx, bubble = false) => {
    try {
      // Create row
      const newRow = await API.saveRow({ ...row, tableId: get(tableId) })

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
      notifications.success("Row created successfully")
      return newRow
    } catch (error) {
      if (bubble) {
        throw error
      } else {
        handleValidationError("new", error)
      }
    }
  }

  const duplicateRow = async row => {
    let clone = { ...row }
    delete clone._id
    delete clone._rev
    delete clone.__idx
    try {
      const newRow = await addRow(clone, row.__idx + 1, true)

      // We deliberately re-use the majority of the existing row as the API
      // returns different metadata for relationships when saving a row compared
      // to using the search endpoint. We always want data in the shape that the
      // search endpoint returns it.
      return {
        ...row,
        __idx: row.__idx + 1,
        _id: newRow._id,
        _rev: newRow._rev,
      }
    } catch (error) {
      handleValidationError(row._id, error)
    }
  }

  // Refreshes a specific row, handling updates, addition or deletion
  const refreshRow = async id => {
    // Fetch row from the server again
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
    let newRow = res?.rows?.[0]

    // Get index of row to check if it exists
    const $rows = get(rows)
    const $rowLookupMap = get(rowLookupMap)
    const index = $rowLookupMap[id]

    // Process as either an update, addition or deletion
    if (newRow) {
      if (index != null) {
        // An existing row was updated
        rows.update(state => {
          state[index] = { ...newRow }
          return state
        })
      } else {
        // A new row was created
        handleNewRows([newRow])
      }
    } else if (index != null) {
      // A row was removed
      handleRemoveRows([$rows[index]])
    }
  }

  // Refreshes all data
  const refreshData = () => {
    get(fetch)?.getInitialData()
  }

  // Updates a value of a row
  const updateRow = async (rowId, column, value) => {
    const $rows = get(rows)
    const $rowLookupMap = get(rowLookupMap)
    const index = $rowLookupMap[rowId]
    const row = $rows[index]
    if (index == null || row?.[column] === value) {
      return
    }

    // Immediately update state so that the change is reflected
    rowChangeCache.update(state => ({
      ...state,
      [rowId]: {
        ...state[rowId],
        [column]: value,
      },
    }))

    // Save change
    try {
      inProgressChanges.update(state => ({
        ...state,
        [rowId]: true,
      }))
      const newRow = { ...row, ...get(rowChangeCache)[rowId] }
      const saved = await API.saveRow(newRow)

      // Update state after a successful change
      rows.update(state => {
        state[index] = {
          ...newRow,
          _rev: saved._rev,
        }
        return state.slice()
      })
      rowChangeCache.update(state => ({
        ...state,
        [rowId]: null,
      }))
    } catch (error) {
      handleValidationError(rowId, error)
    }
    inProgressChanges.update(state => ({
      ...state,
      [rowId]: false,
    }))
  }

  // Deletes an array of rows
  const deleteRows = async rowsToDelete => {
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
    return await get(fetch)?.refreshDefinition()
  }

  // Checks if we have a row with a certain ID
  const hasRow = id => {
    return get(rowLookupMap)[id] != null
  }

  // Wipe the row change cache when changing row
  previousFocusedRowId.subscribe(id => {
    if (!get(inProgressChanges)[id]) {
      rowChangeCache.update(state => ({
        ...state,
        [id]: null,
      }))
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
        updateRow,
        deleteRows,
        hasRow,
        loadNextPage,
        refreshRow,
        refreshData,
        refreshTableDefinition,
      },
    },
  }
}

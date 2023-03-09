import { writable, derived, get } from "svelte/store"
import { LuceneUtils } from "../../../index"
import { fetchData } from "../../../fetch/fetchData"
import { notifications } from "@budibase/bbui"

export const createRowsStore = context => {
  const { config, API } = context
  const tableId = derived(config, $config => $config.tableId)
  const rows = writable([])
  const schema = writable({})
  const table = writable(null)
  const filter = writable([])
  const loaded = writable(false)
  const sort = writable({
    column: null,
    order: null,
  })
  const enrichedRows = derived(rows, $rows => {
    return $rows.map((row, idx) => ({
      ...row,
      __idx: idx,
    }))
  })
  const rowLookupMap = derived(enrichedRows, $rows => {
    let map = {}
    for (let i = 0; i < $rows.length; i++) {
      map[$rows[i]._id] = i
    }
    return map
  })

  // Local cache of row IDs to speed up checking if a row exists
  let rowCacheMap = {}

  // Reset everything when table ID changes
  tableId.subscribe(() => {
    filter.set([])
    sort.set({
      column: null,
      order: null,
    })
  })

  // Local stores for managing fetching data
  const query = derived(filter, $filter =>
    LuceneUtils.buildLuceneQuery($filter)
  )
  const fetch = derived([tableId, query, sort], ([$tableId, $query, $sort]) => {
    if (!$tableId) {
      return null
    }
    // Wipe state and fully hydrate next time our fetch returns data
    loaded.set(false)

    // Create fetch and load initial data
    return fetchData({
      API,
      datasource: {
        type: "table",
        tableId: $tableId,
      },
      options: {
        sortColumn: $sort.column,
        sortOrder: $sort.order,
        query: $query,
        limit: 100,
        paginate: true,
      },
    })
  })

  // Observe each data fetch and extract some data
  fetch.subscribe($fetch => {
    if (!$fetch) {
      return
    }
    $fetch.subscribe($$fetch => {
      if ($$fetch.loaded) {
        if (!get(loaded)) {
          // Hydrate initial data
          loaded.set(true)
          rowCacheMap = {}
          rows.set([])
        }

        // Update schema and enrich primary display into schema
        let newSchema = $$fetch.schema
        const primaryDisplay = $$fetch.definition?.primaryDisplay
        if (primaryDisplay && newSchema[primaryDisplay]) {
          newSchema[primaryDisplay].primaryDisplay = true
        }
        schema.set(newSchema)
        table.set($$fetch.definition)

        // Process new rows
        handleNewRows($$fetch.rows)
      }
    })
  })

  // Adds a new empty row
  const addRow = async (row, idx) => {
    try {
      // Create row
      const newRow = await API.saveRow({ ...row, tableId: get(tableId) })

      // Update state
      if (idx) {
        rowCacheMap[newRow._id] = true
        rows.update(state => {
          state.splice(idx, 0, newRow)
          return state.slice()
        })
      } else {
        handleNewRows([newRow])
      }
      return newRow
    } catch (error) {
      notifications.error(`Error adding row: ${error?.message}`)
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
    filter.set([])
    sort.set({
      column: null,
      order: null,
    })
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
    let newRow = { ...row, [column]: value }
    rows.update(state => {
      state[index] = { ...newRow }
      return state
    })

    // Save change
    delete newRow.__idx
    try {
      await API.saveRow(newRow)
    } catch (error) {
      notifications.error(`Error saving row: ${error?.message}`)
    }
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
  const handleNewRows = newRows => {
    let rowsToAppend = []
    let newRow
    for (let i = 0; i < newRows.length; i++) {
      newRow = newRows[i]
      if (!rowCacheMap[newRow._id]) {
        rowCacheMap[newRow._id] = true
        rowsToAppend.push(newRow)
      }
    }
    if (rowsToAppend.length) {
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

    // If we ended up with no rows, try getting the next page
    if (!get(rows).length) {
      loadNextPage()
    }
  }

  // Loads the next page of data if available
  const loadNextPage = () => {
    get(fetch)?.nextPage()
  }

  // Refreshes the schema of the data fetch subscription
  const refreshSchema = async () => {
    return await get(fetch)?.refreshDefinition()
  }

  return {
    rows: {
      ...rows,
      subscribe: enrichedRows.subscribe,
      actions: {
        addRow,
        updateRow,
        deleteRows,
        loadNextPage,
        refreshRow,
        refreshData,
        refreshSchema,
      },
    },
    rowLookupMap,
    table,
    schema,
    sort,
    filter,
    loaded,
  }
}

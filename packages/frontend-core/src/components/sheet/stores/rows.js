import { writable, derived, get } from "svelte/store"
import { buildLuceneQuery } from "../../../utils/lucene"
import { fetchData } from "../../../fetch/fetchData"
import { notifications } from "@budibase/bbui"

export const createRowsStore = context => {
  const { tableId, filter, API } = context

  // Flag for whether this is the first time loading our fetch
  let loaded = false

  // Local cache of row IDs to speed up checking if a row exists
  let rowCacheMap = {}

  // Exported stores
  const rows = writable([])
  const schema = writable({})

  // Local stores for managing fetching data
  const query = derived(filter, $filter => buildLuceneQuery($filter))
  const fetch = derived(tableId, $tableId => {
    if (!$tableId) {
      return null
    }
    // Wipe state and fully hydrate next time our fetch returns data
    loaded = false

    // Create fetch and load initial data
    return fetchData({
      API,
      datasource: {
        type: "table",
        tableId: $tableId,
      },
      options: {
        sortColumn: null,
        sortOrder: null,
        query: get(query),
        limit: 100,
        paginate: true,
      },
    })
  })

  // Update fetch when query changes
  query.subscribe($query => {
    get(fetch)?.update({
      query: $query,
    })
  })

  // Observe each data fetch and extract some data
  fetch.subscribe($fetch => {
    if (!$fetch) {
      return
    }
    $fetch.subscribe($$fetch => {
      if ($$fetch.loaded) {
        if (!loaded) {
          // Hydrate initial data
          loaded = true
          rowCacheMap = {}
          rows.set([])
          let newSchema = $$fetch.schema
          const primaryDisplay = $$fetch.definition?.primaryDisplay
          if (primaryDisplay && newSchema[primaryDisplay]) {
            newSchema[primaryDisplay].primaryDisplay = true
          }
          schema.set(newSchema)
        }

        // Process new rows
        handleNewRows($$fetch.rows)
      }
    })
  })

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
      rows.update($rows => {
        return [
          ...$rows,
          ...rowsToAppend.map((row, idx) => ({
            ...row,
            __idx: $rows.length + idx,
          })),
        ]
      })
    }
  }

  // Adds a new empty row
  const addRow = async () => {
    try {
      // Create row
      let newRow = await API.saveRow({ tableId: get(tableId) })

      // Use search endpoint to fetch the row again, ensuring relationships are
      // properly enriched
      const res = await API.searchTable({
        tableId: get(tableId),
        limit: 1,
        query: {
          equal: {
            _id: newRow._id,
          },
        },
        paginate: false,
      })
      if (res?.rows?.[0]) {
        newRow = res.rows[0]
      }

      // Update state
      handleNewRows([newRow])
      return newRow
    } catch (error) {
      notifications.error(`Error adding row: ${error?.message}`)
    }
  }

  // Updates a value of a row
  const updateRow = async (rowId, column, value) => {
    const $rows = get(rows)
    const index = $rows.findIndex(x => x._id === rowId)
    const row = $rows[index]
    if (index === -1 || row?.[column.name] === value) {
      return
    }

    // Immediately update state so that the change is reflected
    let newRow = { ...row, [column.name]: value }
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

    // Fetch row from the server again
    const res = await API.searchTable({
      tableId: get(tableId),
      limit: 1,
      query: {
        equal: {
          _id: row._id,
        },
      },
      paginate: false,
    })
    if (res?.rows?.[0]) {
      newRow = res.rows[0]
    }

    // Update state again with this row
    newRow = { ...newRow, __idx: row.__idx }
    rows.update(state => {
      state[index] = newRow
      return state
    })

    return newRow
  }

  // Deletes an array of rows
  const deleteRows = async rowsToDelete => {
    const deletedIds = rowsToDelete.map(row => row._id)

    // Actually delete rows
    rowsToDelete.forEach(row => {
      delete row.__idx
    })
    await API.deleteRows({
      tableId: get(tableId),
      rows: rowsToDelete,
    })

    // Update state
    // We deliberately do not remove IDs from the cache map as the data may
    // still exist inside the fetch, but we don't want to add it again
    rows.update(state => {
      return state
        .filter(row => !deletedIds.includes(row._id))
        .map((row, idx) => ({ ...row, __idx: idx }))
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

  return {
    rows: {
      ...rows,
      actions: {
        addRow,
        updateRow,
        deleteRows,
        loadNextPage,
      },
    },
    schema,
  }
}

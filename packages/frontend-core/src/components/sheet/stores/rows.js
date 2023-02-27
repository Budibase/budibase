import { writable, derived, get } from "svelte/store"
import { buildLuceneQuery } from "../../../utils/lucene"
import { fetchData } from "../../../fetch/fetchData"

export const createRowsStore = context => {
  const { tableId, filter, API } = context
  const rows = writable([])
  const schema = writable({})
  const primaryDisplay = writable(null)
  const query = derived(filter, $filter => buildLuceneQuery($filter))
  const fetch = derived(tableId, $tableId => {
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
    get(fetch).update({
      query: $query,
    })
  })

  // Observe each data fetch and extract some data
  fetch.subscribe($fetch => {
    $fetch.subscribe($$fetch => {
      console.log("new fetch")
      rows.set($$fetch.rows.map((row, idx) => ({ ...row, __idx: idx })))
      schema.set($$fetch.schema)
      primaryDisplay.set($$fetch.definition?.primaryDisplay)
    })
  })

  // Adds a new empty row
  const addRow = async () => {
    let newRow = await API.saveRow({ tableId: get(tableId) })
    newRow.__idx = get(rows).length
    rows.update(state => {
      state.push(newRow)
      return state
    })
    return newRow
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
    await API.saveRow(newRow)

    // Fetch row from the server again
    newRow = await API.fetchRow({
      tableId: get(tableId),
      rowId: row._id,
    })

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
    rows.update(state => {
      return state
        .filter(row => !deletedIds.includes(row._id))
        .map((row, idx) => ({ ...row, __idx: idx }))
    })
  }

  return {
    rows: {
      ...rows,
      actions: {
        addRow,
        updateRow,
        deleteRows,
      },
    },
    schema,
    primaryDisplay,
  }
}

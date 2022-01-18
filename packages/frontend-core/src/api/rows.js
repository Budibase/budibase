import { notificationStore, dataSourceStore } from "stores"
import API from "./api"
import { fetchTableDefinition } from "./tables"
import { FieldTypes } from "../constants"

/**
 * Fetches data about a certain row in a table.
 */
export const fetchRow = async ({ tableId, rowId }) => {
  if (!tableId || !rowId) {
    return
  }
  const row = await API.get({
    url: `/api/${tableId}/rows/${rowId}`,
  })
  return (await enrichRows([row], tableId))[0]
}

/**
 * Creates a row in a table.
 */
export const saveRow = async row => {
  if (!row?.tableId) {
    return
  }
  const res = await API.post({
    url: `/api/${row.tableId}/rows`,
    body: row,
  })
  res.error
    ? notificationStore.actions.error("An error has occurred")
    : notificationStore.actions.success("Row saved")

  // Refresh related datasources
  await dataSourceStore.actions.invalidateDataSource(row.tableId)

  return res
}

/**
 * Updates a row in a table.
 */
export const updateRow = async row => {
  if (!row?.tableId || !row?._id) {
    return
  }
  const res = await API.patch({
    url: `/api/${row.tableId}/rows`,
    body: row,
  })
  res.error
    ? notificationStore.actions.error("An error has occurred")
    : notificationStore.actions.success("Row updated")

  // Refresh related datasources
  await dataSourceStore.actions.invalidateDataSource(row.tableId)

  return res
}

/**
 * Deletes a row from a table.
 */
export const deleteRow = async ({ tableId, rowId, revId }) => {
  if (!tableId || !rowId || !revId) {
    return
  }
  const res = await API.del({
    url: `/api/${tableId}/rows`,
    body: {
      _id: rowId,
      _rev: revId,
    },
  })
  res.error
    ? notificationStore.actions.error("An error has occurred")
    : notificationStore.actions.success("Row deleted")

  // Refresh related datasources
  await dataSourceStore.actions.invalidateDataSource(tableId)

  return res
}

/**
 * Deletes many rows from a table.
 */
export const deleteRows = async ({ tableId, rows }) => {
  if (!tableId || !rows) {
    return
  }
  const res = await API.del({
    url: `/api/${tableId}/rows`,
    body: {
      rows,
    },
  })
  res.error
    ? notificationStore.actions.error("An error has occurred")
    : notificationStore.actions.success(`${rows.length} row(s) deleted`)

  // Refresh related datasources
  await dataSourceStore.actions.invalidateDataSource(tableId)

  return res
}

/**
 * Enriches rows which contain certain field types so that they can
 * be properly displayed.
 * The ability to create these bindings has been removed, but they will still
 * exist in client apps to support backwards compatibility.
 */
export const enrichRows = async (rows, tableId) => {
  if (!Array.isArray(rows)) {
    return []
  }
  if (rows.length) {
    // map of tables, incase a row being loaded is not from the same table
    const tables = {}
    for (let row of rows) {
      // fallback to passed in tableId if row doesn't have it specified
      let rowTableId = row.tableId || tableId
      let table = tables[rowTableId]
      if (!table) {
        // Fetch table schema so we can check column types
        table = await fetchTableDefinition(rowTableId)
        tables[rowTableId] = table
      }
      const schema = table?.schema
      if (schema) {
        const keys = Object.keys(schema)
        for (let key of keys) {
          const type = schema[key].type
          if (type === FieldTypes.LINK && Array.isArray(row[key])) {
            // Enrich row a string join of relationship fields
            row[`${key}_text`] =
              row[key]
                ?.map(option => option?.primaryDisplay)
                .filter(option => !!option)
                .join(", ") || ""
          } else if (type === "attachment") {
            // Enrich row with the first image URL for any attachment fields
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      }
    }
  }
  return rows
}

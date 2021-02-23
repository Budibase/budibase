import { notificationStore, datasourceStore } from "../store"
import API from "./api"
import { fetchTableDefinition } from "./tables"

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
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success("Row saved")

  // Refresh related datasources
  datasourceStore.actions.invalidateDatasource(row.tableId)

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
    url: `/api/${row.tableId}/rows/${row._id}`,
    body: row,
  })
  res.error
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success("Row updated")

  // Refresh related datasources
  datasourceStore.actions.invalidateDatasource(row.tableId)

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
    url: `/api/${tableId}/rows/${rowId}/${revId}`,
  })
  res.error
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success("Row deleted")

  // Refresh related datasources
  datasourceStore.actions.invalidateDatasource(tableId)

  return res
}

/**
 * Deletes many rows from a table.
 */
export const deleteRows = async ({ tableId, rows }) => {
  if (!tableId || !rows) {
    return
  }
  const res = await API.post({
    url: `/api/${tableId}/rows`,
    body: {
      rows,
      type: "delete",
    },
  })
  res.error
    ? notificationStore.danger("An error has occurred")
    : notificationStore.success(`${rows.length} row(s) deleted`)

  // Refresh related datasources
  datasourceStore.actions.invalidateDatasource(tableId)

  return res
}

/**
 * Enriches rows which contain certain field types so that they can
 * be properly displayed.
 */
export const enrichRows = async (rows, tableId) => {
  if (!Array.isArray(rows)) {
    return []
  }
  if (rows.length && tableId) {
    // Fetch table schema so we can check column types
    const tableDefinition = await fetchTableDefinition(tableId)
    const schema = tableDefinition && tableDefinition.schema
    if (schema) {
      const keys = Object.keys(schema)
      rows.forEach(row => {
        for (let key of keys) {
          const type = schema[key].type
          if (type === "link") {
            // Enrich row a string join of relationship fields
            row[`${key}_text`] = row[key]?.join(", ") || ""
          } else if (type === "attachment") {
            // Enrich row with the first image URL for any attachment fields
            let url = null
            if (Array.isArray(row[key]) && row[key][0] != null) {
              url = row[key][0].url
            }
            row[`${key}_first`] = url
          }
        }
      })
    }
  }
  return rows
}

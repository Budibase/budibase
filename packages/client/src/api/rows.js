import { notificationStore } from "../store/notification"
import API from "./api"
import { fetchTableDefinition } from "./tables"

/**
 * Fetches data about a certain row in a table.
 */
export const fetchRow = async ({ tableId, rowId }) => {
  const row = await API.get({
    url: `/api/${tableId}/rows/${rowId}`,
  })
  return (await enrichRows([row], tableId))[0]
}

/**
 * Creates a row in a table.
 */
export const saveRow = async row => {
  const res = await API.post({
    url: `/api/${row.tableId}/rows`,
    body: row,
  })
  res.error
    ? notificationStore.danger("En error has occured")
    : notificationStore.success("Row saved")
  return res
}

/**
 * Updates a row in a table.
 */
export const updateRow = async row => {
  const res = await API.patch({
    url: `/api/${row.tableId}/rows/${row._id}`,
    body: row,
  })
  res.error
    ? notificationStore.danger("En error has occured")
    : notificationStore.success("Row updated")
  return res
}

/**
 * Deletes a row from a table.
 */
export const deleteRow = async ({ tableId, rowId, revId }) => {
  const res = await API.del({
    url: `/api/${tableId}/rows/${rowId}/${revId}`,
  })
  res.error
    ? notificationStore.danger("En error has occured")
    : notificationStore.success("Row deleted")
  return res
}

/**
 * Deletes many rows from a table.
 */
export const deleteRows = async ({ tableId, rows }) => {
  const res = await API.post({
    url: `/api/${tableId}/rows`,
    body: {
      rows,
      type: "delete",
    },
  })
  res.error
    ? notificationStore.danger("En error has occured")
    : notificationStore.success(`${rows.length} rows deleted.`)
  return res
}

/**
 * Enriches rows which contain certain field types so that they can
 * be properly displayed.
 */
export const enrichRows = async (rows, tableId) => {
  if (rows && rows.length && tableId) {
    // Fetch table schema so we can check column types
    const tableDefinition = await fetchTableDefinition(tableId)
    const schema = tableDefinition && tableDefinition.schema
    if (schema) {
      const keys = Object.keys(schema)
      rows.forEach(row => {
        for (let key of keys) {
          const type = schema[key].type
          if (type === "link") {
            // Enrich row with the count of any relationship fields
            row[`${key}_count`] = Array.isArray(row[key]) ? row[key].length : 0
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

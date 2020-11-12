import api from "./api"

/**
 * Fetches a table definition.
 * Since definitions cannot change at runtime, the result is cached.
 */
export const fetchTableDefinition = async tableId => {
  return await api.get({ url: `/api/tables/${tableId}`, cache: true })
}

/**
 * Fetches all rows from a table.
 */
export const fetchTableData = async name => {
  return await api.get({ url: `/api/views/${name}` })
}

import API from "./api"
import { enrichRows } from "./rows"

/**
 * Fetches a table definition.
 * Since definitions cannot change at runtime, the result is cached.
 */
export const fetchTableDefinition = async tableId => {
  return await API.get({ url: `/api/tables/${tableId}`, cache: true })
}

/**
 * Fetches all rows from a table.
 */
export const fetchTableData = async tableId => {
  const rows = await API.get({ url: `/api/${tableId}/rows` })
  return await enrichRows(rows, tableId)
}

/**
 * Perform a mango query against an internal table
 * @param {String} tableId - id of the table to search
 * @param {Object} search - Mango Compliant search object
 */
export const searchTableData = async ({
  tableId,
  search,
  cursor,
  pageSize,
}) => {
  const rows = await API.post({
    url: `/api/${tableId}/rows/search`,
    body: {
      query: search,
      pageSize,
      cursor,
    },
  })
  return await enrichRows(rows, tableId)
}

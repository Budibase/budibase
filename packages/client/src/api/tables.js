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
 * Searches a table using Lucene.
 */
export const searchTable = async ({
  tableId,
  query,
  raw,
  bookmark,
  limit,
  sort,
  sortOrder,
  sortType,
  paginate,
}) => {
  if (!tableId || (!query && !raw)) {
    return
  }
  const res = await API.post({
    url: `/api/search/${tableId}/rows`,
    body: {
      query,
      raw,
      bookmark,
      limit,
      sort,
      sortOrder,
      sortType,
      paginate,
    },
  })
  return {
    ...res,
    rows: await enrichRows(res?.rows, tableId),
  }
}

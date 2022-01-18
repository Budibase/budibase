import API from "./api"
import { enrichRows } from "./rows"

/**
 * Fetches a table definition.
 * Since definitions cannot change at runtime, the result is cached.
 */
export const fetchTableDefinition = async tableId => {
  const res = await API.get({ url: `/api/tables/${tableId}`, cache: true })

  // Wipe any HBS formulae, as these interfere with handlebars enrichment
  Object.keys(res?.schema || {}).forEach(field => {
    if (res.schema[field]?.type === "formula") {
      delete res.schema[field].formula
    }
  })

  return res
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
  bookmark,
  limit,
  sort,
  sortOrder,
  sortType,
  paginate,
}) => {
  if (!tableId || !query) {
    return {
      rows: [],
    }
  }
  const res = await API.post({
    url: `/api/${tableId}/search`,
    body: {
      query,
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

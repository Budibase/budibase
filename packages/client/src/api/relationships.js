import api from "./api"
import { enrichRows } from "./rows"

/**
 * Fetches related rows for a certain field of a certain row.
 */
export const fetchRelationshipData = async ({ tableId, rowId, fieldName }) => {
  if (!tableId || !rowId || !fieldName) {
    return []
  }
  const response = await api.get({ url: `/api/${tableId}/${rowId}/enrich` })
  const rows = response[fieldName] || []
  return await enrichRows(rows, tableId)
}

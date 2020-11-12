import api from "./api"

/**
 * Fetches related rows for a certain field of a certain row.
 */
export const fetchRelationshipData = async ({ tableId, rowId, fieldName }) => {
  if (!tableId || !rowId) {
    return []
  }
  const response = await api.get({ url: `/api/${tableId}/${rowId}/enrich` })
  return response[fieldName] || []
}

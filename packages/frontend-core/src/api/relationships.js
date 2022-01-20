export const buildRelationshipEndpoints = API => ({
  /**
   * Fetches related rows for a certain field of a certain row.
   */
  fetchRelationshipData: async ({ tableId, rowId, fieldName }) => {
    if (!tableId || !rowId || !fieldName) {
      return []
    }
    const response = await API.get({ url: `/api/${tableId}/${rowId}/enrich` })
    return response[fieldName] || []
  },
})

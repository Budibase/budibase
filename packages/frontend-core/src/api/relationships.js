export const buildRelationshipEndpoints = API => ({
  /**
   * Fetches related rows for a certain field of a certain row.
   * @param tableId the ID of the table to fetch from
   * @param rowId the ID of the row to fetch related rows for
   * @param fieldName the name of the relationship field
   */
  fetchRelationshipData: async ({ tableId, rowId, fieldName }) => {
    if (!tableId || !rowId) {
      return []
    }
    const response = await API.get({ url: `/api/${tableId}/${rowId}/enrich` })
    if (!fieldName) {
      return response || []
    } else {
      return response[fieldName] || []
    }
  },
})

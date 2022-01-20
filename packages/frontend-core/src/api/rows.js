export const buildRowEndpoints = API => ({
  /**
   * Fetches data about a certain row in a table.
   */
  fetchRow: async ({ tableId, rowId }) => {
    if (!tableId || !rowId) {
      return null
    }
    const row = await API.get({
      url: `/api/${tableId}/rows/${rowId}`,
    })
    return (await API.enrichRows([row], tableId))[0]
  },

  /**
   * Creates a row in a table.
   */
  saveRow: async row => {
    if (!row?.tableId) {
      return
    }
    return await API.post({
      url: `/api/${row.tableId}/rows`,
      body: row,
    })
  },

  /**
   * Deletes a row from a table.
   */
  deleteRow: async ({ tableId, rowId, revId }) => {
    if (!tableId || !rowId || !revId) {
      return
    }
    return await API.delete({
      url: `/api/${tableId}/rows`,
      body: {
        _id: rowId,
        _rev: revId,
      },
    })
  },
})

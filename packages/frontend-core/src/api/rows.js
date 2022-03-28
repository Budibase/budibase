export const buildRowEndpoints = API => ({
  /**
   * Fetches data about a certain row in a table.
   * @param tableId the ID of the table to fetch from
   * @param rowId the ID of the row to fetch
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
   * Creates or updates a row in a table.
   * @param row the row to save
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
   * @param tableId the ID of the table to delete from
   * @param rowId the ID of the row to delete
   * @param revId the rev of the row to delete
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

  /**
   * Deletes multiple rows from a table.
   * @param tableId the table ID to delete the rows from
   * @param rows the array of rows to delete
   */
  deleteRows: async ({ tableId, rows }) => {
    return await API.delete({
      url: `/api/${tableId}/rows`,
      body: {
        rows,
      },
    })
  },

  /**
   * Exports rows.
   * @param tableId the table ID to export the rows from
   * @param rows the array of rows to export
   */
  exportRows: async ({ tableId, rows, format }) => {
    return await API.post({
      url: `/api/${tableId}/rows/exportRows?format=${format}`,
      body: {
        rows,
      },
      parseResponse: async response => {
        return await response.text()
      },
    })
  },
})

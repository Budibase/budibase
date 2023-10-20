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
    return await API.get({
      url: `/api/${tableId}/rows/${rowId}`,
    })
  },

  /**
   * Creates or updates a row in a table.
   * @param row the row to save
   * @param suppressErrors whether or not to suppress error notifications
   */
  saveRow: async (row, suppressErrors = false) => {
    if (!row?.tableId) {
      return
    }
    return await API.post({
      url: `/api/${row._viewId || row.tableId}/rows`,
      body: row,
      suppressErrors,
    })
  },

  /**
   * Patches a row in a table.
   * @param row the row to patch
   * @param suppressErrors whether or not to suppress error notifications
   */
  patchRow: async (row, suppressErrors = false) => {
    if (!row?.tableId && !row?._viewId) {
      return
    }
    return await API.patch({
      url: `/api/${row._viewId || row.tableId}/rows`,
      body: row,
      suppressErrors,
    })
  },

  /**
   * Deletes a row from a table.
   * @param tableId the ID of the table or view to delete from
   * @param rowId the ID of the row to delete
   * @param revId the rev of the row to delete
   */
  deleteRow: async ({ tableId, rowId, revId }) => {
    if (!tableId || !rowId) {
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
   * @param tableId the table or view ID to delete the rows from
   * @param rows the array of rows to delete
   */
  deleteRows: async ({ tableId, rows }) => {
    rows?.forEach(row => {
      delete row?._viewId
    })
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
   * @param format the format to export (csv or json)
   * @param columns which columns to export (all if undefined)
   */
  exportRows: async ({ tableId, rows, format, columns, search }) => {
    return await API.post({
      url: `/api/${tableId}/rows/exportRows?format=${format}`,
      body: {
        rows,
        columns,
        ...search,
      },
      parseResponse: async response => {
        return await response.text()
      },
    })
  },
})

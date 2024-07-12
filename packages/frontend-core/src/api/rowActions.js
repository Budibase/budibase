export const buildRowActionsEndpoints = API => ({
  /**
   * Fetches row actions for a certain table.
   * @param tableId the ID of the table to fetch from
   */
  fetchRowActions: async tableId => {
    return await API.get({
      url: `/api/tables/${tableId}/actions`,
    })
  },
})

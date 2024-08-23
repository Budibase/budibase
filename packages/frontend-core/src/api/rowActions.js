export const buildRowActionEndpoints = API => ({
  /**
   * Gets the available row actions for a table.
   * @param tableId the ID of the table
   */
  fetch: async tableId => {
    const res = await API.get({
      url: `/api/tables/${tableId}/actions`,
    })
    return res?.actions || {}
  },

  /**
   * Creates a row action.
   * @param name the name of the row action
   * @param tableId the ID of the table
   */
  create: async ({ name, tableId }) => {
    return await API.post({
      url: `/api/tables/${tableId}/actions`,
      body: {
        name,
      },
    })
  },

  /**
   * Updates a row action.
   * @param name the new name of the row action
   * @param tableId the ID of the table
   * @param rowActionId the ID of the row action to update
   */
  update: async ({ tableId, rowActionId, name }) => {
    return await API.post({
      url: `/api/tables/${tableId}/actions/${rowActionId}`,
      body: {
        name,
      },
    })
  },

  /**
   * Deletes a row action.
   * @param tableId the ID of the table
   * @param rowActionId the ID of the row action to delete
   */
  delete: async ({ tableId, rowActionId }) => {
    return await API.delete({
      url: `/api/tables/${tableId}/actions/${rowActionId}`,
    })
  },

  /**
   * Triggers a row action.
   * @param tableId the ID of the table
   * @param rowActionId the ID of the row action to trigger
   */
  trigger: async ({ tableId, rowActionId }) => {
    return await API.post({
      url: `/api/tables/${tableId}/actions/${rowActionId}/trigger`,
    })
  },
})

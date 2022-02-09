export const buildLayoutEndpoints = API => ({
  /**
   * Saves a layout.
   * @param layout the layout to save
   */
  saveLayout: async layout => {
    return await API.post({
      url: "/api/layouts",
      body: layout,
    })
  },

  /**
   * Deletes a layout.
   * @param layoutId the ID of the layout to delete
   * @param layoutRev the rev of the layout to delete
   */
  deleteLayout: async ({ layoutId, layoutRev }) => {
    return await API.delete({
      url: `/api/layouts/${layoutId}/${layoutRev}`,
    })
  },
})

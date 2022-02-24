export const buildScreenEndpoints = API => ({
  /**
   * Saves a screen definition
   * @param screen the screen to save
   */
  saveScreen: async screen => {
    return await API.post({
      url: "/api/screens",
      body: screen,
    })
  },

  /**
   * Deletes a screen.
   * @param screenId the ID of the screen to delete
   * @param screenRev the rev of the screen to delete
   */
  deleteScreen: async ({ screenId, screenRev }) => {
    return await API.delete({
      url: `/api/screens/${screenId}/${screenRev}`,
    })
  },
})

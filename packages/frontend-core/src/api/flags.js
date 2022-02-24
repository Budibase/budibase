export const buildFlagEndpoints = API => ({
  /**
   * Gets the current user flags object.
   */
  getFlags: async () => {
    return await API.get({
      url: "/api/users/flags",
    })
  },

  /**
   * Updates a flag for the current user.
   * @param flag the flag to update
   * @param value the value to set the flag to
   */
  updateFlag: async ({ flag, value }) => {
    return await API.post({
      url: "/api/users/flags",
      body: {
        flag,
        value,
      },
    })
  },
})

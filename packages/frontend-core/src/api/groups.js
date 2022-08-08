export const buildGroupsEndpoints = API => ({
  /**
   * Creates a user group.
   * @param user the new group to create
   */
  saveGroup: async group => {
    return await API.post({
      url: "/api/global/groups",
      body: group,
    })
  },
  /**
   * Gets all of the user groups
   */
  getGroups: async () => {
    return await API.get({
      url: "/api/global/groups",
    })
  },

  /**
   * Gets a group by ID
   */
  getGroup: async id => {
    return await API.get({
      url: `/api/global/groups/${id}`,
    })
  },

  /**
   * Deletes a user group
   * @param id the id of the config to delete
   * @param rev the revision of the config to delete
   */
  deleteGroup: async ({ id, rev }) => {
    return await API.delete({
      url: `/api/global/groups/${id}/${rev}`,
    })
  },
})

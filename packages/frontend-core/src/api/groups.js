export const buildGroupsEndpoints = API => {
  // underlying functionality of adding/removing users/apps to groups
  async function updateGroupResource(groupId, resource, operation, ids) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    return await API.post({
      url: `/api/global/groups/${groupId}/${resource}`,
      body: {
        [operation]: ids,
      },
    })
  }

  return {
    /**
     * Creates a user group.
     * @param group the new group to create
     */
    saveGroup: async group => {
      return await API.post({
        url: "/api/global/groups",
        body: group,
      })
    },
    /**
     * Gets all the user groups
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

    /**
     * Gets a group users by the group id
     */
    getGroupUsers: async ({ id, bookmark, emailSearch }) => {
      let url = `/api/global/groups/${id}/users?`
      if (bookmark) {
        url += `bookmark=${bookmark}&`
      }
      if (emailSearch) {
        url += `emailSearch=${emailSearch}&`
      }

      return await API.get({
        url,
      })
    },

    /**
     * Adds users to a group
     * @param groupId The group to update
     * @param userIds The user IDs to be added
     */
    addUsersToGroup: async (groupId, userIds) => {
      return updateGroupResource(groupId, "users", "add", userIds)
    },

    /**
     * Removes users from a group
     * @param groupId The group to update
     * @param userIds The user IDs to be removed
     */
    removeUsersFromGroup: async (groupId, userIds) => {
      return updateGroupResource(groupId, "users", "remove", userIds)
    },

    /**
     * Adds apps to a group
     * @param groupId The group to update
     * @param appArray Array of objects, containing the appId and roleId to be added
     */
    addAppsToGroup: async (groupId, appArray) => {
      return updateGroupResource(groupId, "apps", "add", appArray)
    },

    /**
     * Removes apps from a group
     * @param groupId The group to update
     * @param appArray Array of objects, containing the appId to be removed
     */
    removeAppsFromGroup: async (groupId, appArray) => {
      return updateGroupResource(groupId, "apps", "remove", appArray)
    },

    /**
     * Add app builder to group
     * @param groupId The group to update
     * @param appId The app id where the builder will be added
     */
    addGroupAppBuilder: async ({ groupId, appId }) => {
      return await API.post({
        url: `/api/global/groups/${groupId}/app/${appId}/builder`,
      })
    },

    /**
     * Remove app builder from group
     * @param groupId The group to update
     * @param appId The app id where the builder will be removed
     */
    removeGroupAppBuilder: async ({ groupId, appId }) => {
      return await API.delete({
        url: `/api/global/groups/${groupId}/app/${appId}/builder`,
      })
    },
  }
}

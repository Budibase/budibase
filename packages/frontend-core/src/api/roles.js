export const buildRoleEndpoints = API => ({
  /**
   * Deletes a role.
   * @param roleId the ID of the role to delete
   * @param roleRev the rev of the role to delete
   */
  deleteRole: async ({ roleId, roleRev }) => {
    return await API.delete({
      url: `/api/roles/${roleId}/${roleRev}`,
    })
  },

  /**
   * Saves a role.
   * @param role the role to save
   */
  saveRole: async role => {
    return await API.post({
      url: "/api/roles",
      body: role,
    })
  },

  /**
   * Gets a list of roles.
   */
  getRoles: async () => {
    return await API.get({
      url: "/api/roles",
    })
  },

  /**
   * Gets a list of roles within a specified app.
   */
  getRolesForApp: async appId => {
    return await API.get({
      url: `/api/global/roles/${appId}`,
    })
  },

  /**
   * For the logged in user and current app - retrieves accessible roles.
   */
  getAccessibleRoles: async () => {
    return await API.get({
      url: `/api/roles/accessible`,
    })
  },
})

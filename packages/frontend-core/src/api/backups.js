export const buildBackupsEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
  searchBackups: async appId => {
    return await API.post({
      url: `/api/apps/${appId}/backups/search`,
      body: {
        trigger: "MANUAL",
      },
    })
  },

  createManualBackup: async ({ appId, name }) => {
    return await API.post({
      url: `/api/apps/${appId}/backups`,
      body: { name },
    })
  },
})

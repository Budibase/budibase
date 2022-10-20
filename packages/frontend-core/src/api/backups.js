export const buildBackupsEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
  searchBackups: async ({ appId, trigger, page }) => {
    const opts = {}
    if (page) {
      opts.page = page
    }
    if (trigger) {
      opts.trigger = trigger.toLowerCase()
    }
    return await API.post({
      url: `/api/apps/${appId}/backups/search`,
      body: opts,
    })
  },

  createManualBackup: async ({ appId, name }) => {
    return await API.post({
      url: `/api/apps/${appId}/backups`,
      body: { name },
    })
  },

  deleteBackup: async ({ appId, backupId }) => {
    return await API.delete({
      url: `/api/apps/${appId}/backups/${backupId}`,
    })
  },

  updateBackup: async ({ appId, backupId }) => {
    return await API.patch({
      url: `/api/apps/${appId}/backups/${backupId}`,
    })
  },

  restoreBackup: async ({ appId, backupId }) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/${backupId}/import`,
    })
  },
})

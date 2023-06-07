export const buildBackupsEndpoints = API => ({
  /**
   * Gets a list of users in the current tenant.
   */
  searchBackups: async ({ appId, trigger, type, page, startDate, endDate }) => {
    const opts = {}
    if (page) {
      opts.page = page
    }
    if (trigger && type) {
      opts.trigger = trigger.toLowerCase()
      opts.type = type.toLowerCase()
    }
    if (startDate && endDate) {
      opts.startDate = startDate
      opts.endDate = endDate
    }
    return await API.post({
      url: `/api/apps/${appId}/backups/search`,
      body: opts,
    })
  },

  createManualBackup: async ({ appId }) => {
    return await API.post({
      url: `/api/apps/${appId}/backups`,
    })
  },

  deleteBackup: async ({ appId, backupId }) => {
    return await API.delete({
      url: `/api/apps/${appId}/backups/${backupId}`,
    })
  },

  updateBackup: async ({ appId, backupId, name }) => {
    return await API.patch({
      url: `/api/apps/${appId}/backups/${backupId}`,
      body: { name },
    })
  },

  restoreBackup: async ({ appId, backupId, name }) => {
    return await API.post({
      url: `/api/apps/${appId}/backups/${backupId}/import`,
      body: { name },
    })
  },
})

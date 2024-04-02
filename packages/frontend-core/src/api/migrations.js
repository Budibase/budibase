export const buildMigrationEndpoints = API => ({
  /**
   * Gets the info about the current app migration
   */
  getMigrationStatus: async () => {
    return await API.get({
      url: "/api/migrations/status",
    })
  },
})

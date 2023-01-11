export const buildLicensingEndpoints = API => ({
  /**
   * Activates a self hosted license key
   */
  activateLicenseKey: async data => {
    return API.post({
      url: `/api/global/license/activate`,
      body: data,
    })
  },

  /**
   * Delete a self hosted license key
   */
  deleteLicenseKey: async () => {
    return API.delete({
      url: `/api/global/license/info`,
    })
  },

  /**
   * Get the license info - metadata about the license including the
   * obfuscated license key.
   */
  getLicenseInfo: async () => {
    return API.get({
      url: "/api/global/license/info",
    })
  },

  /**
   * Refreshes the license cache
   */
  refreshLicense: async () => {
    return API.post({
      url: "/api/global/license/refresh",
    })
  },

  /**
   * Retrieve the usage information for the tenant
   */
  getQuotaUsage: async () => {
    return API.get({
      url: "/api/global/license/usage",
    })
  },
})

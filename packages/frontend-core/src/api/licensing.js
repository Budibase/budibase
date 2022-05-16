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

  getQuotaUsage: async () => {
    return API.get({
      url: "/api/license/usage",
    })
  },
})

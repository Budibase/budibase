export const buildLicensingEndpoints = API => ({

  // LICENSE KEY

  activateLicenseKey: async data => {
    return API.post({
      url: `/api/global/license/key`,
      body: data,
    })
  },
  deleteLicenseKey: async () => {
    return API.delete({
      url: `/api/global/license/key`,
    })
  },
  getLicenseKey: async () => {
    try {
      return await API.get({
        url: "/api/global/license/key",
      })
    } catch (e) {
      if (e.status !== 404) {
        throw e
      }
    }
  },

  // OFFLINE LICENSE

  activateOfflineLicense: async ({ offlineLicense }) => {
    return API.post({
      url: "/api/global/license/offline",
      body: {
        offlineLicense
      },
    })
  },
  deleteOfflineLicense: async () => {
    return API.delete({
      url: "/api/global/license/offline",
    })
  },
  getOfflineLicense: async () => {
    try {
      return await API.get({
        url: "/api/global/license/offline",
      })
    } catch (e) {
      if (e.status !== 404) {
        throw e
      }
    }
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

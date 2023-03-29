export const buildTenantEndpoints = API => ({
  /**
   * Get information about a tenant
   */
  getTenantInfo: async tenantId => {
    return await API.get({ url: `/api/system/tenants/${tenantId}/info` })
  },
})

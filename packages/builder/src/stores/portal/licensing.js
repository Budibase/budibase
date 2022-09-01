import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"

export const createLicensingStore = () => {
  const DEFAULT = {
    plans: {},
  }

  const store = writable(DEFAULT)

  const actions = {
    getQuotaUsage: async () => {
      const quotaUsage = await API.getQuotaUsage()
      store.update(state => {
        return {
          ...state,
          quotaUsage,
        }
      })
    },
    getTestData: async () => {
      const tenantId = get(auth).tenantId
      console.log("Tenant ", tenantId)

      const license = get(auth).user.license
      console.log("User LICENSE ", license)

      // Pull out the usage.
      const quota = get(store).quotaUsage
      console.log("Quota usage", quota)

      // Would only initialise the usage elements if the account element is present.
      console.log("User account ", get(auth).user.account)

      //separate into functions that pass in both the usage and quota
      //easier to test

      const getMonthlyMetrics = (license, quota) => {
        return ["sessions", "queries", "automations"].reduce((acc, key) => {
          const quotaLimit = license.quotas.usage.monthly[key].value
          acc[key] =
            quotaLimit > -1
              ? (quota.monthly.current[key] / quotaLimit) * 100
              : -1
          return acc
        }, {})
      }

      const getStaticMetrics = (license, quota) => {
        return ["apps", "rows"].reduce((acc, key) => {
          const quotaLimit = license.quotas.usage.monthly[key].value
          acc[key] =
            quotaLimit > -1 ? (quota.usageQuota[key] / quotaLimit) * 100 : -1
          return acc
        }, {})
      }

      const modQuotaStr = JSON.stringify(quota)
      const cloneQuota = JSON.parse(modQuotaStr)
      cloneQuota.monthly.current.sessions = 4

      const monthlyMetrics = getMonthlyMetrics(license, cloneQuota)
      const staticMetrics = getStaticMetrics(license, cloneQuota)

      console.log("Monthly Usage Metrics ", monthlyMetrics)
      console.log("Static Usage Metrics ", staticMetrics)

      const flagged = Object.keys(monthlyMetrics).filter(key => {
        return monthlyMetrics[key] >= 100
      })

      console.log(flagged)

      // store.update(state => {
      //   return {
      //     ...state,
      //     metrics,
      //   }
      // })
    },
  }

  return {
    subscribe: store.subscribe,
    ...actions,
  }
}

export const licensing = createLicensingStore()

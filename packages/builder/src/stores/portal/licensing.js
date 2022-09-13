import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import { Constants } from "@budibase/frontend-core"
import { StripeStatus } from "components/portal/licensing/constants"

export const createLicensingStore = () => {
  const DEFAULT = {
    plans: {},
  }

  const oneDayInMilliseconds = 86400000

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
    getUsageMetrics: async () => {
      const quota = get(store).quotaUsage
      const license = get(auth).user.license
      const now = Date.now()
      const nowSeconds = now / 1000

      const getMetrics = (keys, license, quota) => {
        if (!license || !quota || !keys) {
          return {}
        }
        return keys.reduce((acc, key) => {
          const quotaLimit = license[key].value
          const quotaUsed = (quota[key] / quotaLimit) * 100

          // Catch for sessions
          key = key === "sessions" ? "dayPasses" : key

          acc[key] = quotaLimit > -1 ? Math.round(quotaUsed) : -1
          return acc
        }, {})
      }
      const monthlyMetrics = getMetrics(
        ["sessions", "queries", "automations"],
        license.quotas.usage.monthly,
        quota.monthly.current
      )
      const staticMetrics = getMetrics(
        ["apps", "rows"],
        license.quotas.usage.static,
        quota.usageQuota
      )

      // DEBUG
      console.log("Store licensing val ", {
        ...monthlyMetrics,
        ...staticMetrics,
      })

      let subscriptionDaysRemaining
      if (license?.billing?.subscription) {
        const currentPeriodEnd = license.billing.subscription.currentPeriodEnd
        const currentPeriodEndMilliseconds = currentPeriodEnd * 1000

        subscriptionDaysRemaining = Math.round(
          (currentPeriodEndMilliseconds - now) / oneDayInMilliseconds
        )
      }

      const quotaResetDaysRemaining =
        quota.quotaReset > now
          ? Math.round((quota.quotaReset - now) / oneDayInMilliseconds)
          : 0

      const accountDowngraded =
        license?.billing?.subscription?.status === StripeStatus.PAST_DUE &&
        license?.plan === Constants.PlanType.FREE

      const accountPastDue =
        nowSeconds >= license?.billing?.subscription?.currentPeriodEnd &&
        nowSeconds <= license?.billing?.subscription?.pastDueAt &&
        license?.billing?.subscription?.status === StripeStatus.PAST_DUE &&
        !accountDowngraded

      const pastDueAtSeconds = license?.billing?.subscription?.pastDueAt
      const pastDueAtMilliseconds = pastDueAtSeconds * 1000
      const paymentDueDaysRemaining = Math.round(
        (pastDueAtMilliseconds - now) / oneDayInMilliseconds
      )

      store.update(state => {
        return {
          ...state,
          usageMetrics: { ...monthlyMetrics, ...staticMetrics },
          subscriptionDaysRemaining,
          paymentDueDaysRemaining,
          quotaResetDaysRemaining,
          accountDowngraded,
          accountPastDue,
        }
      })
    },
  }

  return {
    subscribe: store.subscribe,
    ...actions,
  }
}

export const licensing = createLicensingStore()

import { writable, get } from "svelte/store"
import { API } from "api"
import { auth } from "stores/portal"
import { Constants } from "@budibase/frontend-core"
import { StripeStatus } from "components/portal/licensing/constants"
import { FEATURE_FLAGS, isEnabled } from "../../helpers/featureFlags"

export const createLicensingStore = () => {
  const DEFAULT = {
    plans: {},
    usageMetrics: {},
  }
  const oneDayInMilliseconds = 86400000

  const store = writable(DEFAULT)

  const actions = {
    init: async () => {
      await actions.getQuotaUsage()
      await actions.getUsageMetrics()
    },
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
      if (isEnabled(FEATURE_FLAGS.LICENSING)) {
        const quota = get(store).quotaUsage
        const license = get(auth).user.license
        const now = new Date()

        const getMetrics = (keys, license, quota) => {
          if (!license || !quota || !keys) {
            return {}
          }
          return keys.reduce((acc, key) => {
            const quotaLimit = license[key].value
            const quotaUsed = (quota[key] / quotaLimit) * 100
            acc[key] = quotaLimit > -1 ? Math.round(quotaUsed) : -1
            return acc
          }, {})
        }
        const monthlyMetrics = getMetrics(
          ["dayPasses", "queries", "automations"],
          license.quotas.usage.monthly,
          quota.monthly.current
        )
        const staticMetrics = getMetrics(
          ["apps", "rows"],
          license.quotas.usage.static,
          quota.usageQuota
        )

        const getDaysBetween = (dateStart, dateEnd) => {
          return dateEnd > dateStart
            ? Math.round(
                (dateEnd.getTime() - dateStart.getTime()) / oneDayInMilliseconds
              )
            : 0
        }

        const quotaResetDate = new Date(quota.quotaReset)
        const quotaResetDaysRemaining = getDaysBetween(now, quotaResetDate)

        const accountDowngraded =
          license?.billing?.subscription?.downgradeAt &&
          license?.billing?.subscription?.downgradeAt <= now.getTime() &&
          license?.billing?.subscription?.status === StripeStatus.PAST_DUE &&
          license?.plan.type === Constants.PlanType.FREE

        const pastDueAtMilliseconds = license?.billing?.subscription?.pastDueAt
        const downgradeAtMilliseconds =
          license?.billing?.subscription?.downgradeAt
        let pastDueDaysRemaining
        let pastDueEndDate

        if (pastDueAtMilliseconds && downgradeAtMilliseconds) {
          pastDueEndDate = new Date(downgradeAtMilliseconds)
          pastDueDaysRemaining = getDaysBetween(
            new Date(pastDueAtMilliseconds),
            pastDueEndDate
          )
        }

        store.update(state => {
          return {
            ...state,
            usageMetrics: { ...monthlyMetrics, ...staticMetrics },
            quotaResetDaysRemaining,
            quotaResetDate,
            accountDowngraded,
            accountPastDue: pastDueAtMilliseconds != null,
            pastDueEndDate,
            pastDueDaysRemaining,
            isFreePlan: () => {
              return license?.plan.type === Constants.PlanType.FREE
            },
          }
        })
      }
    },
  }

  return {
    subscribe: store.subscribe,
    ...actions,
  }
}

export const licensing = createLicensingStore()

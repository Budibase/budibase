import { writable, get } from "svelte/store"
import { API } from "api"
import { auth, admin } from "stores/portal"
import { Constants } from "@budibase/frontend-core"
import { StripeStatus } from "components/portal/licensing/constants"
import { TENANT_FEATURE_FLAGS, isEnabled } from "helpers/featureFlags"
import * as helpers from "../../helpers"

export const createLicensingStore = () => {
  const DEFAULT = {
    // navigation
    goToUpgradePage: () => {},
    // the top level license
    license: undefined,
    isFreePlan: true,
    isTrialing: false,
    trialDaysRemaining: undefined,
    planName: undefined,
    // features
    groupsEnabled: false,
    // the currently used quotas from the db
    quotaUsage: undefined,
    // derived quota metrics for percentages used
    usageMetrics: undefined,
    // quota reset
    quotaResetDaysRemaining: undefined,
    quotaResetDate: undefined,
    // failed payments
    accountPastDue: undefined,
    pastDueEndDate: undefined,
    pastDueDaysRemaining: undefined,
    accountDowngraded: undefined,
  }
  const oneDayInMilliseconds = 86400000

  const store = writable(DEFAULT)

  const getDaysBetween = (dateStart, dateEnd) => {
    return dateEnd > dateStart
      ? Math.round(
          (dateEnd.getTime() - dateStart.getTime()) / oneDayInMilliseconds
        )
      : 0
  }

  const actions = {
    init: async () => {
      actions.setNavigation()
      actions.setLicense()
      await actions.setQuotaUsage()
      actions.setUsageMetrics()
    },
    setNavigation: () => {
      const upgradeUrl = `${get(admin).accountPortalUrl}/portal/upgrade`
      const pricingUrl = `https://budibase.com/pricing/`
      const goToUpgradePage = () => {
        if (get(auth).user?.accountPortalAccess) {
          window.location.href = upgradeUrl
        } else {
          window.open(pricingUrl, "_blank")
        }
      }
      store.update(state => {
        return {
          ...state,
          goToUpgradePage,
        }
      })
    },
    setLicense: () => {
      const license = get(auth).user.license
      const isFreePlan = license?.plan.type === Constants.PlanType.FREE
      const planName = license?.plan.type
        ? helpers.capitalise(license.plan.type)
        : ""
      const groupsEnabled = license.features.includes(
        Constants.Features.USER_GROUPS
      )
      // trial
      const isTrialing = license?.plan.isTrialing
      let trialDaysRemaining
      if (isTrialing) {
        const now = new Date()
        trialDaysRemaining = getDaysBetween(
          now,
          new Date(license.plan.trialEndAt)
        )
      }
      store.update(state => {
        return {
          ...state,
          license,
          isFreePlan,
          isTrialing,
          trialDaysRemaining,
          planName,
          groupsEnabled,
        }
      })
    },
    setQuotaUsage: async () => {
      const quotaUsage = await API.getQuotaUsage()
      store.update(state => {
        return {
          ...state,
          quotaUsage,
        }
      })
    },
    setUsageMetrics: () => {
      if (isEnabled(TENANT_FEATURE_FLAGS.LICENSING)) {
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
            acc[key] = quotaLimit > -1 ? Math.floor(quotaUsed) : -1
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

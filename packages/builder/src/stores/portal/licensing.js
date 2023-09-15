import { writable, get } from "svelte/store"
import { API } from "api"
import { auth, admin } from "stores/portal"
import { Constants } from "@budibase/frontend-core"
import { StripeStatus } from "components/portal/licensing/constants"
import { TENANT_FEATURE_FLAGS, isEnabled } from "helpers/featureFlags"
import { PlanModel } from "@budibase/types"

const UNLIMITED = -1

export const createLicensingStore = () => {
  const DEFAULT = {
    // navigation
    goToUpgradePage: () => {},
    goToPricingPage: () => {},
    // the top level license
    license: undefined,
    isFreePlan: true,
    isEnterprisePlan: true,
    isBusinessPlan: true,
    // features
    groupsEnabled: false,
    backupsEnabled: false,
    brandingEnabled: false,
    scimEnabled: false,
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
    // user limits
    userCount: undefined,
    userLimit: undefined,
    userLimitReached: false,
    errUserLimit: false,
  }

  const oneDayInMilliseconds = 86400000

  const store = writable(DEFAULT)

  function usersLimitReached(userCount, userLimit) {
    if (userLimit === UNLIMITED) {
      return false
    }
    return userCount >= userLimit
  }

  function usersLimitExceeded(userCount, userLimit) {
    if (userLimit === UNLIMITED) {
      return false
    }
    return userCount > userLimit
  }

  async function isCloud() {
    let adminStore = get(admin)
    if (!adminStore.loaded) {
      await admin.init()
      adminStore = get(admin)
    }
    return adminStore.cloud
  }

  const actions = {
    init: async () => {
      actions.setNavigation()
      actions.setLicense()
      await actions.setQuotaUsage()
    },
    setNavigation: () => {
      const adminStore = get(admin)
      const authStore = get(auth)

      const upgradeUrl = authStore?.user?.accountPortalAccess
        ? `${adminStore.accountPortalUrl}/portal/upgrade`
        : "/builder/portal/account/upgrade"

      const goToUpgradePage = () => {
        window.location.href = upgradeUrl
      }
      const goToPricingPage = () => {
        window.open("https://budibase.com/pricing/", "_blank")
      }
      store.update(state => {
        return {
          ...state,
          goToUpgradePage,
          goToPricingPage,
        }
      })
    },
    setLicense: () => {
      const license = get(auth).user.license
      const planType = license?.plan.type
      const isEnterprisePlan = planType === Constants.PlanType.ENTERPRISE
      const isFreePlan = planType === Constants.PlanType.FREE
      const isBusinessPlan = planType === Constants.PlanType.BUSINESS
      const groupsEnabled = license.features.includes(
        Constants.Features.USER_GROUPS
      )
      const backupsEnabled = license.features.includes(
        Constants.Features.APP_BACKUPS
      )
      const scimEnabled = license.features.includes(Constants.Features.SCIM)
      const environmentVariablesEnabled = license.features.includes(
        Constants.Features.ENVIRONMENT_VARIABLES
      )
      const enforceableSSO = license.features.includes(
        Constants.Features.ENFORCEABLE_SSO
      )
      const brandingEnabled = license.features.includes(
        Constants.Features.BRANDING
      )
      const auditLogsEnabled = license.features.includes(
        Constants.Features.AUDIT_LOGS
      )
      const syncAutomationsEnabled = license.features.includes(
        Constants.Features.SYNC_AUTOMATIONS
      )
      const perAppBuildersEnabled = license.features.includes(
        Constants.Features.APP_BUILDERS
      )

      const isViewPermissionsEnabled = license.features.includes(
        Constants.Features.VIEW_PERMISSIONS
      )
      store.update(state => {
        return {
          ...state,
          license,
          isEnterprisePlan,
          isFreePlan,
          isBusinessPlan,
          groupsEnabled,
          backupsEnabled,
          brandingEnabled,
          scimEnabled,
          environmentVariablesEnabled,
          auditLogsEnabled,
          enforceableSSO,
          syncAutomationsEnabled,
          isViewPermissionsEnabled,
          perAppBuildersEnabled,
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
      await actions.setUsageMetrics()
    },
    usersLimitReached: userCount => {
      return usersLimitReached(userCount, get(store).userLimit)
    },
    usersLimitExceeded(userCount) {
      return usersLimitExceeded(userCount, get(store).userLimit)
    },
    setUsageMetrics: async () => {
      if (isEnabled(TENANT_FEATURE_FLAGS.LICENSING)) {
        const usage = get(store).quotaUsage
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
          usage.monthly.current
        )
        const staticMetrics = getMetrics(
          ["apps", "rows"],
          license.quotas.usage.static,
          usage.usageQuota
        )

        const getDaysBetween = (dateStart, dateEnd) => {
          return dateEnd > dateStart
            ? Math.round(
                (dateEnd.getTime() - dateStart.getTime()) / oneDayInMilliseconds
              )
            : 0
        }

        const quotaResetDate = new Date(usage.quotaReset)
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

        const userQuota = license.quotas.usage.static.users
        const userLimit = userQuota?.value
        const userCount = usage.usageQuota.users
        const userLimitReached = usersLimitReached(userCount, userLimit)
        const userLimitExceeded = usersLimitExceeded(userCount, userLimit)
        const isCloudAccount = await isCloud()
        const errUserLimit =
          isCloudAccount &&
          license.plan.model === PlanModel.PER_USER &&
          userLimitExceeded

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
            // user limits
            userCount,
            userLimit,
            userLimitReached,
            errUserLimit,
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

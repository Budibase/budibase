import { ExpiringKeys } from "./constants"
import { admin, auth, licensing, temporalStore } from "@/stores/portal"
import { get } from "svelte/store"
import { BANNER_TYPES } from "@budibase/bbui"

const oneDayInSeconds = 86400

const defaultCacheFn = key => {
  temporalStore.actions.setExpiring(key, {}, oneDayInSeconds)
}

const upgradeAction = key => {
  return defaultNavigateAction(
    key,
    "Upgrade",
    `${get(admin).accountPortalUrl}/portal/upgrade`
  )
}

const billingAction = key => {
  return defaultNavigateAction(
    key,
    "Billing",
    `${get(admin).accountPortalUrl}/portal/billing`
  )
}

const defaultNavigateAction = (key, actionText, url) => {
  if (!get(auth).user.accountPortalAccess) {
    return {}
  }
  return {
    extraButtonText: actionText,
    extraButtonAction: () => {
      defaultCacheFn(key)
      window.location.href = url
    },
  }
}

const buildUsageInfoBanner = (
  metricKey,
  metricLabel,
  cacheKey,
  percentageThreshold,
  customMessage
) => {
  const appAuth = get(auth)
  const appLicensing = get(licensing)

  const displayPercent =
    appLicensing?.usageMetrics[metricKey] > 100
      ? 100
      : appLicensing?.usageMetrics[metricKey]

  let bannerConfig = {
    key: cacheKey,
    type: BANNER_TYPES.INFO,
    onChange: () => {
      defaultCacheFn(cacheKey)
    },
    message: customMessage
      ? customMessage
      : `You have used ${displayPercent}% of your monthly usage of ${metricLabel} with ${
          appLicensing.quotaResetDaysRemaining
        } day${
          appLicensing.quotaResetDaysRemaining == 1 ? "" : "s"
        } remaining. ${
          appAuth.user.accountPortalAccess
            ? ""
            : "Please contact your account holder to upgrade"
        }`,
    criteria: () => {
      return appLicensing?.usageMetrics[metricKey] >= percentageThreshold
    },
    tooltip: appLicensing?.quotaResetDate,
  }

  return !get(auth).user.accountPortalAccess
    ? bannerConfig
    : {
        ...bannerConfig,
        ...upgradeAction(cacheKey),
      }
}

const buildPaymentFailedBanner = () => {
  return {
    key: "payment_Failed",
    type: BANNER_TYPES.NEGATIVE,
    criteria: () => {
      return get(licensing)?.accountPastDue && !get(licensing).isFreePlan
    },
    message: `Payment Failed - Please update your billing details or your account will be downgraded in 
    ${get(licensing)?.pastDueDaysRemaining} day${
      get(licensing)?.pastDueDaysRemaining == 1 ? "" : "s"
    }`,
    ...billingAction(),
    showCloseButton: false,
    tooltip: get(licensing).pastDueEndDate,
  }
}

const buildUsersAboveLimitBanner = EXPIRY_KEY => {
  const userLicensing = get(licensing)
  return {
    key: EXPIRY_KEY,
    type: BANNER_TYPES.NEGATIVE,
    onChange: () => {
      defaultCacheFn(EXPIRY_KEY)
    },
    criteria: () => {
      return userLicensing.errUserLimit
    },
    message: "Your Budibase account is de-activated. Upgrade your plan",
    ...{
      extraButtonText: "View plans",
      extraButtonAction: () => {
        defaultCacheFn(ExpiringKeys.LICENSING_USERS_ABOVE_LIMIT_BANNER)
        window.location.href = "https://budibase.com/pricing/"
      },
    },
    showCloseButton: true,
  }
}

export const getBanners = () => {
  return [
    buildPaymentFailedBanner(),
    buildUsageInfoBanner(
      "rows",
      "Rows",
      ExpiringKeys.LICENSING_ROWS_WARNING_BANNER,
      90
    ),
    buildUsageInfoBanner(
      "automations",
      "Automations",
      ExpiringKeys.LICENSING_AUTOMATIONS_WARNING_BANNER,
      90
    ),
    buildUsageInfoBanner(
      "queries",
      "Queries",
      ExpiringKeys.LICENSING_QUERIES_WARNING_BANNER,
      90
    ),
    buildUsersAboveLimitBanner(ExpiringKeys.LICENSING_USERS_ABOVE_LIMIT_BANNER),
  ].filter(licensingBanner => {
    return (
      !temporalStore.actions.getExpiring(licensingBanner.key) &&
      licensingBanner.criteria()
    )
  })
}

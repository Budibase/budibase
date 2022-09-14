import { ExpiringKeys } from "./constants"
import { temporalStore } from "builderStore"
import { admin, auth, licensing } from "stores/portal"
import { get } from "svelte/store"
import { BANNER_TYPES } from "@budibase/bbui"

const oneDayInSeconds = 86400

const defaultCacheFn = key => {
  temporalStore.actions.setExpiring(key, {}, oneDayInSeconds)
}

const defaultAction = key => {
  if (!get(auth).user.accountPortalAccess) {
    return {}
  }
  return {
    extraButtonText: "Upgrade Plan",
    extraButtonAction: () => {
      defaultCacheFn(key)
      window.location.href = `${get(admin).accountPortalUrl}/portal/upgrade`
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
        ...defaultAction(cacheKey),
      }
}

const buildDayPassBanner = () => {
  const appAuth = get(auth)
  const appLicensing = get(licensing)
  if (get(licensing)?.usageMetrics["dayPasses"] >= 100) {
    return {
      key: "max_dayPasses",
      type: BANNER_TYPES.NEGATIVE,
      criteria: () => {
        return true
      },
      message: `Your apps are currently offline. You have exceeded your plans limit for Day Passes. ${
        appAuth.user.accountPortalAccess
          ? ""
          : "Please contact your account holder to upgrade."
      }`,
      ...defaultAction(),
      showCloseButton: false,
    }
  }

  return buildUsageInfoBanner(
    "dayPasses",
    "Day Passes",
    ExpiringKeys.LICENSING_DAYPASS_WARNING_BANNER,
    90,
    `You have used ${
      appLicensing?.usageMetrics["dayPasses"]
    }% of your monthly usage of Day Passes with ${
      appLicensing?.quotaResetDaysRemaining
    } day${
      get(licensing).quotaResetDaysRemaining == 1 ? "" : "s"
    } remaining. All apps will be taken offline if this limit is reached. ${
      appAuth.user.accountPortalAccess
        ? ""
        : "Please contact your account holder to upgrade."
    }`
  )
}

const buildPaymentFailedBanner = () => {
  return {
    key: "payment_Failed",
    type: BANNER_TYPES.NEGATIVE,
    criteria: () => {
      return get(licensing)?.accountPastDue && !get(licensing).isFreePlan()
    },
    message: `Payment Failed - Please update your billing details or your account will be downgrades in 
    ${get(licensing)?.pastDueDaysRemaining} day${
      get(licensing)?.pastDueDaysRemaining == 1 ? "" : "s"
    }`,
    ...defaultAction(),
    showCloseButton: false,
    tooltip: get(licensing).pastDueEndDate,
  }
}

export const getBanners = () => {
  return [
    buildPaymentFailedBanner(),
    buildDayPassBanner(ExpiringKeys.LICENSING_DAYPASS_WARNING_BANNER),
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
  ].filter(licensingBanner => {
    return (
      !temporalStore.actions.getExpiring(licensingBanner.key) &&
      licensingBanner.criteria()
    )
  })
}

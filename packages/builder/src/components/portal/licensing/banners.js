import { ExpiringKeys } from "./constants"
import { temporalStore } from "builderStore"
import { admin, auth, licensing } from "stores/portal"
import { get } from "svelte/store"

const oneDayInSeconds = 86400
const upgradeUrl = `${get(admin).accountPortalUrl}/portal/upgrade`

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
      window.location.href = upgradeUrl
    },
  }
}

const buildUsageInfoBanner = (metricKey, metricLabel, cacheKey, percentage) => {
  const appAuth = get(auth)
  const appLicensing = get(licensing)

  let bannerConfig = {
    key: cacheKey,
    type: "info",
    onChange: () => {
      defaultCacheFn(cacheKey)
    },
    message: `You have used ${
      appLicensing?.usageMetrics[metricKey]
    }% of your monthly usage of ${metricLabel} with ${
      appLicensing.quotaResetDaysRemaining
    } day${
      appLicensing.quotaResetDaysRemaining == 1 ? "" : "s"
    } remaining. All apps will be taken offline if this limit is reached. ${
      appAuth.user.accountPortalAccess
        ? ""
        : "Please contact your account holder."
    }`,
    criteria: () => {
      return appLicensing?.usageMetrics[metricKey] >= percentage
    },
    priority: 0, //Banners.Priority 0, 1, 2 ??
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
  if (get(licensing)?.usageMetrics["dayPasses"] >= 100) {
    return {
      key: "max_dayPasses",
      type: "negative",
      criteria: () => {
        return true
      },
      message: `Your apps are currently offline. You have exceeded your plans limit for Day Passes. ${
        appAuth.user.accountPortalAccess
          ? ""
          : "Please contact your account holder."
      }`,
      ...defaultAction(),
      showCloseButton: false,
    }
  }

  return buildUsageInfoBanner(
    "dayPasses",
    "Day Passes",
    ExpiringKeys.LICENSING_DAYPASS_WARNING_BANNER,
    90
  )
}

const buildPaymentFailedBanner = () => {
  return {
    key: "payment_Failed",
    type: "negative",
    criteria: () => {
      return get(licensing)?.accountPastDue
    },
    message: `Payment Failed - Please update your billing details or your account will be downgrades in 
    ${get(licensing)?.paymentDueDaysRemaining} day${
      get(licensing)?.paymentDueDaysRemaining == 1 ? "" : "s"
    }`,
    ...defaultAction(),
    showCloseButton: false,
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
      90 // could be an array [50,75,90]
    ),
  ].filter(licensingBanner => {
    return (
      !temporalStore.actions.getExpiring(licensingBanner.key) &&
      licensingBanner.criteria()
    )
  })
}

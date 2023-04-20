import { _ } from "../../../../lang/i18n"
import { ExpiringKeys } from "./constants"
import { temporalStore } from "builderStore"
import { admin, auth, licensing } from "stores/portal"
import { get } from "svelte/store"
import { BANNER_TYPES } from "@budibase/bbui"

const oneDayInSeconds = 86400

const defaultCacheFn = key => {
  temporalStore.actions.setExpiring(key, {}, oneDayInSeconds)
}

const upgradeAction = key => {
  return defaultNavigateAction(
    key,
    $_("components.portal.licensing.licensingBanners.Upgrade_plan"),
    `${get(admin).accountPortalUrl}/portal/upgrade`
  )
}

const billingAction = key => {
  return defaultNavigateAction(
    key,
    $_("components.portal.licensing.licensingBanners.Billing"),
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
      : `${$_(
          "components.portal.licensing.licensingBanners.You"
        )} ${displayPercent}% ${$_(
          "components.portal.licensing.licensingBanners.of"
        )} ${metricLabel} ${$_(
          "components.portal.licensing.licensingBanners.with"
        )} ${appLicensing.quotaResetDaysRemaining} ${$_(
          "components.portal.licensing.licensingBanners.day"
        )}${appLicensing.quotaResetDaysRemaining == 1 ? "" : "s"} ${$_(
          "components.portal.licensing.licensingBanners.remaining"
        )} ${
          appAuth.user.accountPortalAccess
            ? ""
            : $_("components.portal.licensing.licensingBanners.Please_contact")
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
      message: `${$_(
        "components.portal.licensing.licensingBanners.Your_apps"
      )} ${
        appAuth.user.accountPortalAccess
          ? ""
          : $_("components.portal.licensing.licensingBanners.Please_contact")
      }`,
      ...upgradeAction(),
      showCloseButton: false,
    }
  }

  return buildUsageInfoBanner(
    "dayPasses",
    $_("components.portal.licensing.licensingBanners.Day_passes"),
    ExpiringKeys.LICENSING_DAYPASS_WARNING_BANNER,
    90,
    `${$_("components.portal.licensing.licensingBanners.You")} ${
      appLicensing?.usageMetrics["dayPasses"]
    }% ${$_("components.portal.licensing.licensingBanners.of_your")} ${
      appLicensing?.quotaResetDaysRemaining
    } ${$_("components.portal.licensing.licensingBanners.day")}${
      get(licensing).quotaResetDaysRemaining == 1 ? "" : "s"
    } ${$_("components.portal.licensing.licensingBanners.remaining")} ${$_(
      "components.portal.licensing.licensingBanners.All_apps"
    )} ${
      appAuth.user.accountPortalAccess
        ? ""
        : $_("components.portal.licensing.licensingBanners.Please_contact")
    }`
  )
}

const buildPaymentFailedBanner = () => {
  return {
    key: "payment_Failed",
    type: BANNER_TYPES.NEGATIVE,
    criteria: () => {
      return get(licensing)?.accountPastDue && !get(licensing).isFreePlan
    },
    message: `${$_(
      "components.portal.licensing.licensingBanners.Payment_failed"
    )} 
    ${get(licensing)?.pastDueDaysRemaining} ${$_(
      "components.portal.licensing.licensingBanners.day"
    )}${get(licensing)?.pastDueDaysRemaining == 1 ? "" : "s"}`,
    ...billingAction(),
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
      $_("components.portal.licensing.licensingBanners.Rows"),
      ExpiringKeys.LICENSING_ROWS_WARNING_BANNER,
      90
    ),
    buildUsageInfoBanner(
      "automations",
      $_("components.portal.licensing.licensingBanners.Automation"),
      ExpiringKeys.LICENSING_AUTOMATIONS_WARNING_BANNER,
      90
    ),
    buildUsageInfoBanner(
      "queries",
      $_("components.portal.licensing.licensingBanners.Queries"),
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

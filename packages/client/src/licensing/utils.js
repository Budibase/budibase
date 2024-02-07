import { authStore } from "../stores/auth.js"
import { appStore } from "../stores/app.js"
import { get } from "svelte/store"
import { Constants } from "@budibase/frontend-core"

const getUserLicense = () => {
  const user = get(authStore)
  if (user) {
    return user.license
  }
}

const getAppLicenseType = () => {
  const appDef = get(appStore)
  if (appDef?.licenseType) {
    return appDef.licenseType
  }
}

export const isFreePlan = () => {
  let licenseType = getAppLicenseType()
  if (!licenseType) {
    const license = getUserLicense()
    licenseType = license?.plan?.type
  }
  if (licenseType) {
    return licenseType === Constants.PlanType.FREE
  } else {
    // safety net - no license means free plan
    return true
  }
}

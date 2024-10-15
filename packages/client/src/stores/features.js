import { derived } from "svelte/store"
import { appStore } from "./app"
import { authStore } from "./auth"
import { Constants } from "@budibase/frontend-core"
import { Feature } from "@budibase/types"

const createFeaturesStore = () => {
  return derived([authStore, appStore], ([$authStore, $appStore]) => {
    const getUserLicense = () => {
      const user = $authStore
      if (user) {
        return user.license
      }
    }

    const getAppLicenseType = () => {
      const appDef = $appStore
      if (appDef?.licenseType) {
        return appDef.licenseType
      }
    }

    const isFreePlan = () => {
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

    const license = getUserLicense()

    return {
      logoEnabled: isFreePlan(),
      aiEnabled:
        license?.features?.includes(Feature.AI_CUSTOM_CONFIGS) ||
        license?.features?.includes(Feature.BUDIBASE_AI),
    }
  })
}

export const featuresStore = createFeaturesStore()

import { Feature, License, Quotas } from "@budibase/types"
import _ from "lodash"

let CLOUD_FREE_LICENSE: License
let UNLIMITED_LICENSE: License
let getCachedLicense: any

// init for the packages other than pro
export function init(proPkg: any) {
  initInternal({
    CLOUD_FREE_LICENSE: proPkg.constants.licenses.CLOUD_FREE_LICENSE,
    UNLIMITED_LICENSE: proPkg.constants.licenses.UNLIMITED_LICENSE,
    getCachedLicense: proPkg.licensing.cache.getCachedLicense,
  })
}

// init for the pro package
export function initInternal(opts: {
  CLOUD_FREE_LICENSE: License
  UNLIMITED_LICENSE: License
  getCachedLicense: any
}) {
  CLOUD_FREE_LICENSE = opts.CLOUD_FREE_LICENSE
  UNLIMITED_LICENSE = opts.UNLIMITED_LICENSE
  getCachedLicense = opts.getCachedLicense
}

export interface UseLicenseOpts {
  features?: Feature[]
  quotas?: Quotas
}

// LICENSES

export const useLicense = (license: License, opts?: UseLicenseOpts) => {
  if (opts) {
    if (opts.features) {
      license.features.push(...opts.features)
    }
    if (opts.quotas) {
      license.quotas = opts.quotas
    }
  }

  getCachedLicense.mockReturnValue(license)

  return license
}

export const useUnlimited = (opts?: UseLicenseOpts) => {
  return useLicense(UNLIMITED_LICENSE, opts)
}

export const useCloudFree = () => {
  return useLicense(CLOUD_FREE_LICENSE)
}

// FEATURES

const useFeature = (feature: Feature) => {
  const license = _.cloneDeep(UNLIMITED_LICENSE)
  const opts: UseLicenseOpts = {
    features: [feature],
  }

  return useLicense(license, opts)
}

export const useBackups = () => {
  return useFeature(Feature.APP_BACKUPS)
}

export const useGroups = () => {
  return useFeature(Feature.USER_GROUPS)
}

export const useEnvironmentVariables = () => {
  return useFeature(Feature.ENVIRONMENT_VARIABLES)
}

// QUOTAS

export const setAutomationLogsQuota = (value: number) => {
  const license = _.cloneDeep(UNLIMITED_LICENSE)
  license.quotas.constant.automationLogRetentionDays.value = value
  return useLicense(license)
}

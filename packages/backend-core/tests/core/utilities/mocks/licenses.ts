import {
  Feature,
  License,
  MonthlyQuotaName,
  QuotaType,
  QuotaUsageType,
} from "@budibase/types"
import cloneDeep from "lodash/cloneDeep"
import merge from "lodash/merge"

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
  monthlyQuotas?: [MonthlyQuotaName, number][]
}

// LICENSES

export const useLicense = (license: License, opts?: UseLicenseOpts) => {
  if (opts?.features) {
    license.features.push(...opts.features)
  }
  if (opts?.monthlyQuotas) {
    for (const [name, value] of opts.monthlyQuotas) {
      license.quotas[QuotaType.USAGE][QuotaUsageType.MONTHLY][name].value =
        value
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

const useFeature = (feature: Feature, extra?: Partial<UseLicenseOpts>) => {
  const license = cloneDeep(getCachedLicense() || UNLIMITED_LICENSE)
  const opts: UseLicenseOpts = merge({ features: [feature] }, extra)
  return useLicense(license, opts)
}

export const useBackups = () => {
  return useFeature(Feature.APP_BACKUPS)
}

export const useEnforceableSSO = () => {
  return useFeature(Feature.ENFORCEABLE_SSO)
}

export const useGroups = () => {
  return useFeature(Feature.USER_GROUPS)
}

export const useEnvironmentVariables = () => {
  return useFeature(Feature.ENVIRONMENT_VARIABLES)
}

export const useAuditLogs = () => {
  return useFeature(Feature.AUDIT_LOGS)
}

export const useExpandedPublicApi = () => {
  return useFeature(Feature.EXPANDED_PUBLIC_API)
}

export const useScimIntegration = () => {
  return useFeature(Feature.SCIM)
}

export const useSyncAutomations = () => {
  return useFeature(Feature.SYNC_AUTOMATIONS)
}

export const useAppBuilders = () => {
  return useFeature(Feature.APP_BUILDERS)
}

export const useRecaptcha = () => {
  return useFeature(Feature.RECAPTCHA)
}

export const usePkceOidc = () => {
  return useFeature(Feature.PKCE_OIDC)
}

export const useBudibaseAI = (opts?: { monthlyQuota?: number }) => {
  return useFeature(Feature.BUDIBASE_AI, {
    monthlyQuotas: [
      [MonthlyQuotaName.BUDIBASE_AI_CREDITS, opts?.monthlyQuota || 1000],
    ],
  })
}

export const useAICustomConfigs = () => {
  return useFeature(Feature.AI_CUSTOM_CONFIGS)
}

// QUOTAS

export const setAutomationLogsQuota = (value: number) => {
  const license = cloneDeep(UNLIMITED_LICENSE)
  license.quotas.constant.automationLogRetentionDays.value = value
  return useLicense(license)
}

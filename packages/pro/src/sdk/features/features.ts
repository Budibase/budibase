import { configs, env, FeatureDisabledWarning } from "@budibase/backend-core"
import { Feature, License, SettingsInnerConfig } from "@budibase/types"
import { cache } from "../licensing"

// UTILS

async function areFeaturesEnabled(
  featureFlags: Feature[] | Feature,
  license?: License
) {
  if (!Array.isArray(featureFlags)) {
    featureFlags = [featureFlags]
  }
  if (!license) {
    license = await cache.getCachedLicense()
  }
  for (let flag of featureFlags) {
    if (!license?.features.includes(flag)) {
      return false
    }
  }
  return true
}

export async function checkFeature(featureFlag: Feature, license?: License) {
  if (!(await areFeaturesEnabled(featureFlag, license))) {
    throw new FeatureDisabledWarning(featureFlag)
  }
}

export async function checkFeatures(
  featureFlags: Feature[],
  license?: License
) {
  if (!(await areFeaturesEnabled(featureFlags, license))) {
    const flagsMsg = featureFlags.join(", ")
    throw new FeatureDisabledWarning(flagsMsg)
  }
}

// BACKUPS

export function checkBackups<Args extends any[], Return>(
  targetFunction: (...parameters: Args) => Return
): (...parameters: Args) => Promise<Return> {
  return async (...parameters: Args) => {
    await checkFeature(Feature.WORKSPACE_BACKUPS)
    return targetFunction(...parameters)
  }
}

export async function isBackupsEnabled() {
  return areFeaturesEnabled(Feature.WORKSPACE_BACKUPS)
}

// BRANDING

export async function isBrandingEnabled() {
  return areFeaturesEnabled(Feature.BRANDING)
}

// SSO

export async function isEnforceableSSO() {
  return areFeaturesEnabled(Feature.ENFORCEABLE_SSO)
}

// SYNC WEBHOOK

export async function isSyncAutomationsEnabled() {
  return areFeaturesEnabled(Feature.SYNC_AUTOMATIONS)
}

// TRIGGER OTHER AUTOMATIONS
export async function isTriggerAutomationRunEnabled() {
  return areFeaturesEnabled(Feature.TRIGGER_AUTOMATION_RUN)
}

// AUDIT LOGS

export async function isAuditLogsEnabled() {
  return areFeaturesEnabled(Feature.AUDIT_LOGS)
}

// GROUPS

export async function isUserGroupsEnabled() {
  return areFeaturesEnabled(Feature.USER_GROUPS)
}

// PWA

export function isPWAEnabled() {
  return areFeaturesEnabled(Feature.PWA)
}

// RECAPTCHA

export function isRecaptchaEnabled() {
  return areFeaturesEnabled(Feature.RECAPTCHA)
}

// PKCE OIDC

export const isPkceOidcEnabled = () => {
  return areFeaturesEnabled(Feature.PKCE_OIDC)
}

export async function isTranslationsEnabled() {
  return areFeaturesEnabled(Feature.TRANSLATIONS)
}

// EXPANDED PUBLIC API

export async function isExpandedPublicApiEnabled() {
  return areFeaturesEnabled(Feature.EXPANDED_PUBLIC_API)
}

export async function isSSOEnforced(opts?: {
  config: SettingsInnerConfig
}): Promise<boolean> {
  // never enforced in maintenance mode
  if (env.ENABLE_SSO_MAINTENANCE_MODE) {
    return false
  }

  // never enforced if the feature is not enabled
  const enforceable = await isEnforceableSSO()
  if (!enforceable) {
    return false
  }

  // get the enforced setting from config
  let config
  if (opts?.config) {
    config = opts.config
  } else {
    config = await configs.getSettingsConfig()
  }
  return !!config.isSSOEnforced
}

export const checkSCIM = async (): Promise<boolean> => {
  const featureFlag = Feature.SCIM

  const featureEnabled = await areFeaturesEnabled(featureFlag)
  const scimConfig = await configs.getSCIMConfig()

  if (!featureEnabled || !scimConfig?.enabled) {
    throw new FeatureDisabledWarning(featureFlag)
  }

  return true
}

export async function isViewPermissionEnabled() {
  return areFeaturesEnabled(Feature.VIEW_PERMISSIONS)
}

export async function isViewReadonlyColumnsEnabled() {
  return areFeaturesEnabled(Feature.VIEW_READONLY_COLUMNS)
}

import { Feature, PlanFeatures, PlanType } from "@budibase/types"
import * as constants from "../../../constants"

const SELF_FEATURES: PlanFeatures = {
  [PlanType.FREE]: [...constants.licenses.SELF_FREE_LICENSE.features],
  [PlanType.PREMIUM]: [
    Feature.WORKSPACE_BACKUPS,
    Feature.BRANDING,
    Feature.APP_BUILDERS,
    Feature.VIEW_PERMISSIONS,
    Feature.PDF,
  ],
  [PlanType.PREMIUM_PLUS]: [
    Feature.WORKSPACE_BACKUPS,
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    Feature.APP_BUILDERS,
    Feature.VIEW_PERMISSIONS,
    Feature.TRIGGER_AUTOMATION_RUN,
    Feature.VIEW_READONLY_COLUMNS,
    Feature.AI_CUSTOM_CONFIGS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
  ],
  [PlanType.PREMIUM_PLUS_TRIAL]: [
    Feature.WORKSPACE_BACKUPS,
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    Feature.APP_BUILDERS,
    Feature.VIEW_PERMISSIONS,
    Feature.TRIGGER_AUTOMATION_RUN,
    Feature.VIEW_READONLY_COLUMNS,
    Feature.AI_CUSTOM_CONFIGS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
  ],
  [PlanType.PRO]: [Feature.USER_GROUPS, Feature.WORKSPACE_BACKUPS],
  [PlanType.TEAM]: [Feature.USER_GROUPS, Feature.WORKSPACE_BACKUPS],
  [PlanType.BUSINESS]: [
    Feature.USER_GROUPS,
    Feature.WORKSPACE_BACKUPS,
    Feature.ENVIRONMENT_VARIABLES,
    Feature.AUDIT_LOGS,
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    Feature.APP_BUILDERS,
    Feature.EXPANDED_PUBLIC_API,
    Feature.VIEW_PERMISSIONS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
  ],
  [PlanType.ENTERPRISE_BASIC]: [
    Feature.USER_GROUPS,
    Feature.WORKSPACE_BACKUPS,
    Feature.ENVIRONMENT_VARIABLES,
    Feature.ENFORCEABLE_SSO,
    Feature.AUDIT_LOGS,
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    Feature.OFFLINE,
    Feature.APP_BUILDERS,
    Feature.EXPANDED_PUBLIC_API,
    Feature.VIEW_PERMISSIONS,
    Feature.TRIGGER_AUTOMATION_RUN,
    Feature.SCIM,
    Feature.VIEW_READONLY_COLUMNS,
    Feature.AI_CUSTOM_CONFIGS,
    Feature.PWA,
    Feature.CUSTOM_APP_SCRIPTS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
    Feature.RECAPTCHA,
    Feature.PKCE_OIDC,
    Feature.TRANSLATIONS,
  ],
  [PlanType.ENTERPRISE_BASIC_TRIAL]: [
    Feature.USER_GROUPS,
    Feature.WORKSPACE_BACKUPS,
    Feature.ENVIRONMENT_VARIABLES,
    Feature.ENFORCEABLE_SSO,
    //Feature.AUDIT_LOGS, // This feature is not available in the trial version
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    //Feature.OFFLINE, // This feature is not available in the trial version
    Feature.APP_BUILDERS,
    Feature.EXPANDED_PUBLIC_API,
    Feature.VIEW_PERMISSIONS,
    Feature.TRIGGER_AUTOMATION_RUN,
    Feature.SCIM,
    Feature.VIEW_READONLY_COLUMNS,
    Feature.AI_CUSTOM_CONFIGS,
    Feature.PWA,
    Feature.CUSTOM_APP_SCRIPTS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
    Feature.RECAPTCHA,
    Feature.PKCE_OIDC,
    Feature.TRANSLATIONS,
  ],
  [PlanType.ENTERPRISE]: [
    Feature.USER_GROUPS,
    Feature.WORKSPACE_BACKUPS,
    Feature.ENVIRONMENT_VARIABLES,
    Feature.ENFORCEABLE_SSO,
    Feature.AUDIT_LOGS,
    Feature.BRANDING,
    Feature.SYNC_AUTOMATIONS,
    Feature.OFFLINE,
    Feature.APP_BUILDERS,
    Feature.EXPANDED_PUBLIC_API,
    Feature.VIEW_PERMISSIONS,
    Feature.TRIGGER_AUTOMATION_RUN,
    Feature.SCIM,
    Feature.VIEW_READONLY_COLUMNS,
    Feature.AI_CUSTOM_CONFIGS,
    Feature.PWA,
    Feature.CUSTOM_APP_SCRIPTS,
    Feature.PDF,
    Feature.BUDIBASE_AI,
    Feature.RECAPTCHA,
    Feature.PKCE_OIDC,
    Feature.TRANSLATIONS,
  ],
}

export function getOfflineFeatures(planType: PlanType): Feature[] {
  function readFeatures(planFeatures: PlanFeatures): Feature[] {
    const quotas = planFeatures[planType]

    if (!quotas) {
      // e.g. Premium plan doesn't exist on self host
      throw new Error(`Features do not exist for planType=${planType}`)
    }

    return quotas
  }
  return readFeatures(SELF_FEATURES)
}

import { License, PlanModel, PlanType } from "@budibase/types"
import * as quotas from "./quotas"

export const UNLIMITED = -1

/**
 * The license used when no license is present.
 */
export const CLOUD_FREE_LICENSE: License = {
  features: [],
  quotas: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(200),
        ...quotas.budibaseAICredits(50000),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.apps(UNLIMITED),
        ...quotas.rows(2000),
        ...quotas.users(5),
        ...quotas.creators(5),
        ...quotas.userGroups(0),
        ...quotas.plugins(10),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.automationLogRetentionDays(1),
      ...quotas.appBackupRetentionDays(0),
    },
  },
  plan: {
    type: PlanType.FREE,
    usesInvoicing: false,
    model: PlanModel.PER_USER,
  },
}

/**
 * The license used when no license is present.
 */
export const SELF_FREE_LICENSE: License = {
  features: [],
  quotas: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(50000),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(10),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.automationLogRetentionDays(1),
      ...quotas.appBackupRetentionDays(0),
    },
  },
  plan: {
    type: PlanType.FREE,
    usesInvoicing: false,
    model: PlanModel.PER_USER,
  },
}

/**
 * Unlimited license to support unit tests.
 */
export const UNLIMITED_LICENSE: License = {
  features: [],
  quotas: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(UNLIMITED),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.apps(UNLIMITED),
        ...quotas.rows(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  plan: {
    type: PlanType.FREE,
    usesInvoicing: false,
    model: PlanModel.PER_USER,
  },
}

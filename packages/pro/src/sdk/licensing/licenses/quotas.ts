import { Hosting, PlanQuotas, PlanType, Quotas } from "@budibase/types"
import * as constants from "../../../constants"

const quotas = constants.quotas
const licenses = constants.licenses
export const UNLIMITED = -1

const millions = (multiple: number) => multiple * 1000000

const CLOUD_QUOTAS: PlanQuotas = {
  [PlanType.FREE]: {
    ...licenses.CLOUD_FREE_LICENSE.quotas,
  },
  [PlanType.PREMIUM]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(1000),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(5000),
      },
      static: {
        ...quotas.rows(10000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.PREMIUM_PLUS]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(10)),
        ...quotas.actions(20000),
      },
      static: {
        ...quotas.rows(250000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.PREMIUM_MAX]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(10)),
        ...quotas.actions(50000),
      },
      static: {
        ...quotas.rows(250000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.PREMIUM_PLUS_TRIAL]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(750000),
        ...quotas.actions(20000),
      },
      static: {
        ...quotas.rows(250000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.PRO]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(2)),
        ...quotas.actions(5000),
      },
      static: {
        ...quotas.rows(50000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(1),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(1),
      ...quotas.automationLogRetentionDays(1),
      ...quotas.appBackupRetentionDays(0),
    },
  },
  [PlanType.PRO_MAX]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(2)),
        ...quotas.actions(10000),
      },
      static: {
        ...quotas.rows(50000),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(1),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(1),
      ...quotas.automationLogRetentionDays(1),
      ...quotas.appBackupRetentionDays(0),
    },
  },
  [PlanType.TEAM]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(10000),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(10),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(90),
    },
  },
  [PlanType.BUSINESS]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(250000),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  [PlanType.BUSINESS_PLUS]: undefined,
  [PlanType.ENTERPRISE_BASIC]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(250000),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(UNLIMITED),
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  [PlanType.ENTERPRISE_BASIC_TRIAL]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(750000),
        ...quotas.actions(250000),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(1),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(15),
      ...quotas.automationLogRetentionDays(15),
      ...quotas.appBackupRetentionDays(15),
    },
  },
  [PlanType.ENTERPRISE]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(250000),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(UNLIMITED),
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
}

const SELF_QUOTAS: PlanQuotas = {
  [PlanType.FREE]: {
    ...licenses.SELF_FREE_LICENSE.quotas,
  },
  [PlanType.PREMIUM]: undefined,
  [PlanType.PREMIUM_PLUS]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(2)),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(1),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(30),
    },
  },
  [PlanType.PREMIUM_MAX]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(2)),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(1),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(30),
    },
  },
  [PlanType.PREMIUM_PLUS_TRIAL]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(0),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(1),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(30),
    },
  },
  [PlanType.PRO]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(5),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.PRO_MAX]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(5),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(7),
      ...quotas.automationLogRetentionDays(7),
      ...quotas.appBackupRetentionDays(7),
    },
  },
  [PlanType.TEAM]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(10),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(90),
    },
  },
  [PlanType.BUSINESS]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(0),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(50),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(0),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(UNLIMITED),
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  [PlanType.BUSINESS_PLUS]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(30),
      ...quotas.automationLogRetentionDays(30),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  [PlanType.ENTERPRISE_BASIC]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(UNLIMITED),
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
  [PlanType.ENTERPRISE_BASIC_TRIAL]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(750000),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(15),
      ...quotas.automationLogRetentionDays(15),
      ...quotas.appBackupRetentionDays(15),
    },
  },
  [PlanType.ENTERPRISE]: {
    usage: {
      monthly: {
        ...quotas.queries(UNLIMITED),
        ...quotas.automations(UNLIMITED),
        ...quotas.budibaseAICredits(millions(50)),
        ...quotas.actions(UNLIMITED),
      },
      static: {
        ...quotas.rows(UNLIMITED),
        ...quotas.apps(UNLIMITED),
        ...quotas.users(UNLIMITED),
        ...quotas.creators(UNLIMITED),
        ...quotas.userGroups(UNLIMITED),
        ...quotas.plugins(UNLIMITED),
        ...quotas.customAIConfigurations(UNLIMITED),
      },
    },
    constant: {
      ...quotas.agentLogRetentionDays(UNLIMITED),
      ...quotas.automationLogRetentionDays(UNLIMITED),
      ...quotas.appBackupRetentionDays(UNLIMITED),
    },
  },
}

export function getQuotas(hosting: Hosting, planType: PlanType): Quotas {
  let defaultQuotas: Quotas

  function readQuotas(planQuotas: PlanQuotas): Quotas {
    const quotas = planQuotas[planType]

    if (!quotas) {
      // e.g. Premium plan doesn't exist on self host
      throw new Error(
        `Quotas do not exist for planType=${planType} and hosting=${hosting}`
      )
    }

    return quotas
  }

  switch (hosting) {
    case Hosting.SELF:
      defaultQuotas = readQuotas(SELF_QUOTAS)
      break
    case Hosting.CLOUD:
      defaultQuotas = readQuotas(CLOUD_QUOTAS)
      break
  }

  // always return a deep copy
  return JSON.parse(JSON.stringify(defaultQuotas))
}

import { context, db as dbCore } from "@budibase/backend-core"
import {
  isDatasourceOrDatasourcePlusId,
  isTableIdOrExternalTableId,
} from "@budibase/shared-core"
import {
  BaseQuotaUsage,
  BreakdownQuotaName,
  MonthlyQuotaName,
  MonthlyUsage,
  QuotaUsage,
  StaticQuotaName,
} from "@budibase/types"

export const getQuotaDocId = () => {
  if (context.isSelfHostUsingCloud()) {
    return `quota_usage_${context.getTenantId()}`
  }
  return dbCore.StaticDatabases.GLOBAL.docs.usageQuota
}

const getNextQuotaReset = () => {
  const now = new Date()
  // first day of next month - always using the server time
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toISOString()
}

export const setQuotaReset = (usage: QuotaUsage) => {
  usage.quotaReset = getNextQuotaReset()
}

export const getCurrentMonthString = (): string => {
  const date = new Date()
  const month = date.getMonth() + 1 // month is 0-based
  const year = date.getFullYear()
  return `${month}-${year}`
}

export const generateBaseQuotaUsage = (): BaseQuotaUsage => {
  return {
    usageQuota: {
      [StaticQuotaName.WORKSPACES]: 0,
      [StaticQuotaName.ROWS]: 0,
      [StaticQuotaName.PLUGINS]: 0,
      [StaticQuotaName.USERS]: 0,
      [StaticQuotaName.CREATORS]: 0,
      [StaticQuotaName.USER_GROUPS]: 0,
      [StaticQuotaName.AI_CUSTOM_CONFIGS]: 0,
      triggers: {},
    },
    monthly: {
      [getCurrentMonthString()]: generateNewMonthlyQuotas(),
    },
  }
}

export const generateNewQuotaUsage = (): QuotaUsage => {
  const usage = {
    _id: getQuotaDocId(),
    quotaReset: getNextQuotaReset(),
    ...generateBaseQuotaUsage(),
    apps: {},
  }
  setCurrentMonth(usage)
  return usage
}

export const generateNewMonthlyQuotas = (): MonthlyUsage => {
  return {
    [MonthlyQuotaName.QUERIES]: 0,
    [MonthlyQuotaName.AUTOMATIONS]: 0,
    [MonthlyQuotaName.BUDIBASE_AI_CREDITS]: 0,
    [MonthlyQuotaName.ACTIONS]: 0,
    triggers: {},
  }
}

export const setCurrentMonth = (usage: QuotaUsage) => {
  const currentMonth = getCurrentMonthString()

  // set the monthly field if it doesn't exist
  if (!usage.monthly) {
    usage.monthly = {}
  }

  // set the monthly > currentMonth field if it doesn't exist
  if (!usage.monthly[currentMonth]) {
    usage.monthly[currentMonth] = generateNewMonthlyQuotas()
  }

  // set the current field to the current month
  usage.monthly.current = usage.monthly[currentMonth]
}

export const getBreakdownName = (
  name: MonthlyQuotaName,
  id?: string
): BreakdownQuotaName | undefined => {
  if (!id || !name) {
    return
  }
  switch (name) {
    case MonthlyQuotaName.AUTOMATIONS:
      return BreakdownQuotaName.AUTOMATIONS
    case MonthlyQuotaName.QUERIES:
      return isTableIdOrExternalTableId(id)
        ? BreakdownQuotaName.ROW_QUERIES
        : isDatasourceOrDatasourcePlusId(id)
          ? BreakdownQuotaName.DATASOURCE_QUERIES
          : undefined
  }
}

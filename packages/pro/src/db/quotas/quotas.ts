import {
  cache,
  context,
  db as dbCore,
  Duration,
  tenancy,
} from "@budibase/backend-core"
import {
  APP_QUOTA_NAMES,
  BREAKDOWN_QUOTA_NAMES,
  MeteredQuotaName,
  MonthlyQuotaName,
  MonthlyUsage,
  QuotaTriggers,
  QuotaUsage,
  QuotaUsageType,
  SetUsageValues,
  StaticQuotaName,
  UsageBreakdown,
  UsageValues,
} from "@budibase/types"
import * as utils from "./utils"

const DB_WRITE_RATE_MS = Duration.fromSeconds(60).toMs()
const { Writethrough } = cache.writethrough

// have to use any for this
function clearDeprecated(usage: any): QuotaUsage {
  // deprecated
  delete usage["usageLimits"]
  // unused
  delete usage.usageQuota["automationRuns"]
  delete usage.usageQuota["emails"]
  delete usage.usageQuota["storage"]
  delete usage.usageQuota["views"]
  delete usage.usageQuota["publishedApps"]
  delete usage.usageQuota["developers"]
  return usage
}

const getDB = () => {
  // When we introduced Budibase AI for self-host users, we didn't want to
  // create a new global DB for each self-host tenant. We wanted to maintain the
  // idea that a tenant global DB in cloud represented a cloud user. Instead, we
  // create a single global DB for all self-host users using Budicloud services,
  // and we track their quota in tenant-specific documents.
  if (tenancy.isSelfHostUsingCloud()) {
    return new Writethrough(tenancy.getSelfHostCloudDB(), DB_WRITE_RATE_MS)
  }
  return new Writethrough(tenancy.getGlobalDB(), DB_WRITE_RATE_MS)
}

export async function bustCache(retries = 0) {
  const maxRetries = 1
  const db = getDB()
  const id = utils.getQuotaDocId()
  const usage = await db.tryGet<QuotaUsage>(id)

  if (usage && usage._rev) {
    await db.remove(id, usage._rev).catch(async e => {
      if (retries < maxRetries) {
        return await bustCache(retries + 1)
      }
      throw e
    })
  }
}

export const getQuotaUsage = async (): Promise<QuotaUsage> => {
  const db = getDB()
  let usage = await db.tryGet<QuotaUsage>(utils.getQuotaDocId())
  if (!usage) {
    usage = utils.generateNewQuotaUsage()
    const { rev } = await db.put(usage)
    usage._rev = rev
  }
  utils.setCurrentMonth(usage)
  utils.setQuotaReset(usage)
  return clearDeprecated(usage)
}

export const setUsage = async (
  value: number,
  name: MeteredQuotaName,
  type: QuotaUsageType
) => {
  return setAllUsage({ name, type, values: { total: value } })
}

export const setUsagePerApp = async (
  appValues: { [key: string]: number },
  name: MeteredQuotaName,
  type: QuotaUsageType
) => {
  const db = getDB()
  let quotaUsage = await getQuotaUsage()
  const total = Object.values(appValues).reduce((sum, num) => sum + num, 0)
  for (let [appId, value] of Object.entries(appValues)) {
    quotaUsage = coreUsageUpdate(
      quotaUsage,
      name,
      type,
      {
        total,
        app: value,
      },
      {
        appId,
      }
    )
  }
  const response = await db.put(quotaUsage)
  quotaUsage._rev = response.rev
  return quotaUsage
}

const setBreakdown = (
  monthUsage: MonthlyUsage,
  name: MonthlyQuotaName,
  id: string,
  values: UsageValues
) => {
  const breakdownName = utils.getBreakdownName(name, id)
  if (!breakdownName || !values?.breakdown) {
    return monthUsage
  }
  if (!monthUsage.breakdown) {
    monthUsage.breakdown = {}
  }
  if (!monthUsage.breakdown[breakdownName]) {
    monthUsage.breakdown[breakdownName] = {
      parent: name,
      values: {},
    }
  }
  const breakdown = monthUsage.breakdown[breakdownName] as UsageBreakdown
  breakdown.values[id] = values.breakdown
  return monthUsage
}

export const setAppUsageValue = (
  quotaUsage: QuotaUsage,
  name: MeteredQuotaName,
  type: QuotaUsageType,
  opts: { id?: string; appId?: string } = {},
  values: UsageValues
) => {
  let appId
  try {
    appId = dbCore.getProdWorkspaceID(
      (opts?.appId || context.getWorkspaceId())!
    )
  } catch (err) {
    // ignore error for now
  }
  if (!appId || !values.app || !APP_QUOTA_NAMES.includes(name)) {
    return quotaUsage
  }
  if (!quotaUsage.apps?.[appId]) {
    quotaUsage.apps = {
      ...quotaUsage.apps,
      [appId]: utils.generateBaseQuotaUsage(),
    }
  }
  const appUsage = quotaUsage.apps[appId]
  switch (type) {
    case QuotaUsageType.STATIC:
      appUsage.usageQuota[name as StaticQuotaName] = values.app
      break
    case QuotaUsageType.MONTHLY: {
      const currentMonth = utils.getCurrentMonthString()
      const monthlyName: MonthlyQuotaName = name as MonthlyQuotaName
      let monthUsage = appUsage.monthly[currentMonth]

      // init the new month if required
      if (!monthUsage) {
        appUsage.monthly[currentMonth] = utils.generateNewMonthlyQuotas()
        monthUsage = appUsage.monthly[currentMonth]
      }

      monthUsage[monthlyName] = values.app
      if (BREAKDOWN_QUOTA_NAMES.includes(monthlyName) && opts?.id) {
        monthUsage = setBreakdown(monthUsage, monthlyName, opts.id, values)
      }
      break
    }
  }
  return quotaUsage
}

const getAppUsageValue = (
  quotaUsage: QuotaUsage,
  type: QuotaUsageType,
  name: MeteredQuotaName,
  id?: string
): { app?: number; breakdown?: number } => {
  if (!APP_QUOTA_NAMES.includes(name)) {
    return {}
  }
  let appId
  try {
    appId = dbCore.getProdWorkspaceID(context.getWorkspaceId()!)
  } catch (err) {
    // ignore error for now
  }
  if (!appId || !quotaUsage.apps || !quotaUsage.apps[appId]) {
    return { app: 0 }
  }
  const appUsage = quotaUsage.apps[appId]
  switch (type) {
    case QuotaUsageType.STATIC:
      if (appUsage.usageQuota?.[name as StaticQuotaName]) {
        return { app: appUsage.usageQuota[name as StaticQuotaName] }
      }
      break
    case QuotaUsageType.MONTHLY: {
      const currentMonth = utils.getCurrentMonthString()
      const monthlyName = name as MonthlyQuotaName
      if (!appUsage.monthly?.[currentMonth]?.[monthlyName]) {
        break
      }
      const month = appUsage.monthly[currentMonth]
      const app = month[monthlyName]
      let breakdown
      const breakdownName = utils.getBreakdownName(monthlyName, id)

      if (breakdownName && id && month.breakdown?.[breakdownName]) {
        breakdown = month.breakdown[breakdownName]?.values[id]
      }
      return { app, breakdown: breakdown || 0 }
    }
  }
  return { app: 0 }
}

const setStaticTriggers = (
  name: StaticQuotaName,
  quotaUsage: QuotaUsage,
  triggers?: QuotaTriggers
) => {
  // init triggers if not exists
  if (!quotaUsage.usageQuota.triggers) {
    quotaUsage.usageQuota.triggers = {}
  }
  // set triggers if supplied
  if (triggers) {
    quotaUsage.usageQuota.triggers[name] = triggers
  }
}

const setMonthlyTriggers = (
  name: MonthlyQuotaName,
  currentMonth: string,
  quotaUsage: QuotaUsage,
  triggers?: QuotaTriggers
) => {
  // init triggers if not exists
  if (!quotaUsage.monthly[currentMonth].triggers) {
    quotaUsage.monthly[currentMonth].triggers = {}
  }
  // set triggers if supplied
  if (triggers) {
    quotaUsage.monthly[currentMonth].triggers[name] = triggers
  }
}

const coreUsageUpdate = (
  quotaUsage: QuotaUsage,
  name: MeteredQuotaName,
  type: QuotaUsageType,
  values: SetUsageValues,
  opts: { id?: string; appId?: string } = {}
) => {
  if (type === QuotaUsageType.STATIC) {
    name = name as StaticQuotaName
    quotaUsage.usageQuota[name] = values.total
    setStaticTriggers(name, quotaUsage, values.triggers)
  } else if (type === QuotaUsageType.MONTHLY) {
    name = name as MonthlyQuotaName
    const currentMonth = utils.getCurrentMonthString()
    quotaUsage.monthly[currentMonth][name] = values.total
    setMonthlyTriggers(name, currentMonth, quotaUsage, values.triggers)
  } else {
    throw new Error(`Invalid usage type: ${type}`)
  }
  return setAppUsageValue(quotaUsage, name, type, opts, values)
}

interface SetAllUsageParams {
  name: MeteredQuotaName
  type: QuotaUsageType
  values: SetUsageValues
  opts?: { id?: string; appId?: string; tenantId?: string }
}

export const setAllUsage = async (
  params: SetAllUsageParams | SetAllUsageParams[]
) => {
  const actions = Array.isArray(params) ? params : [params]
  const db = getDB()
  let quotaUsage = await getQuotaUsage()
  for (let action of actions) {
    quotaUsage = coreUsageUpdate(
      quotaUsage,
      action.name,
      action.type,
      action.values,
      action.opts
    )
  }
  const response = await db.put(quotaUsage, 0)
  quotaUsage._rev = response.rev
  return quotaUsage
}

export const getCurrentUsageValues = async (
  type: QuotaUsageType,
  name: MeteredQuotaName,
  id?: string
): Promise<UsageValues> => {
  const quotaUsage = await getQuotaUsage()
  let total = 0,
    appValues: { app?: number; breakdown?: number } = {}
  switch (type) {
    case QuotaUsageType.STATIC:
      if (quotaUsage.usageQuota[name as StaticQuotaName]) {
        const staticName = name as StaticQuotaName
        total = quotaUsage.usageQuota[staticName]
        appValues = getAppUsageValue(quotaUsage, type, name, id)
      }
      break
    case QuotaUsageType.MONTHLY: {
      const currentMonth = utils.getCurrentMonthString()
      const monthlyName = name as MonthlyQuotaName
      if (quotaUsage.monthly[currentMonth][monthlyName]) {
        total = quotaUsage.monthly[currentMonth][monthlyName]
        appValues = getAppUsageValue(quotaUsage, type, name, id)
      }
      break
    }
    default:
      throw new Error(`Invalid usage type: ${type}`)
  }
  if (
    APP_QUOTA_NAMES.includes(name) &&
    !(appValues.app || appValues.breakdown)
  ) {
    appValues.app = appValues.app || 0
    appValues.breakdown = appValues.breakdown || 0
  }
  return { total, app: appValues.app, breakdown: appValues.breakdown }
}

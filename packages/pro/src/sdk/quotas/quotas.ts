import {
  context,
  locks,
  logging,
  tenancy,
  UsageLimitWarning,
} from "@budibase/backend-core"
import {
  APP_QUOTA_NAMES,
  ConstantQuotaName,
  isConstantQuota,
  isMonthlyQuota,
  isStaticQuota,
  LockName,
  LockType,
  MeteredQuotaName,
  MonthlyQuotaName,
  Quota,
  QuotaTriggeredRequest,
  QuotaTriggers,
  QuotaUsage,
  QuotaUsageType,
  StaticQuotaName,
  APIWarningCode,
  QuotaType,
} from "@budibase/types"
import { tracer } from "dd-trace"
import { quotas as constants } from "../../constants"
import * as db from "../../db"
import { getQuotaUsage } from "../../db/quotas"
import * as licensing from "../licensing"

// INCREMENT

interface IncrementOptions<T = any> {
  /**
   * The function being wrapped by this quota usage.
   */
  fn?: () => Promise<T>
  /**
   * If provided, the new usage value will be calculated using this function.
   */
  valueFn?: () => Promise<number>
  /**
   * Turn on or off error logging when a quotas has been exceeded
   */
  suppressErrorLog?: boolean
  /**
   * If using a specific resource which has an ID, can pass this ID for granular quotas.
   */
  id?: string
}

export interface IncrementManyParams<T = any> {
  change: number
  name: MeteredQuotaName
  type: QuotaUsageType
  opts?: IncrementOptions<T>
}

interface UpdateUsageParams {
  usageChange: number
  name: MeteredQuotaName
  type: QuotaUsageType
  opts?: UpdateUsageOptions
}

interface DecrementManyParams {
  change: number
  name: MeteredQuotaName
  type: QuotaUsageType
  opts?: DecrementOptions
}

export const increment = async <T = any>(
  name: MeteredQuotaName,
  type: QuotaUsageType,
  opts?: IncrementOptions<T>
): Promise<T> => {
  return await tracer.trace("quotas.increment", async span => {
    span.addTags({ name, type })
    return await tryIncrement({ change: 1, name, type, opts })
  })
}

export const incrementMany = (
  params: IncrementManyParams | IncrementManyParams[]
) => {
  return tracer.trace("quotas.incrementMany", async () => {
    return tryIncrement(params)
  })
}

const tryIncrement = async <T = any>(
  params: IncrementManyParams<T> | IncrementManyParams<T>[]
): Promise<T> => {
  return await tracer.trace("quotas.tryIncrement", async span => {
    const actions = Array.isArray(params) ? params : [params]
    span.addTags({ numActions: actions.length })

    // dry run first to check that the quotas are not exceeded
    await updateUsage(
      actions.map(action => ({
        usageChange: action.change,
        name: action.name,
        type: action.type,
        opts: {
          dryRun: true,
          suppressErrorLog: action.opts?.suppressErrorLog,
          id: action.opts?.id,
        },
      }))
    )

    // run the actual functions
    const results: any[] = []
    for (let action of actions) {
      await tracer.trace("quotas.incrementMany.fn", async span => {
        span.addTags({
          actionName: action.name,
          actionType: action.type,
          actionChange: action.change,
        })
        let fn = action.opts?.fn
        if (fn) {
          results.push(await fn())
        }
      })
    }

    // increment the quota
    await updateUsage(
      actions.map(action => ({
        usageChange: action.change,
        name: action.name,
        type: action.type,
        opts: {
          dryRun: false,
          valueFn: action.opts?.valueFn,
          suppressErrorLog: action.opts?.suppressErrorLog,
          id: action.opts?.id,
        },
      }))
    )

    return results[0] //TODO What happen if we need to get all the results?
  })
}

// DECREMENT

interface DecrementOptions {
  /**
   * If provided, the new usage value will be calculated using this function.
   */
  valueFn?: () => Promise<number>
  /**
   * If using a specific resource which has an ID, can pass this ID for granular quotas.
   */
  id?: string
}

export const decrement = (
  name: MeteredQuotaName,
  type: QuotaUsageType,
  opts: DecrementOptions = {}
) => {
  return updateUsage({ usageChange: -1, name, type, opts })
}

export const decrementMany = (
  params: DecrementManyParams | DecrementManyParams[]
) => {
  const actions = Array.isArray(params) ? params : [params]
  return updateUsage(
    actions.map(action => ({
      usageChange: -action.change,
      name: action.name,
      type: action.type,
      opts: action.opts,
    }))
  )
}

export const set = async (
  name: MeteredQuotaName,
  type: QuotaUsageType,
  value: number
) => {
  return db.quotas.setUsage(value, name, type)
}

interface UpdateUsageOptions {
  /**
   * If provided and true, the usage quota will not be updated.
   * Used to verify that a quota is not exceeded before running.
   */
  dryRun?: boolean
  /**
   * If provided, the new usage value will be calculated using this function.
   */
  valueFn?: () => Promise<number>
  /**
   * Turn on or off error logging when a quotas has been exceeded
   */
  suppressErrorLog?: boolean
  /**
   * If using a specific resource which has an ID, can pass this ID for granular quotas.
   */
  id?: string
}

const getExistingTriggers = (
  type: QuotaUsageType,
  name: MeteredQuotaName,
  quotaUsage: QuotaUsage
): QuotaTriggers => {
  if (type == QuotaUsageType.STATIC) {
    const triggers = quotaUsage.usageQuota.triggers
    return triggers ? triggers[name as StaticQuotaName] || {} : {}
  } else {
    const currentMonthString = db.quotas.utils.getCurrentMonthString()
    const triggers = quotaUsage.monthly[currentMonthString].triggers
    return triggers ? triggers[name as MonthlyQuotaName] || {} : {}
  }
}

const triggerQuota = async (
  name: MeteredQuotaName,
  quota: Quota,
  percentage: number,
  resetDate?: string
) => {
  try {
    // use a lock so that we never send the email more than once
    // under high throughput where there may be stale reads
    await locks.doWithLock(
      {
        type: LockType.TRY_ONCE,
        name: LockName.TRIGGER_QUOTA,
        resource: name, // use the quota name for extra uniqueness on the lock
        ttl: 10000, // auto expire after 10 seconds
      },
      async () => {
        const request: QuotaTriggeredRequest = {
          percentage,
          name: quota.name,
        }
        if (resetDate) {
          request.resetDate = resetDate
        }
        await licensing.client.triggerQuota(request)
      }
    )
  } catch (e: any) {
    // swallow error so we don't interrupt quota update
    logging.logAlert("Error triggering quota", e)
  }
}

const checkTriggers = async (
  type: QuotaUsageType,
  name: MeteredQuotaName,
  totalValue: number,
  quota: Quota
): Promise<QuotaTriggers> => {
  const usage = await getQuotaUsage()
  const resetDate =
    type === QuotaUsageType.MONTHLY ? usage.quotaReset : undefined
  const triggers = await getExistingTriggers(type, name, usage)

  const quotaTriggers = quota.triggers
  let percentage = (totalValue / quota.value) * 100
  if (percentage > 100) {
    // sometimes quotas may overflow - set back to 100% for below logic
    percentage = 100
  }

  for (const [index, triggerPercentage] of quotaTriggers.entries()) {
    // set the trigger time for all triggers this update applies to
    const isTriggered =
      percentage >= triggerPercentage && quota.value !== constants.UNLIMITED
    if (isTriggered) {
      // don't overwrite the time if already set
      if (!triggers[triggerPercentage]) {
        triggers[triggerPercentage] = new Date().toISOString()

        // send the trigger request for the highest trigger met by this update
        const nextTriggerPercentage = quotaTriggers[index + 1] || 100
        const nextIsTriggered = percentage >= nextTriggerPercentage
        const isAtTrigger = percentage === triggerPercentage // to account for 100%
        const sendNotification = !nextIsTriggered || isAtTrigger

        if (sendNotification) {
          await triggerQuota(name, quota, percentage, resetDate)
        }
      }
    } else {
      triggers[triggerPercentage] = undefined
    }
  }

  return triggers
}

export const updateUsage = async (
  params: UpdateUsageParams | UpdateUsageParams[]
) => {
  await tracer.trace("quotas.updateUsage", async span => {
    const tenantId = tenancy.getTenantId()

    const actions = Array.isArray(params) ? params : [params]

    span.addTags({
      numActions: actions.length,
      tenantId,
    })

    let appId: string | undefined = undefined
    let licensedQuota
    const licenseQuotas = []
    let totalValuesToApply: any = {}
    let appValuesToApply: any = {}
    let breakdownValuesToApply: any = {}
    let triggersToApply: any = {}
    for (let action of actions) {
      await tracer.trace("quotas.updateUsage.action", async span => {
        span.addTags({
          actionName: action.name,
          actionType: action.type,
          actionUsageChange: action.usageChange,
        })
        try {
          appId = context.getWorkspaceId()
        } catch (err) {
          // ignore error for now
        }

        // need an app ID for these
        const isAppQuota = APP_QUOTA_NAMES.includes(action.name)
        if (isAppQuota && !appId) {
          throw new Error("App context required for quota update")
        }

        try {
          licensedQuota = await getLicensedQuota(
            QuotaType.USAGE,
            action.name,
            action.type
          )
          licenseQuotas.push(licensedQuota)

          let {
            total: totalValue,
            app: appValue,
            breakdown: breakdownValue,
          } = await db.quotas.getCurrentUsageValues(
            action.type,
            action.name,
            action.opts?.id
          )

          // increment / decrement the quota
          totalValue += action.usageChange
          if (appValue != null) {
            appValue += action.usageChange
          }
          if (breakdownValue != null) {
            breakdownValue += action.usageChange
          }

          let triggers: QuotaTriggers = {}
          if (!action.opts?.dryRun) {
            triggers = await checkTriggers(
              action.type,
              action.name,
              totalValue,
              licensedQuota
            )
            triggersToApply = { ...triggersToApply, [action.name]: triggers }
          }

          if (
            licensedQuota.value !== constants.UNLIMITED &&
            totalValue > licensedQuota.value &&
            action.usageChange > 0 // allow for decrementing usage when the quota is already exceeded
          ) {
            throw new UsageLimitWarning(`${action.name}`)
          }

          // never go negative if the quota has previously been exceeded
          totalValue = Math.max(0, totalValue)
          if (appValue) {
            appValue = Math.max(0, appValue)
          }
          if (breakdownValue) {
            breakdownValue = Math.max(0, breakdownValue)
            breakdownValuesToApply = {
              ...breakdownValuesToApply,
              [action.name]: breakdownValue,
            }
          }

          // Apply functions if it is not a dry run
          if (!action.opts?.dryRun) {
            // if a value function is provided
            // use it to calculate the new value instead of incrementing / decrementing
            let fn = action.opts?.valueFn
            if (fn) {
              totalValue = await fn()
              appValue = totalValue
            }
            totalValuesToApply = {
              ...totalValuesToApply,
              [action.name]: totalValue,
            }
            appValuesToApply = {
              ...appValuesToApply,
              [action.name]: appValue,
            }
          }
        } catch (err) {
          if (!action.opts?.suppressErrorLog) {
            console.error(`Error updating usage quotas for ${action.name}`, err)
          }
          // re-throw any error - if the error was caused by a usage limit being exceeded
          // this will prevent the subsequent operation e.g. create app, from running
          throw err
        }
      })
    }

    // update the usage quotas
    const usageQuotas = actions
      .filter(action => !action.opts?.dryRun)
      .map(action => ({
        name: action.name,
        type: action.type,
        values: {
          total: totalValuesToApply[action.name],
          app: appValuesToApply[action.name],
          breakdown: breakdownValuesToApply[action.name],
          triggers: triggersToApply[action.name],
        },
        opts: { ...action.opts, tenantId },
      }))

    if (usageQuotas.length > 0) {
      await db.quotas.setAllUsage(usageQuotas)
    }
  })
}

export const getLicensedQuota = async (
  quotaType: QuotaType,
  name: MonthlyQuotaName | StaticQuotaName | ConstantQuotaName,
  usageType?: QuotaUsageType
): Promise<Quota> => {
  const license = await licensing.cache.getCachedLicense()

  if (!license) {
    const tenantId = tenancy.getTenantId()
    throw new Error("License not found for tenant id " + tenantId)
  }

  if (usageType && isStaticQuota(quotaType, usageType, name)) {
    return license.quotas[quotaType as QuotaType.USAGE][
      usageType as QuotaUsageType.STATIC
    ][name]
  } else if (usageType && isMonthlyQuota(quotaType, usageType, name)) {
    return license.quotas[quotaType as QuotaType.USAGE][
      usageType as QuotaUsageType.MONTHLY
    ][name]
  } else if (isConstantQuota(quotaType, name)) {
    return license.quotas[quotaType as QuotaType.CONSTANT][name]
  } else {
    throw new Error("Invalid quota type")
  }
}

export const usageLimitIsExceeded = async ({
  name,
  type,
  usageChange,
}: {
  name: MeteredQuotaName
  type: QuotaUsageType
  usageChange: number
}) => {
  try {
    await updateUsage({ usageChange, name, type, opts: { dryRun: true } })
    return false
  } catch (e: any) {
    if (e.code === APIWarningCode.USAGE_LIMIT_EXCEEDED) {
      return true
    }
    throw e
  }
}

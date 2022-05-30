import { TenantBackfillSucceededEvent } from "./../../../../../types/src/events/backfill"
import * as users from "./global/users"
import * as configs from "./global/configs"
import * as quotas from "./global/quotas"
import {
  tenancy,
  events,
  migrations,
  accounts,
  db as dbUtils,
} from "@budibase/backend-core"
import { QuotaUsage } from "@budibase/pro"
import { CloudAccount, App } from "@budibase/types"
import env from "../../../environment"

const failGraceful = env.SELF_HOSTED && !env.isDev()

const handleError = (e: any, errors?: any) => {
  if (failGraceful) {
    if (errors) {
      errors.push(e)
    }
    return
  }
  throw e
}

const formatUsage = (usage: QuotaUsage) => {
  let maxAutomations = 0
  let maxQueries = 0
  let rows = 0
  let developers = 0

  if (usage) {
    if (usage.usageQuota) {
      rows = usage.usageQuota.rows
      developers = usage.usageQuota.developers
    }

    if (usage.monthly) {
      for (const value of Object.values(usage.monthly)) {
        if (value.automations > maxAutomations) {
          maxAutomations = value.automations
        }
        if (value.queries > maxQueries) {
          maxQueries = value.queries
        }
      }
    }
  }

  return {
    maxAutomations,
    maxQueries,
    rows,
    developers,
  }
}

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill global events.
 */

export const run = async (db: any) => {
  try {
    const tenantId = tenancy.getTenantId()
    let installTimestamp

    const totals: any = {}
    const errors: any = []

    try {
      installTimestamp = await getInstallTimestamp(db)
    } catch (e) {
      handleError(e, errors)
    }

    let account: CloudAccount | undefined
    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
      account = await accounts.getAccountByTenantId(tenantId)
    }

    try {
      await events.identification.identifyTenantGroup(
        tenantId,
        account,
        installTimestamp
      )
    } catch (e) {
      handleError(e, errors)
    }

    try {
      await configs.backfill(db, installTimestamp)
    } catch (e) {
      handleError(e, errors)
    }

    try {
      totals.users = await users.backfill(db, account)
    } catch (e) {
      handleError(e, errors)
    }

    try {
      const allApps: App[] = await dbUtils.getAllApps({ dev: true })
      totals.apps = allApps.length

      totals.usage = await quotas.backfill(allApps)
    } catch (e) {
      handleError(e, errors)
    }

    const properties: TenantBackfillSucceededEvent = {
      apps: totals.apps,
      users: totals.users,
      ...formatUsage(totals.usage),
      usage: totals.usage,
    }

    if (errors.length) {
      properties.errors = errors.map((e: any) =>
        JSON.stringify(e, Object.getOwnPropertyNames(e))
      )
      properties.errorCount = errors.length
    } else {
      properties.errorCount = 0
    }
    await events.backfill.tenantSucceeded(properties)
  } catch (e) {
    handleError(e)
    await events.backfill.tenantFailed(e)
  }
}

export const isComplete = async (): Promise<boolean> => {
  const globalDb = tenancy.getGlobalDB()
  const migrationsDoc = await migrations.getMigrationsDoc(globalDb)
  return !!migrationsDoc.event_global_backfill
}

export const getInstallTimestamp = async (
  globalDb: any
): Promise<number | undefined> => {
  const allUsers = await users.getUsers(globalDb)

  // get the oldest user timestamp
  const timestamps = allUsers
    .map(user => user.createdAt)
    .filter(timestamp => !!timestamp)
    .sort(
      (a, b) =>
        new Date(a as number).getTime() - new Date(b as number).getTime()
    )

  if (timestamps.length) {
    return timestamps[0]
  }
}

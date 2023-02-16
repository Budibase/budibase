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
import { QuotaUsage } from "@budibase/types"
import {
  CloudAccount,
  App,
  TenantBackfillSucceededEvent,
  Event,
  User,
} from "@budibase/types"
import env from "../../../environment"
import { DEFAULT_TIMESTAMP } from "."

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

  if (usage) {
    if (usage.usageQuota) {
      rows = usage.usageQuota.rows
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
  }
}

const EVENTS = [
  Event.EMAIL_SMTP_CREATED,
  Event.AUTH_SSO_CREATED,
  Event.AUTH_SSO_ACTIVATED,
  Event.ORG_NAME_UPDATED,
  Event.ORG_LOGO_UPDATED,
  Event.ORG_PLATFORM_URL_UPDATED,
  Event.USER_CREATED,
  Event.USER_PERMISSION_ADMIN_ASSIGNED,
  Event.USER_PERMISSION_BUILDER_ASSIGNED,
  Event.ROLE_ASSIGNED,
  Event.ROWS_CREATED,
  Event.QUERIES_RUN,
  Event.AUTOMATIONS_RUN,
]

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
    let timestamp: string | number = DEFAULT_TIMESTAMP

    const totals: any = {}
    const errors: any = []

    let allUsers: User[] = []
    try {
      allUsers = await users.getUsers(db)
    } catch (e: any) {
      handleError(e, errors)
    }

    if (!allUsers || allUsers.length === 0) {
      // first time startup - we don't need to backfill anything
      // tenant will be identified when admin user is created
      if (env.SELF_HOSTED) {
        await events.installation.firstStartup()
      }
      return
    }

    try {
      const installTimestamp = await getInstallTimestamp(db, allUsers)
      if (installTimestamp) {
        timestamp = installTimestamp
      }
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
        timestamp
      )
    } catch (e) {
      handleError(e, errors)
    }

    // tell the event pipeline to start caching
    // events for this tenant
    await events.backfillCache.start(EVENTS)

    try {
      await configs.backfill(db, timestamp)
    } catch (e) {
      handleError(e, errors)
    }

    try {
      totals.users = await users.backfill(db, account)
    } catch (e) {
      handleError(e, errors)
    }

    try {
      const allApps = (await dbUtils.getAllApps({ dev: true })) as App[]
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
    // tell the event pipeline to stop caching events for this tenant
    await events.backfillCache.end()
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
  globalDb: any,
  allUsers?: User[]
): Promise<number | undefined> => {
  if (!allUsers) {
    allUsers = await users.getUsers(globalDb)
  }

  // get the oldest user timestamp
  if (allUsers) {
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
}

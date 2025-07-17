import { getAppMigrationQueue } from "./queue"
import { Next } from "koa"
import { getAppMigrationVersion } from "./appMigrationMetadata"
import { MIGRATIONS } from "./migrations"
import { UserCtx } from "@budibase/types"
import { db, Header } from "@budibase/backend-core"
import environment from "../environment"

export * from "./appMigrationMetadata"
export * from "./migrationLock"

export type AppMigration = {
  id: string
  func: () => Promise<void>
  // disabled so that by default all migrations listed are enabled
  disabled?: boolean
}

export function getLatestEnabledMigrationId(migrations?: AppMigration[]) {
  let latestMigrationId: string | undefined
  if (!migrations) {
    migrations = MIGRATIONS
  }
  for (let migration of migrations) {
    // if a migration is disabled, all migrations after it are disabled
    if (migration.disabled) {
      break
    }
    latestMigrationId = migration.id
  }
  return latestMigrationId
}

export function getTimestamp(versionId: string): number {
  const timestampStr = new RegExp(/^(?<timestamp>\d{14})_.+$/).exec(versionId)
    ?.groups?.["timestamp"]

  if (!timestampStr) {
    throw new Error("Migration id not valid")
  }

  const timestamp = parseInt(timestampStr ?? "0", 10)
  return timestamp
}

export async function checkMissingMigrations(
  ctx: UserCtx,
  next: Next,
  appId: string
) {
  const latestMigration = getLatestEnabledMigrationId()

  // no migrations set - edge case, don't try to do anything
  if (!latestMigration) {
    return next()
  }

  if (!(await isAppFullyMigrated(appId))) {
    const queue = getAppMigrationQueue()
    await queue.add(
      {
        appId,
      },
      {
        jobId: `${appId}_${latestMigration}`,
      }
    )

    const { applied: migrationApplied } = await waitForMigration(appId, {
      timeoutMs: environment.SYNC_MIGRATION_CHECKS_MS,
    })
    if (!migrationApplied) {
      ctx.response.set(Header.MIGRATING_APP, appId)
    }
  }

  return next()
}

const waitForMigration = async (
  appId: string,
  { timeoutMs }: { timeoutMs: number }
): Promise<{ applied: boolean }> => {
  const start = Date.now()

  const devAppId = db.getDevAppID(appId)

  while (Date.now() - start < timeoutMs) {
    if (await isAppFullyMigrated(devAppId)) {
      console.log(`Migration ran in ${Date.now() - start}ms`)
      return { applied: true }
    }

    await new Promise(r => setTimeout(r, 10))
  }

  return { applied: false }
}

export const isAppFullyMigrated = async (appId: string) => {
  const latestMigration = getLatestEnabledMigrationId()
  if (!latestMigration) {
    return true
  }
  const latestMigrationApplied = await getAppMigrationVersion(appId)
  if (!latestMigrationApplied) {
    return false
  }

  return getTimestamp(latestMigrationApplied) >= getTimestamp(latestMigration)
}

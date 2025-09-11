import { context, db, Header } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import environment from "../environment"
import sdk from "../sdk"
import { MIGRATIONS } from "./migrations"
import { getAppMigrationQueue } from "./queue"
import { getAppMigrationVersion } from "./workspaceMigrationMetadata"

export * from "./migrationLock"
export * from "./workspaceMigrationMetadata"

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

function getMigrationIndex(versionId: string) {
  return MIGRATIONS.findIndex(m => m.id === versionId)
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

  const appExists = await context.doInWorkspaceContext(
    appId,
    async () => !!(await sdk.applications.metadata.tryGet())
  )
  if (!appExists) {
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

  const devId = db.getDevWorkspaceID(appId)

  while (Date.now() - start < timeoutMs) {
    if (await isAppFullyMigrated(devId)) {
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
  return (
    getMigrationIndex(latestMigrationApplied) >=
    getMigrationIndex(latestMigration)
  )
}

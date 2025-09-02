import { getWorkspaceMigrationQueue } from "./queue"
import { Next } from "koa"
import { getWorkspaceMigrationVersion } from "./workspaceMigrationMetadata"
import { MIGRATIONS } from "./migrations"
import { UserCtx } from "@budibase/types"
import { context, db, Header } from "@budibase/backend-core"
import environment from "../environment"
import sdk from "../sdk"

export * from "./workspaceMigrationMetadata"
export * from "./migrationLock"

export type WorkspaceMigration = {
  id: string
  func: () => Promise<void>
  // disabled so that by default all migrations listed are enabled
  disabled?: boolean
}

export function getLatestEnabledMigrationId(migrations?: WorkspaceMigration[]) {
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
  workspaceId: string
) {
  const latestMigration = getLatestEnabledMigrationId()

  // no migrations set - edge case, don't try to do anything
  if (!latestMigration) {
    return next()
  }

  const workspaceExists = await context.doInWorkspaceContext(
    workspaceId,
    async () => !!(await sdk.workspaces.metadata.tryGet())
  )
  if (!workspaceExists) {
    return next()
  }

  if (!(await isWorkspaceFullyMigrated(workspaceId))) {
    const queue = getWorkspaceMigrationQueue()
    await queue.add(
      {
        workspaceId: workspaceId,
      },
      {
        jobId: `${workspaceId}_${latestMigration}`,
      }
    )

    const { applied: migrationApplied } = await waitForMigration(workspaceId, {
      timeoutMs: environment.SYNC_MIGRATION_CHECKS_MS,
    })
    if (!migrationApplied) {
      ctx.response.set(Header.MIGRATING_WORKSPACE, workspaceId)
    }
  }

  return next()
}

const waitForMigration = async (
  workspaceId: string,
  { timeoutMs }: { timeoutMs: number }
): Promise<{ applied: boolean }> => {
  const start = Date.now()

  const devWorkspaceId = db.getDevWorkspaceID(workspaceId)

  while (Date.now() - start < timeoutMs) {
    if (await isWorkspaceFullyMigrated(devWorkspaceId)) {
      console.log(`Migration ran in ${Date.now() - start}ms`)
      return { applied: true }
    }

    await new Promise(r => setTimeout(r, 10))
  }

  return { applied: false }
}

export const isWorkspaceFullyMigrated = async (workspaceId: string) => {
  const latestMigration = getLatestEnabledMigrationId()
  if (!latestMigration) {
    return true
  }
  const latestMigrationApplied = await getWorkspaceMigrationVersion(workspaceId)
  return (
    getMigrationIndex(latestMigrationApplied) >=
    getMigrationIndex(latestMigration)
  )
}

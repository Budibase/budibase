import { context, db, logging } from "@budibase/backend-core"

import tracer from "dd-trace"
import { WorkspaceMigration, doInMigrationLock } from "."
import sdk from "../sdk"
import { MIGRATIONS } from "./migrations"
import {
  getWorkspaceMigrationVerions,
  updateWorkspaceMigrationMetadata,
} from "./workspaceMigrationMetadata"

async function getPendingMigrationsForWorkspace(
  appId: string,
  allMigrations: WorkspaceMigration[]
): Promise<WorkspaceMigration[]> {
  const currentVersion = await getWorkspaceMigrationVerions(appId)
  const currentIndex = allMigrations.findIndex(m => m.id === currentVersion)
  return allMigrations.slice(currentIndex + 1)
}

function getAllPendingMigrationIds(
  pendingMigrationsPerApp: Record<string, WorkspaceMigration[]>
): string[] {
  return Object.values(pendingMigrationsPerApp)
    .flatMap(migrations => migrations)
    .map(migration => migration.id)
}

function getUniquePendingMigrations(
  allMigrations: WorkspaceMigration[],
  pendingMigrationIds: string[]
): WorkspaceMigration[] {
  return allMigrations.filter(migration =>
    pendingMigrationIds.includes(migration.id)
  )
}

async function runMigrationForApp({
  migrationId,
  migrationFunc,
  workspaceId,
}: {
  migrationId: string
  migrationFunc: () => Promise<void>
  workspaceId: string
}): Promise<void> {
  // PR note can I update this??
  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({
      appId: workspaceId,
      migrationId,
    })
    await context.doInWorkspaceMigrationContext(workspaceId, async () => {
      console.log(`Running migration "${migrationId}" for app "${workspaceId}"`)
      await migrationFunc()
      console.log(`Migration "${migrationId}" ran for app "${workspaceId}"`)
    })
  })
}

// PR note can I update this??
async function syncDevApp(devWorkspaceId: string): Promise<void> {
  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({
      appId: devWorkspaceId,
    })
    await context.doInWorkspaceMigrationContext(devWorkspaceId, async () => {
      await sdk.workspaces.syncWorkspace(devWorkspaceId)
      console.log(`Workspace synchronized for dev "${devWorkspaceId}"`)
    })
  })
}

async function updateMigrationVersion(
  workspaceId: string,
  migrationId: string
): Promise<void> {
  await context.doInWorkspaceMigrationContext(workspaceId, () =>
    updateWorkspaceMigrationMetadata({
      workspaceId,
      version: migrationId,
    })
  )
}

export async function processMigrations(
  workspaceId: string,
  migrations: WorkspaceMigration[] = MIGRATIONS
) {
  console.log(`Processing workspace migration for "${workspaceId}"`)

  // note for PR, should I update this?
  await tracer.trace("runMigrationForApp", async span => {
    span.addTags({ appId: workspaceId })
    try {
      await context.doInWorkspaceContext(workspaceId, () =>
        doInMigrationLock(workspaceId, async () => {
          const devWorkspaceId = db.getDevWorkspaceID(workspaceId)
          const prodWorkspaceId = db.getProdWorkspaceID(workspaceId)
          const isPublished =
            await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)
          const workspaceIdToMigrate = isPublished
            ? prodWorkspaceId
            : devWorkspaceId

          console.log(
            `Starting workspace migration for "${workspaceIdToMigrate}"`
          )

          const pendingMigrationsPerWorkspace = {
            [devWorkspaceId]: await getPendingMigrationsForWorkspace(
              devWorkspaceId,
              migrations
            ),
            [prodWorkspaceId]: isPublished
              ? await getPendingMigrationsForWorkspace(
                  prodWorkspaceId,
                  migrations
                )
              : [],
          }

          function needsToRun(
            migrationId: string,
            targetWorkspaceId: string
          ): boolean {
            return pendingMigrationsPerWorkspace[targetWorkspaceId].some(
              m => m.id === migrationId
            )
          }

          const allPendingMigrationIds = getAllPendingMigrationIds(
            pendingMigrationsPerWorkspace
          )
          const pendingMigrations = getUniquePendingMigrations(
            migrations,
            allPendingMigrationIds
          )

          span.addTags({ migrationsToRun: pendingMigrations.length })

          console.log(
            `Workspace migrations to run for "${workspaceIdToMigrate}" - ${pendingMigrations.map(m => m.id).join(",")}`
          )

          let migrationIndex = 0
          for (const {
            id: migrationId,
            func: migrationFunc,
            disabled,
          } of pendingMigrations) {
            if (disabled) {
              // If we find a disabled migration, we prevent running any other
              console.log(
                `Migration ${migrationId} is disabled, stopping migration process`
              )
              return
            }

            const progressCounter = `(${++migrationIndex}/${pendingMigrations.length})`
            console.info(
              `Running migration ${migrationId}... ${progressCounter}`,
              {
                migrationId,
                workspaceId: workspaceIdToMigrate,
              }
            )

            const runForWorkspaceToMigrate = needsToRun(
              migrationId,
              workspaceIdToMigrate
            )
            const runForDevApp =
              isPublished && needsToRun(migrationId, devWorkspaceId)

            if (runForWorkspaceToMigrate) {
              await runMigrationForApp({
                migrationId,
                migrationFunc,
                workspaceId: workspaceIdToMigrate,
              })
            }

            if (runForDevApp) {
              await syncDevApp(devWorkspaceId)
              await runMigrationForApp({
                migrationId,
                migrationFunc,
                workspaceId: devWorkspaceId,
              })
            }

            if (runForWorkspaceToMigrate) {
              await updateMigrationVersion(workspaceIdToMigrate, migrationId)
            }

            if (runForDevApp) {
              await updateMigrationVersion(devWorkspaceId, migrationId)
            }
          }

          console.log(
            `Workspace migration for "${workspaceIdToMigrate}" processed`
          )
        })
      )
    } catch (err) {
      logging.logAlert("Failed to run workspace migration", err)
      throw err
    }
  })
}

import {
  cache,
  context,
  db as dbCore,
  errors,
  events,
} from "@budibase/backend-core"
import { backups } from "@budibase/pro"
import {
  Automation,
  BackupTrigger,
  DeploymentDoc,
  DeploymentProgressResponse,
  DeploymentStatus,
  FieldType,
  FetchDeploymentResponse,
  FormulaType,
  PublishStatusResponse,
  PublishTableRequest,
  PublishTableResponse,
  PublishWorkspaceRequest,
  PublishWorkspaceResponse,
  Table,
  UserCtx,
  Workspace,
} from "@budibase/types"
import {
  clearMetadata,
  disableAllCrons,
  enableCronOrEmailTrigger,
} from "../../../automations/utils"
import {
  DocumentType,
  getAutomationParams,
  InternalTables,
  SEPARATOR,
} from "../../../db/utils"
import env from "../../../environment"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"
import { doInMigrationLock } from "../../../workspaceMigrations"
import Deployment from "./Deployment"
import { updateAllFormulasInTable } from "../row/staticFormula"

// the max time we can wait for an invalidation to complete before considering it failed
const MAX_PENDING_TIME_MS = 30 * 60000

// checks that deployments are in a good state, any pending will be updated
async function checkAllDeployments(
  deployments: any
): Promise<{ updated: boolean; deployments: DeploymentDoc }> {
  let updated = false
  let deployment: any
  for (deployment of Object.values(deployments.history)) {
    // check that no deployments have crashed etc and are now stuck
    if (
      deployment.status === DeploymentStatus.PENDING &&
      Date.now() - deployment.updatedAt > MAX_PENDING_TIME_MS
    ) {
      deployment.status = DeploymentStatus.FAILURE
      deployment.err = "Timed out"
      updated = true
    }
  }
  return { updated, deployments }
}

async function storeDeploymentHistory(deployment: Deployment) {
  const deploymentJSON = deployment.getJSON()
  const db = context.getWorkspaceDB()

  let deploymentDoc
  try {
    // theres only one deployment doc per app database
    deploymentDoc = await db.get<any>(DocumentType.DEPLOYMENTS)
  } catch (err) {
    deploymentDoc = { _id: DocumentType.DEPLOYMENTS, history: {} }
  }

  const deploymentId = deploymentJSON._id

  // first time deployment
  if (!deploymentDoc.history[deploymentId])
    deploymentDoc.history[deploymentId] = {}

  deploymentDoc.history[deploymentId] = {
    ...deploymentDoc.history[deploymentId],
    ...deploymentJSON,
    updatedAt: Date.now(),
  }

  await db.put(deploymentDoc)
  deployment.fromJSON(deploymentDoc.history[deploymentId])
  return deployment
}

async function initDeployedApp(prodAppId: string) {
  const db = context.getProdWorkspaceDB()
  console.log("Reading automation docs")
  const automations = (
    await db.allDocs<Automation>(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
  await clearMetadata()
  const { count } = await disableAllCrons(prodAppId)
  const promises = []

  for (let automation of automations) {
    promises.push(
      enableCronOrEmailTrigger(prodAppId, automation).catch(err => {
        throw new Error(
          `Failed to enable CRON or Email trigger for automation "${automation.name}": ${err.message}`,
          { cause: err }
        )
      })
    )
  }
  const results = await Promise.all(promises)
  const enabledCount = results
    .map(result => result.enabled)
    .filter(result => result).length
  console.log(
    `Cleared ${count} old CRON/email, enabled ${enabledCount} new CRON/email triggers for app deployment`
  )
  // sync the automations back to the dev DB - since there is now CRON
  // information attached
  await sdk.workspaces.syncWorkspace(dbCore.getDevWorkspaceID(prodAppId), {
    automationOnly: true,
  })
}

async function applyPendingColumnRenames(
  workspaceId: string
): Promise<Table[]> {
  return await context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const tables = await sdk.tables.getAllInternalTables()
    const updatedTables: Table[] = []

    for (let table of tables) {
      if (table._deleted) {
        continue
      }
      const pendingColumnRenames = table.pendingColumnRenames
      if (!pendingColumnRenames?.length) {
        continue
      }

      for (const rename of pendingColumnRenames) {
        const tableToUpdate: Table = {
          ...table,
          schema: { ...table.schema },
        }

        const existingNew = tableToUpdate.schema[rename.updated]
        const existingOld = tableToUpdate.schema[rename.old]

        // If the updatd column schema doesn't exist (replication left the old schema),
        // use the old column schema to the new name so the rename can complete.
        if (!existingNew && existingOld) {
          tableToUpdate.schema[rename.updated] = {
            ...existingOld,
            name: rename.updated,
          }
          delete tableToUpdate.schema[rename.old]
        }

        await sdk.tables.update(tableToUpdate, rename)
        table = await sdk.tables.getTable(table._id!)
      }

      const updatedTable: Table = { ...table, pendingColumnRenames: [] }
      const putResult = await db.put(updatedTable)
      const persistedTable: Table = { ...updatedTable, _rev: putResult.rev }
      updatedTables.push(persistedTable)
    }

    return updatedTables
  })
}

const getRevisionNumber = (rev?: string) =>
  parseInt(rev?.split("-")?.[0] || "0", 10)

async function clearPendingColumnRenames(workspaceId: string) {
  await context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    const tables = await sdk.tables.getAllInternalTables()

    for (const table of tables) {
      if (table._deleted) {
        continue
      }
      if (!table.pendingColumnRenames?.length) {
        continue
      }
      const updatedTable: Table = {
        ...table,
        pendingColumnRenames: [],
      }
      await db.put(updatedTable)
    }
  })
}

async function syncStaticFormulasToProduction(prodWorkspaceId: string) {
  await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const tables = await sdk.tables.getAllInternalTables()
    for (const table of tables) {
      const hasStaticFormula = Object.values(table.schema).some(
        column =>
          column?.type === FieldType.FORMULA &&
          column.formulaType === FormulaType.STATIC
      )
      if (hasStaticFormula) {
        await updateAllFormulasInTable(table)
      }
    }
  })
}

export async function fetchDeployments(
  ctx: UserCtx<void, FetchDeploymentResponse>
) {
  try {
    const db = context.getWorkspaceDB()
    const deploymentDoc = await db.get(DocumentType.DEPLOYMENTS)
    const { updated, deployments } = await checkAllDeployments(deploymentDoc)
    if (updated) {
      await db.put(deployments)
    }
    ctx.body = deployments.history
      ? Object.values(deployments.history).reverse()
      : []
  } catch (err) {
    ctx.body = []
  }
}

export async function deploymentProgress(
  ctx: UserCtx<void, DeploymentProgressResponse>
) {
  try {
    const db = context.getWorkspaceDB()
    const deploymentDoc = await db.get<DeploymentDoc>(DocumentType.DEPLOYMENTS)
    if (!deploymentDoc.history?.[ctx.params.deploymentId]) {
      ctx.throw(404, "No deployment found")
    }
    ctx.body = deploymentDoc.history?.[ctx.params.deploymentId]
  } catch (err) {
    ctx.throw(
      500,
      `Error fetching data for deployment ${ctx.params.deploymentId}`
    )
  }
}

export async function publishStatus(ctx: UserCtx<void, PublishStatusResponse>) {
  const { automations, workspaceApps, tables } = await sdk.deployment.status()

  ctx.body = {
    automations,
    workspaceApps,
    tables,
  }
}

type PublishContext = UserCtx<
  PublishWorkspaceRequest | PublishTableRequest,
  PublishWorkspaceResponse | PublishTableResponse
>

export const publishWorkspaceInternal = async (
  ctx: PublishContext,
  seedProductionTables?: boolean,
  tablesToSeed?: string[]
) => {
  const seedTables =
    seedProductionTables !== undefined
      ? seedProductionTables
      : ctx.request.body?.seedProductionTables
  const tablesToPublish = tablesToSeed?.length
    ? new Set<string>(tablesToSeed)
    : undefined
  tablesToPublish?.add(InternalTables.USER_METADATA)
  const getTableIdFromDocId = (_id: string) => {
    const parts = _id.split(SEPARATOR)
    const tableIndex = parts.indexOf(DocumentType.TABLE)
    if (tableIndex === -1 || !parts[tableIndex + 1]) {
      return
    }
    return `${DocumentType.TABLE}${SEPARATOR}${parts[tableIndex + 1]}`
  }
  let deployment = new Deployment()
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeDeploymentHistory(deployment)
  let tablesToSync: "all" | string[] | undefined
  if (seedTables && tablesToSeed?.length) {
    tablesToSync = tablesToSeed
  } else if (env.isTest()) {
    // TODO: a lot of tests depend on old behaviour of data being published
    // we could do with going through the tests and updating them all to write
    // data to production instead of development - but doesn't improve test
    // quality - so keep publishing data in dev for now
    tablesToSync = "all"
  } else if (seedTables) {
    try {
      tablesToSync = await sdk.tables.listEmptyProductionTables()
    } catch (e) {
      tablesToSync = []
    }
  }

  const appId = context.getWorkspaceId()!

  let migrationResult: { app: Workspace; prodWorkspaceId: string }
  try {
    migrationResult = await doInMigrationLock(appId, async () => {
      let replication
      try {
        const devId = dbCore.getDevWorkspaceID(appId)
        const prodId = dbCore.getProdWorkspaceID(appId)

        if (!(await sdk.workspaces.isWorkspacePublished(prodId))) {
          const allWorkspaceApps = await sdk.workspaceApps.fetch()
          for (const workspaceApp of allWorkspaceApps) {
            if (workspaceApp.disabled !== undefined) {
              continue
            }

            await sdk.workspaceApps.update({ ...workspaceApp, disabled: true })
          }

          const allAutomations = await sdk.automations.fetch()
          for (const automation of allAutomations) {
            if (automation.disabled !== undefined) {
              continue
            }

            await sdk.automations.update({ ...automation, disabled: true })
          }
        }

        const isPublished = await sdk.workspaces.isWorkspacePublished(prodId)
        const restrictToTables =
          !!tablesToPublish?.size && tablesToSync !== "all" && !isPublished
        const tableFilter =
          restrictToTables && tablesToPublish
            ? (doc: any) => {
                const _id = doc?._id as string
                if (!_id) {
                  return false
                }
                const tableId = getTableIdFromDocId(_id)
                if (!tableId) {
                  return true
                }
                return tablesToPublish.has(tableId)
              }
            : undefined

        if (await backups.isEnabled()) {
          await backups.triggerAppBackup(prodId, BackupTrigger.PUBLISH, {
            createdBy: ctx.user._id,
          })
        }
        const config = {
          source: devId,
          target: prodId,
        }
        replication = new dbCore.Replication(config)
        const devDb = context.getDevWorkspaceDB()

        const devTablesIds = tablesToPublish
          ? Array.from(tablesToPublish)
          : await sdk.tables.getAllInternalTableIds()
        await replication.resolveInconsistencies(devTablesIds)

        await devDb.compact()
        await replication.replicate(
          replication.appReplicateOpts({
            isCreation: !isPublished,
            tablesToSync,
            // don't use checkpoints, this can stop previously ignored data being replicated
            checkpoint: !seedTables,
            filter: tableFilter,
          })
        )

        const updatedProdTables = await applyPendingColumnRenames(prodId)

        // Keep development revs aligned with production after renaming, so the
        // next publish doesn't see production ahead and delete / tombstone the doc.
        if (updatedProdTables.length > 0) {
          await context.doInWorkspaceContext(devId, async () => {
            const devDb = context.getWorkspaceDB()
            for (const prodTable of updatedProdTables) {
              try {
                const devTable = await devDb.tryGet<Table>(prodTable._id!)
                if (!devTable) {
                  console.warn(
                    `Failed to get development table for table ${prodTable._id} when applying column renames`
                  )
                  continue
                }

                const prodRevNum = getRevisionNumber(prodTable._rev)
                let devRevNum = getRevisionNumber(devTable._rev)

                let docForPut: Table = {
                  ...prodTable,
                  _rev: devTable._rev,
                }

                // Bump dev revisions until dev is at least prod (avoids prod-ahead).
                while (devRevNum < prodRevNum) {
                  const res = await devDb.put(docForPut)
                  docForPut = { ...docForPut, _rev: res.rev }
                  devRevNum = getRevisionNumber(res.rev)
                }

                // Ensure final content is written with the latest dev rev (handles equal case).
                await devDb.put(docForPut)
              } catch (err) {
                console.warn(
                  `Failed to update development table with production table 
                  revision when applying column renames for table ${prodTable._id}: ${err}`
                )
              }
            }
          })
        }

        await clearPendingColumnRenames(devId)

        const db = context.getProdWorkspaceDB()
        const appDoc = await sdk.workspaces.metadata.tryGet({
          production: false,
        })
        if (!appDoc) {
          throw new Error(
            "Unable to publish - cannot retrieve development app metadata"
          )
        }
        const prodAppDoc = await sdk.workspaces.metadata.tryGet({
          production: true,
        })
        if (prodAppDoc) {
          appDoc._rev = prodAppDoc._rev
        } else {
          delete appDoc._rev
        }

        deployment.appUrl = appDoc.url
        appDoc.appId = prodId
        appDoc.instance._id = prodId
        const [automations, workspaceApps, tables] = await Promise.all([
          sdk.automations.fetch(),
          sdk.workspaceApps.fetch(),
          sdk.tables.getAllInternalTables(),
        ])
        const tablesMarkedForPublish =
          restrictToTables && tablesToPublish
            ? tables.filter(table => tablesToPublish.has(table._id!))
            : tables
        const automationIds = automations.map(auto => auto._id!)
        const workspaceAppIds = workspaceApps.map(app => app._id!)
        const tableIds = tablesMarkedForPublish.map(table => table._id!)
        const fullMap = [
          ...(automationIds ?? []),
          ...(workspaceAppIds ?? []),
          ...(tableIds ?? []),
        ]
        appDoc.resourcesPublishedAt = {
          ...prodAppDoc?.resourcesPublishedAt,
          ...Object.fromEntries(
            fullMap.map(id => [id, new Date().toISOString()])
          ),
        }
        delete appDoc.automationErrors
        await db.put(appDoc)
        await cache.workspace.invalidateWorkspaceMetadata(prodId)
        await initDeployedApp(prodId)

        return { app: appDoc, prodWorkspaceId: prodId }
      } finally {
        if (replication) {
          await replication.close()
        }
      }
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error"
    deployment.setStatus(DeploymentStatus.FAILURE, message)
    await storeDeploymentHistory(deployment)
    throw new Error(`Deployment Failed: ${message}`, { cause: error })
  }

  try {
    await syncStaticFormulasToProduction(migrationResult.prodWorkspaceId)
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error"
    deployment.setStatus(DeploymentStatus.FAILURE, message)
    await storeDeploymentHistory(deployment)
    throw new Error(`Deployment Failed: ${message}`, { cause: error })
  }

  deployment.setStatus(DeploymentStatus.SUCCESS)
  await storeDeploymentHistory(deployment)

  await events.app.published(migrationResult.app)

  builderSocket?.emitAppPublish(ctx)
  return deployment
}

export const publishWorkspace = async function (
  ctx: UserCtx<PublishWorkspaceRequest, PublishWorkspaceResponse>
) {
  if (ctx.request.body?.automationIds || ctx.request.body?.workspaceAppIds) {
    throw new errors.NotImplementedError(
      "Publishing resources by ID not currently supported"
    )
  }

  ctx.body = await publishWorkspaceInternal(ctx)
}

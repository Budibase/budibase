import {
  cache,
  context,
  db as dbCore,
  errors,
  events,
  locks,
} from "@budibase/backend-core"
import { backups } from "@budibase/pro"
import {
  Automation,
  BackupTrigger,
  DeploymentDoc,
  DeploymentHistoryEntry,
  DeploymentProgressResponse,
  DeploymentStatus,
  FieldType,
  FetchDeploymentResponse,
  FormulaType,
  LockName,
  LockType,
  MAX_DEPLOYMENT_HISTORY,
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

// the deployment doc is a single document rewritten in full on every publish -
// MAX_DEPLOYMENT_HISTORY and this bound stop it growing without limit, which
// slows every publish down and eventually breaches CouchDB's max_document_size
const MAX_DEPLOYMENT_ERROR_LENGTH = 1000

const byMostRecent = (a: DeploymentHistoryEntry, b: DeploymentHistoryEntry) =>
  (b.updatedAt ?? 0) - (a.updatedAt ?? 0)

// keeps only the most recent deployments, never evicting the one being written -
// a node with a skewed clock can leave stored entries dated ahead of our own
// Date.now(), so recency alone is not enough to guarantee it survives
function boundHistory(
  history: Record<string, DeploymentHistoryEntry>,
  writtenId: string
): Record<string, DeploymentHistoryEntry> {
  const entries = Object.values(history)
  if (entries.length <= MAX_DEPLOYMENT_HISTORY) {
    return history
  }
  const retained = entries
    .filter(entry => entry._id !== writtenId)
    .sort(byMostRecent)
    .slice(0, MAX_DEPLOYMENT_HISTORY - 1)
  return Object.fromEntries(
    [history[writtenId], ...retained].map(entry => [entry._id, entry])
  )
}

// checks that deployments are in a good state, any pending will be updated
function checkAllDeployments(deployments: DeploymentDoc): {
  updated: boolean
  deployments: DeploymentDoc
} {
  let updated = false
  for (const deployment of Object.values(deployments.history ?? {})) {
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
  const deploymentJSON: Omit<DeploymentHistoryEntry, "updatedAt"> =
    deployment.getJSON()
  const db = context.getWorkspaceDB()

  // theres only one deployment doc per app database
  const deploymentDoc: DeploymentDoc = (await db.tryGet<DeploymentDoc>(
    DocumentType.DEPLOYMENTS
  )) ?? { _id: DocumentType.DEPLOYMENTS, history: {} }

  const deploymentId = deploymentJSON._id
  const history = deploymentDoc.history ?? {}

  const entry: DeploymentHistoryEntry = {
    ...history[deploymentId],
    ...deploymentJSON,
    updatedAt: Date.now(),
  }
  if (entry.err) {
    entry.err = entry.err.substring(0, MAX_DEPLOYMENT_ERROR_LENGTH)
  }
  history[deploymentId] = entry

  const bounded = boundHistory(history, deploymentId)
  deploymentDoc.history = bounded

  await db.put(deploymentDoc)
  deployment.fromJSON(bounded[deploymentId])
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
  let { count } = await disableAllCrons(prodAppId)
  const promises = []

  for (let automation of automations) {
    promises.push(
      enableCronOrEmailTrigger(prodAppId, automation)
        .then(({ enabled, automation, clearedRepeatableJobs }) => {
          count += clearedRepeatableJobs
          return { enabled, automation }
        })
        .catch(err => {
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

  const knowledgeSourceSyncSummary = await context.doInWorkspaceContext(
    prodAppId,
    async () => {
      const agents = await sdk.ai.agents.fetch()
      const results = await Promise.all(
        agents.map(agent =>
          sdk.ai.rag.knowledgeSourceSyncQueue.reconcileAgentJobs(
            agent,
            prodAppId
          )
        )
      )
      return results.reduce(
        (summary, result) => ({
          cleared: summary.cleared + result.clearedSchedules,
          enabled: summary.enabled + result.enabledSchedules,
        }),
        { cleared: 0, enabled: 0 }
      )
    }
  )
  console.log(
    `Cleared ${knowledgeSourceSyncSummary.cleared} old knowledge-source sync schedules, enabled ${knowledgeSourceSyncSummary.enabled} new knowledge-source sync schedules for app deployment`
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
    const renamedTableIds = new Set<string>()

    for (const listedTable of tables) {
      if (listedTable._deleted || !listedTable.pendingColumnRenames?.length) {
        continue
      }

      let table = await sdk.tables.getTable(listedTable._id!)
      const pendingColumnRenames = table.pendingColumnRenames ?? []

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

        await sdk.tables.update(tableToUpdate, rename, {
          skipDefinitionRebuildLock: true,
        })
        table = await sdk.tables.getTable(table._id!)
      }

      renamedTableIds.add(table._id!)
    }

    if (renamedTableIds.size === 0) {
      return []
    }

    // Tables processed early in the loop can have been rewritten by later ones,
    // so read the current revisions back before clearing the pending renames.
    const latestTables = await sdk.tables.getAllInternalTables()
    const updatedTables = latestTables
      .filter(table => !table._deleted && renamedTableIds.has(table._id!))
      .map(table => ({ ...table, pendingColumnRenames: [] }))

    const bulkResults = await db.bulkDocs(updatedTables)
    const failedIndex = bulkResults.findIndex(result => result.error)
    if (failedIndex !== -1) {
      const failedResult = bulkResults[failedIndex]
      throw new Error(
        `Failed to apply pending column renames for ${updatedTables[failedIndex]._id}: ${failedResult.error}`
      )
    }
    for (let i = 0; i < updatedTables.length; i++) {
      updatedTables[i]._rev = bulkResults[i].rev
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

    const updatedTables: Table[] = []
    for (const table of tables) {
      if (table._deleted) {
        continue
      }
      if (!table.pendingColumnRenames?.length) {
        continue
      }
      updatedTables.push({
        ...table,
        pendingColumnRenames: [],
      })
    }

    if (updatedTables.length > 0) {
      const bulkResults = await db.bulkDocs(updatedTables)
      const failedIndex = bulkResults.findIndex(result => result.error)
      if (failedIndex !== -1) {
        const failedResult = bulkResults[failedIndex]
        throw new Error(
          `Failed to clear pending column renames for ${updatedTables[failedIndex]._id}: ${failedResult.error}`
        )
      }
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
  const db = context.getWorkspaceDB()
  const deploymentDoc = await db.tryGet<DeploymentDoc>(DocumentType.DEPLOYMENTS)

  let history: DeploymentHistoryEntry[] = []
  if (deploymentDoc) {
    const { updated, deployments } = checkAllDeployments(deploymentDoc)
    if (updated) {
      await db.put(deployments)
    }
    history = Object.values(deployments.history ?? {}).sort(byMostRecent)
  }

  ctx.body = history
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
  const { automations, workspaceApps, tables, agents } =
    await sdk.deployment.status()

  ctx.body = {
    automations,
    workspaceApps,
    tables,
    agents,
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

  const appId = context.getOrThrowWorkspaceId()

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
          await backups.triggerWorkspaceBackup(prodId, BackupTrigger.PUBLISH, {
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
        await sdk.tables.sqs.withDefinitionRebuildLocks([devId, prodId], () =>
          replication!.replicate(
            replication!.appReplicateOpts({
              isCreation: !isPublished,
              tablesToSync,
              // don't use checkpoints, this can stop previously ignored data being replicated
              checkpoint: !seedTables,
              filter: tableFilter,
            })
          )
        )

        const updatedProdTables =
          await sdk.tables.sqs.withDefinitionRebuildLock(
            () => applyPendingColumnRenames(prodId),
            prodId
          )

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
        await sdk.plugins.reconcileWorkspaceUsedPlugins(devId)

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
        const [automations, workspaceApps, tables, agents] = await Promise.all([
          sdk.automations.fetch(),
          sdk.workspaceApps.fetch(),
          sdk.tables.getAllInternalTables(),
          sdk.ai.agents.fetch(),
        ])
        const tablesMarkedForPublish =
          restrictToTables && tablesToPublish
            ? tables.filter(table => tablesToPublish.has(table._id!))
            : tables
        const automationIds = automations.map(auto => auto._id!)
        const deployedAutomationIds = automations
          .filter(auto => auto.disabled !== true)
          .map(auto => auto._id!)
        const workspaceAppIds = workspaceApps.map(app => app._id!)
        const deployedWorkspaceAppIds = workspaceApps
          .filter(app => app.disabled !== true)
          .map(app => app._id!)
        const tableIds = tablesMarkedForPublish.map(table => table._id!)
        const agentIds = agents.map(agent => agent._id!)
        const deployedAgentIds = agents
          .filter(agent => agent.live === true)
          .map(agent => agent._id!)
        const fullMap = [
          ...(automationIds ?? []),
          ...(workspaceAppIds ?? []),
          ...(tableIds ?? []),
          ...(agentIds ?? []),
        ]
        const deployedMap = [
          ...(deployedAutomationIds ?? []),
          ...(deployedWorkspaceAppIds ?? []),
          ...(tableIds ?? []),
          ...(deployedAgentIds ?? []),
        ]
        const publishedAt = new Date().toISOString()
        appDoc.resourcesPublishedAt = {
          ...prodAppDoc?.resourcesPublishedAt,
          ...Object.fromEntries(fullMap.map(id => [id, publishedAt])),
        }
        appDoc.resourcesDeployedAt = {
          ...prodAppDoc?.resourcesDeployedAt,
          ...Object.fromEntries(deployedMap.map(id => [id, publishedAt])),
        }
        delete appDoc.automationErrors
        await db.put(appDoc)
        await sdk.plugins.reconcileWorkspaceUsedPlugins(prodId)
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
    await sdk.tables.sqs.withDefinitionRebuildLock(
      () => syncStaticFormulasToProduction(migrationResult.prodWorkspaceId),
      migrationResult.prodWorkspaceId
    )
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

export async function withPublishLock<T>(fn: () => Promise<T>): Promise<T> {
  const lockResult = await locks.doWithLock(
    {
      type: LockType.TRY_ONCE,
      name: LockName.PUBLISH_WORKSPACE,
      resource: dbCore.getDevWorkspaceID(context.getOrThrowWorkspaceId()),
      ttl: MAX_PENDING_TIME_MS,
    },
    fn
  )
  if (!lockResult.executed) {
    throw new errors.HTTPError(
      "A publish for this app is already in progress, please wait for it to finish",
      429
    )
  }
  return lockResult.result
}

export const publishWorkspace = async function (
  ctx: UserCtx<PublishWorkspaceRequest, PublishWorkspaceResponse>
) {
  if (ctx.request.body?.automationIds || ctx.request.body?.workspaceAppIds) {
    throw new errors.NotImplementedError(
      "Publishing resources by ID not currently supported"
    )
  }

  ctx.body = await withPublishLock(() => publishWorkspaceInternal(ctx))
}

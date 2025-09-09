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
  FetchDeploymentResponse,
  PublishStatusResponse,
  PublishWorkspaceRequest,
  PublishWorkspaceResponse,
  UserCtx,
} from "@budibase/types"
import {
  clearMetadata,
  disableAllCrons,
  enableCronTrigger,
} from "../../../automations/utils"
import { DocumentType, getAutomationParams } from "../../../db/utils"
import env from "../../../environment"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"
import { doInMigrationLock } from "../../../workspaceMigrations"
import Deployment from "./Deployment"

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

async function storeDeploymentHistory(deployment: any) {
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

async function initDeployedApp(prodAppId: any) {
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
      enableCronTrigger(prodAppId, automation).catch(err => {
        throw new Error(
          `Failed to enable CRON trigger for automation "${automation.name}": ${err.message}`,
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
    `Cleared ${count} old CRON, enabled ${enabledCount} new CRON triggers for app deployment`
  )
  // sync the automations back to the dev DB - since there is now CRON
  // information attached
  await sdk.applications.syncApp(dbCore.getDevWorkspaceID(prodAppId), {
    automationOnly: true,
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

export const publishApp = async function (
  ctx: UserCtx<PublishWorkspaceRequest, PublishWorkspaceResponse>
) {
  if (ctx.request.body?.automationIds || ctx.request.body?.workspaceAppIds) {
    throw new errors.NotImplementedError(
      "Publishing resources by ID not currently supported"
    )
  }
  const seedProductionTables = ctx.request.body?.seedProductionTables
  let deployment = new Deployment()
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeDeploymentHistory(deployment)
  let tablesToSync: "all" | string[] | undefined
  if (env.isTest()) {
    // TODO: a lot of tests depend on old behaviour of data being published
    // we could do with going through the tests and updating them all to write
    // data to production instead of development - but doesn't improve test
    // quality - so keep publishing data in dev for now
    tablesToSync = "all"
  } else if (seedProductionTables) {
    try {
      tablesToSync = await sdk.tables.listEmptyProductionTables()
    } catch (e) {
      tablesToSync = []
    }
  }

  const appId = context.getWorkspaceId()!

  // Wrap the entire publish operation in migration lock to prevent race conditions
  const result = await doInMigrationLock(appId, async () => {
    let app
    let replication
    try {
      const devId = dbCore.getDevWorkspaceID(appId)
      const prodId = dbCore.getProdWorkspaceID(appId)

      if (!(await sdk.applications.isAppPublished(prodId))) {
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

      const isPublished = await sdk.applications.isAppPublished(prodId)

      // don't try this if feature isn't allowed, will error
      if (await backups.isEnabled()) {
        // trigger backup initially
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
      await devDb.compact()
      await replication.replicate(
        replication.appReplicateOpts({
          isCreation: !isPublished,
          tablesToSync,
          // don't use checkpoints, this can stop data that was previous ignored
          // getting written - if not seeding tables we don't need to worry about it
          checkpoint: !seedProductionTables,
        })
      )
      // app metadata is excluded as it is likely to be in conflict
      // replicate the app metadata document manually
      const db = context.getProdWorkspaceDB()
      const appDoc = await sdk.applications.metadata.tryGet({
        production: false,
      })
      if (!appDoc) {
        throw new Error(
          "Unable to publish - cannot retrieve development app metadata"
        )
      }
      const prodAppDoc = await sdk.applications.metadata.tryGet({
        production: true,
      })
      if (prodAppDoc) {
        appDoc._rev = prodAppDoc._rev
      } else {
        delete appDoc._rev
      }

      // switch to production app ID
      deployment.appUrl = appDoc.url
      appDoc.appId = prodId
      appDoc.instance._id = prodId
      const [automations, workspaceApps, tables] = await Promise.all([
        sdk.automations.fetch(),
        sdk.workspaceApps.fetch(),
        sdk.tables.getAllInternalTables(),
      ])
      const automationIds = automations.map(auto => auto._id!)
      const workspaceAppIds = workspaceApps.map(app => app._id!)
      const tableIds = tables.map(table => table._id!)
      const fullMap = [
        ...(automationIds ?? []),
        ...(workspaceAppIds ?? []),
        ...(tableIds ?? []),
      ]
      // if resource publishing, need to restrict this list
      appDoc.resourcesPublishedAt = {
        ...prodAppDoc?.resourcesPublishedAt,
        ...Object.fromEntries(
          fullMap.map(id => [id, new Date().toISOString()])
        ),
      }
      // remove automation errors if they exist
      delete appDoc.automationErrors
      await db.put(appDoc)
      await cache.workspace.invalidateWorkspaceMetadata(prodId)
      await initDeployedApp(prodId)
      deployment.setStatus(DeploymentStatus.SUCCESS)
      await storeDeploymentHistory(deployment)
      app = appDoc
    } catch (err: any) {
      deployment.setStatus(DeploymentStatus.FAILURE, err.message)
      await storeDeploymentHistory(deployment)

      throw new Error(`Deployment Failed: ${err.message}`, { cause: err })
    } finally {
      if (replication) {
        await replication.close()
      }
    }

    await events.app.published(app)
    return { deployment }
  })

  ctx.body = result.deployment
  builderSocket?.emitAppPublish(ctx)
}

import Deployment from "./Deployment"
import {
  context,
  db as dbCore,
  events,
  cache,
  features,
  errors,
} from "@budibase/backend-core"
import { DocumentType, getAutomationParams } from "../../../db/utils"
import {
  clearMetadata,
  disableAllCrons,
  enableCronTrigger,
} from "../../../automations/utils"
import { backups } from "@budibase/pro"
import {
  AppBackupTrigger,
  DeploymentDoc,
  FetchDeploymentResponse,
  PublishAppResponse,
  UserCtx,
  DeploymentStatus,
  DeploymentProgressResponse,
  Automation,
  PublishAppRequest,
  PublishStatusResponse,
  FeatureFlag,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"
import { doInMigrationLock } from "../../../appMigrations"

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
  const db = context.getAppDB()

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
  const db = context.getProdAppDB()
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
  await sdk.applications.syncApp(dbCore.getDevAppID(prodAppId), {
    automationOnly: true,
  })
}

export async function fetchDeployments(
  ctx: UserCtx<void, FetchDeploymentResponse>
) {
  try {
    const db = context.getAppDB()
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
    const db = context.getAppDB()
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
  if (!(await features.isEnabled(FeatureFlag.WORKSPACE_APPS))) {
    return (ctx.body = { automations: {}, workspaceApps: {} })
  }

  const { automations, workspaceApps } = await sdk.deployment.status()

  ctx.body = {
    automations,
    workspaceApps,
  }
}

export const publishApp = async function (
  ctx: UserCtx<PublishAppRequest, PublishAppResponse>
) {
  if (ctx.request.body?.automationIds || ctx.request.body?.workspaceAppIds) {
    throw new errors.NotImplementedError(
      "Publishing resources by ID not currently supported"
    )
  }
  let deployment = new Deployment()
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeDeploymentHistory(deployment)

  const appId = context.getAppId()!

  // Wrap the entire publish operation in migration lock to prevent race conditions
  const result = await doInMigrationLock(appId, async () => {
    let app
    let replication
    try {
      const devAppId = dbCore.getDevelopmentAppID(appId)
      const productionAppId = dbCore.getProdAppID(appId)

      const isPublished = await sdk.applications.isAppPublished(productionAppId)

      // don't try this if feature isn't allowed, will error
      if (await backups.isEnabled()) {
        // trigger backup initially
        await backups.triggerAppBackup(
          productionAppId,
          AppBackupTrigger.PUBLISH,
          {
            createdBy: ctx.user._id,
          }
        )
      }
      const config = {
        source: devAppId,
        target: productionAppId,
      }
      replication = new dbCore.Replication(config)
      const devDb = context.getDevAppDB()
      await devDb.compact()
      await replication.replicate(
        replication.appReplicateOpts({ isCreation: !isPublished })
      )
      // app metadata is excluded as it is likely to be in conflict
      // replicate the app metadata document manually
      const db = context.getProdAppDB()
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
      appDoc.appId = productionAppId
      appDoc.instance._id = productionAppId
      const [automations, workspaceApps] = await Promise.all([
        sdk.automations.fetch(),
        sdk.workspaceApps.fetch(),
      ])
      const automationIds = automations.map(auto => auto._id!)
      const workspaceAppIds = workspaceApps.map(app => app._id!)
      const fullMap = [...(automationIds ?? []), ...(workspaceAppIds ?? [])]
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
      await cache.app.invalidateAppMetadata(productionAppId)
      await initDeployedApp(productionAppId)
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

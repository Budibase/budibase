import Deployment from "./Deployment"
import { context, db as dbCore, events, cache } from "@budibase/backend-core"
import { DocumentType, getAutomationParams } from "../../../db/utils"
import {
  clearMetadata,
  disableAllCrons,
  enableCronTrigger,
} from "../../../automations/utils"
import { backups } from "@budibase/pro"
import {
  App,
  AppBackupTrigger,
  DeploymentDoc,
  FetchDeploymentResponse,
  PublishAppResponse,
  UserCtx,
  DeploymentStatus,
  DeploymentProgressResponse,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"

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
    await db.allDocs(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map((row: any) => row.doc)
  await clearMetadata()
  const { count } = await disableAllCrons(prodAppId)
  const promises = []
  for (let automation of automations) {
    promises.push(enableCronTrigger(prodAppId, automation))
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

export const publishApp = async function (
  ctx: UserCtx<void, PublishAppResponse>
) {
  let deployment = new Deployment()
  console.log("Deployment object created")
  deployment.setStatus(DeploymentStatus.PENDING)
  console.log("Deployment object set to pending")
  deployment = await storeDeploymentHistory(deployment)
  console.log("Stored deployment history")

  console.log("Deploying app...")

  let app
  let replication
  try {
    const appId = context.getAppId()!
    const devAppId = dbCore.getDevelopmentAppID(appId)
    const productionAppId = dbCore.getProdAppID(appId)

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
    const config: any = {
      source: devAppId,
      target: productionAppId,
    }
    replication = new dbCore.Replication(config)
    const devDb = context.getDevAppDB()
    console.log("Compacting development DB")
    await devDb.compact()
    console.log("Replication object created")
    await replication.replicate(replication.appReplicateOpts())
    console.log("replication complete.. replacing app meta doc")
    // app metadata is excluded as it is likely to be in conflict
    // replicate the app metadata document manually
    const db = context.getProdAppDB()
    const appDoc = await devDb.get<App>(DocumentType.APP_METADATA)
    try {
      const prodAppDoc = await db.get<App>(DocumentType.APP_METADATA)
      appDoc._rev = prodAppDoc._rev
    } catch (err) {
      delete appDoc._rev
    }

    // switch to production app ID
    deployment.appUrl = appDoc.url
    appDoc.appId = productionAppId
    appDoc.instance._id = productionAppId
    // remove automation errors if they exist
    delete appDoc.automationErrors
    await db.put(appDoc)
    await cache.app.invalidateAppMetadata(productionAppId)
    console.log("New app doc written successfully.")
    await initDeployedApp(productionAppId)
    console.log("Deployed app initialised, setting deployment to successful")
    deployment.setStatus(DeploymentStatus.SUCCESS)
    await storeDeploymentHistory(deployment)
    app = appDoc
  } catch (err: any) {
    deployment.setStatus(DeploymentStatus.FAILURE, err.message)
    await storeDeploymentHistory(deployment)
    throw {
      ...err,
      message: `Deployment Failed: ${err.message}`,
    }
  } finally {
    if (replication) {
      await replication.close()
    }
  }

  await events.app.published(app)
  ctx.body = deployment
  builderSocket?.emitAppPublish(ctx)
}

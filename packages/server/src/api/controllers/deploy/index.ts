import Deployment from "./Deployment"
import {
  Replication,
  getProdAppID,
  getDevelopmentAppID,
} from "@budibase/backend-core/db"
import { DocumentTypes, getAutomationParams } from "../../../db/utils"
import {
  disableAllCrons,
  enableCronTrigger,
  clearMetadata,
} from "../../../automations/utils"
import { app as appCache } from "@budibase/backend-core/cache"
import {
  getAppId,
  getAppDB,
  getProdAppDB,
} from "@budibase/backend-core/context"
import { quotas } from "@budibase/pro"
import { events } from "@budibase/backend-core"

// the max time we can wait for an invalidation to complete before considering it failed
const MAX_PENDING_TIME_MS = 30 * 60000
const DeploymentStatus = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILURE: "FAILURE",
}

// checks that deployments are in a good state, any pending will be updated
async function checkAllDeployments(deployments: any) {
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
  const db = getAppDB()

  let deploymentDoc
  try {
    // theres only one deployment doc per app database
    deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
  } catch (err) {
    deploymentDoc = { _id: DocumentTypes.DEPLOYMENTS, history: {} }
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
  const db = getProdAppDB()
  console.log("Reading automation docs")
  const automations = (
    await db.allDocs(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map((row: any) => row.doc)
  await clearMetadata()
  console.log("You have " + automations.length + " automations")
  const promises = []
  console.log("Disabling prod crons..")
  await disableAllCrons(prodAppId)
  console.log("Prod Cron triggers disabled..")
  console.log("Enabling cron triggers for deployed app..")
  for (let automation of automations) {
    promises.push(enableCronTrigger(prodAppId, automation))
  }
  await Promise.all(promises)
  console.log("Enabled cron triggers for deployed app..")
}

async function deployApp(deployment: any) {
  let replication
  try {
    const appId = getAppId()
    const devAppId = getDevelopmentAppID(appId)
    const productionAppId = getProdAppID(appId)

    const config: any = {
      source: devAppId,
      target: productionAppId,
    }
    replication = new Replication(config)

    console.log("Replication object created")
    await replication.replicate()
    console.log("replication complete.. replacing app meta doc")
    const db = getProdAppDB()
    const appDoc = await db.get(DocumentTypes.APP_METADATA)

    deployment.appUrl = appDoc.url

    appDoc.appId = productionAppId
    appDoc.instance._id = productionAppId
    await db.put(appDoc)
    await appCache.invalidateAppMetadata(productionAppId)
    console.log("New app doc written successfully.")
    await initDeployedApp(productionAppId)
    console.log("Deployed app initialised, setting deployment to successful")
    deployment.setStatus(DeploymentStatus.SUCCESS)
    await storeDeploymentHistory(deployment)
    return appDoc
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
}

export async function fetchDeployments(ctx: any) {
  try {
    const db = getAppDB()
    const deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
    const { updated, deployments } = await checkAllDeployments(deploymentDoc)
    if (updated) {
      await db.put(deployments)
    }
    ctx.body = Object.values(deployments.history).reverse()
  } catch (err) {
    ctx.body = []
  }
}

export async function deploymentProgress(ctx: any) {
  try {
    const db = getAppDB()
    const deploymentDoc = await db.get(DocumentTypes.DEPLOYMENTS)
    ctx.body = deploymentDoc[ctx.params.deploymentId]
  } catch (err) {
    ctx.throw(
      500,
      `Error fetching data for deployment ${ctx.params.deploymentId}`
    )
  }
}

const isFirstDeploy = async () => {
  try {
    const db = getProdAppDB()
    await db.get(DocumentTypes.APP_METADATA)
  } catch (e: any) {
    if (e.status === 404) {
      return true
    }
    throw e
  }
  return false
}

const _deployApp = async function (ctx: any) {
  let deployment = new Deployment()
  console.log("Deployment object created")
  deployment.setStatus(DeploymentStatus.PENDING)
  console.log("Deployment object set to pending")
  deployment = await storeDeploymentHistory(deployment)
  console.log("Stored deployment history")

  console.log("Deploying app...")

  let app
  if (await isFirstDeploy()) {
    app = await quotas.addPublishedApp(() => deployApp(deployment))
  } else {
    app = await deployApp(deployment)
  }

  await events.app.published(app)
  ctx.body = deployment
}

export { _deployApp as deployApp }

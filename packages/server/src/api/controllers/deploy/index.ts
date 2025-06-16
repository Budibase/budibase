import Deployment from "./Deployment"
import {
  context,
  db as dbCore,
  events,
  cache,
  features,
} from "@budibase/backend-core"
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
  Automation,
  PublishAppRequest,
  PublishStatusResponse,
  WorkspaceApp,
  FeatureFlag,
  PublishStatusResource,
} from "@budibase/types"
import sdk from "../../../sdk"
import { builderSocket } from "../../../websockets"
import { buildPublishFilter } from "./filters"

// the max time we can wait for an invalidation to complete before considering it failed
const MAX_PENDING_TIME_MS = 30 * 60000

async function getAppMetadata(opts: { production: boolean }) {
  const db = opts.production ? context.getProdAppDB() : context.getDevAppDB()
  return db.tryGet<App>(DocumentType.APP_METADATA)
}

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
  try {
    const prodDb = context.getProdAppDB()
    const productionExists = await prodDb.exists()
    type State = { automations: Automation[]; workspaceApps: WorkspaceApp[] }
    let developmentState: State = { automations: [], workspaceApps: [] }
    let productionState: State = { automations: [], workspaceApps: [] }
    const updateState = async (state: State) => {
      const [automations, workspaceApps] = await Promise.all([
        sdk.automations.fetch(),
        sdk.workspaceApps.fetch(),
      ])
      state.automations = automations
      state.workspaceApps = workspaceApps
    }

    await context.doInAppContext(context.getDevAppId(), async () =>
      updateState(developmentState)
    )

    if (productionExists) {
      await context.doInAppContext(context.getProdAppId(), async () =>
        updateState(productionState)
      )
    }

    // Create maps of production state for quick lookup
    const prodAutomationIds = new Set(
      productionState.automations.map(a => a._id)
    )
    const prodWorkspaceAppIds = new Set(
      productionState.workspaceApps.map(w => w._id)
    )

    // Build response maps comparing development vs production
    const automations: Record<string, PublishStatusResource> = {}
    for (const automation of developmentState.automations) {
      automations[automation._id!] = {
        published: prodAutomationIds.has(automation._id!),
        name: automation.name,
      }
    }

    const workspaceApps: Record<string, PublishStatusResource> = {}
    for (const workspaceApp of developmentState.workspaceApps) {
      workspaceApps[workspaceApp._id!] = {
        published: prodWorkspaceAppIds.has(workspaceApp._id!),
        name: workspaceApp.name,
      }
    }

    if (productionExists) {
      const metadata = await getAppMetadata({ production: true })
      if (metadata?.lastPublishedAt) {
        const lastPublishedAt = metadata.lastPublishedAt
        for (const automationId of Object.keys(automations)) {
          if (lastPublishedAt[automationId]) {
            automations[automationId].lastPublishedAt =
              lastPublishedAt[automationId]
          }
        }
        for (const workspaceAppId of Object.keys(workspaceApps)) {
          if (lastPublishedAt[workspaceAppId]) {
            workspaceApps[workspaceAppId].lastPublishedAt =
              lastPublishedAt[workspaceAppId]
          }
        }
      }
    }

    ctx.body = {
      automations,
      workspaceApps,
    }
  } catch (err) {
    ctx.throw(500, "Error fetching data for deployment status")
  }
}

export const publishApp = async function (
  ctx: UserCtx<PublishAppRequest, PublishAppResponse>
) {
  let automationIds: string[] | undefined, workspaceAppIds: string[] | undefined
  if (ctx.request.body) {
    automationIds = ctx.request.body.automationIds
    workspaceAppIds = ctx.request.body.workspaceAppIds
  }
  let deployment = new Deployment()
  deployment.setStatus(DeploymentStatus.PENDING)
  deployment = await storeDeploymentHistory(deployment)

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
    const config = {
      source: devAppId,
      target: productionAppId,
    }
    replication = new dbCore.Replication(config)
    const devDb = context.getDevAppDB()
    const publishFilter =
      automationIds || workspaceAppIds
        ? await buildPublishFilter({
            automationIds,
            workspaceAppIds,
          })
        : undefined
    await devDb.compact()
    await replication.replicate(
      replication.appReplicateOpts({
        // filters automations, screen and workspace documents based on supplied filters
        filter: publishFilter,
      })
    )
    // app metadata is excluded as it is likely to be in conflict
    // replicate the app metadata document manually
    const db = context.getProdAppDB()
    const appDoc = await getAppMetadata({ production: false })
    if (!appDoc) {
      throw new Error(
        "Unable to publish - cannot retrieve development app metadata"
      )
    }
    const prodAppDoc = await getAppMetadata({ production: true })
    if (prodAppDoc) {
      appDoc._rev = prodAppDoc._rev
    } else {
      delete appDoc._rev
    }

    // switch to production app ID
    deployment.appUrl = appDoc.url
    appDoc.appId = productionAppId
    appDoc.instance._id = productionAppId
    if (automationIds?.length || workspaceAppIds?.length) {
      const fullMap = [...(automationIds ?? []), ...(workspaceAppIds ?? [])]
      appDoc.lastPublishedAt = Object.fromEntries(
        fullMap.map(id => [id, new Date().toISOString()])
      )
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
  ctx.body = deployment
  builderSocket?.emitAppPublish(ctx)
}

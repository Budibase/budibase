import { context } from "@budibase/backend-core"
import {
  Automation,
  WorkspaceApp,
  PublishStatusResource,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function status() {
  const prodDb = context.getProdAppDB()
  const productionExists = await prodDb.exists()
  type State = { automations: Automation[]; workspaceApps: WorkspaceApp[] }
  const developmentState: State = { automations: [], workspaceApps: [] }
  const productionState: State = { automations: [], workspaceApps: [] }
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
  const prodAutomationIds = new Set(productionState.automations.map(a => a._id))
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
    const metadata = await sdk.applications.metadata.tryGet({
      production: true,
    })
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

  return { automations, workspaceApps }
}

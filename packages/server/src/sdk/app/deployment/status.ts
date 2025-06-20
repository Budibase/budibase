import { context } from "@budibase/backend-core"
import {
  Automation,
  WorkspaceApp,
  PublishStatusResource,
  Screen,
  App,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function status() {
  const prodDb = context.getProdAppDB()
  const productionExists = await prodDb.exists()
  type State = {
    automations: Automation[]
    workspaceApps: WorkspaceApp[]
    screens: Screen[]
  }
  const developmentState: State = {
    automations: [],
    workspaceApps: [],
    screens: [],
  }
  const productionState: State = {
    automations: [],
    workspaceApps: [],
    screens: [],
  }
  const updateState = async (state: State) => {
    const [automations, workspaceApps, screens] = await Promise.all([
      sdk.automations.fetch(),
      sdk.workspaceApps.fetch(),
      sdk.screens.fetch(),
    ])
    state.automations = automations
    state.workspaceApps = workspaceApps
    state.screens = screens
  }

  await context.doInAppContext(context.getDevAppId(), async () =>
    updateState(developmentState)
  )

  let metadata: App | undefined
  if (productionExists) {
    metadata = await sdk.applications.metadata.tryGet({
      production: true,
    })
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
    const resourcePublishedAt =
      metadata?.resourcesPublishedAt?.[automation._id!]
    automations[automation._id!] = {
      published: prodAutomationIds.has(automation._id!),
      name: automation.name,
      publishedAt: resourcePublishedAt,
      unpublishedChanges:
        !resourcePublishedAt || automation.updatedAt! > resourcePublishedAt,
    }
  }

  const workspaceApps: Record<string, PublishStatusResource> = {}
  for (const workspaceApp of developmentState.workspaceApps) {
    const resourcePublishedAt =
      metadata?.resourcesPublishedAt?.[workspaceApp._id!]
    const workspaceScreens = developmentState.screens.filter(
      screen => screen.workspaceAppId === workspaceApp._id
    )
    workspaceApps[workspaceApp._id!] = {
      published: prodWorkspaceAppIds.has(workspaceApp._id!),
      name: workspaceApp.name,
      publishedAt: resourcePublishedAt,
      unpublishedChanges:
        !resourcePublishedAt ||
        !!workspaceScreens.find(
          screen => screen.updatedAt! > resourcePublishedAt
        ),
    }
  }

  return { automations, workspaceApps }
}

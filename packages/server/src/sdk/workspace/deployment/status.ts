import { context } from "@budibase/backend-core"
import {
  Agent,
  Automation,
  PublishResourceState,
  PublishStatusResource,
  Screen,
  Table,
  Workspace,
  WorkspaceApp,
} from "@budibase/types"
import sdk from "../.."

function getPublishedState(
  resource: { disabled?: boolean },
  publishedAt?: string
): PublishResourceState {
  if (!resource.disabled && publishedAt) {
    return PublishResourceState.PUBLISHED
  }

  return PublishResourceState.DISABLED
}

export async function status() {
  const prodWorkspaceId = context.getProdWorkspaceId()
  const productionExists =
    await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)
  type State = {
    agents: Agent[]
    automations: Automation[]
    workspaceApps: WorkspaceApp[]
    screens: Screen[]
    tables: Table[]
  }
  const developmentState: State = {
    agents: [],
    automations: [],
    workspaceApps: [],
    screens: [],
    tables: [],
  }
  const productionState: State = {
    agents: [],
    automations: [],
    workspaceApps: [],
    screens: [],
    tables: [],
  }
  const updateState = async (state: State) => {
    const [agents, automations, workspaceApps, screens, tables] =
      await Promise.all([
        sdk.ai.agents.fetch(),
        sdk.automations.fetch(),
        sdk.workspaceApps.fetch(),
        sdk.screens.fetch(),
        sdk.tables.getAllInternalTables(),
      ])
    state.agents = agents
    state.automations = automations
    state.workspaceApps = workspaceApps
    state.screens = screens
    state.tables = tables
  }

  await context.doInWorkspaceContext(context.getDevWorkspaceId(), async () =>
    updateState(developmentState)
  )

  let metadata: Workspace | undefined
  if (productionExists) {
    metadata = await sdk.workspaces.metadata.tryGet({
      production: true,
    })
    await context.doInWorkspaceContext(context.getProdWorkspaceId(), async () =>
      updateState(productionState)
    )
  }

  // Create maps of production state for quick lookup
  const prodAutomationIds = new Set(productionState.automations.map(a => a._id))
  const prodWorkspaceAppIds = new Set(
    productionState.workspaceApps.map(w => w._id)
  )
  const prodTableIds = new Set(productionState.tables.map(t => t._id))
  const prodAgentIds = new Set(productionState.agents.map(agent => agent._id))

  const processResource = (
    map: Record<string, PublishStatusResource>,
    prodIds: Set<string | undefined>,
    resource: {
      disabled?: boolean
      updatedAt?: string
      name: string
      _id?: string
    }
  ) => {
    const id = resource._id!
    const resourcePublishedAt = metadata?.resourcesPublishedAt?.[id]
    const resourceDeployedAt = metadata?.resourcesDeployedAt?.[id]
    const isPublished = prodIds.has(id) || !!resourcePublishedAt

    map[id] = {
      published: isPublished,
      name: resource.name,
      publishedAt: resourcePublishedAt,
      lastDeployedLiveAt: resourceDeployedAt,
      unpublishedChanges:
        !resourcePublishedAt || resource.updatedAt! > resourcePublishedAt,
      state: getPublishedState(resource, resourcePublishedAt),
    }
  }

  // Build response maps comparing development vs production
  const automations: Record<string, PublishStatusResource> = {}
  for (const automation of developmentState.automations) {
    processResource(automations, prodAutomationIds, automation)
  }

  const tables: Record<string, PublishStatusResource> = {}
  for (const table of developmentState.tables) {
    processResource(tables, prodTableIds, table)
  }

  const workspaceApps: Record<string, PublishStatusResource> = {}
  for (const workspaceApp of developmentState.workspaceApps) {
    const resourcePublishedAt =
      metadata?.resourcesPublishedAt?.[workspaceApp._id!]
    const resourceDeployedAt =
      metadata?.resourcesDeployedAt?.[workspaceApp._id!]
    const workspaceScreens = developmentState.screens.filter(
      screen => screen.workspaceAppId === workspaceApp._id
    )
    workspaceApps[workspaceApp._id!] = {
      published: prodWorkspaceAppIds.has(workspaceApp._id!),
      name: workspaceApp.name,
      publishedAt: resourcePublishedAt,
      lastDeployedLiveAt: resourceDeployedAt,
      unpublishedChanges:
        !resourcePublishedAt ||
        !!workspaceScreens.find(
          screen => screen.updatedAt! > resourcePublishedAt
        ),
      state: getPublishedState(workspaceApp, resourcePublishedAt),
    }
  }

  const agents: Record<string, PublishStatusResource> = {}
  for (const agent of developmentState.agents) {
    processResource(agents, prodAgentIds, {
      _id: agent._id,
      name: agent.name,
      updatedAt: agent.updatedAt,
      disabled: agent.live !== true,
    })
  }

  return { agents, automations, workspaceApps, tables }
}

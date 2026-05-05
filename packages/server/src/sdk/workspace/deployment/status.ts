import { context } from "@budibase/backend-core"
import {
  Agent,
  Automation,
  KnowledgeBaseFile,
  PublishResourceState,
  PublishStatusResource,
  Screen,
  Table,
  Workspace,
  WorkspaceApp,
} from "@budibase/types"
import pick from "lodash/pick"
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
    agentFiles: Record<string, KnowledgeBaseFile[]>
    automations: Automation[]
    workspaceApps: WorkspaceApp[]
    screens: Screen[]
    tables: Table[]
  }
  const developmentState: State = {
    agents: [],
    agentFiles: {},
    automations: [],
    workspaceApps: [],
    screens: [],
    tables: [],
  }
  const productionState: State = {
    agents: [],
    agentFiles: {},
    automations: [],
    workspaceApps: [],
    screens: [],
    tables: [],
  }

  const normalizeArray = <T>(items: T[]) => [...items].sort()

  const toComparableKnowledgeSource = (
    source: NonNullable<Agent["knowledgeSources"]>[number]
  ) => ({
    id: source.id,
    type: source.type,
    config: {
      site: source.config.site
        ? {
            id: source.config.site.id,
            name: source.config.site.name,
            webUrl: source.config.site.webUrl,
          }
        : undefined,
      filters: source.config.filters
        ? {
            patterns: normalizeArray(source.config.filters.patterns || []),
          }
        : undefined,
    },
  })

  const toComparableKnowledgeBaseFile = (file: KnowledgeBaseFile) => ({
    ...pick(file, ["_id", "filename"]),
    source: file.source
      ? pick(file.source, [
          "type",
          "knowledgeSourceId",
          "siteId",
          "driveId",
          "itemId",
          "path",
        ])
      : undefined,
  })

  const normalizeAgentPayload = (agent: Agent, files: KnowledgeBaseFile[]) => {
    const normalizedKnowledgeSources = (agent.knowledgeSources || [])
      .map(source => toComparableKnowledgeSource(source))
      .sort((a, b) => a.id.localeCompare(b.id))

    const normalizedFiles = files
      .map(file => toComparableKnowledgeBaseFile(file))
      .sort((a, b) => {
        const aKey = `${a._id || ""}:${a.filename || ""}`
        const bKey = `${b._id || ""}:${b.filename || ""}`
        return aKey.localeCompare(bKey)
      })

    return {
      name: agent.name,
      icon: agent.icon,
      iconColor: agent.iconColor,
      aiconfig: agent.aiconfig,
      promptInstructions: agent.promptInstructions,
      goal: agent.goal,
      live: agent.live,
      enabledTools: normalizeArray(agent.enabledTools || []),
      discordIntegration: agent.discordIntegration
        ? {
            applicationId: agent.discordIntegration.applicationId,
            publicKey: agent.discordIntegration.publicKey,
            botToken: agent.discordIntegration.botToken,
            guildId: agent.discordIntegration.guildId,
            interactionsEndpointUrl:
              agent.discordIntegration.interactionsEndpointUrl,
            chatAppId: agent.discordIntegration.chatAppId,
            idleTimeoutMinutes: agent.discordIntegration.idleTimeoutMinutes,
          }
        : undefined,
      MSTeamsIntegration: agent.MSTeamsIntegration
        ? {
            appId: agent.MSTeamsIntegration.appId,
            appPassword: agent.MSTeamsIntegration.appPassword,
            tenantId: agent.MSTeamsIntegration.tenantId,
            messagingEndpointUrl: agent.MSTeamsIntegration.messagingEndpointUrl,
            chatAppId: agent.MSTeamsIntegration.chatAppId,
            idleTimeoutMinutes: agent.MSTeamsIntegration.idleTimeoutMinutes,
          }
        : undefined,
      slackIntegration: agent.slackIntegration
        ? {
            botToken: agent.slackIntegration.botToken,
            signingSecret: agent.slackIntegration.signingSecret,
            messagingEndpointUrl: agent.slackIntegration.messagingEndpointUrl,
            chatAppId: agent.slackIntegration.chatAppId,
            idleTimeoutMinutes: agent.slackIntegration.idleTimeoutMinutes,
          }
        : undefined,
      knowledgeSources: normalizedKnowledgeSources,
      files: normalizedFiles,
    }
  }

  const toComparableAgentPayload = (agent: Agent, files: KnowledgeBaseFile[]) =>
    JSON.stringify(normalizeAgentPayload(agent, files))

  const updateState = async (state: State) => {
    const [automations, workspaceApps, screens, tables, agents] =
      await Promise.all([
        sdk.automations.fetch(),
        sdk.workspaceApps.fetch(),
        sdk.screens.fetch(),
        sdk.tables.getAllInternalTables(),
        sdk.ai.agents.fetch(),
      ])

    const filesByAgentEntries = await Promise.all(
      agents.map(async agent => {
        if (!agent._id) {
          return ["", [] as KnowledgeBaseFile[]] as const
        }
        const files = await sdk.ai.rag.listFilesForAgent(agent._id)
        return [agent._id, files] as const
      })
    )
    const agentFiles = Object.fromEntries(
      filesByAgentEntries.filter(([agentId]) => !!agentId)
    )

    state.agents = agents
    state.agentFiles = agentFiles
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
  const prodAgentIds = new Set(productionState.agents.map(a => a._id))

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

  const prodAgentComparables = new Map<string, string>()
  for (const agent of productionState.agents) {
    const agentId = agent._id
    if (!agentId) {
      continue
    }
    const files = productionState.agentFiles[agentId] || []
    prodAgentComparables.set(agentId, toComparableAgentPayload(agent, files))
  }

  const agents: Record<string, PublishStatusResource> = {}
  for (const agent of developmentState.agents) {
    const agentId = agent._id
    if (!agentId) {
      continue
    }
    const resourcePublishedAt = metadata?.resourcesPublishedAt?.[agentId]
    const resourceDeployedAt = metadata?.resourcesDeployedAt?.[agentId]
    const devComparable = toComparableAgentPayload(
      agent,
      developmentState.agentFiles[agentId] || []
    )
    const prodComparable = prodAgentComparables.get(agentId)

    agents[agentId] = {
      published: prodAgentIds.has(agentId) || !!resourcePublishedAt,
      name: agent.name,
      publishedAt: resourcePublishedAt,
      lastDeployedLiveAt: resourceDeployedAt,
      unpublishedChanges:
        !resourcePublishedAt || devComparable !== (prodComparable || ""),
      state:
        agent.live && resourcePublishedAt
          ? PublishResourceState.PUBLISHED
          : PublishResourceState.DISABLED,
    }
  }

  return { automations, workspaceApps, tables, agents }
}

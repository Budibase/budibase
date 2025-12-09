import { db, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateToolSourceRequest,
  FetchAgentsResponse,
  RequiredKeys,
  Tool,
  ToolSourceType,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UpdateToolSourceRequest,
  UserCtx,
} from "@budibase/types"
import { createToolSource as createToolSourceInstance } from "../../../ai/tools/base"
import sdk from "../../../sdk"

export async function fetchToolSources(
  ctx: UserCtx<void, AgentToolSourceWithTools[], { agentId: string }>
) {
  const agentId = ctx.params.agentId

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(agentId)

  const toolSourcesWithTools: AgentToolSourceWithTools[] = []

  for (const toolSource of agent.allowedTools || []) {
    const toolSourceInstance = createToolSourceInstance(toolSource)

    const tools: Tool[] = toolSourceInstance
      ? await toolSourceInstance.getToolsAsync()
      : []

    toolSourcesWithTools.push({
      ...toolSource,
      tools,
    })
  }

  ctx.body = toolSourcesWithTools
}

export async function createToolSource(
  ctx: UserCtx<CreateToolSourceRequest, { created: true }>
) {
  const toolSourceRequest = ctx.request.body

  if (!toolSourceRequest.agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(toolSourceRequest.agentId)

  const toolSourceId = docIds.generateAgentToolSourceID()

  const { agentId: _, ...toolSourceData } = toolSourceRequest

  const toolSource: AgentToolSource = {
    ...toolSourceData,
    id: toolSourceId,
  } as AgentToolSource

  const updatedAgent: Agent = {
    ...agent,
    allowedTools: [...(agent.allowedTools || []), toolSource],
  }

  await sdk.ai.agents.update(updatedAgent)

  ctx.body = { created: true }
  ctx.status = 201
}

export async function updateToolSource(
  ctx: UserCtx<UpdateToolSourceRequest, AgentToolSource>
) {
  const toolSourceRequest = ctx.request.body

  if (!toolSourceRequest.id) {
    throw new HTTPError("id field missing", 400)
  }

  if (!toolSourceRequest.agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(toolSourceRequest.agentId)

  // Remove agentId from tool source as it's not part of the tool source structure
  const { agentId: _, ...toolSourceData } = toolSourceRequest

  // Find and update the tool source in allowedTools
  const updatedAllowedTools = (agent.allowedTools || []).map(ts => {
    if (ts.id === toolSourceRequest.id) {
      return {
        ...toolSourceData,
        id: toolSourceRequest.id,
      } as AgentToolSource
    }
    return ts
  })

  const updatedAgent: Agent = {
    ...agent,
    allowedTools: updatedAllowedTools,
  }

  await sdk.ai.agents.update(updatedAgent)

  // Return the updated tool source
  const updatedToolSource = updatedAllowedTools.find(
    ts => ts.id === toolSourceRequest.id
  ) as AgentToolSource

  ctx.body = updatedToolSource
  ctx.status = 200
}

export async function deleteToolSource(ctx: UserCtx<void, { deleted: true }>) {
  const toolSourceId = ctx.params.toolSourceId

  // Find agent that contains this tool source
  const agents = await sdk.ai.agents.fetch()
  const agentWithToolSource = agents.find(agent =>
    (agent.allowedTools || []).some(ts => ts.id === toolSourceId)
  )

  if (!agentWithToolSource) {
    throw new HTTPError("Tool source not found", 404)
  }

  // Remove tool source from agent's allowedTools
  const updatedAgent: Agent = {
    ...agentWithToolSource,
    allowedTools: (agentWithToolSource.allowedTools || []).filter(
      ts => ts.id !== toolSourceId
    ),
  }

  await sdk.ai.agents.update(updatedAgent)

  ctx.body = { deleted: true }
  ctx.status = 200
}

export async function fetchAvailableTools(
  ctx: UserCtx<void, Tool[], { toolSourceType: string }>
) {
  const toolSourceType = ctx.params.toolSourceType

  if (!toolSourceType) {
    throw new HTTPError("toolSourceType is required", 400)
  }

  let tempToolSource: AgentToolSource
  if (toolSourceType === ToolSourceType.BUDIBASE) {
    tempToolSource = {
      type: ToolSourceType.BUDIBASE,
      id: "temp",
      auth: {},
      disabledTools: [],
      agentId: "temp",
    }
  } else if (toolSourceType === ToolSourceType.REST_QUERY) {
    tempToolSource = {
      type: ToolSourceType.REST_QUERY,
      id: "temp",
      auth: {},
      disabledTools: [],
      agentId: "temp",
      datasourceId: "",
      queryIds: [],
    }
  } else {
    throw new HTTPError(`Unknown tool source type: ${toolSourceType}`, 400)
  }

  const toolSourceInstance = createToolSourceInstance(tempToolSource)

  if (!toolSourceInstance) {
    throw new HTTPError(
      `Failed to create tool source instance: ${toolSourceType}`,
      400
    )
  }

  const tools = await toolSourceInstance.getToolsAsync()

  ctx.body = tools
}

export async function fetchAgents(ctx: UserCtx<void, FetchAgentsResponse>) {
  const agents = await sdk.ai.agents.fetch()
  ctx.body = { agents }
}

export async function createAgent(
  ctx: UserCtx<CreateAgentRequest, CreateAgentResponse>
) {
  const body = ctx.request.body
  const createdBy = ctx.user?._id!
  const globalId = db.getGlobalIDFromUserMetadataID(createdBy)

  const createRequest: RequiredKeys<CreateAgentRequest> = {
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    promptInstructions: body.promptInstructions,
    goal: body.goal,
    allowedTools: body.allowedTools || [],
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    _deleted: false,
    createdBy: globalId,
  }

  const agent = await sdk.ai.agents.create(createRequest)

  ctx.body = agent
  ctx.status = 201
}

export async function updateAgent(
  ctx: UserCtx<UpdateAgentRequest, UpdateAgentResponse>
) {
  const body = ctx.request.body

  const updateRequest: RequiredKeys<UpdateAgentRequest> = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    promptInstructions: body.promptInstructions,
    goal: body.goal,
    allowedTools: body.allowedTools,
    _deleted: false,
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    createdBy: body.createdBy,
  }

  const agent = await sdk.ai.agents.update(updateRequest)

  ctx.body = agent
  ctx.status = 200
}

export async function deleteAgent(
  ctx: UserCtx<void, { deleted: true }, { agentId: string }>
) {
  const agentId = ctx.params.agentId
  await sdk.ai.agents.remove(agentId ?? "")
  ctx.body = { deleted: true }
  ctx.status = 200
}

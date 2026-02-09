import { db } from "@budibase/backend-core"
import {
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  RequiredKeys,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchTools(ctx: UserCtx<void, ToolMetadata[]>) {
  const rawAiconfigId = ctx.query.aiconfigId

  if (typeof rawAiconfigId !== "string") {
    ctx.throw(400, "Invalid aiconfig ID")
  }
  ctx.body = await sdk.ai.agents.getAvailableToolsMetadata(rawAiconfigId)
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
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    _deleted: false,
    createdBy: globalId,
    enabledTools: body.enabledTools,
    embeddingModel: body.embeddingModel,
    vectorDb: body.vectorDb,
    ragMinDistance: body.ragMinDistance,
    ragTopK: body.ragTopK,
    discordIntegration: body.discordIntegration,
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
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    enabledTools: body.enabledTools,
    embeddingModel: body.embeddingModel,
    vectorDb: body.vectorDb,
    ragMinDistance: body.ragMinDistance,
    ragTopK: body.ragTopK,
    discordIntegration: body.discordIntegration,
  }

  const agent = await sdk.ai.agents.update(updateRequest)

  ctx.body = agent
  ctx.status = 200
}

export async function syncAgentDiscordCommands(
  ctx: UserCtx<
    SyncAgentDiscordCommandsRequest,
    SyncAgentDiscordCommandsResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const {
    applicationId,
    botToken,
    guildId,
    chatAppId: configuredChatAppId,
  } = sdk.ai.deployments.discord.validateDiscordIntegration(agent)

  const requestedChatAppId = ctx.request.body?.chatAppId?.trim()
  const chatApp = await sdk.ai.deployments.discord.resolveChatAppForAgent(
    agentId,
    requestedChatAppId || configuredChatAppId
  )

  await sdk.ai.deployments.discord.syncGuildCommands(
    applicationId,
    botToken,
    guildId
  )

  const interactionsEndpointUrl =
    await sdk.ai.deployments.discord.buildDiscordWebhookUrl(
      chatApp._id!,
      agentId
    )

  await sdk.ai.agents.update({
    ...agent,
    discordIntegration: {
      ...agent.discordIntegration,
      chatAppId: chatApp._id!,
      interactionsEndpointUrl,
    },
  })

  ctx.body = {
    success: true,
    chatAppId: chatApp._id!,
    interactionsEndpointUrl,
    inviteUrl: sdk.ai.deployments.discord.buildDiscordInviteUrl(applicationId),
  }
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

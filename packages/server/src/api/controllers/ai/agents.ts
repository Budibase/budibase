import { db } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  RequiredKeys,
  ToggleAgentDiscordRequest,
  ToggleAgentDiscordResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const DISCORD_SECRET_MASK = "********"

const obfuscateAgentSecrets = (agent: Agent): Agent => {
  if (!agent.discordIntegration) {
    return agent
  }

  return {
    ...agent,
    discordIntegration: {
      ...agent.discordIntegration,
      ...(agent.discordIntegration.publicKey
        ? { publicKey: DISCORD_SECRET_MASK }
        : {}),
      ...(agent.discordIntegration.botToken
        ? { botToken: DISCORD_SECRET_MASK }
        : {}),
    },
  }
}

export async function fetchTools(ctx: UserCtx<void, ToolMetadata[]>) {
  const rawAiconfigId = ctx.query.aiconfigId

  if (typeof rawAiconfigId !== "string") {
    ctx.throw(400, "Invalid aiconfig ID")
  }
  ctx.body = await sdk.ai.agents.getAvailableToolsMetadata(rawAiconfigId)
}

export async function fetchAgents(ctx: UserCtx<void, FetchAgentsResponse>) {
  const agents = await sdk.ai.agents.fetch()
  ctx.body = { agents: agents.map(obfuscateAgentSecrets) }
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

  ctx.body = obfuscateAgentSecrets(agent)
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

  ctx.body = obfuscateAgentSecrets(agent)
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

  const requestedChatAppIdRaw = ctx.request.body?.chatAppId
  const requestedChatAppId =
    typeof requestedChatAppIdRaw === "string"
      ? requestedChatAppIdRaw.trim()
      : undefined
  const chatApp = await sdk.ai.deployments.discord.resolveChatAppForAgent(
    agentId,
    requestedChatAppId || configuredChatAppId
  )

  await sdk.ai.deployments.discord.syncApplicationCommands(
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

export async function toggleAgentDiscordDeployment(
  ctx: UserCtx<
    ToggleAgentDiscordRequest,
    ToggleAgentDiscordResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const { enabled } = ctx.request.body
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  if (enabled) {
    const {
      applicationId,
      botToken,
      guildId,
      chatAppId: configuredChatAppId,
    } = sdk.ai.deployments.discord.validateDiscordIntegration(agent)

    const chatApp = await sdk.ai.deployments.discord.resolveChatAppForAgent(
      agentId,
      configuredChatAppId
    )

    await sdk.ai.deployments.discord.syncApplicationCommands(
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
  } else {
    const chatAppId = agent.discordIntegration?.chatAppId?.trim()

    if (chatAppId) {
      await sdk.ai.deployments.discord.disableAgentOnChatApp(
        chatAppId,
        agentId
      )
    }

    await sdk.ai.agents.update({
      ...agent,
      discordIntegration: {
        ...agent.discordIntegration,
        interactionsEndpointUrl: undefined,
        chatAppId: undefined,
      },
    })
  }

  ctx.body = { success: true, enabled }
  ctx.status = 200
}

export async function duplicateAgent(
  ctx: UserCtx<void, CreateAgentResponse, { agentId: string }>
) {
  const sourceAgent = await sdk.ai.agents.getOrThrow(ctx.params.agentId)

  const createdBy = ctx.user?._id!
  const globalId = db.getGlobalIDFromUserMetadataID(createdBy)
  const duplicated = await sdk.ai.agents.duplicate(sourceAgent, globalId)

  ctx.body = obfuscateAgentSecrets(duplicated)
  ctx.status = 201
}

export async function deleteAgent(
  ctx: UserCtx<void, { deleted: true }, { agentId: string }>
) {
  const agentId = ctx.params.agentId
  await sdk.ai.agents.remove(agentId ?? "")
  ctx.body = { deleted: true }
  ctx.status = 200
}

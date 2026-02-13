import { db, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  ProvisionAgentTeamsChannelRequest,
  ProvisionAgentTeamsChannelResponse,
  RequiredKeys,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const DISCORD_SECRET_MASK = "********"
const TEAMS_SECRET_MASK = "********"

const obfuscateAgentSecrets = (agent: Agent): Agent => {
  return {
    ...agent,
    ...(agent.discordIntegration
      ? {
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
      : {}),
    ...(agent.teamsIntegration
      ? {
          teamsIntegration: {
            ...agent.teamsIntegration,
            ...(agent.teamsIntegration.appPassword
              ? { appPassword: TEAMS_SECRET_MASK }
              : {}),
          },
        }
      : {}),
  }
}

const parseOptionalChatAppId = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

interface ConfiguredDeployment<TValidatedIntegration> {
  chatAppId: string
  endpointUrl: string
  integration: TValidatedIntegration
}

const configureDeploymentChannel = async <
  TValidatedIntegration extends { chatAppId?: string },
>({
  agent,
  agentId,
  requestedChatAppId,
  validateIntegration,
  resolveChatAppForAgent,
  buildEndpointUrl,
  persistIntegration,
  beforeBuildEndpoint,
}: {
  agent: Agent
  agentId: string
  requestedChatAppId?: string
  validateIntegration: (agent: Agent) => TValidatedIntegration
  resolveChatAppForAgent: (
    agentId: string,
    chatAppId?: string
  ) => Promise<{ _id?: string }>
  buildEndpointUrl: (chatAppId: string, agentId: string) => Promise<string>
  persistIntegration: (chatAppId: string, endpointUrl: string) => Promise<void>
  beforeBuildEndpoint?: (integration: TValidatedIntegration) => Promise<void>
}): Promise<ConfiguredDeployment<TValidatedIntegration>> => {
  const integration = validateIntegration(agent)
  const chatApp = await resolveChatAppForAgent(
    agentId,
    requestedChatAppId || integration.chatAppId
  )
  const chatAppId = chatApp._id
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  if (beforeBuildEndpoint) {
    await beforeBuildEndpoint(integration)
  }

  const endpointUrl = await buildEndpointUrl(chatAppId, agentId)
  await persistIntegration(chatAppId, endpointUrl)

  return {
    chatAppId,
    endpointUrl,
    integration,
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
    teamsIntegration: body.teamsIntegration,
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
    teamsIntegration: body.teamsIntegration,
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
  const requestedChatAppId = parseOptionalChatAppId(ctx.request.body?.chatAppId)

  const { chatAppId, endpointUrl, integration } = await configureDeploymentChannel({
    agent,
    agentId,
    requestedChatAppId,
    validateIntegration: sdk.ai.deployments.discord.validateDiscordIntegration,
    resolveChatAppForAgent: sdk.ai.deployments.discord.resolveChatAppForAgent,
    buildEndpointUrl: sdk.ai.deployments.discord.buildDiscordWebhookUrl,
    beforeBuildEndpoint: async ({
      applicationId,
      botToken,
      guildId,
    }) => {
      await sdk.ai.deployments.discord.syncApplicationCommands(
        applicationId,
        botToken,
        guildId
      )
    },
    persistIntegration: async (resolvedChatAppId, interactionsEndpointUrl) => {
      await sdk.ai.agents.update({
        ...agent,
        discordIntegration: {
          ...agent.discordIntegration,
          chatAppId: resolvedChatAppId,
          interactionsEndpointUrl,
        },
      })
    },
  })

  ctx.body = {
    success: true,
    chatAppId,
    interactionsEndpointUrl: endpointUrl,
    inviteUrl: sdk.ai.deployments.discord.buildDiscordInviteUrl(
      integration.applicationId
    ),
  }
  ctx.status = 200
}

export async function provisionAgentTeamsChannel(
  ctx: UserCtx<
    ProvisionAgentTeamsChannelRequest,
    ProvisionAgentTeamsChannelResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const requestedChatAppId = parseOptionalChatAppId(ctx.request.body?.chatAppId)
  const { chatAppId, endpointUrl } = await configureDeploymentChannel({
    agent,
    agentId,
    requestedChatAppId,
    validateIntegration: sdk.ai.deployments.teams.validateTeamsIntegration,
    resolveChatAppForAgent: sdk.ai.deployments.teams.resolveChatAppForAgent,
    buildEndpointUrl: sdk.ai.deployments.teams.buildTeamsWebhookUrl,
    persistIntegration: async (resolvedChatAppId, messagingEndpointUrl) => {
      await sdk.ai.agents.update({
        ...agent,
        teamsIntegration: {
          ...agent.teamsIntegration,
          chatAppId: resolvedChatAppId,
          messagingEndpointUrl,
        },
      })
    },
  })

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
  }
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

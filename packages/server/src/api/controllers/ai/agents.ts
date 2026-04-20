import { db, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  RequiredKeys,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const SECRET_MASK = "********"

const maskSecretFields = <T extends object>(obj: T, fields: (keyof T)[]): T => {
  const result = { ...obj }
  for (const field of fields) {
    if (result[field]) {
      result[field] = SECRET_MASK as T[typeof field]
    }
  }
  return result
}

const obfuscateAgentSecrets = (agent: Agent): Agent => ({
  ...agent,
  ...(agent.discordIntegration && {
    discordIntegration: maskSecretFields(agent.discordIntegration, [
      "publicKey",
      "botToken",
    ]),
  }),
  ...(agent.MSTeamsIntegration && {
    MSTeamsIntegration: maskSecretFields(agent.MSTeamsIntegration, [
      "appPassword",
    ]),
  }),
  ...(agent.slackIntegration && {
    slackIntegration: maskSecretFields(agent.slackIntegration, [
      "botToken",
      "signingSecret",
    ]),
  }),
})

const withoutKnowledgeConfig = <T extends Agent>(agent: T) => {
  const {
    knowledgeSources: _knowledgeSources,
    knowledgeBases: _knowledgeBases,
    ...rest
  } = agent
  return rest
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

type DiscordDeployment = ConfiguredDeployment<
  ReturnType<typeof sdk.ai.deployments.discord.validateDiscordIntegration>
>

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

const persistDiscordDeployment = async ({
  agent,
  chatAppId,
  interactionsEndpointUrl,
}: {
  agent: Agent
  chatAppId?: string
  interactionsEndpointUrl?: string
}) => {
  await sdk.ai.agents.update({
    ...agent,
    discordIntegration: {
      ...agent.discordIntegration,
      chatAppId,
      interactionsEndpointUrl,
    },
  })
}

const persistMSTeamsDeployment = async ({
  agent,
  chatAppId,
  messagingEndpointUrl,
}: {
  agent: Agent
  chatAppId: string
  messagingEndpointUrl: string
}) => {
  await sdk.ai.agents.update({
    ...agent,
    MSTeamsIntegration: {
      ...agent.MSTeamsIntegration,
      chatAppId,
      messagingEndpointUrl,
    },
  })
}

const persistSlackDeployment = async ({
  agent,
  chatAppId,
  messagingEndpointUrl,
}: {
  agent: Agent
  chatAppId: string
  messagingEndpointUrl: string
}) => {
  await sdk.ai.agents.update({
    ...agent,
    slackIntegration: {
      ...agent.slackIntegration,
      chatAppId,
      messagingEndpointUrl,
    },
  })
}

const configureDiscordDeployment = async ({
  agent,
  agentId,
  requestedChatAppId,
}: {
  agent: Agent
  agentId: string
  requestedChatAppId?: string
}): Promise<DiscordDeployment> =>
  await configureDeploymentChannel({
    agent,
    agentId,
    requestedChatAppId,
    validateIntegration: sdk.ai.deployments.discord.validateDiscordIntegration,
    resolveChatAppForAgent: sdk.ai.deployments.discord.resolveChatAppForAgent,
    buildEndpointUrl: sdk.ai.deployments.discord.buildDiscordWebhookUrl,
    beforeBuildEndpoint: async ({ applicationId, botToken, guildId }) => {
      await sdk.ai.deployments.discord.syncApplicationCommands(
        applicationId,
        botToken,
        guildId
      )
    },
    persistIntegration: async (chatAppId, interactionsEndpointUrl) =>
      await persistDiscordDeployment({
        agent,
        chatAppId,
        interactionsEndpointUrl,
      }),
  })

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

  const createRequest: RequiredKeys<
    Parameters<typeof sdk.ai.agents.create>[0]
  > = {
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
    discordIntegration: body.discordIntegration,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
    knowledgeSources: undefined,
    knowledgeBases: undefined,
  }

  const agent = await sdk.ai.agents.create(createRequest)

  ctx.body = withoutKnowledgeConfig(obfuscateAgentSecrets(agent))
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
    publishedAt: undefined,
    enabledTools: body.enabledTools,
    discordIntegration: body.discordIntegration,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
  }

  const agent = await sdk.ai.agents.update(updateRequest)

  ctx.body = withoutKnowledgeConfig(obfuscateAgentSecrets(agent))
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

  const { chatAppId, endpointUrl, integration } =
    await configureDiscordDeployment({
      agent,
      agentId,
      requestedChatAppId,
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

export async function provisionAgentMSTeamsChannel(
  ctx: UserCtx<
    ProvisionAgentMSTeamsChannelRequest,
    ProvisionAgentMSTeamsChannelResponse,
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
    validateIntegration: sdk.ai.deployments.MSTeams.validateMSTeamsIntegration,
    resolveChatAppForAgent: sdk.ai.deployments.MSTeams.resolveChatAppForAgent,
    buildEndpointUrl: sdk.ai.deployments.MSTeams.buildMSTeamsWebhookUrl,
    persistIntegration: async (chatAppId, messagingEndpointUrl) =>
      await persistMSTeamsDeployment({
        agent,
        chatAppId,
        messagingEndpointUrl,
      }),
  })

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
  }
  ctx.status = 200
}

export async function provisionAgentSlackChannel(
  ctx: UserCtx<
    ProvisionAgentSlackChannelRequest,
    ProvisionAgentSlackChannelResponse,
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
    validateIntegration: sdk.ai.deployments.slack.validateSlackIntegration,
    resolveChatAppForAgent: sdk.ai.deployments.slack.resolveChatAppForAgent,
    buildEndpointUrl: sdk.ai.deployments.slack.buildSlackWebhookUrl,
    persistIntegration: async (chatAppId, messagingEndpointUrl) =>
      await persistSlackDeployment({
        agent,
        chatAppId,
        messagingEndpointUrl,
      }),
  })

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
  }
  ctx.status = 200
}

export async function toggleAgentDiscordDeployment(
  ctx: UserCtx<
    ToggleAgentDeploymentRequest,
    ToggleAgentDeploymentResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const { enabled } = ctx.request.body
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  if (enabled) {
    await configureDiscordDeployment({
      agent,
      agentId,
    })
  } else {
    const chatAppId = agent.discordIntegration?.chatAppId?.trim()

    if (chatAppId) {
      await sdk.ai.deployments.shared.disableAgentOnChatApp({
        chatAppId,
        agentId,
      })
    }

    await persistDiscordDeployment({
      agent,
      interactionsEndpointUrl: undefined,
      chatAppId: undefined,
    })
  }

  ctx.body = { success: true, enabled }
  ctx.status = 200
}

export async function toggleAgentMSTeamsDeployment(
  ctx: UserCtx<
    ToggleAgentDeploymentRequest,
    ToggleAgentDeploymentResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const { enabled } = ctx.request.body
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  if (enabled) {
    const requestedChatAppId = parseOptionalChatAppId(
      agent.MSTeamsIntegration?.chatAppId?.trim() || undefined
    )
    await configureDeploymentChannel({
      agent,
      agentId,
      requestedChatAppId,
      validateIntegration:
        sdk.ai.deployments.MSTeams.validateMSTeamsIntegration,
      resolveChatAppForAgent: sdk.ai.deployments.MSTeams.resolveChatAppForAgent,
      buildEndpointUrl: sdk.ai.deployments.MSTeams.buildMSTeamsWebhookUrl,
      persistIntegration: async (chatAppId, messagingEndpointUrl) =>
        await persistMSTeamsDeployment({
          agent,
          chatAppId,
          messagingEndpointUrl,
        }),
    })
  } else {
    const chatAppId = agent.MSTeamsIntegration?.chatAppId?.trim()

    if (chatAppId) {
      await sdk.ai.deployments.shared.disableAgentOnChatApp({
        chatAppId,
        agentId,
      })
    }

    await sdk.ai.agents.update({
      ...agent,
      MSTeamsIntegration: {
        ...agent.MSTeamsIntegration,
        messagingEndpointUrl: undefined,
      },
    })
  }

  ctx.body = { success: true, enabled }
  ctx.status = 200
}

export async function toggleAgentSlackDeployment(
  ctx: UserCtx<
    ToggleAgentDeploymentRequest,
    ToggleAgentDeploymentResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const { enabled } = ctx.request.body
  const agent = await sdk.ai.agents.getOrThrow(agentId)

  if (enabled) {
    const requestedChatAppId = parseOptionalChatAppId(
      agent.slackIntegration?.chatAppId?.trim() || undefined
    )
    await configureDeploymentChannel({
      agent,
      agentId,
      requestedChatAppId,
      validateIntegration: sdk.ai.deployments.slack.validateSlackIntegration,
      resolveChatAppForAgent: sdk.ai.deployments.slack.resolveChatAppForAgent,
      buildEndpointUrl: sdk.ai.deployments.slack.buildSlackWebhookUrl,
      persistIntegration: async (chatAppId, messagingEndpointUrl) =>
        await persistSlackDeployment({
          agent,
          chatAppId,
          messagingEndpointUrl,
        }),
    })
  } else {
    const chatAppId = agent.slackIntegration?.chatAppId?.trim()

    if (chatAppId) {
      await sdk.ai.deployments.shared.disableAgentOnChatApp({
        chatAppId,
        agentId,
      })
    }

    await sdk.ai.agents.update({
      ...agent,
      slackIntegration: {
        ...agent.slackIntegration,
        messagingEndpointUrl: undefined,
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
  await sdk.ai.rag.knowledgeSourceSyncQueue.removeAllAgentJobs(agentId ?? "")
  await sdk.ai.rag.deleteKnowledgeSourceSyncStateForAgent(agentId ?? "")
  await sdk.ai.agents.remove(agentId ?? "")
  ctx.body = { deleted: true }
  ctx.status = 200
}

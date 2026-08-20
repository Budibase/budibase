import {
  cache,
  configs,
  context,
  db,
  HTTPError,
  utils,
} from "@budibase/backend-core"
import {
  Agent,
  CreateAgentSlackAppRequest,
  CreateAgentSlackAppResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  RequiredKeys,
  type ResolvedSlackIntegration,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { apiFileReturn } from "../../../utilities/fileSystem"
import {
  resolveProjectIds,
  resolveUpdatedProjectIds,
} from "../../../utilities/projects"
import { toAgentResponse } from "./agentResponse"

const SLACK_OAUTH_STATE_TTL_SECONDS = 600
const SLACK_OAUTH_CALLBACK_PATH = "/api/agent/slack/oauth/callback"

interface SlackOAuthState {
  agentId: string
  workspaceId: string
}

const getSlackOAuthStateCacheKey = (state: string) =>
  `agent:slack:oauth:state:${state}`

const getSlackOAuthRedirectUrl = async () => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  return `${platformUrl.replace(/\/$/, "")}${SLACK_OAUTH_CALLBACK_PATH}`
}

const buildSlackInstallUrl = ({
  oauthAuthorizeUrl,
  redirectUri,
  state,
}: {
  oauthAuthorizeUrl: string
  redirectUri: string
  state: string
}) => {
  const url = new URL(oauthAuthorizeUrl)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("state", state)
  return url.toString()
}

interface ConfiguredDeployment<TValidatedIntegration> {
  endpointUrl: string
  integration: TValidatedIntegration
}

type SlackDeployment = ConfiguredDeployment<ResolvedSlackIntegration>

const configureDeploymentChannel = async <TValidatedIntegration>({
  agent,
  agentId,
  validateIntegration,
  buildEndpointUrl,
  persistIntegration,
  beforeBuildEndpoint,
}: {
  agent: Agent
  agentId: string
  validateIntegration: (agent: Agent) => TValidatedIntegration
  buildEndpointUrl: (agentId: string) => Promise<string>
  persistIntegration: (endpointUrl: string) => Promise<void>
  beforeBuildEndpoint?: (integration: TValidatedIntegration) => Promise<void>
}): Promise<ConfiguredDeployment<TValidatedIntegration>> => {
  const integration = validateIntegration(agent)

  if (beforeBuildEndpoint) {
    await beforeBuildEndpoint(integration)
  }

  const endpointUrl = await buildEndpointUrl(agentId)
  await persistIntegration(endpointUrl)

  return {
    endpointUrl,
    integration,
  }
}

const persistMSTeamsDeployment = async ({
  agent,
  messagingEndpointUrl,
}: {
  agent: Agent
  messagingEndpointUrl: string
}) => {
  await sdk.ai.agents.update({
    ...agent,
    MSTeamsIntegration: {
      ...agent.MSTeamsIntegration,
      messagingEndpointUrl,
    },
  })
}

const persistSlackDeployment = async ({
  agent,
  messagingEndpointUrl,
}: {
  agent: Agent
  messagingEndpointUrl: string
}) => {
  await sdk.ai.agents.update({
    ...agent,
    slackIntegration: {
      ...agent.slackIntegration,
      messagingEndpointUrl,
    },
  })
}

const configureSlackDeployment = async ({
  agent,
  agentId,
}: {
  agent: Agent
  agentId: string
}): Promise<SlackDeployment> =>
  await configureDeploymentChannel({
    agent,
    agentId,
    validateIntegration: sdk.ai.deployments.slack.validateSlackIntegration,
    buildEndpointUrl: sdk.ai.deployments.slack.buildSlackWebhookUrl,
    persistIntegration: async messagingEndpointUrl =>
      await persistSlackDeployment({
        agent,
        messagingEndpointUrl,
      }),
  })

const configureSlackAppCreationDeployment = async (agentId: string) => {
  const messagingEndpointUrl =
    await sdk.ai.deployments.slack.buildSlackWebhookUrl(agentId)

  return {
    messagingEndpointUrl,
  }
}

const getPublishedLiveSlackDeployment = async ({
  agent,
  agentId,
  workspaceId,
}: {
  agent: Agent
  agentId: string
  workspaceId: string
}) => {
  if (!agent.live) {
    return undefined
  }

  const prodWorkspaceId = db.getProdWorkspaceID(workspaceId)
  const isPublished = await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)
  if (!isPublished) {
    return undefined
  }

  return await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const prodAgent = await context.getWorkspaceDB().tryGet<Agent>(agentId)
    if (!prodAgent) {
      return undefined
    }

    return await configureSlackAppCreationDeployment(agentId)
  })
}

const publishSlackIntegrationForLiveAgent = async (agent: Agent) => {
  if (!agent.live || !agent._id || !agent.slackIntegration) {
    return
  }

  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }

  const prodWorkspaceId = db.getProdWorkspaceID(workspaceId)
  const isPublished = await sdk.workspaces.isWorkspacePublished(prodWorkspaceId)
  if (!isPublished) {
    return
  }

  await context.doInWorkspaceContext(prodWorkspaceId, async () => {
    const prodAgent = await context.getWorkspaceDB().tryGet<Agent>(agent._id!)
    if (!prodAgent) {
      return
    }

    const { messagingEndpointUrl } = await configureSlackAppCreationDeployment(
      agent._id!
    )

    await sdk.ai.agents.update({
      ...prodAgent,
      slackIntegration: {
        ...prodAgent.slackIntegration,
        appId: agent.slackIntegration?.appId,
        clientId: agent.slackIntegration?.clientId,
        clientSecret: agent.slackIntegration?.clientSecret,
        signingSecret: agent.slackIntegration?.signingSecret,
        messagingEndpointUrl,
        botToken: agent.slackIntegration?.botToken,
        botUserId: agent.slackIntegration?.botUserId,
        teamId: agent.slackIntegration?.teamId,
        teamName: agent.slackIntegration?.teamName,
      },
    })
  })
}

const toSafeFilenameSegment = (value: string) => {
  const safe = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return safe || "agent"
}

export async function fetchTools(ctx: UserCtx<void, ToolMetadata[]>) {
  ctx.body = await sdk.ai.agents.getAvailableToolsMetadata()
}

export async function fetchAgents(ctx: UserCtx<void, FetchAgentsResponse>) {
  const agents = await sdk.ai.agents.fetch()
  ctx.body = { agents: agents.map(toAgentResponse) }
}

export async function createAgent(
  ctx: UserCtx<CreateAgentRequest, CreateAgentResponse>
) {
  const body = ctx.request.body
  const createdBy = ctx.user?._id!
  const globalId = db.getGlobalIDFromUserMetadataID(createdBy)
  const projectIds = await resolveProjectIds(body.projectIds)

  const createRequest: Parameters<typeof sdk.ai.agents.create>[number] = {
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    projectIds,
    goal: body.goal,
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    _deleted: false,
    createdBy: globalId,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
  }

  const agent = await sdk.ai.agents.create(createRequest)

  ctx.body = toAgentResponse(agent)
  ctx.status = 201
}

export async function updateAgent(
  ctx: UserCtx<UpdateAgentRequest, UpdateAgentResponse>
) {
  const body = ctx.request.body
  const existing = await sdk.ai.agents.getOrThrow(body._id)
  const projectIds = await resolveUpdatedProjectIds(
    body.projectIds,
    existing.projectIds
  )

  const updateRequest: RequiredKeys<UpdateAgentRequest> = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    description: body.description,
    aiconfig: body.aiconfig,
    projectIds,
    goal: body.goal,
    icon: body.icon,
    iconColor: body.iconColor,
    live: body.live,
    publishedAt: undefined,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
  }

  const agent = await sdk.ai.agents.update({
    ...existing,
    ...updateRequest,
  })

  ctx.body = toAgentResponse(agent)
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
  const { endpointUrl } = await configureDeploymentChannel({
    agent,
    agentId,
    validateIntegration: sdk.ai.deployments.MSTeams.validateMSTeamsIntegration,
    buildEndpointUrl: sdk.ai.deployments.MSTeams.buildMSTeamsWebhookUrl,
    persistIntegration: async messagingEndpointUrl =>
      await persistMSTeamsDeployment({
        agent,
        messagingEndpointUrl,
      }),
  })

  ctx.body = {
    success: true,
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
  const { endpointUrl } = await configureSlackDeployment({
    agent,
    agentId,
  })

  ctx.body = {
    success: true,
    messagingEndpointUrl: endpointUrl,
  }
  ctx.status = 200
}

export async function downloadAgentSlackManifest(
  ctx: UserCtx<void, ReturnType<typeof apiFileReturn>, { agentId: string }>
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const { messagingEndpointUrl } =
    await configureSlackAppCreationDeployment(agentId)
  await persistSlackDeployment({
    agent,
    messagingEndpointUrl,
  })
  const manifest = sdk.ai.deployments.slack.buildSlackManifest({
    agent,
    messagingEndpointUrl,
  })
  const filename = `budibase-slack-${toSafeFilenameSegment(agent.name)}-manifest.json`

  ctx.attachment(filename)
  ctx.type = "application/json"
  ctx.body = apiFileReturn(`${JSON.stringify(manifest, null, 2)}\n`)
  ctx.status = 200
}

export async function createAgentSlackApp(
  ctx: UserCtx<
    CreateAgentSlackAppRequest,
    CreateAgentSlackAppResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }

  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const devDeployment = await configureSlackAppCreationDeployment(agentId)
  const liveDeployment = await getPublishedLiveSlackDeployment({
    agent,
    agentId,
    workspaceId,
  })
  const slackAppDeployment = liveDeployment || devDeployment
  const oauthRedirectUrl = await getSlackOAuthRedirectUrl()
  const manifest = sdk.ai.deployments.slack.buildSlackManifest({
    agent,
    messagingEndpointUrl: slackAppDeployment.messagingEndpointUrl,
    oauthRedirectUrl,
  })
  const created = await sdk.ai.deployments.slack.createSlackAppFromManifest({
    configToken: await sdk.ai.slackAppConfig.fetchConfigToken(),
    manifest,
  })

  const clientId = created.credentials?.client_id?.trim()
  const clientSecret = created.credentials?.client_secret?.trim()
  const signingSecret = created.credentials?.signing_secret?.trim()
  const appId = created.app_id?.trim()
  const oauthAuthorizeUrl = created.oauth_authorize_url?.trim()
  if (
    !clientId ||
    !clientSecret ||
    !signingSecret ||
    !appId ||
    !oauthAuthorizeUrl
  ) {
    throw new HTTPError("Slack app creation response was incomplete", 400)
  }

  const state = utils.newid()
  await cache.store(
    getSlackOAuthStateCacheKey(state),
    {
      agentId,
      workspaceId,
    } satisfies SlackOAuthState,
    SLACK_OAUTH_STATE_TTL_SECONDS,
    { useTenancy: false }
  )

  await sdk.ai.agents.update({
    ...agent,
    slackIntegration: {
      ...agent.slackIntegration,
      appId,
      clientId,
      clientSecret,
      signingSecret,
      messagingEndpointUrl: devDeployment.messagingEndpointUrl,
    },
  })

  ctx.body = {
    success: true,
    appId,
    messagingEndpointUrl: slackAppDeployment.messagingEndpointUrl,
    oauthAuthorizeUrl: buildSlackInstallUrl({
      oauthAuthorizeUrl,
      redirectUri: oauthRedirectUrl,
      state,
    }),
  }
  ctx.status = 200
}

export async function completeSlackOAuth(ctx: UserCtx<void, void>) {
  const state = String(ctx.query.state || "").trim()
  if (!state) {
    throw new Error("Slack OAuth callback is missing state")
  }

  const cacheKey = getSlackOAuthStateCacheKey(state)
  const statePayload = (await cache.get(cacheKey, {
    useTenancy: false,
  })) as SlackOAuthState | undefined
  await cache.destroy(cacheKey, { useTenancy: false })
  if (!statePayload?.agentId || !statePayload.workspaceId) {
    throw new Error("Slack OAuth state is invalid or expired")
  }

  const oauthError = String(ctx.query.error || "").trim()
  if (oauthError) {
    throw new Error("Slack OAuth authorization failed")
  }

  const code = String(ctx.query.code || "").trim()
  if (!code) {
    throw new Error("Slack OAuth callback is missing the authorization code")
  }

  await context.doInWorkspaceContext(statePayload.workspaceId, async () => {
    const agent = await sdk.ai.agents.getOrThrow(statePayload.agentId)
    const clientId = agent.slackIntegration?.clientId?.trim()
    const clientSecret = agent.slackIntegration?.clientSecret?.trim()
    if (!clientId || !clientSecret) {
      throw new Error("Slack OAuth client credentials are not configured")
    }

    const redirectUri = await getSlackOAuthRedirectUrl()
    const token = await sdk.ai.deployments.slack.exchangeSlackOAuthCode({
      code,
      clientId,
      clientSecret,
      redirectUri,
    })
    const botToken = token.access_token?.trim()
    if (!botToken) {
      throw new Error("Slack OAuth response did not include a bot token")
    }

    const updatedAgent = await sdk.ai.agents.update({
      ...agent,
      slackIntegration: {
        ...agent.slackIntegration,
        appId: token.app_id?.trim() || agent.slackIntegration?.appId,
        botToken,
        botUserId: token.bot_user_id?.trim() || undefined,
        teamId: token.team?.id?.trim() || undefined,
        teamName: token.team?.name?.trim() || undefined,
      },
    })
    await publishSlackIntegrationForLiveAgent(updatedAgent)
  })

  ctx.redirect(
    `/builder/workspace/${statePayload.workspaceId}/agent/${statePayload.agentId}/deployment?slack_connected=1`
  )
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
    await configureDeploymentChannel({
      agent,
      agentId,
      validateIntegration:
        sdk.ai.deployments.MSTeams.validateMSTeamsIntegration,
      buildEndpointUrl: sdk.ai.deployments.MSTeams.buildMSTeamsWebhookUrl,
      persistIntegration: async messagingEndpointUrl =>
        await persistMSTeamsDeployment({
          agent,
          messagingEndpointUrl,
        }),
    })
  } else {
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
    await configureDeploymentChannel({
      agent,
      agentId,
      validateIntegration: sdk.ai.deployments.slack.validateSlackIntegration,
      buildEndpointUrl: sdk.ai.deployments.slack.buildSlackWebhookUrl,
      persistIntegration: async messagingEndpointUrl =>
        await persistSlackDeployment({
          agent,
          messagingEndpointUrl,
        }),
    })
  } else {
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

  ctx.body = toAgentResponse(duplicated)
  ctx.status = 201
}

export async function deleteAgent(
  ctx: UserCtx<void, { deleted: true }, { agentId: string }>
) {
  const agentId = ctx.params.agentId
  await sdk.ai.rag.knowledgeSourceSyncQueue.removeAllAgentJobs(agentId)
  await sdk.ai.rag.deleteKnowledgeSourceSyncStateForAgent(agentId)
  await sdk.ai.agents.remove(agentId ?? "")
  ctx.body = { deleted: true }
  ctx.status = 200
}

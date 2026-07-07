import archiver from "archiver"
import stream from "stream"

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
  CreateAgentMSTeamsAppRequest,
  CreateAgentMSTeamsAppResponse,
  CreateAgentSlackAppRequest,
  CreateAgentSlackAppResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentTelegramChannelRequest,
  ProvisionAgentTelegramChannelResponse,
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
import { apiFileReturn } from "../../../utilities/fileSystem"
import {
  resolveProjectIds,
  resolveUpdatedProjectIds,
} from "../../../utilities/projects"
import { toAgentResponse } from "./agentResponse"

const SLACK_OAUTH_STATE_TTL_SECONDS = 600
const SLACK_OAUTH_CALLBACK_PATH = "/api/agent/slack/oauth/callback"

const TEAMS_COLOR_ICON = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAACF0lEQVR4nO3ToQEAIAzAMG7kEv4344yJRsTX9Lw7A1VnOwA2GYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaQYgzQCkGYA0A5BmANIMQJoBSDMAaR+ikxc1i9nMKQAAAABJRU5ErkJggg==",
  "base64"
)
const TEAMS_OUTLINE_ICON = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAKUlEQVR4nO3OIQEAAAACIP+f1hkWWEB6FgEBAQEBAQEBAQEBAQEBgXdgl/rw4unIZ5cAAAAASUVORK5CYII=",
  "base64"
)

interface SlackOAuthState {
  agentId: string
  workspaceId: string
  chatAppId: string
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

type SlackDeployment = ConfiguredDeployment<
  ReturnType<typeof sdk.ai.deployments.slack.validateSlackIntegration>
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

const persistTelegramDeployment = async ({
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
    telegramIntegration: {
      ...agent.telegramIntegration,
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

const configureSlackDeployment = async ({
  agent,
  agentId,
  requestedChatAppId,
}: {
  agent: Agent
  agentId: string
  requestedChatAppId?: string
}): Promise<SlackDeployment> =>
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

const configureMSTeamsDeployment = async ({
  agent,
  agentId,
  requestedChatAppId,
}: {
  agent: Agent
  agentId: string
  requestedChatAppId?: string
}) =>
  await configureDeploymentChannel({
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

const configureSlackAppCreationDeployment = async ({
  agent,
  agentId,
}: {
  agent: Agent
  agentId: string
}) => {
  const chatApp = await sdk.ai.deployments.slack.resolveChatAppForAgent(
    agentId,
    agent.slackIntegration?.chatAppId
  )
  const chatAppId = chatApp._id
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const messagingEndpointUrl =
    await sdk.ai.deployments.slack.buildSlackWebhookUrl(chatAppId, agentId)

  return {
    chatAppId,
    messagingEndpointUrl,
  }
}

const configureMSTeamsAppCreationDeployment = async ({
  agent,
  agentId,
}: {
  agent: Agent
  agentId: string
}) => {
  const chatApp = await sdk.ai.deployments.MSTeams.resolveChatAppForAgent(
    agentId,
    agent.MSTeamsIntegration?.chatAppId
  )
  const chatAppId = chatApp._id
  if (!chatAppId) {
    throw new HTTPError("chatAppId is required", 400)
  }

  const messagingEndpointUrl =
    await sdk.ai.deployments.MSTeams.buildMSTeamsWebhookUrl(chatAppId, agentId)

  return {
    chatAppId,
    messagingEndpointUrl,
  }
}

const toSafeFilenameSegment = (value: string) => {
  const safe = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return safe || "agent"
}

const toSafeTeamsPackageName = (agent: Agent) =>
  `budibase-teams-${toSafeFilenameSegment(agent.name)}-package.zip`

export async function fetchTools(ctx: UserCtx<void, ToolMetadata[]>) {
  const rawAiconfigId = ctx.query.aiconfigId

  if (typeof rawAiconfigId !== "string") {
    ctx.throw(400, "Invalid aiconfig ID")
  }
  ctx.body = await sdk.ai.agents.getAvailableToolsMetadata(rawAiconfigId)
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
    discordIntegration: body.discordIntegration,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
    telegramIntegration: body.telegramIntegration,
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
    discordIntegration: body.discordIntegration,
    MSTeamsIntegration: body.MSTeamsIntegration,
    slackIntegration: body.slackIntegration,
    telegramIntegration: body.telegramIntegration,
  }

  const agent = await sdk.ai.agents.update({
    ...existing,
    ...updateRequest,
  })

  ctx.body = toAgentResponse(agent)
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
  const { chatAppId, endpointUrl } = await configureMSTeamsDeployment({
    agent,
    agentId,
    requestedChatAppId,
  })

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
  }
  ctx.status = 200
}

export async function downloadAgentMSTeamsPackage(
  ctx: UserCtx<void, stream.PassThrough, { agentId: string }>
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const requestedChatAppId = parseOptionalChatAppId(
    agent.MSTeamsIntegration?.chatAppId?.trim() || undefined
  )
  const { endpointUrl } = await configureMSTeamsDeployment({
    agent,
    agentId,
    requestedChatAppId,
  })
  const manifest = sdk.ai.deployments.MSTeams.buildMSTeamsManifest({
    agent,
    messagingEndpointUrl: endpointUrl,
  })

  const passThrough = new stream.PassThrough()
  const archive = archiver.create("zip")
  archive.pipe(passThrough)
  archive.append(`${JSON.stringify(manifest, null, 2)}\n`, {
    name: "manifest.json",
  })
  archive.append(TEAMS_COLOR_ICON, { name: "color.png" })
  archive.append(TEAMS_OUTLINE_ICON, { name: "outline.png" })

  ctx.attachment(toSafeTeamsPackageName(agent))
  ctx.type = "zip"
  ctx.body = passThrough
  await archive.finalize()
  ctx.status = 200
}

export async function createAgentMSTeamsApp(
  ctx: UserCtx<
    CreateAgentMSTeamsAppRequest,
    CreateAgentMSTeamsAppResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const body = ctx.request.body || {}
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const config = await sdk.ai.msTeamsAppConfig.fetchConfig()
  const { chatAppId, messagingEndpointUrl } =
    await configureMSTeamsAppCreationDeployment({
      agent,
      agentId,
    })
  const created = await sdk.ai.deployments.MSTeams.createMSTeamsAppResources({
    agent,
    config,
    messagingEndpointUrl,
  })

  await sdk.ai.agents.update({
    ...agent,
    MSTeamsIntegration: {
      ...agent.MSTeamsIntegration,
      appId: created.appId,
      appPassword: created.appPassword,
      tenantId: created.tenantId,
      teamId: parseOptionalChatAppId(body.teamId),
      idleTimeoutMinutes: body.idleTimeoutMinutes,
      requireUserLink: body.requireUserLink,
      chatAppId,
      messagingEndpointUrl,
    },
  })

  ctx.body = {
    success: true,
    chatAppId,
    appId: created.appId,
    tenantId: created.tenantId,
    messagingEndpointUrl,
    packageAvailable: true,
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
  const { chatAppId, endpointUrl } = await configureSlackDeployment({
    agent,
    agentId,
    requestedChatAppId,
  })

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
  }
  ctx.status = 200
}

export async function downloadAgentSlackManifest(
  ctx: UserCtx<void, ReturnType<typeof apiFileReturn>, { agentId: string }>
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const requestedChatAppId = parseOptionalChatAppId(
    agent.slackIntegration?.chatAppId?.trim() || undefined
  )
  const { endpointUrl } = await configureSlackDeployment({
    agent,
    agentId,
    requestedChatAppId,
  })
  const manifest = sdk.ai.deployments.slack.buildSlackManifest({
    agent,
    messagingEndpointUrl: endpointUrl,
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
  const { chatAppId, messagingEndpointUrl } =
    await configureSlackAppCreationDeployment({
      agent,
      agentId,
    })
  const oauthRedirectUrl = await getSlackOAuthRedirectUrl()
  const manifest = sdk.ai.deployments.slack.buildSlackManifest({
    agent,
    messagingEndpointUrl,
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
      chatAppId,
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
      chatAppId,
      messagingEndpointUrl,
    },
  })

  ctx.body = {
    success: true,
    chatAppId,
    appId,
    messagingEndpointUrl,
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

    await sdk.ai.agents.update({
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
  })

  ctx.redirect(
    `/builder/workspace/${statePayload.workspaceId}/agent/${statePayload.agentId}/deployment?slack_connected=1`
  )
}

export async function provisionAgentTelegramChannel(
  ctx: UserCtx<
    ProvisionAgentTelegramChannelRequest,
    ProvisionAgentTelegramChannelResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const requestedChatAppId = parseOptionalChatAppId(ctx.request.body?.chatAppId)
  const { chatAppId, endpointUrl, integration } =
    await configureDeploymentChannel({
      agent,
      agentId,
      requestedChatAppId,
      validateIntegration:
        sdk.ai.deployments.telegram.validateTelegramIntegration,
      resolveChatAppForAgent:
        sdk.ai.deployments.telegram.resolveChatAppForAgent,
      buildEndpointUrl: sdk.ai.deployments.telegram.buildTelegramWebhookUrl,
      persistIntegration: async (chatAppId, messagingEndpointUrl) =>
        await persistTelegramDeployment({
          agent,
          chatAppId,
          messagingEndpointUrl,
        }),
    })

  let warning: string | undefined
  try {
    await sdk.ai.deployments.telegram.setTelegramWebhook({
      botToken: integration.botToken,
      webhookUrl: endpointUrl,
      secretToken: integration.webhookSecretToken,
    })
  } catch (error: any) {
    warning = error.message || "Failed to register webhook with Telegram"
  }

  ctx.body = {
    success: true,
    chatAppId,
    messagingEndpointUrl: endpointUrl,
    ...(warning ? { warning } : {}),
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

export async function toggleAgentTelegramDeployment(
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
      agent.telegramIntegration?.chatAppId?.trim() || undefined
    )
    const { endpointUrl, integration } = await configureDeploymentChannel({
      agent,
      agentId,
      requestedChatAppId,
      validateIntegration:
        sdk.ai.deployments.telegram.validateTelegramIntegration,
      resolveChatAppForAgent:
        sdk.ai.deployments.telegram.resolveChatAppForAgent,
      buildEndpointUrl: sdk.ai.deployments.telegram.buildTelegramWebhookUrl,
      persistIntegration: async (chatAppId, messagingEndpointUrl) =>
        await persistTelegramDeployment({
          agent,
          chatAppId,
          messagingEndpointUrl,
        }),
    })

    await sdk.ai.deployments.telegram.setTelegramWebhook({
      botToken: integration.botToken,
      webhookUrl: endpointUrl,
      secretToken: integration.webhookSecretToken,
    })
  } else {
    const chatAppId = agent.telegramIntegration?.chatAppId?.trim()

    if (chatAppId) {
      await sdk.ai.deployments.shared.disableAgentOnChatApp({
        chatAppId,
        agentId,
      })
    }

    await sdk.ai.agents.update({
      ...agent,
      telegramIntegration: {
        ...agent.telegramIntegration,
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

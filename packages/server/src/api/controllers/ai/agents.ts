import { configs, context, db, HTTPError } from "@budibase/backend-core"
import {
  ChatApp,
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
import fetch from "node-fetch"
import sdk from "../../../sdk"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const COMMAND_NAME_REGEX = /^[a-z0-9_-]{1,32}$/

const normalizeCommandName = (value: string | undefined, fallback: string) => {
  const candidate = (value || fallback).trim().toLowerCase()
  if (!COMMAND_NAME_REGEX.test(candidate)) {
    throw new HTTPError(
      `Invalid command name "${candidate}". Use lowercase letters, numbers, hyphens, or underscores (max 32 chars).`,
      400
    )
  }
  return candidate
}

const validateDiscordIntegration = (agent: UpdateAgentResponse) => {
  const integration = agent.discordIntegration
  if (!integration) {
    throw new HTTPError(
      "Discord integration is not configured for this agent",
      400
    )
  }

  const applicationId = integration.applicationId?.trim()
  const botToken = integration.botToken?.trim()
  const guildId = integration.guildId?.trim()

  if (!applicationId || !botToken || !guildId) {
    throw new HTTPError(
      "Discord integration requires applicationId, botToken, and guildId",
      400
    )
  }

  return {
    applicationId,
    botToken,
    guildId,
    askCommandName: normalizeCommandName(integration.askCommandName, "ask"),
    newCommandName: normalizeCommandName(integration.newCommandName, "new"),
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

const enableAgentOnChatApp = async (chatApp: ChatApp, agentId: string) => {
  const agents = chatApp.agents || []
  const existing = agents.find(e => e.agentId === agentId)
  if (existing?.isEnabled) {
    return chatApp
  }

  const updatedAgents = existing
    ? agents.map(e => (e.agentId === agentId ? { ...e, isEnabled: true } : e))
    : [...agents, { agentId, isEnabled: true, isDefault: false }]

  return await sdk.ai.chatApps.update({ ...chatApp, agents: updatedAgents })
}

const resolveChatAppForAgent = async (agentId: string, chatAppId?: string) => {
  if (chatAppId) {
    const app = await sdk.ai.chatApps.getOrThrow(chatAppId)
    return await enableAgentOnChatApp(app, agentId)
  }

  const existing = await sdk.ai.chatApps.getSingle()
  if (existing) {
    return await enableAgentOnChatApp(existing, agentId)
  }

  return await sdk.ai.chatApps.create({
    agents: [{ agentId, isEnabled: true, isDefault: false }],
  })
}

const buildDiscordWebhookUrl = async (chatAppId: string, agentId: string) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/discord/${workspaceId}/${chatAppId}/${agentId}`
}

const buildDiscordInviteUrl = (applicationId: string) =>
  `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=bot+applications.commands&permissions=0`

const syncGuildCommands = async (
  applicationId: string,
  botToken: string,
  guildId: string,
  askCommandName: string,
  newCommandName: string
) => {
  const url = `${DISCORD_API_BASE_URL}/applications/${applicationId}/guilds/${guildId}/commands`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        name: askCommandName,
        description: "Ask the configured Budibase agent",
        options: [
          {
            type: 3,
            name: "message",
            description: "Message to send to the agent",
            required: true,
          },
        ],
      },
      {
        name: newCommandName,
        description: "Start a new conversation with the configured agent",
        options: [
          {
            type: 3,
            name: "message",
            description: "Optional opening message",
            required: false,
          },
        ],
      },
    ]),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new HTTPError(
      `Discord command sync failed (${response.status}): ${body || response.statusText}`,
      400
    )
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
    askCommandName,
    newCommandName,
    chatAppId: configuredChatAppId,
  } = validateDiscordIntegration(agent)

  const requestedChatAppId = ctx.request.body?.chatAppId?.trim()
  const chatApp = await resolveChatAppForAgent(
    agentId,
    requestedChatAppId || configuredChatAppId
  )

  await syncGuildCommands(
    applicationId,
    botToken,
    guildId,
    askCommandName,
    newCommandName
  )

  ctx.body = {
    success: true,
    chatAppId: chatApp._id!,
    interactionsEndpointUrl: await buildDiscordWebhookUrl(
      chatApp._id!,
      agentId
    ),
    inviteUrl: buildDiscordInviteUrl(applicationId),
    askCommandName,
    newCommandName,
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

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
const DEFAULT_ASK_COMMAND_NAME = "ask"
const DEFAULT_NEW_COMMAND_NAME = "new"

const normalizeCommandName = (value: string | undefined, fallback: string) => {
  const candidate = (value || fallback).trim().toLowerCase()
  if (!candidate) {
    return fallback
  }
  if (!/^[a-z0-9_-]{1,32}$/.test(candidate)) {
    throw new HTTPError(
      `Invalid command name "${candidate}". Use lowercase letters, numbers, hyphens, or underscores (max 32 chars).`,
      400
    )
  }
  return candidate
}

const validateDiscordIntegration = (
  agent: UpdateAgentResponse
): {
  applicationId: string
  botToken: string
  guildId: string
  askCommandName: string
  newCommandName: string
  chatAppId?: string
} => {
  const integration = agent.discordIntegration
  if (!integration) {
    throw new HTTPError("Discord integration is not configured for this agent", 400)
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
    askCommandName: normalizeCommandName(
      integration.askCommandName,
      DEFAULT_ASK_COMMAND_NAME
    ),
    newCommandName: normalizeCommandName(
      integration.newCommandName,
      DEFAULT_NEW_COMMAND_NAME
    ),
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

const ensureAgentEnabledOnChatApp = async ({
  chatApp,
  agentId,
}: {
  chatApp: ChatApp
  agentId: string
}) => {
  const existingAgents = chatApp.agents || []
  const existing = existingAgents.find(entry => entry.agentId === agentId)
  if (existing && existing.isEnabled) {
    return chatApp
  }

  const nextAgents = existing
    ? existingAgents.map(entry =>
        entry.agentId === agentId ? { ...entry, isEnabled: true } : entry
      )
    : [
        ...existingAgents,
        {
          agentId,
          isEnabled: true,
          isDefault: false,
        },
      ]

  return await sdk.ai.chatApps.update({
    ...chatApp,
    agents: nextAgents,
  })
}

const resolveChatAppForAgent = async ({
  agentId,
  configuredChatAppId,
}: {
  agentId: string
  configuredChatAppId?: string
}) => {
  if (configuredChatAppId) {
    const existing = await sdk.ai.chatApps.getOrThrow(configuredChatAppId)
    return await ensureAgentEnabledOnChatApp({ chatApp: existing, agentId })
  }

  const existing = await sdk.ai.chatApps.getSingle()
  if (existing) {
    return await ensureAgentEnabledOnChatApp({ chatApp: existing, agentId })
  }

  const created = await sdk.ai.chatApps.create({
    agents: [
      {
        agentId,
        isEnabled: true,
        isDefault: false,
      },
    ],
  })
  return created
}

const buildDiscordWebhookUrl = async ({
  chatAppId,
  agentId,
}: {
  chatAppId: string
  agentId: string
}) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/discord/${workspaceId}/${chatAppId}/${agentId}`
}

const buildDiscordInviteUrl = (applicationId: string) => {
  const params = new URLSearchParams({
    client_id: applicationId,
    scope: "bot applications.commands",
    permissions: "0",
  })
  return `https://discord.com/oauth2/authorize?${params.toString()}`
}

const syncGuildCommands = async ({
  applicationId,
  botToken,
  guildId,
  askCommandName,
  newCommandName,
}: {
  applicationId: string
  botToken: string
  guildId: string
  askCommandName: string
  newCommandName: string
}) => {
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
  const agentId = ctx.params.agentId
  const agent = await sdk.ai.agents.getOrThrow(agentId)
  const integration = validateDiscordIntegration(agent)
  const requestedChatAppId = ctx.request.body?.chatAppId?.trim()
  const chatApp = await resolveChatAppForAgent({
    agentId,
    configuredChatAppId: requestedChatAppId || integration.chatAppId,
  })

  await syncGuildCommands({
    applicationId: integration.applicationId,
    botToken: integration.botToken,
    guildId: integration.guildId,
    askCommandName: integration.askCommandName,
    newCommandName: integration.newCommandName,
  })

  const interactionsEndpointUrl = await buildDiscordWebhookUrl({
    chatAppId: chatApp._id!,
    agentId,
  })

  ctx.body = {
    success: true,
    chatAppId: chatApp._id!,
    interactionsEndpointUrl,
    inviteUrl: buildDiscordInviteUrl(integration.applicationId),
    askCommandName: integration.askCommandName,
    newCommandName: integration.newCommandName,
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

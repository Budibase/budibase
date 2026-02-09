import crypto from "crypto"
import fetch from "node-fetch"
import {
  configs,
  context,
  db as dbCore,
  HTTPError,
} from "@budibase/backend-core"
import type {
  Agent,
  ChatApp,
  ResolvedDiscordIntegration,
} from "@budibase/types"
import * as agents from "../agents"
import * as chatApps from "../chatApps"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const DISCORD_DEFAULT_SIGNATURE_MAX_AGE_SECONDS = 300
export const DISCORD_ASK_COMMAND = "ask"
export const DISCORD_NEW_COMMAND = "new"

export const validateDiscordIntegration = (
  agent: Agent
): ResolvedDiscordIntegration => {
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
    chatAppId: integration.chatAppId?.trim() || undefined,
  }
}

const enableAgentOnChatApp = async (chatApp: ChatApp, agentId: string) => {
  const existingAgents = chatApp.agents || []
  const existing = existingAgents.find(agent => agent.agentId === agentId)
  if (existing?.isEnabled) {
    return chatApp
  }

  const updatedAgents = existing
    ? existingAgents.map(agent =>
        agent.agentId === agentId ? { ...agent, isEnabled: true } : agent
      )
    : [...existingAgents, { agentId, isEnabled: true, isDefault: false }]

  return await chatApps.update({ ...chatApp, agents: updatedAgents })
}

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) => {
  if (chatAppId) {
    const app = await chatApps.getOrThrow(chatAppId)
    return await enableAgentOnChatApp(app, agentId)
  }

  const existing = await chatApps.getSingle()
  if (existing) {
    return await enableAgentOnChatApp(existing, agentId)
  }

  return await chatApps.create({
    agents: [{ agentId, isEnabled: true, isDefault: false }],
  })
}

export const buildDiscordWebhookUrl = async (
  chatAppId: string,
  agentId: string
) => {
  const platformUrl = await configs.getPlatformUrl({ tenantAware: true })
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new HTTPError("workspaceId is required", 400)
  }
  return `${platformUrl.replace(/\/$/, "")}/api/webhooks/discord/${workspaceId}/${chatAppId}/${agentId}`
}

export const buildDiscordInviteUrl = (applicationId: string) =>
  `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=bot+applications.commands&permissions=0`

export const syncGuildCommands = async (
  applicationId: string,
  botToken: string,
  guildId: string
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
        name: DISCORD_ASK_COMMAND,
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
        name: DISCORD_NEW_COMMAND,
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

export const verifyDiscordSignature = ({
  publicKey,
  signature,
  timestamp,
  rawBody,
}: {
  publicKey: string
  signature: string
  timestamp: string
  rawBody: string
}) => {
  try {
    const derPrefix = "302a300506032b6570032100"
    const publicKeyObject = crypto.createPublicKey({
      key: Buffer.from(`${derPrefix}${publicKey}`, "hex"),
      format: "der",
      type: "spki",
    })
    return crypto.verify(
      null,
      new Uint8Array(Buffer.from(`${timestamp}${rawBody}`)),
      publicKeyObject,
      new Uint8Array(Buffer.from(signature, "hex"))
    )
  } catch {
    return false
  }
}

const getDiscordSignatureMaxAgeMs = () => {
  const configured = Number(process.env.DISCORD_SIGNATURE_MAX_AGE_SECONDS)
  const seconds =
    Number.isFinite(configured) && configured > 0
      ? configured
      : DISCORD_DEFAULT_SIGNATURE_MAX_AGE_SECONDS
  return seconds * 1000
}

export const isDiscordTimestampFresh = (
  timestamp: string,
  nowMs = Date.now()
) => {
  const parsed = Number(timestamp)
  if (!Number.isFinite(parsed)) {
    return false
  }
  const timestampMs = parsed * 1000
  return Math.abs(nowMs - timestampMs) <= getDiscordSignatureMaxAgeMs()
}

export const getDiscordPublicKeyForRoute = async ({
  instance,
  agentId,
}: {
  instance: string
  agentId: string
}) => {
  const prodAppId = dbCore.getProdWorkspaceID(instance)
  return await context.doInWorkspaceContext(prodAppId, async () => {
    const agent = await agents.getOrThrow(agentId)
    const publicKey = agent.discordIntegration?.publicKey?.trim()
    if (!publicKey) {
      throw new HTTPError(
        "Discord public key is not configured for this agent",
        400
      )
    }
    return publicKey
  })
}

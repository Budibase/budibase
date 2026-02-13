import crypto from "crypto"
import fetch from "node-fetch"
import { context, db as dbCore, HTTPError } from "@budibase/backend-core"
import { DiscordCommands } from "@budibase/shared-core"
import type { Agent, ResolvedDiscordIntegration } from "@budibase/types"
import * as agents from "../agents"
import * as shared from "./shared"

const DISCORD_API_BASE_URL = "https://discord.com/api/v10"
const DISCORD_DEFAULT_SIGNATURE_MAX_AGE_SECONDS = 300
export const DISCORD_ASK_COMMAND = DiscordCommands.ASK
export const DISCORD_NEW_COMMAND = DiscordCommands.NEW

interface DiscordCommandOption {
  type: 3
  name: string
  description: string
  required: boolean
}

interface DiscordCommandDefinition {
  name: string
  description: string
  options: DiscordCommandOption[]
  contexts?: number[]
}

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
  const publicKey = integration.publicKey?.trim()
  const botToken = integration.botToken?.trim()
  const guildId = integration.guildId?.trim()

  if (!applicationId || !publicKey || !botToken || !guildId) {
    throw new HTTPError(
      "Discord integration requires applicationId, publicKey, botToken, and guildId",
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

export const resolveChatAppForAgent = async (
  agentId: string,
  chatAppId?: string
) =>
  await shared.resolveChatAppForAgent({
    agentId,
    chatAppId,
  })

export const buildDiscordWebhookUrl = async (
  chatAppId: string,
  agentId: string
) =>
  await shared.buildWebhookUrl({
    provider: "discord",
    chatAppId,
    agentId,
    useProdWorkspaceId: true,
  })

export const buildDiscordInviteUrl = (applicationId: string) =>
  `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=bot+applications.commands&permissions=0`

const buildGlobalCommandPayload = (): DiscordCommandDefinition[] => [
  {
    name: DiscordCommands.ASK,
    description: "Ask the configured Budibase agent",
    contexts: [0, 1], // guild and bot DM contexts
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
    name: DiscordCommands.NEW,
    description: "Start a new conversation with the configured agent",
    contexts: [0, 1], // guild and bot DM contexts
    options: [
      {
        type: 3,
        name: "message",
        description: "Optional opening message",
        required: false,
      },
    ],
  },
]

const buildGuildCommandPayload = (): DiscordCommandDefinition[] => [
  {
    name: DiscordCommands.ASK,
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
    name: DiscordCommands.NEW,
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
]

const syncCommandsOnEndpoint = async ({
  url,
  botToken,
  payload,
}: {
  url: string
  botToken: string
  payload: DiscordCommandDefinition[]
}) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new HTTPError(
      `Discord command sync failed (${response.status}): ${body || response.statusText}`,
      400
    )
  }
}

export const syncApplicationCommands = async (
  applicationId: string,
  botToken: string,
  guildId: string
) => {
  await syncCommandsOnEndpoint({
    url: `${DISCORD_API_BASE_URL}/applications/${applicationId}/commands`,
    botToken,
    payload: buildGlobalCommandPayload(),
  })

  await syncCommandsOnEndpoint({
    url: `${DISCORD_API_BASE_URL}/applications/${applicationId}/guilds/${guildId}/commands`,
    botToken,
    payload: buildGuildCommandPayload(),
  })
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

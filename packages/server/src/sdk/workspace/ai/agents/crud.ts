import {
  context,
  docIds,
  encryption,
  events,
  HTTPError,
} from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type { Agent, Optional } from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import * as knowledgeBaseSdk from "../knowledgeBase"

const SECRET_MASK = "********"
const SECRET_ENCODING_PREFIX = "bbai_enc::"
const NAME_REQUIRED_ERROR = "Agent name is required."

const guardName = async (name: string, id?: string) => {
  if (!name.trim()) {
    throw new HTTPError(NAME_REQUIRED_ERROR, 400)
  }

  const agents = await fetch()
  const normalizedName = helpers.normalizeForComparison(name)
  const duplicate = agents.find(
    agent =>
      helpers.normalizeForComparison(agent.name) === normalizedName &&
      agent._id !== id
  )

  if (duplicate) {
    throw new HTTPError(`Agent with name '${name}' already exists.`, 400)
  }
}

const encodeSecret = (value?: string): string | undefined => {
  if (!value || value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return `${SECRET_ENCODING_PREFIX}${encryption.encrypt(value)}`
}

const decodeSecret = (value?: string): string | undefined => {
  if (!value || !value.startsWith(SECRET_ENCODING_PREFIX)) {
    return value
  }
  return encryption.decrypt(value.slice(SECRET_ENCODING_PREFIX.length))
}

const encodeDiscordIntegrationSecrets = (
  discordIntegration?: Agent["discordIntegration"]
) => {
  if (!discordIntegration) {
    return discordIntegration
  }

  return {
    ...discordIntegration,
    publicKey: encodeSecret(discordIntegration.publicKey),
    botToken: encodeSecret(discordIntegration.botToken),
  }
}

const decodeDiscordIntegrationSecrets = (
  discordIntegration?: Agent["discordIntegration"]
) => {
  if (!discordIntegration) {
    return discordIntegration
  }

  return {
    ...discordIntegration,
    publicKey: decodeSecret(discordIntegration.publicKey),
    botToken: decodeSecret(discordIntegration.botToken),
  }
}

const encodeSlackIntegrationSecrets = (
  slackIntegration?: Agent["slackIntegration"]
) => {
  if (!slackIntegration) {
    return slackIntegration
  }

  return {
    ...slackIntegration,
    botToken: encodeSecret(slackIntegration.botToken),
    signingSecret: encodeSecret(slackIntegration.signingSecret),
  }
}

const decodeSlackIntegrationSecrets = (
  slackIntegration?: Agent["slackIntegration"]
) => {
  if (!slackIntegration) {
    return slackIntegration
  }

  return {
    ...slackIntegration,
    botToken: decodeSecret(slackIntegration.botToken),
    signingSecret: decodeSecret(slackIntegration.signingSecret),
  }
}

const encodeTelegramIntegrationSecrets = (
  telegramIntegration?: Agent["telegramIntegration"]
) => {
  if (!telegramIntegration) {
    return telegramIntegration
  }

  return {
    ...telegramIntegration,
    botToken: encodeSecret(telegramIntegration.botToken),
    webhookSecretToken: encodeSecret(telegramIntegration.webhookSecretToken),
  }
}

const decodeTelegramIntegrationSecrets = (
  telegramIntegration?: Agent["telegramIntegration"]
) => {
  if (!telegramIntegration) {
    return telegramIntegration
  }

  return {
    ...telegramIntegration,
    botToken: decodeSecret(telegramIntegration.botToken),
    webhookSecretToken: decodeSecret(telegramIntegration.webhookSecretToken),
  }
}

const withAgentDefaults = (agent: Agent): Agent => ({
  ...agent,
  live: agent.live ?? false,
  enabledTools: agent.enabledTools || [],
  knowledgeBases: agent.knowledgeBases || [],
  discordIntegration: decodeDiscordIntegrationSecrets(agent.discordIntegration),
  slackIntegration: decodeSlackIntegrationSecrets(agent.slackIntegration),
  telegramIntegration: decodeTelegramIntegrationSecrets(
    agent.telegramIntegration
  ),
})

const mergeDiscordIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["discordIntegration"]
  incoming?: Agent["discordIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.publicKey === SECRET_MASK && existing?.publicKey) {
    merged.publicKey = existing.publicKey
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  return merged
}

const mergeMSTeamsIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["MSTeamsIntegration"]
  incoming?: Agent["MSTeamsIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.appPassword === SECRET_MASK && existing?.appPassword) {
    merged.appPassword = existing.appPassword
  }

  return merged
}

const mergeSlackIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["slackIntegration"]
  incoming?: Agent["slackIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  if (incoming.signingSecret === SECRET_MASK && existing?.signingSecret) {
    merged.signingSecret = existing.signingSecret
  }

  return merged
}

const mergeTelegramIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["telegramIntegration"]
  incoming?: Agent["telegramIntegration"]
}) => {
  if (incoming === undefined) {
    return existing
  }
  if (!incoming) {
    return incoming
  }

  const merged = {
    ...(existing || {}),
    ...incoming,
  }

  if (incoming.botToken === SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
  }

  if (
    incoming.webhookSecretToken === SECRET_MASK &&
    existing?.webhookSecretToken
  ) {
    merged.webhookSecretToken = existing.webhookSecretToken
  }

  return merged
}

export async function fetch(): Promise<Agent[]> {
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<Agent>(
    docIds.getDocParams(DocumentType.AGENT, undefined, {
      include_docs: true,
    })
  )

  return result.rows
    .map(row => row.doc)
    .filter((doc): doc is Agent => !!doc)
    .map(withAgentDefaults)
}

export async function getOrThrow(agentId: string | undefined): Promise<Agent> {
  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  const db = context.getWorkspaceDB()

  const agent = await db.tryGet<Agent>(agentId)
  if (!agent) {
    throw new HTTPError("Agent not found", 404)
  }

  return withAgentDefaults(agent)
}

export async function create(
  request: Optional<
    Omit<Agent, "_id" | "_rev" | "createdAt" | "updatedAt" | "publishedAt">,
    "aiconfig"
  >
): Promise<Agent> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  await guardName(request.name)

  const agent: Agent = {
    _id: docIds.generateAgentID(),
    name: request.name,
    description: request.description,
    aiconfig: request.aiconfig || "", // this might be set later, it will be validated on publish/usage
    promptInstructions: request.promptInstructions,
    live: request.live ?? false,
    publishedAt: request.live ? now : undefined,
    icon: request.icon,
    iconColor: request.iconColor,
    goal: request.goal,
    createdAt: now,
    createdBy: request.createdBy,
    enabledTools: request.enabledTools || [],
    knowledgeBases: request.knowledgeBases || [],
    knowledgeSources: request.knowledgeSources,
    discordIntegration: request.discordIntegration,
    MSTeamsIntegration: request.MSTeamsIntegration,
    slackIntegration: request.slackIntegration,
    telegramIntegration: request.telegramIntegration,
  }

  const { rev } = await db.put({
    ...agent,
    discordIntegration: encodeDiscordIntegrationSecrets(
      agent.discordIntegration
    ),
    slackIntegration: encodeSlackIntegrationSecrets(agent.slackIntegration),
    telegramIntegration: encodeTelegramIntegrationSecrets(
      agent.telegramIntegration
    ),
  })
  agent._rev = rev
  const result = withAgentDefaults(agent)
  events.ai.agentCreated(result)
  return result
}

export async function duplicate(
  source: Agent,
  createdBy: string
): Promise<Agent> {
  const allAgents = await fetch()
  const name = helpers.duplicateName(
    source.name,
    allAgents.map(agent => agent.name)
  )

  return await create({
    name,
    description: source.description,
    aiconfig: source.aiconfig,
    promptInstructions: source.promptInstructions,
    goal: source.goal,
    icon: source.icon,
    iconColor: source.iconColor,
    live: source.live,
    _deleted: false,
    createdBy,
    enabledTools: source.enabledTools || [],
    knowledgeBases: source.knowledgeBases || [],
  })
}

export async function update(agent: Agent): Promise<Agent> {
  const { _id, _rev } = agent
  if (!_id || !_rev) {
    throw new HTTPError("_id and _rev are required", 400)
  }

  const db = context.getWorkspaceDB()
  const existingRaw = await db.tryGet<Agent>(_id)
  const existing = existingRaw ? withAgentDefaults(existingRaw) : undefined
  if (!existing) {
    throw new HTTPError("Agent not found", 404)
  }

  const incomingName = agent.name ?? existing.name
  const normalizedName = helpers.normalizeForComparison(incomingName)
  const normalizedExistingName = helpers.normalizeForComparison(existing.name)

  if (normalizedName !== normalizedExistingName) {
    await guardName(incomingName, _id)
  }

  const now = new Date().toISOString()
  const updated: Agent = {
    ...existing,
    ...agent,
    updatedAt: now,
    enabledTools: agent.enabledTools ?? existing?.enabledTools ?? [],
    knowledgeBases: agent.knowledgeBases ?? existing?.knowledgeBases ?? [],
    discordIntegration: mergeDiscordIntegration({
      existing: existing?.discordIntegration,
      incoming: agent.discordIntegration,
    }),
    MSTeamsIntegration: mergeMSTeamsIntegration({
      existing: existing?.MSTeamsIntegration,
      incoming: agent.MSTeamsIntegration,
    }),
    slackIntegration: mergeSlackIntegration({
      existing: existing?.slackIntegration,
      incoming: agent.slackIntegration,
    }),
    telegramIntegration: mergeTelegramIntegration({
      existing: existing?.telegramIntegration,
      incoming: agent.telegramIntegration,
    }),
  }

  const hasBeenPublished =
    !!existing?.publishedAt || existing?.live === true || updated.live === true
  updated.publishedAt = hasBeenPublished
    ? existing?.publishedAt || now
    : undefined

  const { rev } = await db.put({
    ...updated,
    discordIntegration: encodeDiscordIntegrationSecrets(
      updated.discordIntegration
    ),
    slackIntegration: encodeSlackIntegrationSecrets(updated.slackIntegration),
    telegramIntegration: encodeTelegramIntegrationSecrets(
      updated.telegramIntegration
    ),
  })
  updated._rev = rev
  const result = withAgentDefaults(updated)
  events.ai.agentUpdated(result)
  return result
}

export async function remove(agentId: string) {
  const db = context.getWorkspaceDB()
  const agent = await getOrThrow(agentId)

  if (agent.knowledgeBases) {
    for (const knowledgeBaseId of agent.knowledgeBases) {
      const knowledgeBase = await knowledgeBaseSdk.find(knowledgeBaseId)
      if (!knowledgeBase) {
        continue
      }

      const files =
        await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
      for (const file of files) {
        try {
          await knowledgeBaseSdk.removeKnowledgeBaseFile(knowledgeBase, file)
        } catch (error) {
          console.log(
            "Failed to remove knowledge base file for agent deletion",
            {
              agentId,
              knowledgeBaseId,
              fileId: file._id,
              error,
            }
          )
        }
      }

      try {
        await knowledgeBaseSdk.remove(knowledgeBaseId)
      } catch (error) {
        console.log("Failed to remove knowledge base for agent deletion", {
          agentId,
          knowledgeBaseId,
          error,
        })
      }
    }
  }

  await db.remove(agent)
  events.ai.agentDeleted(agent)
}

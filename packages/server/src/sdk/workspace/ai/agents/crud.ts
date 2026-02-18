import { context, docIds, encryption, HTTPError } from "@budibase/backend-core"
import { DocumentType } from "@budibase/types"
import type {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import { listAgentFiles, removeAgentFile } from "./files"

const DISCORD_SECRET_MASK = "********"
const SECRET_ENCODING_PREFIX = "bbai_enc::"

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

const withAgentDefaults = (agent: Agent): Agent => ({
  ...agent,
  live: agent.live ?? false,
  enabledTools: agent.enabledTools || [],
  discordIntegration: decodeDiscordIntegrationSecrets(agent.discordIntegration),
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

  if (incoming.publicKey === DISCORD_SECRET_MASK && existing?.publicKey) {
    merged.publicKey = existing.publicKey
  }

  if (incoming.botToken === DISCORD_SECRET_MASK && existing?.botToken) {
    merged.botToken = existing.botToken
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

export async function create(request: CreateAgentRequest): Promise<Agent> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  const agent: Agent = {
    _id: docIds.generateAgentID(),
    name: request.name,
    description: request.description,
    aiconfig: request.aiconfig || "", // this might be set later, it will be validated on publish/usage
    promptInstructions: request.promptInstructions,
    live: request.live ?? false,
    icon: request.icon,
    iconColor: request.iconColor,
    goal: request.goal,
    createdAt: now,
    createdBy: request.createdBy,
    enabledTools: request.enabledTools || [],
    embeddingModel: request.embeddingModel,
    vectorDb: request.vectorDb,
    ragMinDistance: request.ragMinDistance,
    ragTopK: request.ragTopK,
    discordIntegration: request.discordIntegration,
  }

  const { rev } = await db.put({
    ...agent,
    discordIntegration: encodeDiscordIntegrationSecrets(
      agent.discordIntegration
    ),
  })
  agent._rev = rev
  return withAgentDefaults(agent)
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
    embeddingModel: source.embeddingModel,
    vectorDb: source.vectorDb,
    ragMinDistance: source.ragMinDistance,
    ragTopK: source.ragTopK,
  })
}

export async function update(agent: UpdateAgentRequest): Promise<Agent> {
  const { _id, _rev } = agent
  if (!_id || !_rev) {
    throw new HTTPError("_id and _rev are required", 400)
  }

  const db = context.getWorkspaceDB()
  const existingRaw = await db.tryGet<Agent>(_id)
  const existing = existingRaw ? withAgentDefaults(existingRaw) : undefined

  const updated: Agent = {
    ...existing,
    ...agent,
    updatedAt: new Date().toISOString(),
    enabledTools: agent.enabledTools ?? existing?.enabledTools ?? [],
    discordIntegration: mergeDiscordIntegration({
      existing: existing?.discordIntegration,
      incoming: agent.discordIntegration,
    }),
  }

  const { rev } = await db.put({
    ...updated,
    discordIntegration: encodeDiscordIntegrationSecrets(
      updated.discordIntegration
    ),
  })
  updated._rev = rev
  return withAgentDefaults(updated)
}

export async function remove(agentId: string) {
  const db = context.getWorkspaceDB()
  const agent = await getOrThrow(agentId)

  await db.remove(agent)

  if (agent.vectorDb) {
    const files = await listAgentFiles(agentId)
    if (files.length > 0) {
      await Promise.all(files.map(file => removeAgentFile(agent, file)))
    }
  }
}

import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  DocumentType,
  UpdateAgentRequest,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import { listAgentFiles, removeAgentFile } from "./files"

const SECRET_MASK = "********"

const withAgentDefaults = (agent: Agent): Agent => ({
  ...agent,
  live: agent.live ?? false,
  enabledTools: agent.enabledTools || [],
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

const mergeTeamsIntegration = ({
  existing,
  incoming,
}: {
  existing?: Agent["teamsIntegration"]
  incoming?: Agent["teamsIntegration"]
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
    teamsIntegration: request.teamsIntegration,
  }

  const { rev } = await db.put(agent)
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
  const existing = await db.tryGet<Agent>(_id)

  const updated: Agent = {
    ...existing,
    ...agent,
    updatedAt: new Date().toISOString(),
    enabledTools: agent.enabledTools ?? existing?.enabledTools ?? [],
    discordIntegration: mergeDiscordIntegration({
      existing: existing?.discordIntegration,
      incoming: agent.discordIntegration,
    }),
    teamsIntegration: mergeTeamsIntegration({
      existing: existing?.teamsIntegration,
      incoming: agent.teamsIntegration,
    }),
  }

  const { rev } = await db.put(updated)
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

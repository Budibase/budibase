import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  DocumentType,
  UpdateAgentRequest,
} from "@budibase/types"
import { listAgentFiles, removeAgentFile } from "./files"
import { deleteAgentFileChunks, getAgentRagConfig } from "../rag/files"

const withAgentDefaults = (agent: Agent): Agent => ({
  ...agent,
  live: agent.live ?? false,
  enabledTools: agent.enabledTools || [],
})

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
  }

  const { rev } = await db.put(agent)
  agent._rev = rev
  return withAgentDefaults(agent)
}

export async function update(request: UpdateAgentRequest): Promise<Agent> {
  const { _id, _rev } = request
  if (!_id || !_rev) {
    throw new HTTPError("_id and _rev are required", 400)
  }

  const db = context.getWorkspaceDB()
  const existing = await db.tryGet<Agent>(_id)

  const updated: Agent = {
    ...existing,
    ...request,
    updatedAt: new Date().toISOString(),
    enabledTools: request.enabledTools ?? existing?.enabledTools ?? [],
  }

  const { rev } = await db.put(updated)
  updated._rev = rev
  return withAgentDefaults(updated)
}

export async function remove(agentId: string) {
  const db = context.getWorkspaceDB()
  const agent = await getOrThrow(agentId)

  await db.remove(agent)

  if (agent.embeddingModel && agent.vectorDb) {
    const ragConfig = await getAgentRagConfig(agent)

    const files = await listAgentFiles(agentId)
    if (files.length > 0 && ragConfig) {
      await deleteAgentFileChunks(
        ragConfig,
        files.map(file => file.ragSourceId).filter(Boolean)
      )

      await Promise.all(files.map(file => removeAgentFile(agent, file)))
    }
  }
}

import { context, docIds, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  CreateAgentRequest,
  DocumentType,
  UpdateAgentRequest,
} from "@budibase/types"

const withAgentDefaults = (agent: Agent): Agent => ({
  ...agent,
  allowedTools: agent.allowedTools || [],
  live: agent.live ?? false,
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
    aiconfig: request.aiconfig,
    allowedTools: request.allowedTools,
    promptInstructions: request.promptInstructions,
    live: request.live ?? false,
    icon: request.icon,
    iconColor: request.iconColor,
    goal: request.goal,
    createdAt: now,
    createdBy: request.createdBy,
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
  }

  const { rev } = await db.put(updated)
  updated._rev = rev
  return withAgentDefaults(updated)
}

export async function remove(agentId: string) {
  const db = context.getWorkspaceDB()
  const agent = await getOrThrow(agentId)

  await db.remove(agent)
}

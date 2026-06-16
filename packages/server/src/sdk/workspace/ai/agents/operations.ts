import { HTTPError } from "@budibase/backend-core"
import type { Agent, AgentOperation } from "@budibase/types"
import { getOrThrow, update } from "./crud"

export type AgentOperationConfig = Pick<
  AgentOperation,
  | "name"
  | "live"
  | "promptInstructions"
  | "enabledTools"
  | "allowKnowledgeSourceDownload"
>

export type CreateAgentOperationInput = AgentOperationConfig &
  Pick<AgentOperation, "id">

const getOperationOrThrow = (agent: Agent, operationId: string) => {
  const operation = agent.operations?.find(
    candidate => candidate.id === operationId
  )
  if (!operation) {
    throw new HTTPError("Operation not found for this agent", 404)
  }
  return operation
}

const mergeOperationConfig = (
  existing: AgentOperation,
  incoming: Partial<AgentOperationConfig>
): AgentOperation => ({
  ...existing,
  ...incoming,
  id: existing.id,
  knowledgeBases: existing.knowledgeBases,
  knowledgeSources: existing.knowledgeSources,
})

export async function createOperation(
  agentId: string,
  operation: CreateAgentOperationInput
): Promise<Agent> {
  const existing = await getOrThrow(agentId)
  if (existing.operations?.some(candidate => candidate.id === operation.id)) {
    throw new HTTPError("Operation already exists", 400)
  }

  return update({
    ...existing,
    operations: [...(existing.operations ?? []), operation],
  })
}

export async function updateOperation(
  agentId: string,
  operationId: string,
  updateRequest: Partial<AgentOperationConfig>
): Promise<Agent> {
  const existing = await getOrThrow(agentId)
  getOperationOrThrow(existing, operationId)

  return update({
    ...existing,
    operations: (existing.operations ?? []).map(operation =>
      operation.id === operationId
        ? mergeOperationConfig(operation, updateRequest)
        : operation
    ),
  })
}

export async function removeOperation(
  agentId: string,
  operationId: string
): Promise<Agent> {
  const existing = await getOrThrow(agentId)
  getOperationOrThrow(existing, operationId)

  return update({
    ...existing,
    operations: (existing.operations ?? []).filter(
      operation => operation.id !== operationId
    ),
  })
}

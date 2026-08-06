import { HTTPError } from "@budibase/backend-core"
import {
  ToolExecutionPrincipal,
  type Agent,
  type AgentOperation,
  type AgentOperationToolConfig,
} from "@budibase/types"
import { createAgentServiceUser, getOrThrow, update } from "./crud"

export type AgentOperationConfig = Pick<
  AgentOperation,
  | "name"
  | "live"
  | "promptInstructions"
  | "enabledTools"
  | "allowKnowledgeSourceDownload"
  | "escalation"
>

export type CreateAgentOperationInput = AgentOperationConfig &
  Pick<AgentOperation, "id">

export const normalizeOperationTools = (
  tools: AgentOperation["enabledTools"] = []
): AgentOperationToolConfig[] =>
  tools.map(tool =>
    typeof tool === "string"
      ? {
          toolName: tool,
          executionPrincipal: ToolExecutionPrincipal.REQUESTER,
        }
      : tool
  )

const normalizeOperationName = (name: string | undefined) =>
  name?.trim().toLowerCase() || ""

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
  escalation: incoming.escalation ?? existing.escalation,
})

const assertUniqueOperationName = (
  agent: Agent,
  operationName: string | undefined,
  excludedOperationId?: string
) => {
  const normalizedName = normalizeOperationName(operationName)
  if (!normalizedName) {
    return
  }

  const hasDuplicateName = (agent.operations ?? []).some(operation => {
    return (
      operation.id !== excludedOperationId &&
      normalizeOperationName(operation.name) === normalizedName
    )
  })

  if (hasDuplicateName) {
    throw new HTTPError(
      `Operation with name '${operationName?.trim()}' already exists.`,
      400
    )
  }
}

export async function createOperation(
  agentId: string,
  operation: CreateAgentOperationInput
): Promise<Agent> {
  let existing = await getOrThrow(agentId)
  if (existing.operations?.some(candidate => candidate.id === operation.id)) {
    throw new HTTPError("Operation already exists", 400)
  }
  assertUniqueOperationName(existing, operation.name)
  const normalizedTools = normalizeOperationTools(operation.enabledTools)
  if (
    normalizedTools.some(
      tool => tool.executionPrincipal === ToolExecutionPrincipal.AGENT
    ) &&
    !existing.serviceUserId
  ) {
    existing = {
      ...existing,
      serviceUserId: await createAgentServiceUser(existing.name),
    }
  }

  return update({
    ...existing,
    operations: [
      ...(existing.operations ?? []),
      {
        ...operation,
        enabledTools: normalizedTools,
      },
    ],
  })
}

export async function updateOperation(
  agentId: string,
  operationId: string,
  updateRequest: Partial<AgentOperationConfig>
): Promise<Agent> {
  let existing = await getOrThrow(agentId)
  getOperationOrThrow(existing, operationId)
  assertUniqueOperationName(existing, updateRequest.name, operationId)

  const normalizedUpdate = updateRequest.enabledTools
    ? {
        ...updateRequest,
        enabledTools: normalizeOperationTools(updateRequest.enabledTools),
      }
    : updateRequest

  if (
    normalizedUpdate.enabledTools?.some(
      tool =>
        typeof tool !== "string" &&
        tool.executionPrincipal === ToolExecutionPrincipal.AGENT
    ) &&
    !existing.serviceUserId
  ) {
    existing = {
      ...existing,
      serviceUserId: await createAgentServiceUser(existing.name),
    }
  }

  return update({
    ...existing,
    operations: (existing.operations ?? []).map(operation =>
      operation.id === operationId
        ? mergeOperationConfig(operation, normalizedUpdate)
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

import { HTTPError } from "@budibase/backend-core"
import type { Agent, AgentOperation } from "@budibase/types"
import { getOrThrow, update } from "./crud"
import { assertAgentToolApprovalsValid } from "./utils"

interface LegacyAgentOperation extends AgentOperation {
  escalation?: object
}

const hasLegacyEscalation = (operation: AgentOperation) =>
  !!(operation as LegacyAgentOperation).escalation

export type AgentOperationConfig = Pick<
  AgentOperation,
  | "name"
  | "live"
  | "promptInstructions"
  | "enabledTools"
  | "approvalPolicies"
  | "allowKnowledgeSourceDownload"
>

export type CreateAgentOperationInput = AgentOperationConfig &
  Pick<AgentOperation, "id">

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
): AgentOperation => {
  const legacyExisting = existing as LegacyAgentOperation
  const replacesLegacyEscalation = incoming.enabledTools?.some(
    tool => !!tool.approvalPolicyId
  )
  const { escalation: _legacyEscalation, ...current } = legacyExisting
  return {
    ...current,
    ...(!replacesLegacyEscalation &&
      legacyExisting.escalation && {
        escalation: legacyExisting.escalation,
      }),
    ...incoming,
    id: existing.id,
    knowledgeBases: existing.knowledgeBases,
    knowledgeSources: existing.knowledgeSources,
  }
}

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
  const existing = await getOrThrow(agentId)
  if (existing.operations?.some(candidate => candidate.id === operation.id)) {
    throw new HTTPError("Operation already exists", 400)
  }
  assertUniqueOperationName(existing, operation.name)
  const normalizedTools = operation.enabledTools || []
  const newOperation = {
    ...operation,
    enabledTools: normalizedTools,
  }

  const updated = {
    ...existing,
    operations: [...(existing.operations ?? []), newOperation],
  }
  await assertAgentToolApprovalsValid({
    ...updated,
    operations: [newOperation],
  })
  return update(updated)
}

export async function updateOperation(
  agentId: string,
  operationId: string,
  updateRequest: Partial<AgentOperationConfig>
): Promise<Agent> {
  const existing = await getOrThrow(agentId)
  const existingOperation = getOperationOrThrow(existing, operationId)
  assertUniqueOperationName(existing, updateRequest.name, operationId)

  if (
    hasLegacyEscalation(existingOperation) &&
    existingOperation.live !== true &&
    updateRequest.live === true &&
    !updateRequest.enabledTools?.some(tool => !!tool.approvalPolicyId)
  ) {
    throw new HTTPError(
      "Configure approval on individual tools before enabling this operation.",
      422
    )
  }

  const normalizedUpdate = updateRequest
  const mergedOperation = mergeOperationConfig(
    existingOperation,
    normalizedUpdate
  )

  const updated = {
    ...existing,
    operations: (existing.operations ?? []).map(operation =>
      operation.id === operationId ? mergedOperation : operation
    ),
  }
  await assertAgentToolApprovalsValid(
    {
      ...updated,
      operations: [mergedOperation],
    },
    { allowLegacyOperationEscalation: true }
  )
  return update(updated)
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

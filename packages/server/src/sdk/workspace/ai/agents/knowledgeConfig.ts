import {
  Agent,
  AgentKnowledgeSource,
  AgentKnowledgeSourceType,
  AgentOperation,
} from "@budibase/types"

export const getAgentKnowledgeSources = (
  agent: Agent
): AgentKnowledgeSource[] =>
  agent.operations?.flatMap(operation => operation.knowledgeSources ?? []) ?? []

export const getSharePointKnowledgeSources = (
  agent: Agent
): AgentKnowledgeSource[] =>
  getAgentKnowledgeSources(agent).filter(
    source => source.type === AgentKnowledgeSourceType.SHAREPOINT
  )

export const findKnowledgeSource = (
  agent: Agent,
  sourceId: string
): AgentKnowledgeSource | undefined =>
  getAgentKnowledgeSources(agent).find(source => source.id === sourceId)

export const findOperationIdForSharePointSite = (
  agent: Agent,
  siteId: string
): string | undefined =>
  agent.operations?.find(operation =>
    operation.knowledgeSources?.some(
      source =>
        source.type === AgentKnowledgeSourceType.SHAREPOINT &&
        source.config.site.id === siteId
    )
  )?.id

export const findOperationIdForKnowledgeSource = (
  agent: Agent,
  sourceId: string
): string | undefined =>
  agent.operations?.find(operation =>
    operation.knowledgeSources?.some(source => source.id === sourceId)
  )?.id

export const updateOperationKnowledgeSources = (
  agent: Agent,
  operationId: string | undefined,
  updater: (sources: AgentKnowledgeSource[]) => AgentKnowledgeSource[]
): AgentOperation[] => {
  const operations = agent.operations ?? []
  const targetOperationId =
    operationId || operations[0]?.id || "operation_default"

  if (operations.length === 0) {
    return [
      {
        id: targetOperationId,
        name: "Operation",
        live: false,
        knowledgeSources: updater([]),
        allowKnowledgeSourceDownload: true,
      },
    ]
  }

  return operations.map(operation =>
    operation.id === targetOperationId
      ? {
          ...operation,
          knowledgeSources: updater(operation.knowledgeSources ?? []),
        }
      : operation
  )
}

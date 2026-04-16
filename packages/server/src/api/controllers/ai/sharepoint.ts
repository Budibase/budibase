import {
  Agent,
  AgentKnowledgeSource,
  AgentKnowledgeSourceType,
} from "@budibase/types"

export const getSharePointSources = (agent?: Agent): AgentKnowledgeSource[] =>
  (agent?.knowledgeSources || []).filter(
    item => item.type === AgentKnowledgeSourceType.SHAREPOINT
  )

export const getSharePointSiteIds = (agent?: Agent): Set<string> => {
  const ids = getSharePointSources(agent)
    .map(source => source.config.site?.id?.trim())
    .filter((id): id is string => !!id)
  return new Set(ids)
}

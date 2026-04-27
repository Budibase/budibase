import {
  Agent,
  AgentKnowledgeSource,
  AgentKnowledgeSourceType,
  KnowledgeBaseFile,
  KnowledgeBaseFileSourceType,
} from "@budibase/types"
import sdk from "../../../sdk"

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

const isSharePointFile = (
  file: Pick<KnowledgeBaseFile, "source" | "uploadedBy">
) => file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT

const isSharePointFileForRemovedSite = (
  file: Pick<KnowledgeBaseFile, "source" | "uploadedBy">,
  removedSharePointSiteIds: string[]
) => {
  const sourceSiteId =
    file.source?.type === KnowledgeBaseFileSourceType.SHAREPOINT
      ? file.source.siteId
      : undefined
  return removedSharePointSiteIds.some(siteId => {
    return sourceSiteId === siteId
  })
}

export async function cleanupSharePointFilesForAgent({
  agentId,
  removedSharePointSiteIds,
  sharePointDisconnected,
}: {
  agentId: string
  removedSharePointSiteIds: string[]
  sharePointDisconnected: boolean
}) {
  if (
    !agentId ||
    (!sharePointDisconnected && removedSharePointSiteIds.length === 0)
  ) {
    return
  }

  const files = await sdk.ai.rag.listFilesForAgent(agentId)
  const filesToDelete = sharePointDisconnected
    ? files.filter(isSharePointFile)
    : files.filter(file =>
        isSharePointFileForRemovedSite(file, removedSharePointSiteIds)
      )

  const results = await Promise.allSettled(
    filesToDelete
      .map(file => file._id)
      .filter((fileId): fileId is string => !!fileId)
      .map(fileId => sdk.ai.rag.deleteFileForAgent(agentId, fileId))
  )
  const failedDeletes = results.filter(
    result => result.status === "rejected"
  ).length
  if (failedDeletes > 0) {
    console.log("Failed to delete some SharePoint files after source update", {
      agentId,
      sharePointDisconnected,
      removedSharePointSiteIds,
      failedDeletes,
    })
  }
}

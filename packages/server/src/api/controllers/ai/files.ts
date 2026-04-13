import { readFile, unlink } from "node:fs/promises"
import { HTTPError } from "@budibase/backend-core"
import {
  AgentKnowledgeSourceType,
  AgentFileUploadResponse,
  DisconnectAgentKnowledgeSourcesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  FetchAgentFilesResponse,
  isKnowledgeFileSupported,
  SetAgentKnowledgeSourcesRequest,
  SetAgentKnowledgeSourcesResponse,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import {
  cleanupSharePointFilesForAgent,
  getSharePointSiteIds,
  getSharePointSources,
} from "./sharepoint"

const normalizeUpload = (fileInput: any) => {
  if (!fileInput) {
    return undefined
  }
  if (Array.isArray(fileInput)) {
    return fileInput[0]
  }
  return fileInput
}

const unlinkSafe = async (path?: string) => {
  if (!path) {
    return
  }
  try {
    await unlink(path)
  } catch (error) {
    console.log("Failed to delete temp file", error)
  }
}

export async function fetchAgentFiles(
  ctx: UserCtx<void, FetchAgentFilesResponse, { agentId: string }>
) {
  const { agentId } = ctx.params
  const files = await sdk.ai.rag.listFilesForAgent(agentId)
  ctx.body = { files }
  ctx.status = 200
}

export async function uploadAgentFile(
  ctx: UserCtx<void, AgentFileUploadResponse, { agentId: string }>
) {
  const { agentId } = ctx.params
  const upload = normalizeUpload(
    ctx.request.files?.file ||
      ctx.request.files?.knowledgeBaseFile ||
      ctx.request.files?.upload
  )

  if (!upload) {
    throw new HTTPError("file is required", 400)
  }
  const filePath = upload.filepath || upload.path
  if (!filePath) {
    throw new HTTPError("Invalid upload payload", 400)
  }

  const filename = upload.originalFilename || upload.name || "agent-document"
  const mimetype = upload.mimetype || upload.type
  const fileSize =
    typeof upload.size === "number"
      ? upload.size
      : Number(upload.size) || undefined
  if (!isKnowledgeFileSupported({ filename, mimetype })) {
    await unlinkSafe(filePath)
    throw new HTTPError("Unsupported file type for knowledge ingestion", 400)
  }

  const buffer = await readFile(filePath)

  try {
    const updated = await sdk.ai.rag.uploadFileForAgent(agentId, {
      filename,
      mimetype,
      size: fileSize ?? buffer.byteLength,
      buffer,
      uploadedBy: ctx.user?._id!,
    })
    ctx.body = { file: updated }
    ctx.status = 201
  } catch (error: any) {
    console.error("Failed to upload agent file", error)
    throw new HTTPError(
      error?.message || "Failed to process uploaded file",
      400
    )
  } finally {
    await unlinkSafe(filePath)
  }
}

export async function deleteAgentFile(
  ctx: UserCtx<void, { deleted: true }, { agentId: string; fileId: string }>
) {
  const { agentId, fileId } = ctx.params
  await sdk.ai.rag.deleteFileForAgent(agentId, fileId)
  ctx.body = { deleted: true }
  ctx.status = 200
}

export async function fetchAgentKnowledgeSourceOptions(
  ctx: UserCtx<
    void,
    FetchAgentKnowledgeSourceOptionsResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  ctx.body = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  ctx.status = 200
}

export async function syncAgentKnowledgeSources(
  ctx: UserCtx<
    SyncAgentKnowledgeSourcesRequest,
    SyncAgentKnowledgeSourcesResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const sourceIds = Array.isArray(ctx.request.body?.sourceIds)
    ? ctx.request.body.sourceIds
    : undefined
  console.log("Agent knowledge source sync requested", {
    agentId,
    sourceIds: sourceIds?.length ? sourceIds : "all",
  })
  const response = sourceIds
    ? await sdk.ai.rag.syncSharePointSourcesForAgent(agentId, sourceIds)
    : await sdk.ai.rag.syncSharePointSourcesForAgent(agentId)
  ctx.body = response
  ctx.status = 200
}

export async function setAgentKnowledgeSources(
  ctx: UserCtx<
    SetAgentKnowledgeSourcesRequest,
    SetAgentKnowledgeSourcesResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const siteIds = Array.from(
    new Set(
      (ctx.request.body.sourceIds || [])
        .map(id => id?.trim())
        .filter((id): id is string => !!id)
    )
  )

  const existingAgent = await sdk.ai.agents.getOrThrow(agentId)
  const hasWorkspaceConnection =
    await sdk.ai.rag.hasSharePointWorkspaceConnection()
  if (!hasWorkspaceConnection) {
    throw new HTTPError("SharePoint is not connected for this agent", 400)
  }
  const sharePointSources = getSharePointSources(existingAgent)

  const previousSiteIdsSet = getSharePointSiteIds(existingAgent)
  const previousSiteIds = Array.from(previousSiteIdsSet)
  const addedSharePointSiteIds = siteIds.filter(
    id => !previousSiteIdsSet.has(id)
  )
  const removedSharePointSiteIds = previousSiteIds.filter(
    id => !siteIds.includes(id)
  )
  console.log("Updating agent knowledge sources", {
    agentId,
    previousSiteCount: previousSiteIds.length,
    nextSiteCount: siteIds.length,
    addedSharePointSiteIds,
    removedSharePointSiteIds,
  })
  const availableSites = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  const availableById = new Map(
    availableSites.options.map(site => [
      site.id,
      { name: site.name, webUrl: site.webUrl },
    ])
  )
  const existingById = new Map(
    sharePointSources
      .map(source => source.config.site)
      .filter(
        (site): site is { id: string; name?: string; webUrl?: string } =>
          !!site?.id
      )
      .map(site => [site.id, site] as const)
  )
  const nextSources = siteIds.map(siteId => {
    const sourceSiteId = siteId.replace(/[^a-zA-Z0-9_-]/g, "_")
    const existingSite = existingById.get(siteId)
    const fetchedSite = availableById.get(siteId)
    return {
      id: `sharepoint_site_${sourceSiteId}`,
      type: AgentKnowledgeSourceType.SHAREPOINT,
      config: {
        site: {
          id: siteId,
          name: fetchedSite?.name || existingSite?.name,
          webUrl: fetchedSite?.webUrl || existingSite?.webUrl,
        },
      },
    }
  })
  const nonSharePointSources = (existingAgent.knowledgeSources || []).filter(
    source => source.type !== AgentKnowledgeSourceType.SHAREPOINT
  )

  const updated = await sdk.ai.agents.update({
    ...existingAgent,
    knowledgeSources: [...nonSharePointSources, ...nextSources],
  })
  await sdk.ai.rag.knowledgeSourceSyncQueue.reconcileAgentJobs(updated)

  await cleanupSharePointFilesForAgent({
    agentId,
    removedSharePointSiteIds,
    sharePointDisconnected: false,
  })
  await sdk.ai.rag.deleteKnowledgeSourceSyncStateForAgent(
    agentId,
    removedSharePointSiteIds
  )

  const nextSourceIds = nextSources.map(source => source.id)
  if (nextSourceIds.length > 0) {
    await sdk.ai.rag.syncSharePointSourcesForAgent(agentId, nextSourceIds)
  }

  console.log("Updated agent knowledge sources", {
    agentId,
    nextSourceIds,
    addedSharePointSiteIds,
    removedSharePointSiteIds,
  })

  ctx.body = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  ctx.status = 200
}

export async function disconnectAgentKnowledgeSources(
  ctx: UserCtx<
    void,
    DisconnectAgentKnowledgeSourcesResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const existingAgent = await sdk.ai.agents.getOrThrow(agentId)
  const removedSharePointSiteIds = Array.from(
    getSharePointSiteIds(existingAgent)
  )
  console.log("Disconnecting agent knowledge sources", {
    agentId,
    removedSharePointSiteIds,
    removedCount: removedSharePointSiteIds.length,
  })

  const nextSources = (existingAgent.knowledgeSources || []).filter(
    source => source.type !== AgentKnowledgeSourceType.SHAREPOINT
  )
  await sdk.ai.agents.update({
    ...existingAgent,
    knowledgeSources: nextSources,
  })
  await sdk.ai.rag.knowledgeSourceSyncQueue.removeAllAgentJobs(agentId)
  await cleanupSharePointFilesForAgent({
    agentId,
    removedSharePointSiteIds: [],
    sharePointDisconnected: true,
  })
  await sdk.ai.rag.deleteKnowledgeSourceSyncStateForAgent(agentId)
  console.log("Disconnected agent knowledge sources", {
    agentId,
    removedSharePointSiteIds,
  })

  ctx.body = {
    agentId,
    disconnected: true,
  }
  ctx.status = 200
}

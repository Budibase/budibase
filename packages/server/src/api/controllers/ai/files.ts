import { readFile, unlink } from "node:fs/promises"
import { HTTPError } from "@budibase/backend-core"
import {
  AgentKnowledgeSourceType,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  DisconnectAgentSharePointSiteResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  FetchAgentKnowledgeSourceEntriesResponse,
  FetchAgentFilesResponse,
  isKnowledgeFileSupported,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  UpdateAgentSharePointSiteRequest,
  UpdateAgentSharePointSiteResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"
import { getSharePointSiteIds, getSharePointSources } from "./sharepoint"

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

const normalizeSourcePatterns = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined
  }
  const normalized = Array.from(
    new Set(
      value
        .map(entry => (typeof entry === "string" ? entry.trim() : ""))
        .filter(Boolean)
    )
  )
  return normalized.length > 0 ? normalized : undefined
}

const sanitizeSharePointSourceId = (siteId: string) =>
  `sharepoint_site_${siteId.replace(/[^a-zA-Z0-9_-]/g, "_")}`

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
  ctx: UserCtx<void, void, { agentId: string; fileId: string }>
) {
  const { agentId, fileId } = ctx.params
  await sdk.ai.rag.knowledgeSourceSyncQueue.enqueueDeleteFileJob(
    agentId,
    fileId
  )

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

export async function fetchAgentKnowledgeSourceEntries(
  ctx: UserCtx<
    void,
    FetchAgentKnowledgeSourceEntriesResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const siteId = String(ctx.query.siteId || "").trim()
  if (!siteId) {
    throw new HTTPError("siteId is required", 400)
  }
  ctx.body = await sdk.ai.rag.fetchSharePointEntriesForAgent(agentId, siteId)
  ctx.status = 200
}

export async function fetchAgentKnowledgeSourceAllEntries(
  ctx: UserCtx<
    void,
    FetchAgentKnowledgeSourceEntriesResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const siteId = String(ctx.query.siteId || "").trim()
  if (!siteId) {
    throw new HTTPError("siteId is required", 400)
  }
  ctx.body = await sdk.ai.rag.fetchAllSharePointEntriesForAgent(agentId, siteId)
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

export async function connectAgentSharePointSite(
  ctx: UserCtx<
    ConnectAgentSharePointSiteRequest,
    ConnectAgentSharePointSiteResponse,
    { agentId: string }
  >
) {
  const { agentId } = ctx.params
  const siteId = String(ctx.request.body?.siteId || "").trim()
  if (!siteId) {
    throw new HTTPError("siteId is required", 400)
  }

  const existingAgent = await sdk.ai.agents.getOrThrow(agentId)
  const hasWorkspaceConnection =
    await sdk.ai.rag.hasSharePointWorkspaceConnection()
  if (!hasWorkspaceConnection) {
    throw new HTTPError("SharePoint is not connected for this agent", 400)
  }
  const existingSites = getSharePointSiteIds(existingAgent)
  if (existingSites.has(siteId)) {
    ctx.body = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
    ctx.status = 200
    return
  }
  const availableOptions =
    await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  const selectedOption = availableOptions.options.find(
    option => option.id === siteId
  )
  const nextSource = {
    id: sanitizeSharePointSourceId(siteId),
    type: AgentKnowledgeSourceType.SHAREPOINT,
    config: {
      site: {
        id: siteId,
        name: selectedOption?.name,
        webUrl: selectedOption?.webUrl,
      },
    },
  }
  console.log("Connecting SharePoint site to agent", {
    agentId,
    siteId,
    sourceId: nextSource.id,
  })
  const nonSharePointSources = (existingAgent.knowledgeSources || []).filter(
    source => source.type !== AgentKnowledgeSourceType.SHAREPOINT
  )
  const updated = await sdk.ai.agents.update({
    ...existingAgent,
    knowledgeSources: [
      ...nonSharePointSources,
      ...getSharePointSources(existingAgent),
      nextSource,
    ],
  })
  await sdk.ai.rag.knowledgeSourceSyncQueue.reconcileAgentJobs(updated)
  await sdk.ai.rag.knowledgeSourceSyncQueue.enqueueAgentJobs(
    agentId,
    AgentKnowledgeSourceType.SHAREPOINT,
    [nextSource.id]
  )
  ctx.body = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  ctx.status = 200
}

export async function updateAgentSharePointSite(
  ctx: UserCtx<
    UpdateAgentSharePointSiteRequest,
    UpdateAgentSharePointSiteResponse,
    { agentId: string; siteId: string }
  >
) {
  const { agentId, siteId } = ctx.params
  const existingAgent = await sdk.ai.agents.getOrThrow(agentId)
  const source = getSharePointSources(existingAgent).find(
    source => source.config.site?.id === siteId
  )
  if (!source) {
    throw new HTTPError("SharePoint site is not connected for this agent", 404)
  }
  const patterns = normalizeSourcePatterns(ctx.request.body?.filters?.patterns)
  console.log("Updating SharePoint site filters for agent", {
    agentId,
    siteId,
    sourceId: source.id,
    patternCount: patterns?.length || 0,
  })
  const nextSharePointSources = getSharePointSources(existingAgent).map(
    existingSource =>
      existingSource.id === source.id
        ? {
            ...existingSource,
            config: {
              ...existingSource.config,
              filters: patterns ? { patterns } : undefined,
            },
          }
        : existingSource
  )
  const nonSharePointSources = (existingAgent.knowledgeSources || []).filter(
    source => source.type !== AgentKnowledgeSourceType.SHAREPOINT
  )
  const updated = await sdk.ai.agents.update({
    ...existingAgent,
    knowledgeSources: [...nonSharePointSources, ...nextSharePointSources],
  })
  await sdk.ai.rag.knowledgeSourceSyncQueue.reconcileAgentJobs(updated)
  await sdk.ai.rag.knowledgeSourceSyncQueue.enqueueAgentJobs(
    agentId,
    AgentKnowledgeSourceType.SHAREPOINT,
    [source.id]
  )
  ctx.body = await sdk.ai.rag.fetchSharePointSitesForAgent(agentId)
  ctx.status = 200
}

export async function disconnectAgentSharePointSite(
  ctx: UserCtx<
    void,
    DisconnectAgentSharePointSiteResponse,
    { agentId: string; siteId: string }
  >
) {
  const { agentId, siteId } = ctx.params
  const existingAgent = await sdk.ai.agents.getOrThrow(agentId)
  const removedSource = getSharePointSources(existingAgent).find(
    source => source.config.site?.id === siteId
  )
  if (!removedSource) {
    throw new HTTPError("SharePoint site is not connected for this agent", 404)
  }
  const nextSharePointSources = getSharePointSources(existingAgent).filter(
    source => source.id !== removedSource.id
  )
  const nonSharePointSources = (existingAgent.knowledgeSources || []).filter(
    source => source.type !== AgentKnowledgeSourceType.SHAREPOINT
  )
  const updated = await sdk.ai.agents.update({
    ...existingAgent,
    knowledgeSources: [...nonSharePointSources, ...nextSharePointSources],
  })
  await sdk.ai.rag.knowledgeSourceSyncQueue.reconcileAgentJobs(updated)
  await sdk.ai.rag.knowledgeSourceSyncQueue.enqueueDisconnectSharePointSiteJob(
    agentId,
    siteId
  )
  console.log("Disconnected SharePoint site from agent", {
    agentId,
    siteId,
    sourceId: removedSource.id,
  })
  ctx.body = {
    agentId,
    disconnected: true,
    siteId,
  }
  ctx.status = 200
}

import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import {
  type Agent,
  type AgentKnowledgeSourceSyncState,
  AgentKnowledgeSourceSyncRunStatus,
  AgentKnowledgeSourceType,
  type AgentKnowledgeSource,
  DocumentType,
  type FetchAgentKnowledgeSourceOptionsResponse,
  isKnowledgeFileSupported,
  type KnowledgeSourceOption,
  type SyncAgentKnowledgeSourcesResponse,
} from "@budibase/types"
import { agents as agentsSdk, knowledgeBase as knowledgeBaseSdk } from ".."
import {
  fetchSharePointSitesByConnection,
  getSharePointBearerToken,
  hasSharePointConnection,
  isAllowedSharePointNextLink,
  sharePointConnectionCacheKey,
} from "../sharepoint"
import { ensureKnowledgeBaseForAgent } from "./files"

interface SharePointDrive {
  id?: string
}

interface SharePointDriveListResponse {
  value?: SharePointDrive[]
}

interface SharePointDriveItem {
  id?: string
  name?: string
  file?: {
    mimeType?: string
  }
  folder?: Record<string, unknown>
}

interface SharePointDriveItemsResponse {
  value?: SharePointDriveItem[]
  "@odata.nextLink"?: string
}

const SHAREPOINT_API_BASE = "https://graph.microsoft.com/v1.0"
const SHAREPOINT_SOURCE_TYPE = "sharepoint"
const SHAREPOINT_SITE_ID_REGEX =
  /^[^,/?#\s]+,[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12},[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
type SharePointSourceSite = {
  id: string
  name?: string
  webUrl?: string
}

const trimString = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

export const isValidSharePointSiteId = (value: string): boolean => {
  return SHAREPOINT_SITE_ID_REGEX.test(trimString(value))
}

export const getSharePointWorkspaceConnectionKey = (workspaceId: string) =>
  sharePointConnectionCacheKey("connection", db.getProdWorkspaceID(workspaceId))

const getSharePointCurrentWorkspaceConnectionKey = () =>
  getSharePointWorkspaceConnectionKey(context.getOrThrowWorkspaceId())

export const hasSharePointWorkspaceConnection = async (): Promise<boolean> => {
  return hasSharePointConnection(getSharePointCurrentWorkspaceConnectionKey())
}

const normalizeSites = (
  sites: Array<SharePointSourceSite | KnowledgeSourceOption>
): SharePointSourceSite[] => {
  const map = new Map<string, SharePointSourceSite>()
  for (const site of sites) {
    const id = trimString(site.id)
    if (!id) {
      continue
    }
    map.set(id, {
      id,
      name: trimString(site.name) || undefined,
      webUrl: trimString(site.webUrl) || undefined,
    })
  }
  return Array.from(map.values())
}

const getSharePointSources = (agent: Agent): AgentKnowledgeSource[] => {
  return (agent.knowledgeSources || []).filter(
    source => source.type === AgentKnowledgeSourceType.SHAREPOINT
  )
}

const getSharePointSitesFromSources = (
  agent: Agent
): SharePointSourceSite[] => {
  return normalizeSites(
    getSharePointSources(agent)
      .map(source => source.config.site)
      .filter((site): site is SharePointSourceSite => !!site?.id)
  )
}

const getSharePointSyncRunStatus = (
  synced: number,
  failed: number
): AgentKnowledgeSourceSyncRunStatus => {
  if (failed === 0) {
    return AgentKnowledgeSourceSyncRunStatus.SUCCESS
  }
  if (synced === 0) {
    return AgentKnowledgeSourceSyncRunStatus.FAILED
  }
  return AgentKnowledgeSourceSyncRunStatus.PARTIAL
}

const saveSharePointSyncRunState = async ({
  agentId,
  siteId,
  lastRunAt,
  synced,
  failed,
  skipped,
  totalDiscovered,
}: {
  agentId: string
  siteId: string
  lastRunAt: string
  synced: number
  failed: number
  skipped: number
  totalDiscovered: number
}) => {
  const db = context.getWorkspaceDB()
  const stateId = docIds.generateAgentKnowledgeSourceSyncStateID(
    agentId,
    SHAREPOINT_SOURCE_TYPE,
    siteId
  )
  const existing = await db.tryGet<AgentKnowledgeSourceSyncState>(stateId)
  const now = new Date().toISOString()
  await db.put({
    ...existing,
    _id: stateId,
    agentId,
    sourceType: SHAREPOINT_SOURCE_TYPE,
    sourceId: siteId,
    lastRunAt,
    synced,
    failed,
    skipped,
    totalDiscovered,
    status: getSharePointSyncRunStatus(synced, failed),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
}

const listDrives = async (
  bearerToken: string,
  siteId: string
): Promise<string[]> => {
  const normalizedSiteId = trimString(siteId)
  if (!isValidSharePointSiteId(normalizedSiteId)) {
    throw new HTTPError("Invalid SharePoint site id", 400)
  }

  const response = await fetch(
    `${SHAREPOINT_API_BASE}/sites/${encodeURIComponent(
      normalizedSiteId
    )}/drives?$top=200&$select=id`,
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  )
  if (!response.ok) {
    console.error("Failed to list SharePoint drives", {
      status: response.status,
      siteId: normalizedSiteId,
    })
    throw new HTTPError(
      response.status === 401 || response.status === 403
        ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
        : `Failed to list SharePoint drives (${response.status})`,
      400
    )
  }
  const payload = (await response.json()) as SharePointDriveListResponse
  return (payload.value || [])
    .map(drive => trimString(drive.id))
    .filter(Boolean)
}

const listDriveItems = async (
  bearerToken: string,
  driveId: string,
  itemId?: string
): Promise<SharePointDriveItem[]> => {
  const initialPath = itemId
    ? `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/children?$top=200&$select=id,name,file,folder`
    : `${SHAREPOINT_API_BASE}/drives/${driveId}/root/children?$top=200&$select=id,name,file,folder`

  const items: SharePointDriveItem[] = []
  let nextLink = initialPath

  while (nextLink) {
    const response = await fetch(nextLink, {
      headers: {
        Authorization: bearerToken,
      },
    })
    if (!response.ok) {
      console.error("Failed to list SharePoint drive items", {
        status: response.status,
        driveId,
        hasItemId: !!itemId,
      })
      throw new HTTPError(
        response.status === 401 || response.status === 403
          ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
          : `Failed to list SharePoint drive items (${response.status})`,
        400
      )
    }

    const payload = (await response.json()) as SharePointDriveItemsResponse
    items.push(...(Array.isArray(payload.value) ? payload.value : []))
    const nextPageLink = trimString(payload?.["@odata.nextLink"])
    if (!nextPageLink) {
      nextLink = ""
      continue
    }

    if (!isAllowedSharePointNextLink(nextPageLink)) {
      throw new HTTPError("Invalid SharePoint pagination URL", 400)
    }
    nextLink = nextPageLink
  }

  return items
}

interface SharePointFileRef {
  driveId: string
  itemId: string
  filename: string
  mimetype?: string
}

const isSupportedSharePointFile = (file: SharePointFileRef) => {
  return isKnowledgeFileSupported({
    filename: file.filename,
    mimetype: file.mimetype,
  })
}

const collectFilesRecursive = async (
  bearerToken: string,
  driveId: string,
  folderId?: string
): Promise<SharePointFileRef[]> => {
  const items = await listDriveItems(bearerToken, driveId, folderId)
  const files: SharePointFileRef[] = []

  for (const item of items) {
    const itemId = trimString(item.id)
    const name = trimString(item.name)
    if (!itemId || !name) {
      continue
    }

    if (item.folder) {
      files.push(...(await collectFilesRecursive(bearerToken, driveId, itemId)))
      continue
    }

    if (!item.file) {
      continue
    }

    files.push({
      driveId,
      itemId,
      filename: name,
      mimetype: trimString(item.file.mimeType) || undefined,
    })
  }

  return files
}

const downloadFileBuffer = async (
  bearerToken: string,
  driveId: string,
  itemId: string
) => {
  const response = await fetch(
    `${SHAREPOINT_API_BASE}/drives/${driveId}/items/${itemId}/content`,
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  )
  if (!response.ok) {
    console.error("Failed to download SharePoint file", {
      status: response.status,
      driveId,
      itemId,
    })
    throw new HTTPError(
      response.status === 401 || response.status === 403
        ? "Access denied by Microsoft Graph. Ensure delegated SharePoint read permissions are granted."
        : `Failed to download SharePoint file (${response.status})`,
      400
    )
  }
  return Buffer.from(await response.arrayBuffer())
}

export const fetchSharePointSitesForAgent = async (
  agentId: string
): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
  const trimmedAgentId = trimString(agentId)
  if (!trimmedAgentId) {
    throw new HTTPError("agentId is required", 400)
  }
  const agent = await agentsSdk.getOrThrow(trimmedAgentId)
  const { runs } = await fetchKnowledgeSourceSyncStateForAgent(agent._id!)
  if (!(await hasSharePointWorkspaceConnection())) {
    return { options: [], runs }
  }

  return {
    options: await fetchSharePointSitesByConnection(
      getSharePointCurrentWorkspaceConnectionKey()
    ),
    runs,
  }
}

export const fetchKnowledgeSourceSyncStateForAgent = async (
  agentId: string
): Promise<{ runs: FetchAgentKnowledgeSourceOptionsResponse["runs"] }> => {
  const trimmedAgentId = trimString(agentId)
  if (!trimmedAgentId) {
    throw new HTTPError("agentId is required", 400)
  }
  const db = context.getWorkspaceDB()
  const result = await db.allDocs<AgentKnowledgeSourceSyncState>(
    docIds.getDocParams(
      DocumentType.AGENT_KNOWLEDGE_SOURCE_SYNC_STATE,
      `${trimmedAgentId}_${SHAREPOINT_SOURCE_TYPE}_`,
      { include_docs: true }
    )
  )

  const runs = result.rows
    .map(row => row.doc)
    .filter((doc): doc is AgentKnowledgeSourceSyncState => !!doc?.sourceId)
    .map(doc => ({
      sourceId: doc.sourceId,
      lastRunAt: doc.lastRunAt,
      synced: doc.synced,
      failed: doc.failed,
      skipped: doc.skipped,
      unsupported: doc.unsupported,
      totalDiscovered: doc.totalDiscovered,
      status: doc.status,
    }))

  return { runs }
}

export const deleteKnowledgeSourceSyncStateForAgent = async (
  agentId: string,
  sourceIds?: string[]
) => {
  const trimmedAgentId = trimString(agentId)
  if (!trimmedAgentId) {
    return
  }

  const db = context.getWorkspaceDB()
  const result = await db.allDocs<AgentKnowledgeSourceSyncState>(
    docIds.getDocParams(
      DocumentType.AGENT_KNOWLEDGE_SOURCE_SYNC_STATE,
      `${trimmedAgentId}_${SHAREPOINT_SOURCE_TYPE}_`,
      { include_docs: true }
    )
  )
  const sourceIdSet = sourceIds
    ? new Set(sourceIds.map(id => trimString(id)))
    : null
  const docsToDelete = result.rows
    .map(row => row.doc)
    .filter(
      (doc): doc is AgentKnowledgeSourceSyncState => !!doc?._id && !!doc._rev
    )
    .filter(doc => !sourceIdSet || sourceIdSet.has(doc.sourceId))
    .map(doc => ({
      ...doc,
      _deleted: true,
    }))

  if (docsToDelete.length > 0) {
    await db.bulkDocs(docsToDelete)
  }
}

export const syncSharePointSourcesForAgent = async (
  agentId: string,
  sourceIds?: string[]
): Promise<SyncAgentKnowledgeSourcesResponse> => {
  const lastRunAt = new Date().toISOString()
  const trimmedAgentId = trimString(agentId)
  if (!trimmedAgentId) {
    throw new HTTPError("agentId is required", 400)
  }
  const agent = await agentsSdk.getOrThrow(trimmedAgentId)
  if (getSharePointSources(agent).length === 0) {
    throw new HTTPError("SharePoint is not connected for this agent", 400)
  }

  const existingSites = getSharePointSitesFromSources(agent)
  const sourceIdSet = new Set(
    sourceIds?.map(id => trimString(id)).filter(Boolean)
  )
  const sites =
    sourceIdSet.size > 0
      ? normalizeSites(
          getSharePointSources(agent)
            .filter(source => sourceIdSet.has(trimString(source.id)))
            .map(source => source.config.site)
            .filter((site): site is SharePointSourceSite => !!site?.id)
        )
      : []
  const runSites = sites.length > 0 ? sites : normalizeSites(existingSites)
  const siteIds = runSites.map(site => site.id)

  console.log("Starting SharePoint sync for agent", {
    agentId: trimmedAgentId,
    sourceIds: sourceIds?.length ? sourceIds : "all",
    siteCount: siteIds.length,
    siteIds,
    lastRunAt,
  })

  if (siteIds.length === 0) {
    console.log("SharePoint sync skipped for agent (no sites selected)", {
      agentId: trimmedAgentId,
    })
    return {
      agentId: trimmedAgentId,
      synced: 0,
      failed: 0,
      skipped: 0,
      unsupported: 0,
      totalDiscovered: 0,
    }
  }

  const bearerToken = await getSharePointBearerToken(
    getSharePointCurrentWorkspaceConnectionKey()
  )
  const knowledgeBase = await ensureKnowledgeBaseForAgent(trimmedAgentId)
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new HTTPError("Failed to create agent file storage", 500)
  }

  const existingFiles =
    await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
  const existingExternalIds = new Set(
    existingFiles.map(file => trimString(file.externalSourceId)).filter(Boolean)
  )

  let synced = 0
  let failed = 0
  let skipped = 0
  let unsupported = 0
  let totalDiscovered = 0

  for (const siteId of siteIds) {
    let siteSynced = 0
    let siteFailed = 0
    let siteSkipped = 0
    let siteUnsupported = 0
    let siteTotalDiscovered = 0
    console.log("Starting SharePoint site sync for agent", {
      agentId: trimmedAgentId,
      siteId,
    })
    try {
      const driveIds = await listDrives(bearerToken, siteId)
      console.log("Fetched SharePoint drives for site", {
        agentId: trimmedAgentId,
        siteId,
        driveCount: driveIds.length,
      })
      for (const driveId of driveIds) {
        const files = await collectFilesRecursive(bearerToken, driveId)
        siteTotalDiscovered += files.length
        totalDiscovered += files.length
        for (const file of files) {
          if (!isSupportedSharePointFile(file)) {
            skipped++
            siteSkipped++
            unsupported++
            siteUnsupported++
            continue
          }
          const externalSourceId = `sharepoint:${siteId}:${driveId}:${file.itemId}`
          if (existingExternalIds.has(externalSourceId)) {
            skipped++
            siteSkipped++
            continue
          }

          try {
            const buffer = await downloadFileBuffer(
              bearerToken,
              driveId,
              file.itemId
            )

            await knowledgeBaseSdk.uploadKnowledgeBaseFile({
              knowledgeBaseId,
              filename: file.filename,
              mimetype: file.mimetype,
              size: buffer.byteLength,
              buffer,
              uploadedBy: `sharepoint:${siteId}`,
              externalSourceId,
            })

            existingExternalIds.add(externalSourceId)
            synced++
            siteSynced++
          } catch (error) {
            console.error("Failed to sync SharePoint file for agent", {
              agentId: trimmedAgentId,
              siteId,
              driveId,
              itemId: file.itemId,
              error,
            })
            failed++
            siteFailed++
          }
        }
      }
    } catch (error) {
      console.error("Failed to sync SharePoint site for agent", {
        agentId: trimmedAgentId,
        siteId,
        error,
      })
      failed++
      siteFailed++
    } finally {
      await saveSharePointSyncRunState({
        agentId: trimmedAgentId,
        siteId,
        lastRunAt,
        synced: siteSynced,
        failed: siteFailed,
        skipped: siteSkipped,
        totalDiscovered: siteTotalDiscovered,
      })
      console.log("Completed SharePoint site sync for agent", {
        agentId: trimmedAgentId,
        siteId,
        synced: siteSynced,
        failed: siteFailed,
        skipped: siteSkipped,
        unsupported: siteUnsupported,
        totalDiscovered: siteTotalDiscovered,
      })
    }
  }

  console.log("Completed SharePoint sync for agent", {
    agentId: trimmedAgentId,
    siteCount: siteIds.length,
    synced,
    failed,
    skipped,
    unsupported,
    totalDiscovered,
  })

  return {
    agentId: trimmedAgentId,
    synced,
    failed,
    skipped,
    unsupported,

    totalDiscovered,
  }
}

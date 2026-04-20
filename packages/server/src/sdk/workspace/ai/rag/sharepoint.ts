import { context, db, docIds, HTTPError } from "@budibase/backend-core"
import {
  type Agent,
  type AgentKnowledgeSourceSyncEntry,
  AgentKnowledgeSourceSyncEntryStatus,
  type AgentKnowledgeSourceSyncState,
  AgentKnowledgeSourceSyncRunStatus,
  AgentKnowledgeSourceType,
  type AgentKnowledgeSourceFilterConfig,
  type AgentKnowledgeSource,
  DocumentType,
  type FetchAgentKnowledgeSourceEntriesResponse,
  type FetchAgentKnowledgeSourceOptionsResponse,
  isKnowledgeFileSupported,
  type KnowledgeSourceEntry,
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
import {
  deleteFileForAgent,
  ensureKnowledgeBaseForAgent,
  listFilesForAgent,
} from "./files"

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
  entries,
}: {
  agentId: string
  siteId: string
  lastRunAt: string
  entries: AgentKnowledgeSourceSyncEntry[]
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
    status: getSharePointSyncRunStatus(
      entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.SYNCED
      ).length,
      entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.FAILED
      ).length
    ),
    entries,
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
  path: string
  mimetype?: string
}

const isSupportedSharePointFile = (file: SharePointFileRef) => {
  return isKnowledgeFileSupported({
    filename: file.filename,
    mimetype: file.mimetype,
  })
}

const normalizeSourceFilters = (
  filters?: AgentKnowledgeSourceFilterConfig
): { patterns?: string[] } => {
  const normalize = (value?: string[]) => {
    if (!Array.isArray(value)) {
      return undefined
    }
    const normalized = Array.from(
      new Set(value.map(entry => trimString(entry)).filter(Boolean))
    )
    return normalized.length > 0 ? normalized : undefined
  }
  return { patterns: normalize(filters?.patterns) }
}

const globToRegExp = (pattern: string) => {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  const withGlob = escaped
    .replace(/\\\*\\\*/g, ".*")
    .replace(/\\\*/g, "[^/]*")
    .replace(/\\\?/g, "[^/]")
  return new RegExp(`^${withGlob}$`)
}

export const isSharePointPathIncludedByFilters = (
  path: string,
  filters?: AgentKnowledgeSourceFilterConfig
) => {
  const normalizedPath = trimString(path).toLowerCase()
  const { patterns } = normalizeSourceFilters(filters)

  if (!patterns?.length) {
    return true
  }

  const hasPositivePatterns = patterns.some(pattern => !pattern.startsWith("!"))
  let included = !hasPositivePatterns

  for (const rawPattern of patterns) {
    const isExcludePattern = rawPattern.startsWith("!")
    const normalizedPattern = trimString(
      isExcludePattern ? rawPattern.slice(1) : rawPattern
    ).toLowerCase()
    if (!normalizedPattern) {
      continue
    }
    const globMatcher = globToRegExp(normalizedPattern)
    if (globMatcher.test(normalizedPath)) {
      included = !isExcludePattern
    }
  }

  return included
}

export const isSharePointFileIncludedByFilters = (
  file: SharePointFileRef,
  filters?: AgentKnowledgeSourceFilterConfig
) => {
  return isSharePointPathIncludedByFilters(file.path, filters)
}

const collectFilesRecursive = async (
  bearerToken: string,
  driveId: string,
  folderId?: string,
  parentPath = ""
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
      const nextPath = parentPath ? `${parentPath}/${name}` : name
      files.push(
        ...(await collectFilesRecursive(bearerToken, driveId, itemId, nextPath))
      )
      continue
    }

    if (!item.file) {
      continue
    }

    files.push({
      driveId,
      itemId,
      filename: name,
      path: parentPath ? `${parentPath}/${name}` : name,
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

export const fetchAllSharePointEntriesForAgent = async (
  agentId: string,
  siteId: string
): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
  const trimmedAgentId = trimString(agentId)
  const trimmedSiteId = trimString(siteId)
  if (!trimmedAgentId) {
    throw new HTTPError("agentId is required", 400)
  }
  if (!trimmedSiteId) {
    throw new HTTPError("siteId is required", 400)
  }
  if (!isValidSharePointSiteId(trimmedSiteId)) {
    throw new HTTPError("Invalid SharePoint site id", 400)
  }

  const agent = await agentsSdk.getOrThrow(trimmedAgentId)
  const source = getSharePointSources(agent).find(
    source => trimString(source.config.site?.id) === trimmedSiteId
  )
  if (!source) {
    throw new HTTPError("SharePoint site is not connected for this agent", 404)
  }

  const bearerToken = await getSharePointBearerToken(
    getSharePointCurrentWorkspaceConnectionKey()
  )
  const driveIds = await listDrives(bearerToken, trimmedSiteId)
  const entries: KnowledgeSourceEntry[] = []

  for (const driveId of driveIds) {
    const files = await collectFilesRecursive(bearerToken, driveId)
    for (const file of files) {
      const path = trimString(file.path)
      if (!path) {
        continue
      }
      entries.push({
        id: `${trimString(file.driveId)}:${trimString(file.itemId)}`,
        name: trimString(file.filename) || path.split("/").pop() || path,
        path,
        type: "file",
      })
    }
  }

  entries.sort((a, b) => a.path.localeCompare(b.path))
  return { entries }
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
    .map(doc => {
      const entries = doc.entries || []
      const synced = entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.SYNCED
      ).length
      const failed = entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.FAILED
      ).length
      const excluded = entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.EXCLUDED
      ).length
      const unsupported = entries.filter(
        entry => entry.status === AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED
      ).length
      return {
        sourceId: doc.sourceId,
        lastRunAt: doc.lastRunAt,
        synced,
        failed,
        skipped: excluded + unsupported,
        unsupported,
        totalDiscovered: entries.length,
        status: doc.status,
        entries: doc.entries,
      }
    })

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
  const allSources = getSharePointSources(agent)
  const runSources =
    sourceIdSet.size > 0
      ? allSources.filter(source => sourceIdSet.has(trimString(source.id)))
      : allSources
  const runSites = normalizeSites(
    runSources
      .map(source => source.config.site)
      .filter((site): site is SharePointSourceSite => !!site?.id)
  )
  const fallbackSites = normalizeSites(existingSites)
  const finalRunSites = runSites.length > 0 ? runSites : fallbackSites
  const sourceBySiteId = new Map(
    runSources
      .map(source => {
        const siteId = trimString(source.config.site?.id)
        return siteId ? ([siteId, source] as const) : null
      })
      .filter(
        (entry): entry is readonly [string, AgentKnowledgeSource] => !!entry
      )
  )
  const siteIds = finalRunSites.map(site => site.id)

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
      alreadySynced: 0,
      excluded: 0,
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
  const existingSharePointFilesByExternalId = new Map<
    string,
    { fileId: string; siteId: string }
  >()
  for (const file of existingFiles) {
    const externalId = trimString(file.originFileId)
    const fileId = trimString(file._id)
    if (!externalId || !fileId || !externalId.startsWith("sharepoint:")) {
      continue
    }
    const parts = externalId.split(":")
    const sourceSiteId = trimString(parts[1])
    if (!sourceSiteId) {
      continue
    }
    existingSharePointFilesByExternalId.set(externalId, {
      fileId,
      siteId: sourceSiteId,
    })
  }
  const existingExternalIds = new Set(
    existingSharePointFilesByExternalId.keys()
  )

  let synced = 0
  let failed = 0
  let skipped = 0
  let excluded = 0
  let unsupported = 0
  let totalDiscovered = 0

  for (const siteId of siteIds) {
    let siteSynced = 0
    let siteFailed = 0
    let siteSkipped = 0
    let siteExcluded = 0
    let siteUnsupported = 0
    let siteAlreadySynced = 0
    let sitePruned = 0
    let siteTotalDiscovered = 0
    const siteEntries: AgentKnowledgeSourceSyncEntry[] = []
    const desiredExternalIds = new Set<string>()
    console.log("Starting SharePoint site sync for agent", {
      agentId: trimmedAgentId,
      siteId,
    })
    try {
      const source = sourceBySiteId.get(siteId)
      const knowledgeSourceId = source?.id
      if (!knowledgeSourceId) {
        throw new HTTPError(
          `SharePoint source not found for site ${siteId}`,
          400
        )
      }
      const sourceFilters = source?.config.filters
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
          const originFileId = `sharepoint:${siteId}:${driveId}:${file.itemId}`
          if (!isSharePointFileIncludedByFilters(file, sourceFilters)) {
            excluded++
            siteExcluded++
            siteSkipped++
            siteEntries.push({
              path: file.path,
              originFileId,
              status: AgentKnowledgeSourceSyncEntryStatus.EXCLUDED,
            })
            continue
          }
          if (!isSupportedSharePointFile(file)) {
            skipped++
            siteSkipped++
            unsupported++
            siteUnsupported++
            siteEntries.push({
              path: file.path,
              originFileId,
              status: AgentKnowledgeSourceSyncEntryStatus.UNSUPPORTED,
            })
            continue
          }
          desiredExternalIds.add(originFileId)
          if (existingExternalIds.has(originFileId)) {
            skipped++
            siteSkipped++
            siteAlreadySynced++
            siteEntries.push({
              path: file.path,
              originFileId,
              status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
            })
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
              knowledgeSourceId,
              filename: file.filename,
              sourcePath: file.path,
              mimetype: file.mimetype,
              size: buffer.byteLength,
              buffer,
              uploadedBy: `sharepoint:${siteId}`,
              originFileId,
            })

            existingExternalIds.add(originFileId)
            synced++
            siteSynced++
            siteEntries.push({
              path: file.path,
              originFileId,
              status: AgentKnowledgeSourceSyncEntryStatus.SYNCED,
            })
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
            siteEntries.push({
              path: file.path,
              originFileId,
              status: AgentKnowledgeSourceSyncEntryStatus.FAILED,
              errorMessage:
                error instanceof Error ? error.message : "Upload failed",
            })
          }
        }
      }

      const outOfScopeExternalIds = Array.from(
        existingSharePointFilesByExternalId.entries()
      )
        .filter(
          ([externalId, existing]) =>
            existing.siteId === siteId && !desiredExternalIds.has(externalId)
        )
        .map(([externalId]) => externalId)

      for (const externalId of outOfScopeExternalIds) {
        const existing = existingSharePointFilesByExternalId.get(externalId)
        if (!existing) {
          continue
        }
        try {
          await deleteFileForAgent(trimmedAgentId, existing.fileId)
          existingSharePointFilesByExternalId.delete(externalId)
          existingExternalIds.delete(externalId)
          sitePruned++
        } catch (error) {
          console.error(
            "Failed to delete out-of-scope SharePoint file during sync",
            {
              agentId: trimmedAgentId,
              siteId,
              externalId,
              fileId: existing.fileId,
              error,
            }
          )
          failed++
          siteFailed++
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
        entries: siteEntries,
      })
      console.log("Completed SharePoint site sync for agent", {
        agentId: trimmedAgentId,
        siteId,
        synced: siteSynced,
        failed: siteFailed,
        skipped: siteSkipped,
        excluded: siteExcluded,
        alreadySynced: siteAlreadySynced,
        pruned: sitePruned,
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
    excluded,
    unsupported,
    totalDiscovered,
  })

  return {
    agentId: trimmedAgentId,
    synced,
    failed,
    alreadySynced: skipped - unsupported,
    excluded,
    unsupported,

    totalDiscovered,
  }
}

export const deleteSharePointFilesForAgentSites = async (
  agentId: string,
  siteIds: string[]
) => {
  const trimmedAgentId = trimString(agentId)
  if (!trimmedAgentId) {
    return
  }
  const normalizedSiteIds = Array.from(
    new Set(siteIds.map(siteId => trimString(siteId)).filter(Boolean))
  )
  if (normalizedSiteIds.length === 0) {
    return
  }

  const files = await listFilesForAgent(trimmedAgentId)
  const fileIdsToDelete = files
    .filter(file => {
      const originFileId = trimString(file.originFileId)
      const uploadedBy = trimString(file.uploadedBy)
      return normalizedSiteIds.some(
        siteId =>
          originFileId.startsWith(`sharepoint:${siteId}:`) ||
          uploadedBy === `sharepoint:${siteId}`
      )
    })
    .map(file => file._id)
    .filter((fileId): fileId is string => !!fileId)

  const results = await Promise.allSettled(
    fileIdsToDelete.map(fileId => deleteFileForAgent(trimmedAgentId, fileId))
  )
  const failed = results.filter(result => result.status === "rejected").length
  console.log("SharePoint file cleanup completed for sites", {
    agentId: trimmedAgentId,
    siteIds: normalizedSiteIds,
    deleted: fileIdsToDelete.length - failed,
    failed,
  })
}

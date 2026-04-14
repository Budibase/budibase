<script lang="ts">
  import { Body, Layout, notifications } from "@budibase/bbui"
  import { confirm } from "@/helpers"
  import type { SyncAgentKnowledgeSourcesResponse } from "@budibase/types"
  import {
    AgentKnowledgeSourceType,
    type Agent,
    type KnowledgeSourceEntry,
    type KnowledgeSourceOption,
    type KnowledgeBaseFile,
    type KnowledgeSourceSyncRun,
  } from "@budibase/types"
  import { appStore } from "@/stores/builder/app"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import KnowledgeTable from "./KnowledgeTable.svelte"
  import KnowledgeAddControls from "./KnowledgeAddControls.svelte"
  import SelectSharePointSiteModal from "./SelectSharePointSiteModal.svelte"
  import { onDestroy, onMount } from "svelte"
  import type { KnowledgeTableRow } from "./renderers/types"
  import type { PendingUpload } from "./knowledgeTableRows"
  import {
    toFileTableRows,
    toSharePointConnectionRows,
  } from "./knowledgeTableRows"

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let activeAgentId = $derived(currentAgent?._id)
  let sharePointSources = $derived.by(() =>
    (currentAgent?.knowledgeSources || []).filter(
      source => source.type === AgentKnowledgeSourceType.SHAREPOINT
    )
  )
  let hasSharePointConnection = $derived(sharePointSources.length > 0)
  let loading = $state(true)
  let pendingUploadsByAgent = $state<Record<string, PendingUpload[]>>({})
  let uploadingByAgent = $state<Record<string, boolean>>({})
  let uploadProgressByAgent = $state<Record<string, string>>({})
  let files = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return [] as KnowledgeBaseFile[]
    }
    return $agentsStore.filesByAgentId[agentId] || []
  })

  let initialKnowledgeLoadedForAgent = $state<string | undefined>()
  let sharePointSites = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return [] as KnowledgeSourceOption[]
    }
    return $agentsStore.knowledgeSourceOptionsByAgentId[agentId] || []
  })
  let sharePointSyncRunsBySiteId = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return {} as Record<string, KnowledgeSourceSyncRun>
    }
    return Object.fromEntries(
      ($agentsStore.knowledgeSourceRunsByAgentId[agentId] || []).map(run => [
        run.sourceId,
        run,
      ])
    ) as Record<string, KnowledgeSourceSyncRun>
  })
  let selectedSiteIds = $derived.by(() =>
    sharePointSources
      .map(source => source.config.site?.id)
      .filter((siteId): siteId is string => !!siteId)
  )
  let pendingSiteIds = $state<string[]>([])
  let effectiveSelectedSiteIds = $derived.by(() =>
    Array.from(new Set([...selectedSiteIds, ...pendingSiteIds]))
  )
  let loadingSharePointSites = $state(false)
  let sharePointSiteModal = $state<SelectSharePointSiteModal>()
  let selectedSharePointSiteId = $state("")
  let selectedSharePointEntryPaths = $state<string[]>([])
  let loadingSharePointEntries = $state(false)
  let loadedSharePointEntriesSiteId = $state<string | undefined>()
  let configuringExistingSharePointSite = $state(false)
  let sharePointScopeEditMode = $state(false)
  let selectedSharePointSiteLabel = $state("")
  let shouldOpenSharePointPickerAfterOauth = $state(false)
  let sharePointEntries = $derived.by(() => {
    const agentId = currentAgent?._id
    const siteId = selectedSharePointSiteId
    if (!agentId || !siteId) {
      return [] as KnowledgeSourceEntry[]
    }
    return $agentsStore.knowledgeSourceEntriesByAgentId[agentId]?.[siteId] || []
  })
  let activePendingUploads = $derived(
    activeAgentId ? pendingUploadsByAgent[activeAgentId] || [] : []
  )
  let isUploadingActiveAgent = $derived(
    activeAgentId ? !!uploadingByAgent[activeAgentId] : false
  )
  let activeUploadProgress = $derived(
    activeAgentId ? uploadProgressByAgent[activeAgentId] || "" : ""
  )

  const setPendingUploadsForAgent = (
    agentId: string,
    pendingUploads: PendingUpload[]
  ) => {
    pendingUploadsByAgent = {
      ...pendingUploadsByAgent,
      [agentId]: pendingUploads,
    }
  }

  const removePendingUpload = (agentId: string, tempId: string) => {
    const pendingUploads = pendingUploadsByAgent[agentId] || []
    setPendingUploadsForAgent(
      agentId,
      pendingUploads.filter(upload => upload.tempId !== tempId)
    )
  }

  const setUploadingForAgent = (agentId: string, uploading: boolean) => {
    uploadingByAgent = {
      ...uploadingByAgent,
      [agentId]: uploading,
    }
  }

  const setUploadProgressForAgent = (agentId: string, progress: string) => {
    uploadProgressByAgent = {
      ...uploadProgressByAgent,
      [agentId]: progress,
    }
  }

  const showSharePointSyncResult = (
    result: SyncAgentKnowledgeSourcesResponse
  ) => {
    const skipped = result.skipped - result.unsupported
    const discovered = result.totalDiscovered ?? result.synced + skipped

    if (result.synced === 0 && result.failed === 0) {
      if (discovered === 0) {
        notifications.info("No files found in selected SharePoint site(s)")
        return
      }
      if (skipped > 0) {
        notifications.info(
          `SharePoint sync complete (0 new files, ${skipped} already synced)`
        )
        return
      }
    }

    const message = `SharePoint sync complete (${result.synced} synced${result.failed > 0 ? `, ${result.failed} failed` : ""}${skipped > 0 ? `, ${skipped} skipped` : ""})`

    if (result.failed > 0 && result.synced === 0) {
      notifications.error(message)
    } else if (result.failed > 0) {
      notifications.warning(message)
    } else {
      notifications.success(message)
    }
  }

  const fetchFiles = async (agentId: string) => {
    await agentsStore.fetchAgentFiles(agentId)
  }

  const handleKnowledgeRowClick = (row: KnowledgeTableRow) => {
    if (row.kind !== "sharepoint_connection") {
      return
    }
    openSharePointSiteConfigModal(row.siteId).catch(error => {
      console.error(error)
      notifications.error("Failed to load SharePoint folders/files")
    })
  }

  let fileTableRows = $derived.by(() =>
    toFileTableRows(
      files.filter(file => !file.externalSourceId?.startsWith("sharepoint:")),
      removeFile,
      activePendingUploads
    )
  )
  let sharePointConnectionRows = $derived.by(() => {
    return toSharePointConnectionRows({
      hasSharePointConnection,
      selectedSiteIds: effectiveSelectedSiteIds,
      sharePointSources,
      sharePointSyncRunsBySiteId,
      files,
      loadingSharePointSites,
      onDelete: removeSharePointSite,
      onSync: async sourceId => {
        await syncSharePointNow([sourceId])
      },
      onConfigure: async siteId => {
        await openSharePointSiteConfigModal(siteId)
      },
    })
  })
  let knowledgeTableRows: KnowledgeTableRow[] = $derived.by(() => {
    return [...sharePointConnectionRows, ...fileTableRows]
  })
  let selectedSharePointSyncRun = $derived.by(() =>
    selectedSharePointSiteId
      ? sharePointSyncRunsBySiteId[selectedSharePointSiteId]
      : undefined
  )

  const loadInitialKnowledge = async (agentId: string) => {
    loading = true
    try {
      await agentsStore.fetchAgentFiles(agentId)
      await agentsStore.fetchAgentKnowledgeSourceOptions(agentId)
      initialKnowledgeLoadedForAgent = agentId
    } finally {
      loading = false
    }
  }

  const loadSharePointSites = async (agentId: string) => {
    loadingSharePointSites = true
    try {
      await agentsStore.fetchAgentKnowledgeSourceOptions(agentId)
    } finally {
      loadingSharePointSites = false
    }
  }
  $effect(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      loading = false
      initialKnowledgeLoadedForAgent = undefined
      return
    }
    if (initialKnowledgeLoadedForAgent === agentId) {
      return
    }
    loadInitialKnowledge(agentId).catch(error => {
      console.error(error)
      notifications.error("Failed to load knowledge")
    })
  })

  $effect(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      agentsStore.stopAgentFilePolling()
      return
    }

    agentsStore.startAgentFilePolling(agentId)
    return () => {
      agentsStore.stopAgentFilePolling()
    }
  })

  $effect(() => {
    if (!shouldOpenSharePointPickerAfterOauth) {
      return
    }
    const agentId = currentAgent?._id
    if (!agentId || loading) {
      return
    }
    shouldOpenSharePointPickerAfterOauth = false
    openSharePointSiteModal().catch(error => {
      console.error(error)
      notifications.error("Failed to fetch SharePoint sites")
    })
  })

  onMount(async () => {
    try {
      if (!$agentsStore.agentsLoaded) {
        await agentsStore.init()
      }
      const currentUrl = new URL(window.location.href)
      const microsoftConnected =
        currentUrl.searchParams.get("microsoft_connected") === "1"
      if (microsoftConnected) {
        currentUrl.searchParams.delete("microsoft_connected")
        const query = currentUrl.searchParams.toString()
        const path = query
          ? `${currentUrl.pathname}?${query}`
          : currentUrl.pathname
        window.history.replaceState({}, "", path)
        notifications.success("SharePoint connected")
        shouldOpenSharePointPickerAfterOauth = true
      }
      if (currentAgent?._id && microsoftConnected) {
        initialKnowledgeLoadedForAgent = undefined
      }
    } catch (error) {
      console.error(error)
      notifications.error("Failed to load files")
    }
  })

  function connectSharePoint() {
    const appId = $appStore.appId
    if (!appId) {
      notifications.error("Missing context to connect SharePoint")
      return
    }
    const returnPath = window.location.pathname
    const oauthUrl = `/api/agent/knowledge-sources/sharepoint/connect?appId=${encodeURIComponent(appId)}&returnPath=${encodeURIComponent(returnPath)}`
    window.location.href = oauthUrl
  }

  async function handleAddSharePointKnowledge() {
    if (hasSharePointConnection || sharePointSites.length > 0) {
      await openSharePointSiteModal()
      return
    }
    connectSharePoint()
  }

  async function openSharePointSiteModal() {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    await loadSharePointSites(agentId)
    const selectedSiteIdSet = new Set(effectiveSelectedSiteIds)
    const availableSites = sharePointSites.filter(
      site => !selectedSiteIdSet.has(site.id)
    )
    selectedSharePointSiteId = availableSites[0]?.id || ""
    selectedSharePointEntryPaths = []
    configuringExistingSharePointSite = false
    sharePointScopeEditMode = false
    selectedSharePointSiteLabel = ""
    sharePointSiteModal?.show()
  }

  async function openSharePointSiteConfigModal(siteId: string) {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    selectedSharePointSiteId = siteId
    configuringExistingSharePointSite = true
    sharePointScopeEditMode = true
    const source = sharePointSources.find(s => s.config.site?.id === siteId)
    selectedSharePointSiteLabel =
      source?.config.site?.name || source?.config.site?.webUrl || siteId
    selectedSharePointEntryPaths = source?.config.filters?.includePaths || []
    await loadSharePointEntries(agentId, siteId)
    sharePointSiteModal?.show()
  }

  const loadSharePointEntries = async (agentId: string, siteId: string) => {
    loadingSharePointEntries = true
    try {
      await agentsStore.fetchAgentKnowledgeSourceEntries(agentId, siteId)
    } finally {
      loadingSharePointEntries = false
    }
  }

  $effect(() => {
    const agentId = currentAgent?._id
    const siteId = selectedSharePointSiteId
    if (!configuringExistingSharePointSite || !agentId || !siteId) {
      return
    }
    if (loadedSharePointEntriesSiteId !== siteId) {
      selectedSharePointEntryPaths = []
      loadedSharePointEntriesSiteId = siteId
    }
    loadSharePointEntries(agentId, siteId).catch(error => {
      console.error(error)
      notifications.error("Failed to load SharePoint folders/files")
    })
  })

  async function saveSharePointSites() {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    if (!selectedSharePointSiteId) {
      notifications.error("Please select a SharePoint site")
      return
    }
    try {
      const nextSiteIds = configuringExistingSharePointSite
        ? Array.from(new Set(effectiveSelectedSiteIds))
        : Array.from(
            new Set([...effectiveSelectedSiteIds, selectedSharePointSiteId])
          )
      await agentsStore.setAgentKnowledgeSources(agentId, {
        sourceIds: nextSiteIds,
        sourceFilters: {
          [selectedSharePointSiteId]: {
            includePaths:
              selectedSharePointEntryPaths.length > 0
                ? selectedSharePointEntryPaths
                : undefined,
          },
        },
      })
      pendingSiteIds = nextSiteIds.filter(id => !selectedSiteIds.includes(id))
      sharePointSiteModal?.hide()
      await loadSharePointSites(agentId)
      await fetchFiles(agentId)
      await agentsStore.fetchAgents()
      pendingSiteIds = []
      notifications.success(
        configuringExistingSharePointSite
          ? "SharePoint folders/files updated"
          : "SharePoint site added"
      )
    } catch (error) {
      pendingSiteIds = []
      console.error(error)
      notifications.error("Failed to sync SharePoint")
    }
  }

  async function syncSharePointNow(sourceIds: string[]) {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    if (sourceIds.length === 0) {
      notifications.error("Please select at least one SharePoint site")
      return
    }

    try {
      const result = await agentsStore.syncAgentKnowledgeSources(agentId, {
        sourceIds,
      })
      await loadSharePointSites(agentId)
      await fetchFiles(agentId)
      await agentsStore.fetchAgents()
      showSharePointSyncResult(result)
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync SharePoint")
    }
  }

  async function removeSharePointSite(siteId: string) {
    const agent = currentAgent
    if (!agent?._id || !hasSharePointConnection) {
      return
    }
    const agentId = agent._id
    const siteName =
      sharePointSources
        .map(source => source.config.site)
        .find(site => site?.id === siteId)?.name || "this SharePoint site"

    await confirm({
      title: "Confirm deletion",
      body: `Are you sure you want to remove ${siteName}? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        pendingSiteIds = pendingSiteIds.filter(id => id !== siteId)
        const nextSites = sharePointSources
          .map(source => source.config.site)
          .filter(
            (site): site is { id: string; name?: string; webUrl?: string } =>
              !!site?.id && site.id !== siteId
          )
        const nextSiteIds = nextSites.map(site => site.id)
        try {
          if (nextSiteIds.length === 0) {
            await agentsStore.disconnectAgentKnowledgeSources(agentId)
          } else {
            await agentsStore.setAgentKnowledgeSources(agentId, {
              sourceIds: nextSiteIds,
            })
          }
          await agentsStore.fetchAgents()
          pendingSiteIds = []
          await fetchFiles(agentId)
          if (nextSiteIds.length === 0) {
            await loadSharePointSites(agentId)
          }
          notifications.success("SharePoint site removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove SharePoint site")
        }
      },
    })
  }

  async function removeFile(file: KnowledgeBaseFile) {
    const agentId = currentAgent?._id
    const fileId = file._id
    if (!agentId || !fileId) {
      return
    }

    await confirm({
      title: "Confirm deletion",
      body: `Are you sure you want to remove ${file.filename}? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        try {
          await agentsStore.deleteAgentFile(agentId, fileId)
          await fetchFiles(agentId)
          notifications.success("File removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove file")
        }
      },
    })
  }

  onDestroy(() => {
    agentsStore.stopAgentFilePolling()
  })
</script>

<Layout gap="S" noPadding>
  <div class="section-header">
    <Body size="S">Knowledge</Body>
    <KnowledgeAddControls
      agentId={currentAgent?._id}
      isUploading={isUploadingActiveAgent}
      uploadProgress={activeUploadProgress}
      onPendingUploadsAdded={(agentId, uploads) => {
        setPendingUploadsForAgent(agentId, [
          ...uploads,
          ...(pendingUploadsByAgent[agentId] || []),
        ])
      }}
      onPendingUploadRemoved={(agentId, tempId) => {
        removePendingUpload(agentId, tempId)
      }}
      onUploadingChange={(agentId, uploading, progress) => {
        setUploadingForAgent(agentId, uploading)
        setUploadProgressForAgent(agentId, progress)
      }}
      onUploaded={async agentId => {
        await fetchFiles(agentId)
      }}
      onSharePoint={() =>
        handleAddSharePointKnowledge().catch(error => {
          console.error(error)
          notifications.error("Failed to fetch SharePoint sites")
        })}
    />
  </div>

  <KnowledgeTable
    {loading}
    rows={knowledgeTableRows}
    onRowClick={handleKnowledgeRowClick}
  />
</Layout>

<SelectSharePointSiteModal
  bind:this={sharePointSiteModal}
  title={configuringExistingSharePointSite
    ? `SharePoint - ${selectedSharePointSiteLabel}`
    : "Add from SharePoint"}
  isAddingSite={!configuringExistingSharePointSite}
  {loadingSharePointSites}
  {loadingSharePointEntries}
  {sharePointSites}
  {sharePointEntries}
  syncRun={selectedSharePointSyncRun}
  selectedSiteLabel={selectedSharePointSiteLabel}
  bind:selectedSiteId={selectedSharePointSiteId}
  bind:selectedEntryPaths={selectedSharePointEntryPaths}
  bind:scopeEditMode={sharePointScopeEditMode}
  onSave={saveSharePointSites}
/>

<style>
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

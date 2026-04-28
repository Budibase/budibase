<script lang="ts">
  import { Body, Layout, notifications } from "@budibase/bbui"
  import { confirm } from "@/helpers"
  import type { SyncAgentKnowledgeSourcesResponse } from "@budibase/types"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileStatus,
    type Agent,
    type KnowledgeBaseFile,
    type SharePointKnowledgeSourceSnapshot,
  } from "@budibase/types"
  import { appStore } from "@/stores/builder/app"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import KnowledgeTable from "./KnowledgeTable.svelte"
  import KnowledgeAddControls from "./KnowledgeAddControls.svelte"
  import SelectSharePointSiteModal from "./new/SelectSharePointSiteModal.svelte"
  import { onDestroy, onMount } from "svelte"
  import type {
    KnowledgeTableRow,
    SharePointSelectionMode,
  } from "./renderers/types"
  import type { PendingUpload } from "./knowledgeTableRows"
  import {
    toFileTableRows,
    toSharePointConnectionRows,
  } from "./knowledgeTableRows"
  import DisplaySharePointSiteModal from "./sharepoint/DisplaySharePointSiteModal.svelte"
  import SelectSharePointFilesModal from "./sharepoint/SelectSharePointFilesModal.svelte"
  import {
    coalesceAgentPollRequests,
    createKnowledgePollingController,
  } from "./polling"

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let activeAgentId = $derived(currentAgent?._id)
  let sharePointSources = $derived.by(() =>
    (currentAgent?.knowledgeSources || []).filter(
      source => source.type === AgentKnowledgeSourceType.SHAREPOINT
    )
  )
  let loading = $state(true)
  let pendingUploadsByAgent = $state<Record<string, PendingUpload[]>>({})
  let uploadingByAgent = $state<Record<string, boolean>>({})
  let uploadProgressByAgent = $state<Record<string, string>>({})
  const fetchFiles = coalesceAgentPollRequests(async (agentId: string) => {
    await agentsStore.fetchAgentKnowledge(agentId)
  })
  let files = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return [] as KnowledgeBaseFile[]
    }
    return $agentsStore.knowledgeByAgent[agentId]?.files || []
  })

  let initialKnowledgeLoadedForAgent = $state<string | undefined>()
  let sharePointSourceSnapshots = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return [] as SharePointKnowledgeSourceSnapshot[]
    }
    return $agentsStore.knowledgeByAgent[agentId]?.sharePointSources || []
  })
  let hasSharePointConnection = $derived.by(() => {
    const agentId = currentAgent?._id
    if (!agentId) {
      return false
    }
    return (
      $agentsStore.knowledgeByAgent[agentId]?.hasSharePointConnection || false
    )
  })
  let selectedSiteIds = $derived.by(() =>
    sharePointSources
      .map(source => source.config.site?.id)
      .filter((siteId): siteId is string => !!siteId)
  )
  let selectSharePointSiteModal = $state<SelectSharePointSiteModal>()
  let displaySharePointSiteModal = $state<DisplaySharePointSiteModal>()
  let selectSharePointFilesModal = $state<SelectSharePointFilesModal>()
  let selectedSharePointSiteId = $state("")
  let shouldOpenSharePointPickerAfterOauth = $state(false)
  let loadingSharePointSites = $state(false)
  const KNOWLEDGE_POLL_INTERVAL_MS = 1000
  const knowledgePollingController = createKnowledgePollingController({
    intervalMs: KNOWLEDGE_POLL_INTERVAL_MS,
    onPoll: fetchFiles,
    onError: error => {
      console.error("Failed to poll knowledge files", error)
    },
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

  const stopSharePointBootstrapPolling = () => {
    knowledgePollingController.stop()
  }

  const showSharePointSyncResult = (
    result: SyncAgentKnowledgeSourcesResponse
  ) => {
    const alreadySynced = result.alreadySynced
    const deleted = result.deleted || 0
    const discovered = result.totalDiscovered ?? result.synced + alreadySynced

    if (result.synced === 0 && result.failed === 0) {
      if (deleted > 0 || alreadySynced > 0) {
        const details = [
          alreadySynced > 0 ? `${alreadySynced} already synced` : "",
          deleted > 0 ? `${deleted} removed by filters` : "",
        ]
          .filter(Boolean)
          .join(", ")
        notifications.info(
          `SharePoint sync complete (0 new files${details ? `, ${details}` : ""})`
        )
        return
      }
      if (discovered === 0) {
        notifications.info("No files found in selected SharePoint site(s)")
        return
      }
    }

    const message = `SharePoint sync complete (${result.synced} synced${result.failed > 0 ? `, ${result.failed} failed` : ""}${alreadySynced > 0 ? `, ${alreadySynced} already synced` : ""}${deleted > 0 ? `, ${deleted} removed by filters` : ""})`

    if (result.failed > 0 && result.synced === 0) {
      notifications.error(message)
    } else if (result.failed > 0) {
      notifications.warning(message)
    } else {
      notifications.success(message)
    }
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
      files.filter(file => !file.source),
      removeFile,
      activePendingUploads
    )
  )
  let sharePointConnectionRows = $derived.by(() => {
    return toSharePointConnectionRows({
      sharePointSources,
      sharePointSourceSnapshots,
      loadingSharePointSites,
      onDelete: removeSharePointSite,
      onSync: async sourceId => {
        await syncSharePointNow(sourceId)
      },
    })
  })
  let knowledgeTableRows: KnowledgeTableRow[] = $derived.by(() => {
    return [...sharePointConnectionRows, ...fileTableRows]
  })

  const loadInitialKnowledge = async (agentId: string) => {
    loading = true
    try {
      await agentsStore.fetchAgentKnowledge(agentId)
      initialKnowledgeLoadedForAgent = agentId
    } finally {
      loading = false
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
      knowledgePollingController.stop()
      return
    }
    const hasProcessingFiles = files.some(
      file => file.status === KnowledgeBaseFileStatus.PROCESSING
    )
    const hasUnsyncedSharePointSites = sharePointSourceSnapshots.some(
      source => !source.lastRunAt
    )
    knowledgePollingController.setContinuous(
      agentId,
      hasProcessingFiles || hasUnsyncedSharePointSites
    )
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

  async function openSharePointFlow() {
    if (!hasSharePointConnection) {
      connectSharePoint()
      return
    }
    await openSharePointSiteModal()
  }

  async function openSharePointSiteModal() {
    await selectSharePointSiteModal?.show()
  }

  async function onSharePointSiteCreated(
    siteId: string,
    mode: SharePointSelectionMode
  ) {
    const agentId = currentAgent?._id
    if (agentId) {
      await fetchFiles(agentId)
    }
    selectedSharePointSiteId = siteId
    selectSharePointSiteModal?.hide()
    if (mode === "selective") {
      await selectSharePointFilesModal?.show()
    }
  }

  async function openSharePointSiteSelectionModal(siteId: string) {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }
    selectedSharePointSiteId = siteId
    await selectSharePointFilesModal?.show()
  }

  async function openSharePointSiteConfigModal(siteId: string) {
    selectedSharePointSiteId = siteId
    displaySharePointSiteModal?.show()
  }

  async function syncSharePointNow(sourceId: string) {
    const agentId = currentAgent?._id
    if (!agentId) {
      return
    }

    try {
      const result = await agentsStore.syncAgentKnowledgeSources(
        agentId,
        sourceId
      )
      await fetchFiles(agentId)
      showSharePointSyncResult(result)
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync SharePoint")
    }
  }

  async function removeSharePointSite(siteId: string) {
    const agent = currentAgent
    if (!agent?._id || sharePointSources.length === 0) {
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
        try {
          await agentsStore.disconnectAgentSharePointSite(agentId, siteId)
          await fetchFiles(agentId)
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
    stopSharePointBootstrapPolling()
    knowledgePollingController.stop()
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
        openSharePointFlow().catch(error => {
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
  bind:this={selectSharePointSiteModal}
  agentId={activeAgentId || ""}
  existingSiteIds={selectedSiteIds}
  onCreated={onSharePointSiteCreated}
/>

<DisplaySharePointSiteModal
  bind:this={displaySharePointSiteModal}
  agentId={currentAgent?._id}
  siteId={selectedSharePointSiteId}
  onEdit={openSharePointSiteSelectionModal}
/>

<SelectSharePointFilesModal
  bind:this={selectSharePointFilesModal}
  agentId={currentAgent?._id}
  siteId={selectedSharePointSiteId}
/>

<style>
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

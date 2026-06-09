<script lang="ts">
  import { Body, Button, Layout, notifications, Toggle } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import { confirm } from "@/helpers"
  import { getErrorMessage } from "@/helpers/errors"
  import type { SyncAgentKnowledgeSourcesResponse } from "@budibase/types"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileStatus,
    type Agent,
    type AgentOperation,
    type KnowledgeBaseFile,
    type SharePointKnowledgeSourceSnapshot,
  } from "@budibase/types"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import {
    agentsStore,
    knowledgeConnectionsStore,
    selectedAgent,
  } from "@/stores/portal"
  import KnowledgeTable from "./KnowledgeTable.svelte"
  import KnowledgeAddControls from "./KnowledgeAddControls.svelte"
  import SelectSharePointSiteModal from "./new/SelectSharePointSiteModal.svelte"
  import { onDestroy, onMount } from "svelte"
  import { get } from "svelte/store"
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

  let { operation }: { operation?: AgentOperation } = $props()

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  const getOperationCacheKey = (agentId: string, operationId: string) =>
    `${agentId}:${operationId}`
  let sharePointSources = $derived.by(() =>
    (operation?.knowledgeSources || []).filter(
      source => source.type === AgentKnowledgeSourceType.SHAREPOINT
    )
  )
  let allowKnowledgeSourceDownloadDraft = $state(true)
  let savingAllowKnowledgeSourceDownload = $state(false)

  $effect(() => {
    if (!operation) {
      return
    }

    allowKnowledgeSourceDownloadDraft =
      operation.allowKnowledgeSourceDownload !== false
  })

  const persistAllowKnowledgeSourceDownload = async (next: boolean) => {
    const agent = currentAgent
    if (!agent?._id || !agent._rev || !operation) {
      return
    }

    allowKnowledgeSourceDownloadDraft = next
    savingAllowKnowledgeSourceDownload = true
    try {
      const operations = (agent.operations || []).map(existingOperation =>
        existingOperation.id === operation.id
          ? {
              ...existingOperation,
              allowKnowledgeSourceDownload: next,
            }
          : existingOperation
      )
      await agentsStore.updateAgent({
        ...agent,
        operations,
      })
      await agentsStore.fetchAgents()
      await workspaceDeploymentStore.fetch()
    } catch (error) {
      allowKnowledgeSourceDownloadDraft =
        operation.allowKnowledgeSourceDownload !== false
      notifications.error(
        getErrorMessage(error) || "Failed to save download setting"
      )
    } finally {
      savingAllowKnowledgeSourceDownload = false
    }
  }

  let loading = $state(true)
  let pendingUploadsByOperation = $state<Record<string, PendingUpload[]>>({})
  let uploadingByOperation = $state<Record<string, boolean>>({})
  let uploadProgressByOperation = $state<Record<string, string>>({})
  const fetchFiles = coalesceAgentPollRequests(async (cacheKey: string) => {
    const [agentId] = cacheKey.split(":")
    if (!agentId) {
      return
    }
    await agentsStore.fetchAgentKnowledge(agentId)
  })
  let knowledgeCacheKey = $derived.by(() => {
    if (!currentAgent?._id || !operation?.id) {
      return undefined
    }
    return getOperationCacheKey(currentAgent._id, operation.id)
  })
  let files = $derived.by(() => {
    if (!knowledgeCacheKey) {
      return [] as KnowledgeBaseFile[]
    }
    return $agentsStore.knowledgeByOperation[knowledgeCacheKey]?.files || []
  })

  let initialKnowledgeLoadedForOperation = $state<string | undefined>()
  let sharePointSourceSnapshots = $derived.by(() => {
    if (!knowledgeCacheKey) {
      return [] as SharePointKnowledgeSourceSnapshot[]
    }
    return (
      $agentsStore.knowledgeByOperation[knowledgeCacheKey]?.sharePointSources ||
      []
    )
  })
  let hasSharePointConnection = $derived(
    $knowledgeConnectionsStore.connections.some(
      connection =>
        connection.sourceType === AgentKnowledgeSourceType.SHAREPOINT
    )
  )
  let selectedSiteIds = $derived.by(() =>
    sharePointSources
      .map(source => source.config.site.id)
      .filter((siteId): siteId is string => !!siteId)
  )
  let selectSharePointSiteModal = $state<SelectSharePointSiteModal>()
  let displaySharePointSiteModal = $state<DisplaySharePointSiteModal>()
  let selectSharePointFilesModal = $state<SelectSharePointFilesModal>()
  let selectedSharePointSiteId = $state("")
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
    knowledgeCacheKey ? pendingUploadsByOperation[knowledgeCacheKey] || [] : []
  )
  let isUploadingActiveAgent = $derived(
    knowledgeCacheKey ? !!uploadingByOperation[knowledgeCacheKey] : false
  )
  let activeUploadProgress = $derived(
    knowledgeCacheKey ? uploadProgressByOperation[knowledgeCacheKey] || "" : ""
  )

  let resetting = $state(false)
  let hasStoreAccessFailures = $derived(
    files.some(
      file =>
        file.status === KnowledgeBaseFileStatus.FAILED &&
        file.errorMessage?.includes("Reset store")
    )
  )

  const setPendingUploadsForOperation = (
    cacheKey: string,
    pendingUploads: PendingUpload[]
  ) => {
    pendingUploadsByOperation = {
      ...pendingUploadsByOperation,
      [cacheKey]: pendingUploads,
    }
  }

  const removePendingUpload = (cacheKey: string, tempId: string) => {
    const pendingUploads = pendingUploadsByOperation[cacheKey] || []
    setPendingUploadsForOperation(
      cacheKey,
      pendingUploads.filter(upload => upload.tempId !== tempId)
    )
  }

  const setUploadingForOperation = (cacheKey: string, uploading: boolean) => {
    uploadingByOperation = {
      ...uploadingByOperation,
      [cacheKey]: uploading,
    }
  }

  const setUploadProgressForOperation = (
    cacheKey: string,
    progress: string
  ) => {
    uploadProgressByOperation = {
      ...uploadProgressByOperation,
      [cacheKey]: progress,
    }
  }

  const stopSharePointBootstrapPolling = () => {
    knowledgePollingController.stop()
  }

  const refreshDeploymentStatus = async () => {
    await workspaceDeploymentStore.fetch()
  }

  const syncOperationKnowledgeFromStore = () => {
    if (!operation) {
      return
    }

    const latestAgent = get(selectedAgent)
    const latestOperation = latestAgent?.operations?.find(
      latest => latest.id === operation.id
    )

    operation.knowledgeBases = latestOperation?.knowledgeBases
    operation.knowledgeSources = latestOperation?.knowledgeSources
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

  const loadInitialKnowledge = async (agentId: string, operationId: string) => {
    loading = true
    try {
      if (
        !$agentsStore.knowledgeByOperation[
          getOperationCacheKey(agentId, operationId)
        ]
      ) {
        await agentsStore.fetchAgentKnowledge(agentId)
      }
      initialKnowledgeLoadedForOperation = getOperationCacheKey(
        agentId,
        operationId
      )
    } finally {
      loading = false
    }
  }

  $effect(() => {
    const agentId = currentAgent?._id
    const operationId = operation?.id
    if (!agentId || !operationId) {
      loading = false
      initialKnowledgeLoadedForOperation = undefined
      return
    }
    const cacheKey = getOperationCacheKey(agentId, operationId)
    if (initialKnowledgeLoadedForOperation === cacheKey) {
      return
    }
    loadInitialKnowledge(agentId, operationId).catch(error => {
      console.error(error)
      notifications.error("Failed to load knowledge")
    })
  })

  $effect(() => {
    const agentId = currentAgent?._id
    const operationId = operation?.id
    if (!agentId || !operationId) {
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
      `${agentId}:${operationId}`,
      hasProcessingFiles || hasUnsyncedSharePointSites
    )
  })

  onMount(async () => {
    try {
      if (!$agentsStore.agentsLoaded) {
        await agentsStore.init()
      }
    } catch (error) {
      console.error(error)
      notifications.error("Failed to load files")
    }
  })

  async function openSharePointFlow() {
    if (!hasSharePointConnection) {
      bb.settings("/connections/apis/new/microsoft-sharepoint")
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
    const operationId = operation?.id
    syncOperationKnowledgeFromStore()
    if (agentId && operationId) {
      await fetchFiles(getOperationCacheKey(agentId, operationId))
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
    const operationId = operation?.id
    if (!agentId || !operationId) {
      return
    }

    try {
      const result = await agentsStore.syncOperationKnowledgeSources(
        agentId,
        operationId,
        sourceId
      )
      await Promise.all([
        fetchFiles(getOperationCacheKey(agentId, operationId)),
        refreshDeploymentStatus(),
      ])
      showSharePointSyncResult(result)
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync SharePoint")
    }
  }

  async function removeSharePointSite(siteId: string) {
    const agent = currentAgent
    const operationId = operation?.id
    if (!agent?._id || !operationId || sharePointSources.length === 0) {
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
          await agentsStore.disconnectOperationSharePointSite(
            agentId,
            operationId,
            siteId
          )
          syncOperationKnowledgeFromStore()
          await fetchFiles(getOperationCacheKey(agentId, operationId))
          await refreshDeploymentStatus()
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
    const operationId = operation?.id
    const fileId = file._id
    if (!agentId || !operationId || !fileId) {
      return
    }

    await confirm({
      title: "Confirm deletion",
      body: `Are you sure you want to remove ${file.filename}? This action can't be undone.`,
      okText: "Delete",
      onConfirm: async () => {
        try {
          await agentsStore.deleteOperationFile(agentId, operationId, fileId)
          await fetchFiles(getOperationCacheKey(agentId, operationId))
          await refreshDeploymentStatus()
          notifications.success("File removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove file")
        }
      },
    })
  }

  async function resetKnowledgeStore() {
    const agentId = currentAgent?._id
    const operationId = operation?.id
    if (!agentId || !operationId) {
      return
    }

    await confirm({
      title: "Reset knowledge store",
      body: `This will recreate the underlying vector store and re-queue all sync files for ingestion. Use this if uploads are failing due to an inaccessible store.`,
      okText: "Reset",
      onConfirm: async () => {
        resetting = true
        try {
          await agentsStore.resetOperationKnowledgeBaseStore(
            agentId,
            operationId
          )
          notifications.success(
            "Knowledge store reset - files are re-queued for ingestion"
          )
        } catch (error) {
          console.error(error)
          notifications.error("Failed to reset knowledge store")
        } finally {
          resetting = false
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
    <div class="section-header-actions">
      {#if hasStoreAccessFailures}
        <Button
          quiet
          size="S"
          secondary
          disabled={resetting}
          iconColor="var(--orange)"
          icon="cloud-rain"
          on:click={resetKnowledgeStore}
        >
          Reset store
        </Button>
      {/if}
      <KnowledgeAddControls
        agentId={currentAgent?._id}
        operationId={operation?.id}
        isUploading={isUploadingActiveAgent}
        uploadProgress={activeUploadProgress}
        onPendingUploadsAdded={(cacheKey, uploads) => {
          setPendingUploadsForOperation(cacheKey, [
            ...uploads,
            ...(pendingUploadsByOperation[cacheKey] || []),
          ])
        }}
        onPendingUploadRemoved={(cacheKey, tempId) => {
          removePendingUpload(cacheKey, tempId)
        }}
        onUploadingChange={(cacheKey, uploading, progress) => {
          setUploadingForOperation(cacheKey, uploading)
          setUploadProgressForOperation(cacheKey, progress)
        }}
        onUploaded={async (agentId, operationId) => {
          await fetchFiles(getOperationCacheKey(agentId, operationId))
          syncOperationKnowledgeFromStore()
          await refreshDeploymentStatus()
        }}
        onSharePoint={() =>
          openSharePointFlow().catch(error => {
            console.error(error)
            notifications.error("Failed to fetch SharePoint sites")
          })}
      />
    </div>
  </div>

  <div class="sources-access">
    <Toggle
      value={allowKnowledgeSourceDownloadDraft}
      disabled={savingAllowKnowledgeSourceDownload || !currentAgent?._id}
      on:change={event =>
        persistAllowKnowledgeSourceDownload(Boolean(event.detail))}
    />
    <div>
      <Body
        color={"var(--spectrum-global-color-gray-900)"}
        weight="500"
        size="XS"
      >
        Allow users to download knowledge source files from chat
      </Body>
      <Body color={"var(--spectrum-global-color-gray-700)"} size="XS">
        When disabled, chat still shows which files were used, without a
        download link.
      </Body>
    </div>
  </div>

  <KnowledgeTable
    {loading}
    isUploading={isUploadingActiveAgent}
    rows={knowledgeTableRows}
    onRowClick={handleKnowledgeRowClick}
  />
</Layout>

<SelectSharePointSiteModal
  bind:this={selectSharePointSiteModal}
  agentId={currentAgent?._id || ""}
  operationId={operation?.id}
  existingSiteIds={selectedSiteIds}
  onCreated={onSharePointSiteCreated}
/>

<DisplaySharePointSiteModal
  bind:this={displaySharePointSiteModal}
  agentId={currentAgent?._id}
  operationId={operation?.id}
  siteId={selectedSharePointSiteId}
  onEdit={openSharePointSiteSelectionModal}
/>

<SelectSharePointFilesModal
  bind:this={selectSharePointFilesModal}
  agentId={currentAgent?._id}
  operationId={operation?.id}
  siteId={selectedSharePointSiteId}
/>

<style>
  .sources-access {
    display: flex;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .section-header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>

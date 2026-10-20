<script lang="ts">
  import { Body, Button, Layout, notifications, Toggle } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import { confirm } from "@/helpers"
  import {
    AgentKnowledgeSourceType,
    KnowledgeBaseFileStatus,
    type Agent,
    type AgentOperation,
    type KnowledgeBaseFile,
  } from "@budibase/types"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import {
    agentsStore,
    knowledgeConnectionsStore,
    selectedAgent,
  } from "@/stores/portal"
  import KnowledgeCardList from "./KnowledgeCardList.svelte"
  import KnowledgeAddControls from "./KnowledgeAddControls.svelte"
  import OperationRailSectionHeader from "../OperationRailSectionHeader.svelte"
  import SelectSharePointSiteModal from "./new/SelectSharePointSiteModal.svelte"
  import { onDestroy, onMount } from "svelte"
  import type {
    KnowledgeTableRow,
    SharePointSelectionMode,
  } from "./renderers/types"
  import {
    toFileKnowledgeRows,
    toSharePointConnectionRows,
  } from "./knowledgeTableRows"
  import KnowledgeDetailsModal from "./KnowledgeDetailsModal.svelte"
  import SelectSharePointFilesModal from "./sharepoint/SelectSharePointFilesModal.svelte"
  import { tick } from "svelte"

  let {
    operation = $bindable(),
    onUpdated,
  }: { operation: AgentOperation; onUpdated: () => Promise<boolean> } = $props()

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let sharePointSources = $derived.by(() =>
    (operation.knowledgeSources || []).filter(
      source => source.type === AgentKnowledgeSourceType.SHAREPOINT
    )
  )

  let savingAllowKnowledgeSourceDownload = $state(false)
  let resetting = $state(false)
  let selectedSharePointSiteId = $state("")
  let selectSharePointSiteModal = $state<SelectSharePointSiteModal>()
  let knowledgeDetailsModal = $state<KnowledgeDetailsModal>()
  let selectedKnowledgeRow = $state<KnowledgeTableRow>()
  let selectSharePointFilesModal = $state<SelectSharePointFilesModal>()

  let agentId = $derived(currentAgent?._id)
  let operationId = $derived(operation.id)

  let files = $derived.by(() => {
    if (!agentId || !operationId) {
      return []
    }

    // agentsStore getters use get() internally, so $derived must read $agentsStore
    // to subscribe — otherwise polling updates never re-render these values.
    const _store = $agentsStore

    return agentsStore.getOperationKnowledge(agentId, operationId)?.files || []
  })

  let sharePointSourceSnapshots = $derived.by(() => {
    if (!agentId || !operationId) {
      return []
    }
    const _store = $agentsStore

    return (
      agentsStore.getOperationKnowledge(agentId, operationId)
        ?.sharePointSources || []
    )
  })

  let loading = $derived.by(() => {
    if (!agentId || !operationId) {
      return false
    }
    const _store = $agentsStore
    return agentsStore.isOperationKnowledgeLoading(agentId, operationId)
  })

  let uploadState = $derived.by(() => {
    if (!agentId || !operationId) {
      return {
        pendingUploads: [],
        rejectedUploads: [],
        uploading: false,
        progress: "",
      }
    }
    const _store = $agentsStore
    return agentsStore.getOperationUploadState(agentId, operationId)
  })

  let knowledgeSearchConfigured = $derived.by(() => {
    const _store = $agentsStore
    return agentsStore.getKnowledgeConfiguration()?.knowledgeSearchConfigured
  })
  let knowledgeSearchUnavailable = $derived(knowledgeSearchConfigured !== true)
  let knowledgeActionsTooltip = $derived(
    knowledgeSearchUnavailable
      ? "Set GEMINI_API_KEY on your local environment and restart Budibase."
      : undefined
  )

  let hasSharePointConnection = $derived(
    $knowledgeConnectionsStore.connections.some(
      connection =>
        connection.sourceType === AgentKnowledgeSourceType.SHAREPOINT
    )
  )
  let hasSharePointDatasource = $derived(
    $knowledgeConnectionsStore.sharePointDatasourceIds.length > 0
  )
  let selectedSiteIds = $derived.by(() =>
    sharePointSources
      .map(source => source.config.site.id)
      .filter((siteId): siteId is string => !!siteId)
  )
  let hasStoreAccessFailures = $derived(
    files.some(
      file =>
        file.status === KnowledgeBaseFileStatus.FAILED &&
        file.errorMessage?.includes("Reset store")
    )
  )

  const refreshDeploymentStatus = async () => {
    await workspaceDeploymentStore.fetch()
  }

  const syncOperationFromStore = () => {
    if (!agentId || !operationId) {
      return
    }
    const latest = agentsStore.getAgentOperation(agentId, operationId)
    if (!latest) {
      return
    }
    operation.knowledgeBases = latest.knowledgeBases
    operation.knowledgeSources = latest.knowledgeSources
    operation.allowKnowledgeSourceDownload = latest.allowKnowledgeSourceDownload
  }

  let fileTableRows = $derived.by(() =>
    toFileKnowledgeRows({
      files: files.filter(file => !file.source),
      pendingUploads: uploadState.pendingUploads,
      rejectedUploads: uploadState.rejectedUploads,
      knowledgeSearchConfigured: knowledgeSearchConfigured === true,
      onDelete: removeFile,
      onRetry: retryFile,
      onRetryRejected: uploadState.uploading ? undefined : retryRejectedUpload,
      onDismissRejected: dismissRejectedUpload,
    })
  )
  let sharePointConnectionRows = $derived.by(() =>
    toSharePointConnectionRows({
      sharePointSources,
      sharePointSourceSnapshots,
      onDelete: removeSharePointSite,
      onSync: syncSharePointNow,
      knowledgeSearchConfigured: knowledgeSearchConfigured === true,
    })
  )
  let knowledgeTableRows: KnowledgeTableRow[] = $derived.by(() => [
    ...sharePointConnectionRows,
    ...fileTableRows,
  ])

  let currentKnowledgeRow = $derived(
    knowledgeTableRows.find(
      row =>
        row.kind === selectedKnowledgeRow?.kind &&
        row._id === selectedKnowledgeRow?._id
    )
  )

  $effect(() => {
    if (selectedKnowledgeRow && !currentKnowledgeRow) {
      knowledgeDetailsModal?.hide()
      selectedKnowledgeRow = undefined
    }
  })

  $effect(() => {
    if (!agentId || !operationId) {
      return
    }
    agentsStore
      .ensureOperationKnowledgeLoaded(agentId, operationId)
      .catch(error => {
        console.error(error)
        notifications.error("Failed to load knowledge")
      })
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

  onDestroy(() => {
    agentsStore.stopOperationKnowledgePolling()
  })

  async function openSharePointFlow() {
    if (!hasSharePointConnection) {
      if (hasSharePointDatasource) {
        await selectSharePointSiteModal?.show()
        return
      }
      bb.settings("/connections/apis/new/microsoft-sharepoint")
      return
    }
    await selectSharePointSiteModal?.show()
  }

  async function onSharePointSiteCreated(
    siteId: string,
    mode: SharePointSelectionMode
  ) {
    if (!agentId || !operationId) {
      return
    }
    syncOperationFromStore()
    selectedSharePointSiteId = siteId
    selectSharePointSiteModal?.hide()
    if (mode === "selective") {
      await selectSharePointFilesModal?.show()
    }
  }

  async function openSharePointSiteSelectionModal(siteId: string) {
    selectedSharePointSiteId = siteId
    await selectSharePointFilesModal?.show()
  }

  const handleKnowledgeRowClick = (row: KnowledgeTableRow) => {
    selectedKnowledgeRow = row
    knowledgeDetailsModal?.show()
  }

  async function syncSharePointNow(sourceId: string) {
    if (!agentId || !operationId) {
      return
    }

    try {
      await agentsStore.syncOperationKnowledgeSources(
        agentId,
        operationId,
        sourceId
      )
      await refreshDeploymentStatus()
      notifications.info("SharePoint sync started")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync SharePoint")
    }
  }

  async function removeSharePointSite(siteId: string) {
    if (!agentId || !operationId || sharePointSources.length === 0) {
      return
    }
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
          syncOperationFromStore()
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
          await agentsStore.removeOperationKnowledgeFile(
            agentId,
            operationId,
            fileId
          )
          await refreshDeploymentStatus()
          notifications.success("File removed")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to remove file")
        }
      },
    })
  }

  async function retryFile(file: KnowledgeBaseFile) {
    const fileId = file._id
    if (!agentId || !operationId || !fileId) {
      return
    }
    try {
      await agentsStore.retryOperationKnowledgeFile({
        agentId,
        operationId,
        fileId,
      })
    } catch (error) {
      console.error(error)
      notifications.error(`Failed to retry ${file.filename}`)
    }
  }

  async function retryRejectedUpload(tempId: string) {
    if (!agentId || !operationId) {
      return
    }
    try {
      const result = await agentsStore.retryRejectedUpload({
        agentId,
        operationId,
        tempId,
      })
      if (result.successfulUploads > 0) {
        syncOperationFromStore()
        await refreshDeploymentStatus()
      }
    } catch (error) {
      console.error(error)
      notifications.error("Failed to retry upload")
    }
  }

  function dismissRejectedUpload(tempId: string) {
    if (!agentId || !operationId) {
      return
    }
    agentsStore.dismissRejectedUpload({ agentId, operationId, tempId })
  }

  async function resetKnowledgeStore() {
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
</script>

<Layout gap="S" noPadding>
  <div class="knowledge-section">
    <OperationRailSectionHeader
      title="Knowledge"
      description="Add files and sources this operation can search when handling requests."
    >
      {#snippet actions()}
        <div class="section-header-actions">
          {#if hasStoreAccessFailures}
            <Button
              quiet
              size="S"
              secondary
              tooltip={knowledgeActionsTooltip}
              disabled={resetting || knowledgeSearchUnavailable}
              iconColor="var(--orange)"
              icon="cloud-rain"
              on:click={resetKnowledgeStore}
            >
              Reset store
            </Button>
          {/if}
          <KnowledgeAddControls
            {agentId}
            {operationId}
            disabled={knowledgeSearchUnavailable}
            tooltip={knowledgeActionsTooltip}
            onUploaded={async () => {
              syncOperationFromStore()
              await refreshDeploymentStatus()
            }}
            onSharePoint={() =>
              openSharePointFlow().catch(error => {
                console.error(error)
                notifications.error("Failed to fetch SharePoint sites")
              })}
          />
        </div>
      {/snippet}
    </OperationRailSectionHeader>

    {#if knowledgeTableRows.length}
      <div class="sources-access">
        <Toggle
          bind:value={operation.allowKnowledgeSourceDownload}
          disabled={savingAllowKnowledgeSourceDownload || !agentId}
          on:change={async () => {
            savingAllowKnowledgeSourceDownload = true
            try {
              await tick()
              await onUpdated()
            } finally {
              savingAllowKnowledgeSourceDownload = false
            }
          }}
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
    {/if}

    <KnowledgeCardList
      {loading}
      isUploading={uploadState.uploading}
      rows={knowledgeTableRows}
      onRowClick={handleKnowledgeRowClick}
    />
  </div>
</Layout>

<SelectSharePointSiteModal
  bind:this={selectSharePointSiteModal}
  agentId={agentId || ""}
  {operationId}
  existingSiteIds={selectedSiteIds}
  onCreated={onSharePointSiteCreated}
/>

<KnowledgeDetailsModal
  bind:this={knowledgeDetailsModal}
  row={currentKnowledgeRow}
  {agentId}
  {operationId}
  onEdit={openSharePointSiteSelectionModal}
/>

<SelectSharePointFilesModal
  bind:this={selectSharePointFilesModal}
  {agentId}
  {operationId}
  siteId={selectedSharePointSiteId}
/>

<style>
  .knowledge-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sources-access {
    display: flex;
  }

  .section-header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>

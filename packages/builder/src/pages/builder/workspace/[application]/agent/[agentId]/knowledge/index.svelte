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
  import type {
    KnowledgeTableRow,
    SharePointSelectionMode,
  } from "./renderers/types"
  import {
    toFileTableRows,
    toSharePointConnectionRows,
  } from "./knowledgeTableRows"
  import DisplaySharePointSiteModal from "./sharepoint/DisplaySharePointSiteModal.svelte"
  import SelectSharePointFilesModal from "./sharepoint/SelectSharePointFilesModal.svelte"

  let { operation = $bindable() }: { operation: AgentOperation } = $props()

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
  let displaySharePointSiteModal = $state<DisplaySharePointSiteModal>()
  let selectSharePointFilesModal = $state<SelectSharePointFilesModal>()

  let agentId = $derived(currentAgent?._id)
  let operationId = $derived(operation.id)

  let files = $derived.by(() => {
    if (!agentId || !operationId) {
      return []
    }
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
      return { pendingUploads: [], uploading: false, progress: "" }
    }
    const _store = $agentsStore
    return agentsStore.getOperationUploadState(agentId, operationId)
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
    operation = {
      ...operation,
      knowledgeBases: latest.knowledgeBases,
      knowledgeSources: latest.knowledgeSources,
    }
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

  const persistAllowKnowledgeSourceDownload = async (next: boolean) => {
    if (!agentId || !operationId) {
      return
    }

    savingAllowKnowledgeSourceDownload = true
    try {
      await agentsStore.updateOperationAllowKnowledgeSourceDownload(
        agentId,
        operationId,
        next
      )
      await refreshDeploymentStatus()
    } catch (error) {
      notifications.error(
        getErrorMessage(error) || "Failed to save download setting"
      )
    } finally {
      savingAllowKnowledgeSourceDownload = false
    }
  }

  let fileTableRows = $derived.by(() =>
    toFileTableRows(
      files.filter(file => !file.source),
      removeFile,
      uploadState.pendingUploads
    )
  )
  let sharePointConnectionRows = $derived.by(() =>
    toSharePointConnectionRows({
      sharePointSources,
      sharePointSourceSnapshots,
      onDelete: removeSharePointSite,
      onSync: syncSharePointNow,
    })
  )
  let knowledgeTableRows: KnowledgeTableRow[] = $derived.by(() => [
    ...sharePointConnectionRows,
    ...fileTableRows,
  ])

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

  async function openSharePointSiteConfigModal(siteId: string) {
    selectedSharePointSiteId = siteId
    displaySharePointSiteModal?.show()
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

  async function syncSharePointNow(sourceId: string) {
    if (!agentId || !operationId) {
      return
    }

    try {
      const result = await agentsStore.syncOperationKnowledgeSources(
        agentId,
        operationId,
        sourceId
      )
      await refreshDeploymentStatus()
      showSharePointSyncResult(result)
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
    if (!agentId || !operationId || !file._id) {
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
            file._id!
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
        {agentId}
        {operationId}
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
  </div>

  <div class="sources-access">
    <Toggle
      bind:value={operation.allowKnowledgeSourceDownload}
      disabled={savingAllowKnowledgeSourceDownload || !agentId}
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
    isUploading={uploadState.uploading}
    rows={knowledgeTableRows}
    onRowClick={handleKnowledgeRowClick}
  />
</Layout>

<SelectSharePointSiteModal
  bind:this={selectSharePointSiteModal}
  agentId={agentId || ""}
  {operationId}
  existingSiteIds={selectedSiteIds}
  onCreated={onSharePointSiteCreated}
/>

<DisplaySharePointSiteModal
  bind:this={displaySharePointSiteModal}
  {agentId}
  {operationId}
  siteId={selectedSharePointSiteId}
  onEdit={openSharePointSiteSelectionModal}
/>

<SelectSharePointFilesModal
  bind:this={selectSharePointFilesModal}
  {agentId}
  {operationId}
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

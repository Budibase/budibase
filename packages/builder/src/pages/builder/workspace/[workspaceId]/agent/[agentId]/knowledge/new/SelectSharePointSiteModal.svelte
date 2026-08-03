<script lang="ts">
  import { Helpers, notifications } from "@budibase/bbui"
  import {
    SourceName,
    type Datasource,
    type KnowledgeSourceOption,
    type UIIntegration,
  } from "@budibase/types"
  import { datasources, workspaceDeploymentStore } from "@/stores/builder"
  import { sortedIntegrations } from "@/stores/builder/sortedIntegrations"
  import { bb } from "@/stores/bb"
  import { agentsStore, knowledgeConnectionsStore } from "@/stores/portal"
  import type { SharePointSelectionMode } from "../renderers/types"
  import { EXCLUDE_ALL_PATTERN } from "../sharepoint/sharePointModalUtils"
  import SharePointConnectionStepModal, {
    type SharePointConnectionOption,
  } from "./SharePointConnectionStepModal.svelte"
  import SharePointSiteStepModal from "./SharePointSiteStepModal.svelte"
  import SharePointQuickAddModal from "./SharePointQuickAddModal.svelte"
  import {
    saveSharePointQuickDatasource,
    SHAREPOINT_TEMPLATE_ID,
    type SharePointQuickAddCredentials,
  } from "./sharePointQuickAdd"

  export interface Props {
    agentId: string
    operationId: string
    existingSiteIds?: string[]
    onCreated?: (
      siteId: string,
      mode: SharePointSelectionMode
    ) => Promise<void> | void
  }

  let {
    agentId,
    operationId,
    existingSiteIds = [],
    onCreated,
  }: Props = $props()

  let sharePointSites = $state<KnowledgeSourceOption[]>([])
  let sharePointConnectionOptions = $state<SharePointConnectionOption[]>([])
  let selectedSiteId = $state("")
  let selectedConnectionId = $state("")
  let selectedDatasourceId = $state("")
  let selectedAuthConfigId = $state("")
  let siteLoadError = $state("")
  let loadingNextStep = $state(false)
  let saving = $state(false)
  let savingQuickConnection = $state(false)
  let quickConnectionError = $state("")
  let quickDatasource = $state<Datasource>()
  let quickAuthConfigId = $state("")
  let skippedConnectionStep = $state(false)

  let connectionStepModal = $state<SharePointConnectionStepModal>()
  let siteStepModal = $state<SharePointSiteStepModal>()
  let quickAddModal = $state<SharePointQuickAddModal>()

  let restIntegration = $derived(
    $sortedIntegrations.find(
      (integration): integration is UIIntegration =>
        integration.name === SourceName.REST
    )
  )

  const availableSites = $derived.by(() => {
    const excluded = new Set(existingSiteIds)
    return sharePointSites.filter(site => !excluded.has(site.id))
  })

  const siteEmptyMessage = $derived(
    sharePointSites.length > 0 && availableSites.length === 0
      ? "All SharePoint sites for this connection have already been added."
      : "No SharePoint sites found for this connection."
  )

  const loadSharePointConnections = async () => {
    if (!agentId) {
      sharePointConnectionOptions = []
      selectedConnectionId = ""
      sharePointSites = []
      selectedSiteId = ""
      return
    }
    try {
      const connections = $knowledgeConnectionsStore.connections
      const sharePointConnections = connections.filter(
        connection => connection.sourceType === "sharepoint"
      )
      sharePointConnectionOptions = sharePointConnections.map(connection => ({
        id: connection._id!,
        name: connection.datasourceName,
        account: connection.authConfigName,
      }))
      selectedConnectionId = sharePointConnections[0]?._id || ""
      selectedDatasourceId = sharePointConnections[0]?.datasourceId || ""
      selectedAuthConfigId = sharePointConnections[0]?.authConfigId || ""
    } catch (error) {
      console.error(error)
      notifications.error("Failed to fetch SharePoint connections")
      sharePointConnectionOptions = []
      selectedConnectionId = ""
    }
  }

  const loadSharePointSites = async () => {
    if (!selectedConnectionId) {
      sharePointSites = []
      selectedSiteId = ""
      siteLoadError = ""
      return
    }
    sharePointSites = []
    selectedSiteId = ""
    siteLoadError = ""
    try {
      const response = await agentsStore.fetchAgentKnowledgeSourceOptions(
        selectedDatasourceId,
        selectedAuthConfigId
      )
      sharePointSites = response.options
      const excluded = new Set(existingSiteIds)
      selectedSiteId =
        sharePointSites.find(site => !excluded.has(site.id))?.id || ""
    } catch (error) {
      console.error(error)
      const message = getErrorMessage(
        error,
        "Failed to fetch SharePoint sites for this auth config."
      )
      siteLoadError = message
      notifications.error(`Error fetching sites: ${message}`)
      sharePointSites = []
      selectedSiteId = ""
    }
  }

  const goToSitesStep = async () => {
    if (!selectedConnectionId) {
      return
    }
    loadingNextStep = true
    try {
      await loadSharePointSites()
      if (siteLoadError) {
        return
      }
      connectionStepModal?.hide()
      siteStepModal?.show()
    } finally {
      loadingNextStep = false
    }
  }

  const getErrorMessage = (
    error: unknown,
    fallback = "Failed to connect to SharePoint."
  ) => {
    if (typeof error !== "object" || error === null) {
      return fallback
    }
    if ("cause" in error) {
      const cause = error.cause
      if (
        typeof cause === "object" &&
        cause !== null &&
        "message" in cause &&
        typeof cause.message === "string"
      ) {
        return cause.message
      }
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
    return fallback
  }

  const saveQuickConnection = async (
    credentials: SharePointQuickAddCredentials
  ) => {
    if (!restIntegration || savingQuickConnection) {
      return
    }

    savingQuickConnection = true
    quickConnectionError = ""
    try {
      quickAuthConfigId ||= Helpers.uuid()
      quickDatasource = await saveSharePointQuickDatasource({
        credentials,
        authConfigId: quickAuthConfigId,
        integration: restIntegration,
        existingDatasource: quickDatasource,
        createDatasource: params => datasources.create(params),
        updateDatasource: params => datasources.save(params),
      })

      const datasourceId = quickDatasource._id
      if (!datasourceId) {
        throw new Error("SharePoint connection was saved without an ID.")
      }

      const response = await agentsStore.fetchAgentKnowledgeSourceOptions(
        datasourceId,
        quickAuthConfigId
      )
      sharePointSites = response.options
      const excluded = new Set(existingSiteIds)
      selectedSiteId =
        sharePointSites.find(site => !excluded.has(site.id))?.id || ""
      selectedDatasourceId = datasourceId
      selectedAuthConfigId = quickAuthConfigId
      selectedConnectionId = `${datasourceId}:${quickAuthConfigId}`
      skippedConnectionStep = true
      quickAddModal?.hide()
      siteStepModal?.show()
    } catch (error) {
      console.error(error)
      quickConnectionError = getErrorMessage(error)
    } finally {
      savingQuickConnection = false
    }
  }

  const openAdvancedSetup = () => {
    hide()
    const datasourceId = quickDatasource?._id
    bb.settings(
      datasourceId
        ? `/connections/apis/${datasourceId}`
        : `/connections/apis/new/${SHAREPOINT_TEMPLATE_ID}`
    )
  }

  const handleSelect = async (mode: SharePointSelectionMode) => {
    const selectedSite = availableSites.find(site => site.id === selectedSiteId)
    if (!agentId || !operationId || !selectedSite) {
      return
    }
    saving = true
    try {
      await agentsStore.connectOperationSharePointSite(agentId, operationId, {
        datasourceId: selectedDatasourceId,
        authConfigId: selectedAuthConfigId,
        site: selectedSite,
        filters: mode === "selective" ? [EXCLUDE_ALL_PATTERN] : undefined,
      })
      await workspaceDeploymentStore.fetch()
      notifications.success("SharePoint site added")
      hide()
      await onCreated?.(selectedSiteId, mode)
    } catch (error) {
      console.error(error)
      notifications.error("Failed to add SharePoint site")
    } finally {
      saving = false
    }
  }

  export async function show() {
    await loadSharePointConnections()
    if (
      sharePointConnectionOptions.length === 0 &&
      $knowledgeConnectionsStore.sharePointDatasourceIds.length === 0
    ) {
      quickConnectionError = ""
      quickAddModal?.show()
      return
    }
    if (sharePointConnectionOptions.length === 1 && selectedConnectionId) {
      skippedConnectionStep = true
      loadingNextStep = true
      try {
        await loadSharePointSites()
        if (siteLoadError) {
          skippedConnectionStep = false
          connectionStepModal?.show()
          return
        }
        siteStepModal?.show()
      } finally {
        loadingNextStep = false
      }
      return
    }
    skippedConnectionStep = false
    connectionStepModal?.show()
  }

  export function hide() {
    connectionStepModal?.hide()
    siteStepModal?.hide()
    quickAddModal?.hide()
  }
</script>

<SharePointQuickAddModal
  bind:this={quickAddModal}
  saving={savingQuickConnection}
  error={quickConnectionError}
  onSubmit={saveQuickConnection}
  onAdvancedSetup={openAdvancedSetup}
/>

<SharePointConnectionStepModal
  bind:this={connectionStepModal}
  options={sharePointConnectionOptions}
  {selectedConnectionId}
  {loadingNextStep}
  hasSharePointDatasource={$knowledgeConnectionsStore.sharePointDatasourceIds
    .length > 0}
  onConfigure={() => {
    hide()
    const datasourceId =
      selectedDatasourceId ||
      $knowledgeConnectionsStore.sharePointDatasourceIds[0]
    bb.settings(`/connections/apis/${datasourceId}`)
  }}
  onConnectionChange={connectionId => {
    selectedConnectionId = connectionId
    const full = $knowledgeConnectionsStore.connections.find(
      connection => connection._id === connectionId
    )
    if (!full) return
    selectedDatasourceId = full.datasourceId
    selectedAuthConfigId = full.authConfigId
  }}
  onNext={goToSitesStep}
/>

<SharePointSiteStepModal
  bind:this={siteStepModal}
  options={availableSites}
  {selectedSiteId}
  emptyMessage={siteEmptyMessage}
  {saving}
  showBack={!skippedConnectionStep}
  onSiteChange={siteId => {
    selectedSiteId = siteId
  }}
  onBack={async () => {
    siteStepModal?.hide()
    connectionStepModal?.show()
  }}
  onSelect={handleSelect}
/>

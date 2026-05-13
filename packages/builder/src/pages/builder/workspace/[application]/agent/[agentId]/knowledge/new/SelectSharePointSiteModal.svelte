<script lang="ts">
  import { notifications } from "@budibase/bbui"
  import { type KnowledgeSourceOption } from "@budibase/types"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import { agentsStore, knowledgeConnectionsStore } from "@/stores/portal"
  import type { SharePointSelectionMode } from "../renderers/types"
  import { EXCLUDE_ALL_PATTERN } from "../sharepoint/sharePointModalUtils"
  import SharePointConnectionStepModal, {
    type SharePointConnectionOption,
  } from "./SharePointConnectionStepModal.svelte"
  import SharePointSiteStepModal from "./SharePointSiteStepModal.svelte"

  export interface Props {
    agentId: string
    existingSiteIds?: string[]
    onCreated?: (
      _siteId: string,
      _mode: SharePointSelectionMode
    ) => Promise<void> | void
  }

  let { agentId, existingSiteIds = [], onCreated }: Props = $props()

  let sharePointSites = $state<KnowledgeSourceOption[]>([])
  let sharePointConnectionOptions = $state<SharePointConnectionOption[]>([])
  let selectedSiteId = $state("")
  let selectedConnectionId = $state("")
  let selectedDatasourceId = $state("")
  let selectedAuthConfigId = $state("")
  let siteLoadError = $state("")
  let loadingNextStep = $state(false)
  let saving = $state(false)
  let skippedConnectionStep = $state(false)

  let connectionStepModal = $state<SharePointConnectionStepModal>()
  let siteStepModal = $state<SharePointSiteStepModal>()

  const availableSites = $derived.by(() => {
    const excluded = new Set(existingSiteIds)
    return sharePointSites.filter(site => !excluded.has(site.id))
  })

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
    } catch (error: any) {
      console.error(error)
      const message =
        error?.cause?.message ||
        error?.message ||
        "Failed to fetch SharePoint sites for this auth config."
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

  const handleSelect = async (mode: SharePointSelectionMode) => {
    if (!agentId || !selectedSiteId) {
      return
    }
    saving = true
    try {
      await agentsStore.connectAgentSharePointSite(agentId, {
        datasourceId: selectedDatasourceId,
        authConfigId: selectedAuthConfigId,
        siteId: selectedSiteId,
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
    if (sharePointConnectionOptions.length === 1 && selectedConnectionId) {
      skippedConnectionStep = true
      loadingNextStep = true
      try {
        await loadSharePointSites()
        if (siteLoadError) {
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
  }
</script>

<SharePointConnectionStepModal
  bind:this={connectionStepModal}
  options={sharePointConnectionOptions}
  {selectedConnectionId}
  {loadingNextStep}
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

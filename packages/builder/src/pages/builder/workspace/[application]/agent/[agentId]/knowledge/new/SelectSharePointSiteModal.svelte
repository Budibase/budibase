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
      const connections = await knowledgeConnectionsStore.fetch()
      const sharePointConnections = connections.filter(
        connection => connection.sourceType === "sharepoint"
      )
      sharePointConnectionOptions = sharePointConnections.map(connection => ({
        id: connection._id!,
        name: "Microsoft",
        account: connection.account || "-",
      }))
      selectedConnectionId = sharePointConnections[0]?._id || ""
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
      return
    }
    sharePointSites = []
    selectedSiteId = ""
    try {
      const response =
        await agentsStore.fetchAgentKnowledgeSourceOptions(selectedConnectionId)
      sharePointSites = response.options
      const excluded = new Set(existingSiteIds)
      selectedSiteId =
        sharePointSites.find(site => !excluded.has(site.id))?.id || ""
    } catch (error) {
      console.error(error)
      notifications.error("Failed to fetch SharePoint sites")
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
        connectionId: selectedConnectionId,
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

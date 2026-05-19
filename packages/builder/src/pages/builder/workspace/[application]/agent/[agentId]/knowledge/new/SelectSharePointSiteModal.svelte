<script lang="ts">
  import { notifications } from "@budibase/bbui"
  import { bb } from "@/stores/bb"
  import {
    OAuth2CredentialsMethod,
    OAuth2GrantType,
    RestAuthType,
    type KnowledgeSourceOption,
    type OAuth2RestAuthConfig,
  } from "@budibase/types"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder/datasources"
  import { sortedIntegrations as integrations } from "@/stores/builder/sortedIntegrations"
  import { configFromIntegration } from "@/stores/selectors"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import { agentsStore, knowledgeConnectionsStore } from "@/stores/portal"
  import type { SharePointSelectionMode } from "../renderers/types"
  import { EXCLUDE_ALL_PATTERN } from "../sharepoint/sharePointModalUtils"
  import SharePointQuickSetupModal from "./SharePointQuickSetupModal.svelte"
  import SharePointConnectionStepModal, {
    type SharePointConnectionOption,
  } from "./SharePointConnectionStepModal.svelte"
  import SharePointSiteStepModal from "./SharePointSiteStepModal.svelte"

  const SHAREPOINT_GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0"
  const SHAREPOINT_SCOPE = "https://graph.microsoft.com/.default"

  interface SharePointQuickSetupDetails {
    tenantId: string
    clientId: string
    clientSecret: string
  }

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
  let creatingConnection = $state(false)
  let awaitingAdvancedSetup = $state(false)
  let resumingFromAdvancedSetup = $state(false)
  let saving = $state(false)
  let skippedConnectionStep = $state(false)

  let quickSetupModal = $state<SharePointQuickSetupModal>()
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

  const handleAdvancedSetup = async () => {
    if (creatingConnection || loadingNextStep || saving) {
      return
    }
    awaitingAdvancedSetup = true
    quickSetupModal?.hide()
    bb.settings("/connections/apis/new/microsoft-sharepoint")
  }

  const createSharePointConnection = async (
    details: SharePointQuickSetupDetails
  ) => {
    if (creatingConnection || !agentId) {
      return
    }

    creatingConnection = true
    try {
      const restIntegration = ($integrations || []).find(
        integration => integration.name === IntegrationTypes.REST
      )
      if (!restIntegration) {
        throw new Error("REST integration unavailable")
      }

      const authConfigId = crypto.randomUUID()
      const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(details.tenantId)}/oauth2/v2.0/token`

      const createdDatasource = await datasources.create({
        integration: restIntegration,
        name: "Microsoft SharePoint",
        restTemplateId: "microsoft-sharepoint",
        config: {
          ...configFromIntegration(restIntegration),
          url: SHAREPOINT_GRAPH_BASE_URL,
          authConfigs: [
            {
              _id: authConfigId,
              name: "SharePoint OAuth2",
              type: RestAuthType.OAUTH2,
              url: tokenUrl,
              clientId: details.clientId,
              clientSecret: details.clientSecret,
              method: OAuth2CredentialsMethod.BODY,
              grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
              scope: SHAREPOINT_SCOPE,
            } satisfies OAuth2RestAuthConfig,
          ],
        },
      })

      await loadSharePointConnections()

      const createdAuthConfig = (
        (createdDatasource.config?.authConfigs || []) as OAuth2RestAuthConfig[]
      ).find(config => config._id === authConfigId)

      if (!createdDatasource._id || !createdAuthConfig?._id) {
        throw new Error("Failed to create SharePoint connection")
      }

      selectedDatasourceId = createdDatasource._id
      selectedAuthConfigId = createdAuthConfig._id
      selectedConnectionId = `${createdDatasource._id}:${createdAuthConfig._id}`

      quickSetupModal?.hide()
      skippedConnectionStep = true
      await goToSitesStep()
    } catch (error: any) {
      console.error(error)
      const message =
        error?.cause?.message ||
        error?.message ||
        "Failed to create SharePoint connection"
      notifications.error(message)
    } finally {
      creatingConnection = false
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

  $effect(() => {
    if (!awaitingAdvancedSetup || resumingFromAdvancedSetup) {
      return
    }

    const resume = async () => {
      resumingFromAdvancedSetup = true
      try {
        await loadSharePointConnections()
        if (sharePointConnectionOptions.length === 0) {
          return
        }
        awaitingAdvancedSetup = false
        if (sharePointConnectionOptions.length === 1 && selectedConnectionId) {
          skippedConnectionStep = true
          await goToSitesStep()
          return
        }
        skippedConnectionStep = false
        connectionStepModal?.show()
      } finally {
        resumingFromAdvancedSetup = false
      }
    }

    resume().catch(error => {
      console.error(error)
      notifications.error("Failed to continue SharePoint setup")
    })
  })

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
    awaitingAdvancedSetup = false
    resumingFromAdvancedSetup = false
    await loadSharePointConnections()
    if (sharePointConnectionOptions.length === 0) {
      skippedConnectionStep = true
      quickSetupModal?.show()
      return
    }
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
    awaitingAdvancedSetup = false
    resumingFromAdvancedSetup = false
    quickSetupModal?.hide()
    connectionStepModal?.hide()
    siteStepModal?.hide()
  }
</script>

<SharePointQuickSetupModal
  bind:this={quickSetupModal}
  creating={creatingConnection}
  onCreate={createSharePointConnection}
  onAdvancedSetup={handleAdvancedSetup}
/>

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

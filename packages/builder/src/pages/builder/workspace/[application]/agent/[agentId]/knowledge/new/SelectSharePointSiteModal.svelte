<script lang="ts">
  import { agentsStore } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"
  import {
    Body,
    Button,
    ButtonGroup,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"

  import { type KnowledgeSourceOption } from "@budibase/types"
  import { EXCLUDE_ALL_PATTERN } from "../sharepoint/sharePointModalUtils"
  import type { SharePointSelectionMode } from "../renderers/types"

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
  let availableSites = $derived.by(() => {
    const excluded = new Set(existingSiteIds)
    return sharePointSites.filter(site => !excluded.has(site.id))
  })

  let selectedSiteId = $state("")
  let modal = $state<Modal>()
  let loadingSites = $state(false)

  const displaySharePointSites = $derived(
    [...availableSites]
      .map(site => ({
        ...site,
        name: site.name || site.webUrl || site.id,
      }))
      .sort((a, b) => {
        const aKey = a.name.trim().toLocaleLowerCase()
        const bKey = b.name.trim().toLocaleLowerCase()
        return aKey.localeCompare(bKey)
      })
  )

  let saving = $state<boolean>()

  const loadSharePointSites = async () => {
    if (!agentId) {
      sharePointSites = []
      selectedSiteId = ""
      return
    }
    loadingSites = true
    sharePointSites = []
    selectedSiteId = ""
    try {
      const response =
        await agentsStore.fetchAgentKnowledgeSourceOptions(agentId)
      sharePointSites = response.options
      selectedSiteId = displaySharePointSites[0]?.id || ""
    } catch (error) {
      console.error(error)
      notifications.error("Failed to fetch SharePoint sites")
      sharePointSites = []
      selectedSiteId = ""
    } finally {
      loadingSites = false
    }
  }

  export async function show() {
    await loadSharePointSites()
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const handleSelect = async (mode: SharePointSelectionMode) => {
    if (!agentId || !selectedSiteId) {
      return
    }

    saving = true
    try {
      await agentsStore.connectAgentSharePointSite(agentId, {
        siteId: selectedSiteId,
        filters:
          mode === "selective"
            ? {
                patterns: [EXCLUDE_ALL_PATTERN],
              }
            : undefined,
      })
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
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showDivider={false}
    showConfirmButton={false}
    showCancelButton={false}
    disabled={!selectedSiteId}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add from SharePoint</Body>
      </div>

      {#if loadingSites}
        <Body size="S">Loading SharePoint sites...</Body>
      {:else if availableSites.length === 0}
        <Body size="S">No SharePoint sites found for this connection.</Body>
      {:else}
        <Select
          bind:value={selectedSiteId}
          label="Select site"
          options={displaySharePointSites}
          getOptionLabel={o => o.name || o.webUrl || o.id}
          getOptionSubtitle={o => o.webUrl}
          getOptionValue={o => o.id}
        />
      {/if}
    </div>

    <ButtonGroup slot="footer">
      <Button
        cta
        primary
        on:click={() => handleSelect("selective")}
        disabled={!selectedSiteId || saving}
      >
        Selective sync
      </Button>
      <Button
        cta
        on:click={() => handleSelect("all")}
        disabled={!selectedSiteId || saving}
      >
        Sync all
      </Button>
    </ButtonGroup>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: min(460px, 95vw);
  }

  .title {
    padding-bottom: var(--spacing-s);
  }
</style>

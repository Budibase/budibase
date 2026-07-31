<script lang="ts">
  import { Body, Modal, ModalContent, Select } from "@budibase/bbui"
  import type { KnowledgeSourceOption } from "@budibase/types"

  export interface Props {
    loadingSharePointSites: boolean
    sharePointSites?: KnowledgeSourceOption[]
    selectedSiteId?: string
    onSave?: () => void
  }

  let {
    loadingSharePointSites,
    sharePointSites = [],
    selectedSiteId = $bindable(""),
    onSave,
  }: Props = $props()

  let modal = $state<Modal>()

  const displaySharePointSites = $derived(
    [...sharePointSites]
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

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showCloseIcon={false}
    showDivider={false}
    confirmText="Add"
    onConfirm={onSave}
    onCancel={hide}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add from SharePoint</Body>
      </div>
      {#if loadingSharePointSites}
        <Body size="S">Loading SharePoint sites...</Body>
      {:else if sharePointSites.length === 0}
        <Body size="S">No SharePoint sites found for this connection.</Body>
      {:else}
        <Select
          bind:value={selectedSiteId}
          label="Select site"
          options={displaySharePointSites}
          getOptionLabel={o => o.name || o.webUrl || o.id}
          getOptionSubtitle={o => o.webUrl}
          getOptionValue={o => o.id}
        ></Select>
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    padding: var(--spacing-l);
    width: 360px;
  }

  .title {
    padding-bottom: var(--spacing-s);
  }
</style>

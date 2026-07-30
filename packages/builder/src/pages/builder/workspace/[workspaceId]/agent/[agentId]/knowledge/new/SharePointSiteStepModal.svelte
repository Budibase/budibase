<script lang="ts">
  import {
    Body,
    Button,
    ButtonGroup,
    Modal,
    ModalContent,
    Select,
  } from "@budibase/bbui"
  import { type KnowledgeSourceOption } from "@budibase/types"
  import type { SharePointSelectionMode } from "../renderers/types"

  export interface Props {
    options: KnowledgeSourceOption[]
    selectedSiteId: string
    saving?: boolean
    showBack?: boolean
    onBack: () => Promise<void> | void
    onSelect: (_mode: SharePointSelectionMode) => Promise<void> | void
    onSiteChange: (_siteId: string) => void
  }

  let {
    options,
    selectedSiteId,
    saving = false,
    showBack = true,
    onBack,
    onSelect,
    onSiteChange,
  }: Props = $props()

  let modal = $state<Modal>()

  const displaySharePointSites = $derived(
    [...options]
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
    showDivider={false}
    showConfirmButton={false}
    showCancelButton={false}
    disabled={!selectedSiteId}
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add from SharePoint</Body>
      </div>

      {#if displaySharePointSites.length === 0}
        <Body size="S">No SharePoint sites found for this connection.</Body>
      {:else}
        <Select
          value={selectedSiteId}
          on:change={e => e.detail && onSiteChange(e.detail)}
          label="Select site"
          autocomplete={true}
          searchPlaceholder="Search SharePoint sites"
          options={displaySharePointSites}
          getOptionLabel={o => o.name || o.webUrl || o.id}
          getOptionSubtitle={o => o.webUrl}
          getOptionValue={o => o.id}
        />
      {/if}
    </div>

    <ButtonGroup slot="footer">
      {#if showBack}
        <Button cta secondary on:click={onBack} disabled={saving}>Back</Button>
      {/if}
      <Button
        cta
        primary
        on:click={() => onSelect("selective")}
        disabled={!selectedSiteId || saving}
      >
        Selective sync
      </Button>
      <Button
        cta
        on:click={() => onSelect("all")}
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

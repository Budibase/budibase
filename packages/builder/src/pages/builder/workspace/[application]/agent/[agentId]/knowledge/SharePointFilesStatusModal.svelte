<script lang="ts">
  import { Body, Modal, ModalContent, Table } from "@budibase/bbui"
  import { type KnowledgeBaseFile } from "@budibase/types"
  import KnowledgeIconRenderer from "./renderers/KnowledgeIconRenderer.svelte"
  import KnowledgeNameRenderer from "./renderers/KnowledgeNameRenderer.svelte"
  import KnowledgeStatusRenderer from "./renderers/KnowledgeStatusRenderer.svelte"
  import { toReadOnlyFileTableRows } from "./knowledgeTableRows"

  export interface Props {
    siteName?: string
    files?: KnowledgeBaseFile[]
  }

  let { siteName = "SharePoint site", files = [] }: Props = $props()

  let modal = $state<Modal>()

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  let fileTableRows = $derived.by(() => toReadOnlyFileTableRows(files))

  const customRenderers = [
    { column: "icon", component: KnowledgeIconRenderer },
    { column: "filename", component: KnowledgeNameRenderer },
    { column: "displayStatus", component: KnowledgeStatusRenderer },
  ]
</script>

<Modal bind:this={modal}>
  <ModalContent
    custom
    showConfirmButton={false}
    showCancelButton={false}
    showDivider={false}
    onCancel={hide}
  >
    <div class="content">
      <div class="title-wrap">
        <Body size="S">SharePoint files</Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Site: {siteName}
        </Body>
      </div>
      {#if files.length === 0}
        <div class="empty">
          <Body size="S">No files synced yet.</Body>
        </div>
      {:else}
        <Table
          compact
          quiet
          rounded
          hideHeader
          allowClickRows={false}
          allowEditRows={false}
          allowEditColumns={false}
          data={fileTableRows}
          schema={{
            icon: { width: "36px" },
            filename: { displayName: "Name", width: "minmax(0, 2fr)" },
            displayStatus: { displayName: "Status", width: "130px" },
          }}
          {customRenderers}
        />
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    width: 560px;
    max-width: 90vw;
    padding: var(--spacing-l);
  }

  .title-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
    margin-bottom: var(--spacing-m);
  }

  .empty {
    padding: var(--spacing-s) 0;
  }
</style>

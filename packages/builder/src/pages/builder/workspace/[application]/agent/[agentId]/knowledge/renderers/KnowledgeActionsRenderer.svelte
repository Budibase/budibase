<script lang="ts">
  import { AbsTooltip, ActionButton } from "@budibase/bbui"
  import type { KnowledgeTableRow, SharePointConnectionTableRow } from "./types"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()

  let syncing = $state(false)
  let renderedRowId = $state<string | undefined>(row._id)

  let processing = $derived(syncing)

  $effect(() => {
    if (renderedRowId === row._id) {
      return
    }
    renderedRowId = row._id
    syncing = false
  })

  const remove = async () => {
    await row.onDelete?.()
  }

  const sync = async (row: SharePointConnectionTableRow) => {
    try {
      syncing = true
      await row.onSync?.()
    } finally {
      syncing = false
    }
  }
</script>

<div class="file-actions" class:loading={processing}>
  {#if row.kind === "sharepoint_connection"}
    <AbsTooltip text="Sync SharePoint">
      <ActionButton
        icon={"arrows-clockwise"}
        size="M"
        quiet
        on:click={() => sync(row)}
        disabled={processing}
        loading={syncing}
      ></ActionButton>
    </AbsTooltip>
    <AbsTooltip text="Disconnect SharePoint">
      <ActionButton
        icon="trash"
        size="M"
        quiet
        on:click={remove}
        disabled={processing}
      />
    </AbsTooltip>
  {:else if row.onDelete}
    <AbsTooltip text="Remove file">
      <ActionButton
        icon="trash"
        size="M"
        quiet
        on:click={remove}
        disabled={processing}
      />
    </AbsTooltip>
  {/if}
</div>

<style>
  .file-actions {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
  }

  .file-actions.loading :global(.spectrum-ActionButton-label) {
    display: contents;
  }
</style>

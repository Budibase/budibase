<script lang="ts">
  import { AbsTooltip, ActionButton } from "@budibase/bbui"
  import type { KnowledgeTableRow, SharePointConnectionTableRow } from "./types"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()

  let syncing = $state(false)
  let renderedRowId = $state<string | undefined>(row._id)

  let processing = $derived(
    syncing || (row.kind === "sharepoint_connection" && row.isSyncing)
  )
  const unavailableTooltip =
    "Set GEMINI_API_KEY on your local environment and restart Budibase."

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

  const knowledgeSearchUnavailable = $derived(
    row.knowledgeSearchConfigured !== true
  )
</script>

<div class="file-actions" class:loading={processing}>
  {#if row.kind === "sharepoint_connection"}
    <AbsTooltip
      text={knowledgeSearchUnavailable ? unavailableTooltip : "Sync SharePoint"}
      noWrap
    >
      <ActionButton
        icon={"arrows-clockwise"}
        size="M"
        quiet
        on:click={() => sync(row)}
        disabled={knowledgeSearchUnavailable || processing}
        loading={syncing}
      ></ActionButton>
    </AbsTooltip>
    <AbsTooltip
      text={knowledgeSearchUnavailable ? unavailableTooltip : "Disconnect"}
      noWrap
    >
      <ActionButton
        icon="trash"
        size="M"
        quiet
        on:click={remove}
        disabled={knowledgeSearchUnavailable || processing}
      />
    </AbsTooltip>
  {:else if row.onDelete}
    <AbsTooltip
      text={knowledgeSearchUnavailable ? unavailableTooltip : "Remove"}
      noWrap
    >
      <ActionButton
        icon="trash"
        size="M"
        quiet
        on:click={remove}
        disabled={knowledgeSearchUnavailable || processing}
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

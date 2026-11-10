<script lang="ts">
  import { Button } from "@budibase/bbui"
  import type {
    FileKnowledgeTableRow,
    KnowledgeTableRow,
    SharePointConnectionTableRow,
  } from "./types"

  export interface Props {
    row: KnowledgeTableRow
  }

  let { row }: Props = $props()

  let syncing = $state(false)
  let retrying = $state(false)
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
    retrying = false
  })

  const remove = async () => {
    await row.onDelete?.()
  }

  const getSyncTooltip = (row: SharePointConnectionTableRow) =>
    row.failedCount > 0 ? "Sync and retry failed files" : "Sync SharePoint"

  const sync = async (row: SharePointConnectionTableRow) => {
    try {
      syncing = true
      await row.onSync?.()
    } finally {
      syncing = false
    }
  }

  const retry = async (row: FileKnowledgeTableRow) => {
    try {
      retrying = true
      await row.onRetry?.()
    } finally {
      retrying = false
    }
  }
</script>

<div class="file-actions">
  {#if row.kind === "sharepoint_connection"}
    <Button
      icon="arrows-clockwise"
      tooltip={!row.knowledgeSearchConfigured
        ? unavailableTooltip
        : getSyncTooltip(row)}
      secondary
      on:click={() => sync(row)}
      disabled={!row.knowledgeSearchConfigured || processing}
      >{syncing ? "Syncing..." : "Sync"}</Button
    >
    <Button
      icon="trash"
      tooltip={!row.knowledgeSearchConfigured
        ? unavailableTooltip
        : "Disconnect"}
      secondary
      on:click={remove}
      disabled={!row.knowledgeSearchConfigured || processing}>Disconnect</Button
    >
  {:else}
    {#if row.canRetry && row.onRetry}
      <Button
        icon="arrows-clockwise"
        tooltip={!row.knowledgeSearchConfigured ? unavailableTooltip : "Retry"}
        secondary
        on:click={() => retry(row)}
        disabled={!row.knowledgeSearchConfigured || retrying}
        >{retrying ? "Retrying..." : "Retry"}</Button
      >
    {/if}
    {#if row.isRejected && row.onDismiss}
      <Button
        icon="x"
        secondary
        on:click={() => row.onDismiss?.()}
        disabled={retrying}>Dismiss</Button
      >
    {:else if row.onDelete}
      <Button
        icon="trash"
        tooltip={!row.knowledgeSearchConfigured ? unavailableTooltip : "Remove"}
        warning
        on:click={remove}
        disabled={!row.knowledgeSearchConfigured || retrying}>Remove</Button
      >
    {/if}
  {/if}
</div>

<style>
  .file-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
  }
</style>

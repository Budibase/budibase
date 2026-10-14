<script lang="ts">
  import { AbsTooltip, ActionButton } from "@budibase/bbui"
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

<div class="file-actions" class:loading={processing || retrying}>
  {#if row.kind === "sharepoint_connection"}
    <AbsTooltip
      text={!row.knowledgeSearchConfigured
        ? unavailableTooltip
        : getSyncTooltip(row)}
      noWrap
    >
      <ActionButton
        icon={"arrows-clockwise"}
        size="M"
        quiet
        on:click={() => sync(row)}
        disabled={!row.knowledgeSearchConfigured || processing}
        loading={syncing}
      ></ActionButton>
    </AbsTooltip>
    <AbsTooltip
      text={!row.knowledgeSearchConfigured ? unavailableTooltip : "Disconnect"}
      noWrap
    >
      <ActionButton
        icon="trash"
        size="M"
        quiet
        on:click={remove}
        disabled={!row.knowledgeSearchConfigured || processing}
      />
    </AbsTooltip>
  {:else}
    {#if row.canRetry && row.onRetry}
      <AbsTooltip
        text={!row.knowledgeSearchConfigured ? unavailableTooltip : "Retry"}
        noWrap
      >
        <ActionButton
          icon="arrows-clockwise"
          size="M"
          quiet
          on:click={() => retry(row)}
          disabled={!row.knowledgeSearchConfigured || retrying}
          loading={retrying}
        />
      </AbsTooltip>
    {/if}
    {#if row.isRejected && row.onDismiss}
      <AbsTooltip text="Dismiss" noWrap>
        <ActionButton
          icon="x"
          size="M"
          quiet
          on:click={() => row.onDismiss?.()}
          disabled={retrying}
        />
      </AbsTooltip>
    {:else if row.onDelete}
      <AbsTooltip
        text={!row.knowledgeSearchConfigured ? unavailableTooltip : "Remove"}
        noWrap
      >
        <ActionButton
          icon="trash"
          size="M"
          quiet
          on:click={remove}
          disabled={!row.knowledgeSearchConfigured || retrying}
        />
      </AbsTooltip>
    {/if}
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

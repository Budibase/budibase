<script lang="ts">
  import { Body, Button, Modal, ModalContent } from "@budibase/bbui"
  import KnowledgeCard from "./KnowledgeCard.svelte"
  import type { FileKnowledgeTableRow } from "./renderers/types"

  export interface Props {
    rows: FileKnowledgeTableRow[]
    retryDisabled?: boolean
    onRetryAll: () => Promise<void>
  }

  let { rows, retryDisabled = false, onRetryAll }: Props = $props()

  let modal = $state<Modal>()
  let retryingAll = $state(false)

  let retryableCount = $derived(rows.filter(row => row.canRetry).length)

  export function show() {
    modal?.show()
  }

  export function hide() {
    modal?.hide()
  }

  const retryAll = async () => {
    retryingAll = true
    try {
      await onRetryAll()
    } finally {
      retryingAll = false
    }
  }
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
        <Body size="S" weight="500">Failed files</Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          These files couldn't be added to this operation's knowledge.
        </Body>
      </div>
      {#if rows.length === 0}
        <div class="empty">
          <Body size="S">No failed files</Body>
        </div>
      {:else}
        <div class="list">
          {#each rows as row (row._id)}
            <KnowledgeCard {row} />
          {/each}
        </div>
      {/if}
      <div class="footer">
        <Body size="XS" color="var(--spectrum-global-color-gray-700)">
          {#if rows.length > retryableCount}
            {rows.length - retryableCount} can't be retried
          {/if}
        </Body>
        <Button
          cta
          size="M"
          disabled={retryableCount === 0 || retryDisabled || retryingAll}
          on:click={retryAll}
        >
          Retry all failed ({retryableCount})
        </Button>
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    width: 620px;
    max-width: 90vw;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .title-wrap {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-height: 55vh;
    overflow-y: auto;
  }

  .empty {
    padding: var(--spacing-s) 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding-top: var(--spacing-s);
    border-top: 1px solid var(--spectrum-global-color-gray-300);
  }
</style>

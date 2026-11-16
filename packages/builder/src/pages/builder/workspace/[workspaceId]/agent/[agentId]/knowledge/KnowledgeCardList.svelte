<script lang="ts">
  import { Body, ProgressCircle } from "@budibase/bbui"
  import KnowledgeCard from "./KnowledgeCard.svelte"
  import type { KnowledgeTableRow } from "./renderers/types"

  export interface Props {
    loading: boolean
    isUploading?: boolean
    rows: KnowledgeTableRow[]
    onRowClick?: (row: KnowledgeTableRow) => void
  }

  let { loading, isUploading = false, rows, onRowClick }: Props = $props()
</script>

{#if loading}
  <div class="loading-state">
    <ProgressCircle size="S" />
    <Body size="XS">Loading knowledge...</Body>
  </div>
{:else if rows.length === 0 && !isUploading}
  <div class="empty-state">
    <Body size="XS">No files uploaded yet</Body>
  </div>
{:else}
  <div class="knowledge-cards">
    {#each rows as row (row._id)}
      <KnowledgeCard {row} onClick={onRowClick} />
    {/each}
  </div>
{/if}

<style>
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    padding: 24px 16px;
    text-align: center;
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-l);
  }

  .knowledge-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
</style>

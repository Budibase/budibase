<script lang="ts">
  import { Body, ActionButton } from "@budibase/bbui"
  import type { VectorStore } from "@budibase/types"

  export let config: VectorStore
  export let onEdit: (() => void) | null = null
</script>

<div class="option">
  <div class="details">
    <div class="header">
      <Body size="S" weight="600">{config.name}</Body>
      <Body size="XS">{config.host}:{config.port}</Body>
    </div>
  </div>
  <ActionButton on:click={() => onEdit?.()}>Edit</ActionButton>
</div>

<style>
  .option {
    background-color: var(--background-alt);
    border: 1px solid var(--grey-2);
    padding: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>

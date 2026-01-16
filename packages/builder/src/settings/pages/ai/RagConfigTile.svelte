<script lang="ts">
  import { ActionButton, Body } from "@budibase/bbui"
  import type { RagConfig } from "@budibase/types"

  export let config: RagConfig
  export let onEdit: (() => void) | null = null
</script>

<div class="option">
  <div class="details">
    <div class="header">
      <Body size="S" weight="600">{config.name}</Body>
      <Body size="XS"
        >{config.ragTopK} chunks • {config.ragMinDistance} min similarity</Body
      >
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

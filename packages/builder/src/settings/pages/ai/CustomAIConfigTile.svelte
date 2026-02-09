<script lang="ts">
  import { Body, ActionButton } from "@budibase/bbui"
  import type { CustomAIProviderConfig } from "@budibase/types"

  export let config: CustomAIProviderConfig
  export let editHandler: (() => void) | null
</script>

<div class="option">
  <div class="details">
    <div class="header">
      <Body size="S" weight={"600"}>{config.name}</Body>
    </div>
  </div>
  <div>
    <ActionButton on:click={() => editHandler && editHandler()}>
      Edit
    </ActionButton>
  </div>
</div>

<style>
  .option {
    background-color: var(--background-alt);
    border: 1px solid var(--grey-2);
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .details {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .option :global(label) {
    cursor: pointer;
  }

  .option:hover {
    background-color: var(--grey-2);
  }

  .header {
    align-items: center;
    color: var(--spectrum-global-color-gray-800);
  }
</style>

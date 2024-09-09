<script>
  import { getContext } from "svelte"
  import { Heading, Body, Button } from "@budibase/bbui"

  const { builderStore } = getContext("sdk")
</script>

{#if $builderStore.inBuilder}
  <div class="placeholder">
    <Heading size="L">Your screen is empty</Heading>
    <Body>Bring your app to life by adding some components!</Body>
    <Button cta icon="Add" on:click={builderStore.actions.requestAddComponent}
      >Add component</Button
    >
  </div>
{/if}

<style>
  .placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-s);
    flex: 1 1 auto;
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }
  .placeholder :global(.spectrum-Button) {
    margin-top: var(--spacing-m);
  }
</style>

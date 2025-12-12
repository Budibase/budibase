<script lang="ts">
  import { Label, Button } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"

  export let name
  export let value
  export let tooltip: string | undefined = undefined

  type KeyValueBuilderHandle = {
    addEntry: () => void
  }

  let addButton: KeyValueBuilderHandle | null = null
</script>

<div class="form-row ssl">
  <Label {tooltip}>{name}</Label>
  <Button secondary on:click={() => addButton?.addEntry()}>Add</Button>
</div>
<KeyValueBuilder
  on:change
  on:blur
  bind:this={addButton}
  defaults={value}
  noAddButton={true}
/>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .form-row.ssl {
    display: grid;
    grid-template-columns: 20% 20%;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>

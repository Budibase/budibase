<script>
  import { Label, Button } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"

  export let name
  export let value

  let addButton
</script>

<div class="form-row ssl">
  <Label>{name}</Label>
  <Button secondary thin outline on:click={addButton.addEntry()}>Add</Button>
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

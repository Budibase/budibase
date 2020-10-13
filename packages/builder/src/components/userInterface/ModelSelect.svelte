<script>
  import { Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  export let value
</script>

<div>
  <Select thin secondary wide on:change {value}>
    <option value="">Choose a table</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </Select>
</div>

<style>
  div {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
  }
  div :global(> *) {
    flex: 1 1 auto;
  }
</style>

<script>
  import { Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  export let value
</script>

<Select thin secondary wide on:change {value}>
  <option value="" />
  {#each $backendUiStore.models as model}
    <option value={model._id}>{model.name}</option>
  {/each}
</Select>

<script>
  import { backendUiStore } from "builderStore"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<div class="block-field">
  <Select bind:value secondary thin>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </Select>
</div>

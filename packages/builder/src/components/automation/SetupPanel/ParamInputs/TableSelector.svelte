<script>
  import { backendUiStore } from "builderStore"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<div class="block-field">
  <Select bind:value secondary thin>
    <option value="">Choose an option</option>
    {#each $backendUiStore.tables as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>
</div>

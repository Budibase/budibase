<script>
  import { Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  export let value
</script>

<Select thin secondary wide on:change {value}>
  <option value="" />
  {#each $backendUiStore.tables as table}
    <option value={table._id}>{table.name}</option>
  {/each}
</Select>

<script>
  import { Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"

  export let value

  $: filteredTales = $backendUiStore.tables.filter(
    table => table._id !== TableNames.USERS
  )
</script>

<div>
  <Select extraThin secondary wide on:change {value}>
    <option value="">Choose a table</option>
    {#each filteredTales as table}
      <option value={table._id}>{table.name}</option>
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

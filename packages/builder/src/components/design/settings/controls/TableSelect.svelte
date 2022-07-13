<script>
  import { Select } from "@budibase/bbui"
  import { tables } from "stores/backend"

  export let value
</script>

<div>
  <Select extraThin secondary wide on:change {value}>
    <option value="">Choose a table</option>
    {#each $tables.list as table}
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

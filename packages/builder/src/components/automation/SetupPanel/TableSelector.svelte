<script>
  import { tables } from 'stores/backend/'
  import { Select } from "@budibase/bbui"

  export let value
</script>

<div class="block-field">
  <Select bind:value secondary extraThin>
    <option value="">Choose an option</option>
    {#each $tables.list as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>
</div>

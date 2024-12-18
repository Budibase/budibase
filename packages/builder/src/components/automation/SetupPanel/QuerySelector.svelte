<script>
  import { queries } from "@/stores/builder"
  import { Select } from "@budibase/bbui"

  export let value
</script>

<div class="block-field">
  <Select on:change bind:value secondary extraThin>
    <option value="">Choose an option</option>
    {#each $queries.list as query}
      <option value={query._id}>{query.name}</option>
    {/each}
  </Select>
</div>

<script>
  import { store, currentAsset } from "builderStore"
  import { Select } from "@budibase/bbui"

  export let layout
</script>

<div>
  <Select bind:value={layout} extraThin secondary>
    {#each $store.layouts as layout}
      <option value={layout._id}>{layout.name}</option>
    {/each}
  </Select>
</div>

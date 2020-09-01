<script>
  import { Select, Label } from "@budibase/bbui"
  import { store } from "builderStore"

  export let parameters
</script>

<div>
  <Label size="m" color="dark">Screen</Label>
  <Select outline bind:value={parameters.url}>
    <option value="" />
    {#each $store.screens as screen}
      <option value={screen.url}>{screen.props._instanceName}</option>
    {/each}
  </Select>
</div>

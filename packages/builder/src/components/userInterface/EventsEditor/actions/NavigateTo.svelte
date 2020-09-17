<script>
  import { DataList, Label } from "@budibase/bbui"
  import { store } from "builderStore"

  export let parameters
</script>

<div class="root">
  <Label size="m" color="dark">Screen</Label>
  <DataList secondary bind:value={parameters.url}>
    <option value="" />
    {#each $store.screens as screen}
      <option value={screen.route}>{screen.props._instanceName}</option>
    {/each}
  </DataList>
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .root :global(.relative) {
    flex: 1;
    margin-left: var(--spacing-l);
  }
</style>

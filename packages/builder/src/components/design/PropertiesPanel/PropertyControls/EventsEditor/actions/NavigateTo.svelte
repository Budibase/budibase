<script>
  import { DataList, Label } from "@budibase/bbui"
  import { allScreens } from "builderStore"

  export let parameters
</script>

<div class="root">
  <Label size="m" color="dark">Screen</Label>
  <DataList secondary bind:value={parameters.url}>
    <option value="" />
    {#each $allScreens as screen}
      <option value={screen.routing.route}>{screen.props._instanceName}</option>
    {/each}
  </DataList>
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .root :global(> div) {
    flex: 1;
    margin-left: var(--spacing-l);
  }
</style>

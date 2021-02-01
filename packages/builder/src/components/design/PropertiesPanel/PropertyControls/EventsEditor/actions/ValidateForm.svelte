<script>
  import { DataList, Label } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset.props,
    $store.selectedComponentId,
    "ValidateForm"
  )
  $: console.log(actionProviders)
</script>

<div class="root">
  <Label size="m" color="dark">Form</Label>
  <DataList secondary bind:value={parameters.componentId} label="asd">
    <option value="" />
    {#if actionProviders}
      {#each actionProviders as component}
        <option value={component._id}>{component._instanceName}</option>
      {/each}
    {/if}
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

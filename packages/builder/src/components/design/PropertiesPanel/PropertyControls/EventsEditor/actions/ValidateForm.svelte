<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset.props,
    $store.selectedComponentId,
    "ValidateForm"
  )
</script>

<div class="root">
  <Label size="m" color="dark">Form</Label>
  <Select secondary bind:value={parameters.componentId}>
    <option value="" />
    {#if actionProviders}
      {#each actionProviders as component}
        <option value={component._id}>{component._instanceName}</option>
      {/each}
    {/if}
  </Select>
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

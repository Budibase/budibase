<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset, componentStore } from "stores/frontend"
  import { getActionProviderComponents } from "builder/dataBinding"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $componentStore.selectedComponentId,
    "RefreshDatasource"
  )
</script>

<div class="root">
  <Label small>Data Provider</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 70px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

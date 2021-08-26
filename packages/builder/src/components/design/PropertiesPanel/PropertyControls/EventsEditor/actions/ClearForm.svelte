<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "ClearForm"
  )
</script>

<div class="root">
  <Label small>Form</Label>
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
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

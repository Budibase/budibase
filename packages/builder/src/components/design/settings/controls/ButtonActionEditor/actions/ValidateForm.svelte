<script>
  import { Select, Label } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviders } from "builderStore/dataBinding"

  export let parameters
  export let nested

  $: actionProviders = getActionProviders(
    $currentAsset,
    $store.selectedComponentId,
    "ValidateForm",
    { includeSelf: nested }
  )
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
  />
  <div />
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

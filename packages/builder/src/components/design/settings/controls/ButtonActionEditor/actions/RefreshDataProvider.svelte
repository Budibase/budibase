<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { getActionProviders } from "@/dataBinding"

  export let parameters
  export let nested

  $: actionProviders = getActionProviders(
    $selectedScreen,
    $componentStore.selectedComponentId,
    "RefreshDatasource",
    { includeSelf: nested }
  )
</script>

<div class="root">
  <Label small>Data Provider</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
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

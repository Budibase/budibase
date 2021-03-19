<script>
  import { Label } from "@budibase/bbui"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

  export let parameters

  let bindingDrawer
  let tempValue = parameters.url

  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
</script>

<div class="root">
  <Label small>Screen</Label>
  <DrawerBindableInput
    title="Destination URL"
    placeholder="/screen"
    value={parameters.url}
    on:change={value => (parameters.url = value.detail)}
    {bindings} />
</div>

<style>
  .root {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    max-width: 800px;
    margin: 0 auto;
  }

  .root :global(> div) {
    flex: 1;
    margin-left: var(--spacing-l);
  }
</style>

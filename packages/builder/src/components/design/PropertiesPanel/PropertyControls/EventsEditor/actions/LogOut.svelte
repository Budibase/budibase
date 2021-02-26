<script>
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"

  export let parameters

  let bindingDrawer
  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
</script>

<div class="root">This action doesn't require any additional settings.</div>

<style>
  .root {
    font-size: var(--font-size-s);
  }
</style>

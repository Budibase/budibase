<script>
  import { Label } from "@budibase/bbui"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { currentAsset, store } from "builderStore"
  import DrawerBindableInput from "components/common/DrawerBindableInput.svelte"

  export let parameters

  let bindingDrawer
  $: bindings = getBindableProperties($currentAsset, $store.selectedComponentId)
</script>

<div class="root">
  <Label small>Email</Label>
  <DrawerBindableInput
    title="Email"
    value={parameters.email}
    on:change={value => (parameters.email = value.detail)}
    {bindings} />
  <Label small>Password</Label>
  <DrawerBindableInput
    title="Password"
    value={parameters.password}
    on:change={value => (parameters.password = value.detail)}
    {bindings} />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr;
    align-items: baseline;
    max-width: 800px;
    margin: 0 auto;
  }
</style>

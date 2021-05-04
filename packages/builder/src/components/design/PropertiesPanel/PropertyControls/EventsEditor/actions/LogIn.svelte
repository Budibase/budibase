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
<<<<<<< HEAD
    on:change={(value) => (parameters.email = value.detail)}
=======
    on:change={value => (parameters.email = value.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
    {bindings}
  />
  <Label small>Password</Label>
  <DrawerBindableInput
    title="Password"
    value={parameters.password}
<<<<<<< HEAD
    on:change={(value) => (parameters.password = value.detail)}
=======
    on:change={value => (parameters.password = value.detail)}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
    {bindings}
  />
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

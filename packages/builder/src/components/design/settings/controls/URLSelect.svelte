<script>
  import { store } from "builderStore"
  import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"

  export let value
  export let bindings
  export let placeholder

  $: urlOptions = $store.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)
</script>

<DrawerBindableCombobox
  {value}
  {bindings}
  {placeholder}
  on:change
  options={urlOptions}
  appendBindingsAsOptions={false}
/>

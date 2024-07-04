<script>
import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"
import { screenStore } from "stores/builder"

export let value
export let bindings
export let placeholder

$: urlOptions = $screenStore.screens
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

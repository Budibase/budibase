<script>
  import { screenStore } from "@/stores/builder"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"

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

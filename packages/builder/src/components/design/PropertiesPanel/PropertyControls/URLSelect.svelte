<script>
  import { store } from "builderStore"
  import DrawerBindableCombobox from "components/common/bindings/DrawerBindableCombobox.svelte"

  export let value

  $: urlOptions = $store.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)
</script>

<DrawerBindableCombobox {value} on:change options={urlOptions} />

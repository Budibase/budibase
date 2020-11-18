<script>
  import DataProvider from "./DataProvider.svelte"

  export let table
</script>

<DataProvider row={{ tableId: table }}>
  <slot />
</DataProvider>

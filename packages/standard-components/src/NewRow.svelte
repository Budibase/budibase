<script>
  import { getContext } from "svelte"

  const { DataProvider } = getContext("sdk")

  export let table
</script>

<DataProvider row={{ tableId: table }}>
  <slot />
</DataProvider>

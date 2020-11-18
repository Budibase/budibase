<script>
  import { DataProvider } from "@budibase/component-sdk"

  export let table
</script>

<DataProvider row={{ tableId: table }}>
  <slot />
</DataProvider>

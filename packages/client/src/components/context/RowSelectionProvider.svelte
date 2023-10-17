<script>
  import Provider from "./Provider.svelte"
  import { rowSelectionStore } from "stores"
</script>

<Provider key="rowSelection" data={$rowSelectionStore}>
  <slot />
</Provider>

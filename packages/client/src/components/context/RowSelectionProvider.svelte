<script>
import { rowSelectionStore } from "stores"
import Provider from "./Provider.svelte"
</script>

<Provider key="rowSelection" data={$rowSelectionStore}>
  <slot />
</Provider>

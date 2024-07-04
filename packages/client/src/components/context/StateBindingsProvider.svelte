<script>
import { stateStore } from "stores"
import Provider from "./Provider.svelte"
</script>

<Provider key="state" data={$stateStore}>
  <slot />
</Provider>

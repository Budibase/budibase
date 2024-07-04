<script>
import { routeStore } from "stores"
import Provider from "./Provider.svelte"
</script>

<Provider key="query" data={$routeStore.queryParams}>
  <slot />
</Provider>

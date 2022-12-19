<script>
  import Provider from "./Provider.svelte"
  import { routeStore } from "stores"
</script>

<Provider key="query" data={$routeStore.queryParams}>
  <slot />
</Provider>

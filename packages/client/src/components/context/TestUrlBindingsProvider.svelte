<script>
  import Provider from "./Provider.svelte"
  import { routeStore } from "@/stores"
</script>

<Provider key="url" data={$routeStore.testUrlParams}>
  <slot />
</Provider>

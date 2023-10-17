<script>
  import Provider from "./Provider.svelte"
  import { stateStore } from "stores"
</script>

<Provider key="state" data={$stateStore}>
  <slot />
</Provider>

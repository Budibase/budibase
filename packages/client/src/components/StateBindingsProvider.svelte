<script>
  import Provider from "./Provider.svelte"
  import { stateStore } from "../store"
</script>

<Provider key="state" data={$stateStore}>
  <slot />
</Provider>

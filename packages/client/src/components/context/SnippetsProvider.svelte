<script>
  import Provider from "./Provider.svelte"
  import { snippets } from "stores"
</script>

<Provider key="snippets" data={$snippets}>
  <slot />
</Provider>

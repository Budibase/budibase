<script>
import { snippets } from "stores"
import Provider from "./Provider.svelte"
</script>

<Provider key="snippets" data={$snippets}>
  <slot />
</Provider>

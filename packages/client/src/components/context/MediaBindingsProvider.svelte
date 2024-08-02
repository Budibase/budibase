<script>
  import Provider from "./Provider.svelte"
  import { mediaStore } from "stores"
</script>

<Provider key="media" data={{ ...($mediaStore || {}) }}>
  <slot />
</Provider>

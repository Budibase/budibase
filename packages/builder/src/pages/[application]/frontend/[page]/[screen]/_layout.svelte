<script>
  import { onMount } from "svelte"
  import { params } from "@sveltech/routify"
  import { store } from "builderStore"

  if ($params.screen !== "page-layout") {
    store.setCurrentScreen($params.screen)
  } else {
    store.setScreenType("page")
  }
</script>

<slot />
store.setScreenType("page")

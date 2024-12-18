<script>
  import { viewsV2, builderStore } from "@/stores/builder"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  $: id = $viewsV2.selectedViewId
  $: builderStore.selectResource(id)

  const stopSyncing = syncURLToState({
    urlParam: "viewId",
    stateKey: "selectedViewId",
    validate: id => $viewsV2.list?.some(view => view.id === id),
    update: viewsV2.select,
    fallbackUrl: "../",
    store: viewsV2,
    routify,
    decode: decodeURIComponent,
  })

  onDestroy(stopSyncing)
</script>

<slot />

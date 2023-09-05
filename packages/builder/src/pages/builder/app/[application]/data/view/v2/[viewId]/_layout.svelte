<script>
  import { viewsV2 } from "stores/backend"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { store } from "builderStore"

  $: id = $viewsV2.selectedViewId
  $: store.actions.websocket.selectResource(id)

  const stopSyncing = syncURLToState({
    urlParam: "viewId",
    stateKey: "selectedViewId",
    validate: id => $viewsV2.list?.some(view => view.id === id),
    update: viewsV2.select,
    fallbackUrl: "../../",
    store: viewsV2,
    routify,
    decode: decodeURIComponent,
  })

  onDestroy(stopSyncing)
</script>

<slot />

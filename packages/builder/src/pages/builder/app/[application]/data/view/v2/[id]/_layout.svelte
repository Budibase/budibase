<script>
  import { views } from "stores/backend"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { store } from "builderStore"

  $: viewName = $views.selectedViewName
  $: store.actions.websocket.selectResource(viewName)

  const stopSyncing = syncURLToState({
    urlParam: "id",
    stateKey: "selectedViewId",
    validate: id => $views.list?.some(view => view.id === id),
    update: id => {
      const view = $views.list.find(v => v.id === id)
      views.select(view.name)
    },
    fallbackUrl: "../../",
    store: views,
    routify,
    decode: decodeURIComponent,
  })

  onDestroy(stopSyncing)
</script>

<slot />

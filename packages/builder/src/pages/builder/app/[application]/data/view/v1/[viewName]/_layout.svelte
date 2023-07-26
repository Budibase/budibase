<script>
  import { views } from "stores/backend"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { store } from "builderStore"

  $: name = $views.selectedViewName
  $: store.actions.websocket.selectResource(name)

  const stopSyncing = syncURLToState({
    urlParam: "viewName",
    stateKey: "selectedViewName",
    validate: name => $views.list?.some(view => view.name === name),
    update: views.select,
    fallbackUrl: "../../",
    store: views,
    routify,
    decode: decodeURIComponent,
  })

  onDestroy(stopSyncing)
</script>

<slot />

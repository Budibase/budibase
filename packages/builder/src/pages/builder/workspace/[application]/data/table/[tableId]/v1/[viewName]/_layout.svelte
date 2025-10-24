<script>
  import { views, builderStore } from "@/stores/builder"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"

  // Extract stores from namespace for Svelte 5 compatibility
  const { goto, params, url, redirect, isActive, page, layout } = routify

  $goto
  $params
  $url
  $redirect
  $isActive
  $page
  $layout

  $: name = $views.selectedViewName
  $: builderStore.selectResource(name)

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

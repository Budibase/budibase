<script>
  import { queries, builderStore } from "@/stores/builder"
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

  $: queryId = $queries.selectedQueryId
  $: builderStore.selectResource(queryId)

  const stopSyncing = syncURLToState({
    urlParam: "queryId",
    stateKey: "selectedQueryId",
    validate: id => id === "new" || $queries.list?.some(q => q._id === id),
    update: queries.select,
    fallbackUrl: "../",
    store: queries,
    routify,
  })

  onDestroy(stopSyncing)
</script>

{#key $queries.selectedQueryId}
  <slot />
{/key}

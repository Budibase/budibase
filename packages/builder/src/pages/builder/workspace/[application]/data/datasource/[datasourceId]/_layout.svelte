<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { builderStore, datasources } from "@/stores/builder"
  import * as routify from "@roxi/routify"
  import { params } from "@roxi/routify"
  import { onDestroy } from "svelte"

  // Extract stores from namespace for Svelte 5 compatibility
  const { goto, url, redirect, isActive, page, layout } = routify

  $goto
  $params
  $url
  $redirect
  $isActive
  $page
  $layout

  $: datasourceId = $datasources.selectedDatasourceId
  $: builderStore.selectResource(datasourceId)

  const stopSyncing = syncURLToState({
    urlParam: "datasourceId",
    stateKey: "selectedDatasourceId",
    validate: id => $datasources.list?.some(ds => ds._id === id),
    update: datasources.select,
    fallbackUrl: "../",
    store: datasources,
    routify,
  })

  onDestroy(stopSyncing)
</script>

{#key $params.datasourceId}
  {#if $datasources.selected}
    <slot />
  {/if}
{/key}

<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { builderStore, datasources, queries } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"
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
  $: {
    const ds = $datasources.selected
    if (ds?.source === IntegrationTypes.REST) {
      const firstQuery = $queries.list.find(q => q.datasourceId === ds._id)
      if (firstQuery) {
        $redirect(
          `/builder/workspace/${$params.application}/apis/query/${firstQuery._id}`
        )
      } else {
        $redirect(`/builder/workspace/${$params.application}/apis/query/new`)
      }
    }
  }

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

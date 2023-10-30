<script>
  import { params } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { builderStore } from "stores/frontend"

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

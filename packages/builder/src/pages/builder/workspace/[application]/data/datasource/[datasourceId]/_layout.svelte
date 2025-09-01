<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { builderStore, datasources } from "@/stores/builder"
  import * as routify from "@roxi/routify"
  import { params } from "@roxi/routify"
  import { onDestroy } from "svelte"

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

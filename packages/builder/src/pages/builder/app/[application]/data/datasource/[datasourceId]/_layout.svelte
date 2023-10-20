<script>
  import { params } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import { store } from "builderStore"

  $: datasourceId = $datasources.selectedDatasourceId
  $: store.actions.websocket.selectResource(datasourceId)

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
  <slot />
{/key}

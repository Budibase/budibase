<script>
import * as routify from "@roxi/routify"
import { syncURLToState } from "helpers/urlStateSync"
import { builderStore, views } from "stores/builder"
import { onDestroy } from "svelte"

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

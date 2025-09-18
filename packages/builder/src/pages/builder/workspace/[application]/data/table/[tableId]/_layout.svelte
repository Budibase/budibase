<script>
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { tables, builderStore } from "@/stores/builder"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import ViewNavBar from "./_components/ViewNavBar.svelte"

  $: tableId = $tables.selectedTableId
  $: builderStore.selectResource(tableId)

  const stopSyncing = syncURLToState({
    urlParam: "tableId",
    stateKey: "selectedTableId",
    validate: id => $tables.list?.some(table => table._id === id),
    update: tables.select,
    fallbackUrl: "../",
    store: tables,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<div class="wrapper">
  <ViewNavBar />
  <slot />
</div>

<style>
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--spectrum-global-color-gray-50);
  }
</style>

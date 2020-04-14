<script>
  import { store, backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"

  $: instances = $store.appInstances
  $: views = $store.hierarchy.indexes

  async function selectDatabase(database) {
    backendUiStore.actions.records.select(null)
    backendUiStore.actions.views.select(views[0])
    backendUiStore.actions.database.select(database)
  }

  onMount(async () => {
    if ($store.appInstances.length > 0) {
      await selectDatabase($store.appInstances[0])
      $goto(`./${$backendUiStore.selectedDatabase.id}`)
    }
  })
</script>

<div class="root">
  <div class="node-view">
    <slot />
  </div>
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }

  .node-view {
    overflow-y: auto;
    flex: 1 1 auto;
  }
</style>

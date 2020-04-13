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
    if ($store.appInstances.length > 0 && !$backendUiStore.database) {
      await selectDatabase($store.appInstances[0])
    }
  })
</script>

<slot />

<script>
  import { store, backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"

  $: instances = $store.appInstances

  async function selectDatabase(database) {
    backendUiStore.actions.database.select(database)
  }

  onMount(async () => {
    if ($store.appInstances.length > 0) {
      await selectDatabase($store.appInstances[0])
      $goto(`../${$backendUiStore.selectedDatabase._id}`)
    }
  })
</script>

Please select a database

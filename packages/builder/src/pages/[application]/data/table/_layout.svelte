<script>
  import { backendUiStore } from "builderStore"
  import { goto, leftover } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first table in list, if not already selected
    // and this is the final url (i.e. no selectedTable)
    if (
      !$leftover &&
      $backendUiStore.tables.length > 0 &&
      (!$backendUiStore.selectedTable || !$backendUiStore.selectedTable._id)
    ) {
      $goto(`./${$backendUiStore.tables[0]._id}`)
    }
  })
</script>

<slot />

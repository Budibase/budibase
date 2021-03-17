<script>
  import { backendUiStore } from "builderStore"
  import { goto, leftover } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first datasource in list, if not already selected
    if (
      !$leftover &&
      $backendUiStore.datasources.length > 0 &&
      !$backendUiStore.selectedDatasourceId
    ) {
      $goto(`./${$backendUiStore.datasources[0]._id}`)
    }
  })
</script>

<slot />

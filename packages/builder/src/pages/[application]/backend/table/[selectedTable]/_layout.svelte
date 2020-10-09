<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"

  if ($params.selectedTable) {
    const table = $backendUiStore.tables.find(
      m => m._id === $params.selectedTable
    )
    if (table) {
      backendUiStore.actions.tables.select(table)
    }
  }
</script>

<slot />
